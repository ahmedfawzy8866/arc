# Project Handover: free-claude-code

This document provides a comprehensive state of the repository for the incoming agent/developer.

## 🏗 Architecture Overview
Refer to [PLAN.md](file:///f:/Sierra_Blu_Master/free-claude-code/PLAN.md) for the source of truth.

- **`api/`**: FastAPI implementation of Anthropic-compatible endpoints.
- **`providers/`**: Adapters for upstream LLMs (NVIDIA NIM, etc.).
- **`core/anthropic/`**: Shared protocol logic (neutral to providers).
- **`messaging/`**: Optional Discord/Telegram bot integration.
- **`cli/`**: Entrypoints for managing Claude CLI sessions.
- **`config/`**: Pydantic-based settings management.

## 🛠 Current Environment
- **Tooling**: `uv` is the primary package manager.
- **Python**: 3.14 (managed via `uv`).
- **Static Analysis**: `pyrefly` and `ruff` are configured.
- **CI Sequence**: `format` -> `check` -> `ty check` -> `pytest`.

## 📍 Current Progress & State
I have just completed the integration of **`pyrefly`** for enhanced static analysis.

### Recent Actions:
1.  **Installed `pyrefly`**: Added as a project dependency via `uv add pyrefly`.
2.  **Initialized Config**: Ran `pyrefly init`, which updated `pyproject.toml`.
3.  **Audit Run**: Performed a full check with `--summarize-errors`.

### Critical Findings (Pyrefly Audit):
There are currently **9 errors** that need addressing:
- **`missing-import` (4)**: 
    - `messaging/transcription.py` (3)
    - `providers/nvidia_nim/voice.py` (1)
- **`bad-argument-type` (2)**: 
    - `tests/config/test_config.py`
    - `tests/contracts/test_smoke_config.py`
- **`bad-assignment` (1)**: `messaging/limiter.py`
- **`missing-attribute` (1)**: `tests/api/test_dependencies.py`
- **`bad-instantiation` (1)**: `tests/messaging/test_messaging.py`

## 🚀 Immediate Next Steps
1.  **Fix Imports**: Resolve the `missing-import` errors in `messaging/transcription.py` and `providers/nvidia_nim/voice.py`.
2.  **Type Correction**: Address the `bad-argument-type` and `bad-assignment` issues identified in the audit.
3.  **Contract Verification**: Run `uv run pytest` to ensure recent dependency changes haven't broken existing contracts.
4.  **Formatting**: Run `uv run ruff format` and `uv run ruff check` to maintain compliance with `AGENTS.md` standards.

## ⚠️ Important Notes
- **`AGENTS.md`**: Strict adherence to the agentic directive is mandatory.
- **`FCC_LIVE_SMOKE`**: Set to `1` to run live integration tests with real providers.
- **No Type Ignores**: Fixing the underlying type issue is preferred over `# type: ignore`.
