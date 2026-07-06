#!/usr/bin/env python3
"""
Merge all 15 archived repos into a single 'arc' repo — space-efficient
version using hardlinks instead of copies.

Strategy:
- Use os.link() to hardlink files from consolidated/_archived_repos/<repo>/
  into arc-merge/<repo>/. This costs zero extra disk space.
- Skip the same SKIP_DIRS as before (node_modules, dist, build, .git, etc.).
- After hardlinking, run cross-repo dedup: if two repos have a file at the
  same relative path with the same content, delete the later copy.
- Remove empty directories.
- Write README.md + ARC_MANIFEST.json describing the merge.
"""
import hashlib
import json
import os
import shutil
from collections import defaultdict
from pathlib import Path

SOURCE = Path("/home/z/my-project/consolidated/_archived_repos")
DEST = Path("/home/z/my-project/arc-merge")
MAX_FILE_SIZE = 50 * 1024 * 1024

SKIP_DIRS = {
    ".git", "node_modules", ".next", "dist", "build", "__pycache__",
    ".venv", "venv", "env", ".cache", "target", ".gradle", ".idea",
    ".vscode", "coverage", ".pytest_cache", ".turbo", ".codex",
    "out", ".turbo_cache",
}

SKIP_TOP_FILES = {".DS_Store", "Thumbs.db"}

def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    try:
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return ""

def hardlink_repo(src: Path, dst: Path) -> tuple[int, int, list]:
    """Hardlink files from src into dst. Returns (linked, skipped, large_files)."""
    dst.mkdir(parents=True, exist_ok=True)
    linked = 0
    skipped = 0
    large_files = []
    for root, dirs, files in os.walk(src, followlinks=False):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        rel = Path(root).relative_to(src)
        target_dir = dst / rel if str(rel) != "." else dst
        target_dir.mkdir(parents=True, exist_ok=True)
        for f in files:
            if f in SKIP_TOP_FILES and str(rel) == ".":
                skipped += 1
                continue
            src_file = Path(root) / f
            try:
                if src_file.is_symlink():
                    continue
                size = src_file.stat().st_size
            except OSError:
                continue
            if size > MAX_FILE_SIZE:
                large_files.append((str(src_file.relative_to(src)), size))
                continue
            dst_file = target_dir / f
            try:
                if dst_file.exists():
                    dst_file.unlink()
                os.link(src_file, dst_file)
                linked += 1
            except OSError as e:
                # Cross-device or unsupported — fall back to copy
                if e.errno in (18, 95):  # EXDEV, ENOSYS
                    try:
                        shutil.copy2(src_file, dst_file, follow_symlinks=False)
                        linked += 1
                    except OSError as e2:
                        print(f"  WARN: copy fallback failed for {src_file}: {e2}")
                        skipped += 1
                else:
                    print(f"  WARN: link failed for {src_file}: {e}")
                    skipped += 1
    return linked, skipped, large_files

def remove_empty_dirs(root: Path) -> int:
    removed = 0
    while True:
        round_removed = 0
        for dirpath, dirs, files in os.walk(root, topdown=False):
            if dirpath == str(root):
                continue
            d = Path(dirpath)
            if not d.exists():
                continue
            try:
                if not any(d.iterdir()):
                    d.rmdir()
                    round_removed += 1
            except OSError:
                pass
        removed += round_removed
        if round_removed == 0:
            break
    return removed

def dir_size(path):
    total = 0
    for root, dirs, files in os.walk(path):
        for f in files:
            try:
                fp = os.path.join(root, f)
                if not os.path.islink(fp):
                    total += os.path.getsize(fp)
            except OSError:
                pass
    return total

def human_size(num):
    for unit in ["B", "KB", "MB", "GB"]:
        if num < 1024:
            return f"{num:.1f}{unit}"
        num /= 1024
    return f"{num:.1f}TB"

