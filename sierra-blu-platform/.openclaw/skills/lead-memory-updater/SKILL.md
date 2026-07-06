---
name: lead-memory-updater
description: Save stable learnings about Sierra, the owner, workflows, and client preferences into the lightweight external memory system. Use when a new fact is durable and useful beyond the current chat.
---

# Lead Memory Updater

Use this skill when Sierra learns something stable.

## Save

- owner preferences
- stable client preferences
- workflow rules
- recurring operational issues

## Do Not Save

- secrets
- raw tokens
- full chat dumps
- one-off noise

## External Memory

- `H:\OpenClawMemory\learning-log.jsonl`
- `H:\OpenClawMemory\learning-summary.json`

## Example

```powershell
& 'H:\OpenClawMemory\append-learning.ps1' -Type 'client_preference' -JsonValue '{"client":"Ahmed","prefers_arabic":true}' -Source 'conversation'
& 'H:\OpenClawMemory\summarize-learning.ps1'
```