# ── 1. Wipe destination ──
if DEST.exists():
    print(f"Removing existing {DEST} ...")
    shutil.rmtree(DEST)
DEST.mkdir(parents=True)

# ── 2. Hardlink each repo ──
print("=" * 80)
print("STEP 1: Hardlink each archived repo into arc-merge/<name>/")
print("=" * 80)

repos = sorted([p for p in SOURCE.iterdir() if p.is_dir()])
print(f"Found {len(repos)} archived repos to merge.")
print()

all_large_files = {}
per_repo_stats = {}
for repo in repos:
    name = repo.name
    dst = DEST / name
    print(f"  Linking {name}...", flush=True)
    linked, skipped, large_files = hardlink_repo(repo, dst)
    all_large_files[name] = large_files
    per_repo_stats[name] = {
        "files_linked": linked,
        "files_skipped": skipped,
        "large_files_skipped": len(large_files),
    }
    print(f"    → {linked} files linked, {skipped} skipped, {len(large_files)} large files skipped")

# ── 3. Remove empty dirs ──
print()
print("=" * 80)
print("STEP 2: Remove empty directories")
print("=" * 80)
removed = remove_empty_dirs(DEST)
print(f"Removed {removed} empty directories.")

# ── 4. Cross-repo dedup by content hash ──
print()
print("=" * 80)
print("STEP 3: Cross-repo dedup (hash-based)")
print("=" * 80)
print("Indexing files by hash...")

hash_index = defaultdict(list)
for repo in repos:
    name = repo.name
    repo_dst = DEST / name
    if not repo_dst.exists():
        continue
    for root, dirs, files in os.walk(repo_dst):
        for f in files:
            abs_path = Path(root) / f
            try:
                if abs_path.is_symlink():
                    continue
                rel = abs_path.relative_to(repo_dst)
                h = sha256_of_file(abs_path)
                if h:
                    hash_index[h].append((name, rel, abs_path))
            except OSError:
                continue

print(f"Indexed {sum(len(v) for v in hash_index.values())} files in {len(hash_index)} unique hashes.")

dups_removed = 0
dups_kept = 0
dup_log = []
for h, occurrences in hash_index.items():
    if len(occurrences) <= 1:
        continue
    by_rel = defaultdict(list)
    for repo, rel, abs_path in occurrences:
        by_rel[str(rel)].append((repo, abs_path))
    for rel_str, group in by_rel.items():
        if len(group) <= 1:
            continue
        group.sort(key=lambda x: x[0])
        keeper_repo, keeper_path = group[0]
        for repo, path in group[1:]:
            try:
                size = path.stat().st_size
                path.unlink()
                dups_removed += 1
                dup_log.append({
                    "hash": h[:16],
                    "rel_path": rel_str,
                    "kept_in": keeper_repo,
                    "removed_from": repo,
                    "size_bytes": size,
                })
            except OSError as e:
                print(f"  WARN: failed to remove dup {path}: {e}")
        dups_kept += 1

print(f"Removed {dups_removed} duplicate files (across {dups_kept} unique hash+path groups).")

# ── 5. Remove empty dirs again ──
removed_again = remove_empty_dirs(DEST)
print(f"Removed {removed_again} additional empty directories after dedup.")

# ── 6. Save merge script for reproducibility ──
scripts_dir = DEST / "scripts"
scripts_dir.mkdir(exist_ok=True)
shutil.copy2(__file__, scripts_dir / "merge_into_arc.py")

# ── 7. Write ARC_MANIFEST.json + README.md ──
manifest = {
    "name": "arc",
    "description": "Merged archive of 15 distinct GitHub repos from ahmedfawzy8866.",
    "created": "2026-07-06",
    "source": "Consolidated from _archived_repos/ in Sierra-Estates-Final",
    "merge_method": "hardlink + cross-repo hash dedup",
    "repos": per_repo_stats,
    "dedup_stats": {
        "duplicate_files_removed": dups_removed,
        "unique_hash_path_groups_with_dups": dups_kept,
    },
    "empty_dirs_removed": removed + removed_again,
    "large_files_skipped_per_repo": {
        repo: [{"path": p, "size_mb": round(s/1024/1024, 1)} for p, s in files]
        for repo, files in all_large_files.items()
    },
}

with open(DEST / "ARC_MANIFEST.json", "w") as f:
    json.dump(manifest, f, indent=2, default=str)

# Build README
readme_lines = [
    "# arc — Merged Archive Repository",
    "",
    "This repository merges **15 distinct GitHub repositories** from",
    "`github.com/ahmedfawzy8866` into a single archive. Built on",
    "**2026-07-06**.",
    "",
    "## Properties",
    "",
    "- **No duplicates**: cross-repo content-hash deduplication was applied.",
    f"  {dups_removed} duplicate files were removed.",
    "- **No empty shells**: all empty directories were pruned",
    f"  ({removed + removed_again} removed).",
    "- **No dead code**: build artifacts (`node_modules/`, `dist/`, `build/`,",
    "  `.next/`, `__pycache__/`, etc.) and files >50 MB were excluded.",
    "",
    "## Contents",
    "",
    "| Repo                     | Files | Size      |",
    "| ------------------------ | ----- | --------- |",
]

total_size = 0
total_files = 0
for repo in repos:
    name = repo.name
    repo_dst = DEST / name
    if not repo_dst.exists():
        readme_lines.append(f"| `{name}` | 0 | 0 B |")
        continue
    size = dir_size(repo_dst)
    file_count = sum(1 for _ in os.walk(repo_dst) for __ in _[2])
    total_size += size
    total_files += file_count
    readme_lines.append(f"| `{name}` | {file_count} | {human_size(size)} |")

readme_lines.extend([
    f"| **Total** | **{total_files}** | **{human_size(total_size)}** |",
    "",
    "## How deduplication works",
    "",
    "Each file in each repo subdir was hashed with SHA-256. If two repos",
    "contained a file at the **same relative path** with the **same content**",
    "(same hash), the copy in the alphabetically-later repo was deleted.",
    "",
    "Files at *different* relative paths are NOT deduplicated across repos,",
    "because they serve different purposes in their respective projects.",
    "",
    "## Machine-readable manifest",
    "",
    "See `ARC_MANIFEST.json` for the full per-repo stats, dedup counts, and",
    "list of large files that were skipped.",
    "",
    "## Regenerating this repo",
    "",
    "```bash",
    "git clone https://github.com/ahmedfawzy8866/Sierra-Estates-Final.git",
    "cd Sierra-Estates-Final/_archived_repos",
    "python3 scripts/merge_into_arc.py   # builds arc-merge/ locally",
    "cd arc-merge",
    "git init && git add -A && git commit -m 'Merge 15 archived repos'",
    "git remote add origin https://github.com/ahmedfawzy8866/arc.git",
    "git push -u origin main",
    "```",
    "",
])

with open(DEST / "README.md", "w") as f:
    f.write("\n".join(readme_lines))

print()
print("=" * 80)
print("MERGE COMPLETE")
print("=" * 80)
print(f"Destination: {DEST}")
print(f"Total size: {human_size(total_size)}")
print(f"Total files: {total_files}")
print(f"Repos merged: {len(repos)}")
print(f"Duplicate files removed: {dups_removed}")
print(f"Empty dirs removed: {removed + removed_again}")
print(f"Large files (>50MB) skipped: {sum(len(v) for v in all_large_files.values())}")
print()
print("Per-repo final sizes:")
for repo in repos:
    name = repo.name
    repo_dst = DEST / name
    if repo_dst.exists():
        size = dir_size(repo_dst)
        file_count = sum(1 for _ in os.walk(repo_dst) for __ in _[2])
        print(f"  {name:40} | {file_count:>6} files | {human_size(size):>10}")
    else:
        print(f"  {name:40} | (removed — was empty)")
