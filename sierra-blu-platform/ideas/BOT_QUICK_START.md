# Sierra Blu Bot — Quick Start Guide

## Prerequisites

- Python 3.9+
- `pip` or `pip3`
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com) (**required for live AI parsing**)

---

## 1. Install Dependencies

```bash
cd "h:\Sierra Blue SaaS Program Locally V2\11_Core_Intelligence"
pip install -r requirements_bot.txt
```

---

## 2. Configure Environment

```bash
copy .env.example .env
```

Edit `.env` and fill in at minimum:

| Variable | Where to get it |
|---|---|
| `SIERRA_API_URL` | `http://localhost:3000` (Next.js dev server) |
| `META_WA_ACCESS_TOKEN` | Meta Business → WhatsApp API |
| `META_WA_PHONE_NUMBER_ID` | Meta Business → Phone Number ID |
| `HUBSPOT_API_KEY` | hubspot.com → Settings → Integrations → API Keys |
| `GOOGLE_CALENDAR_ID` | Google Calendar → Settings → Calendar ID |

---

## 3. Run the Mock Demo (no API keys needed)

```bash
python sierra_blue_bot_implementation.py
```

Expected output: All 6 workflow steps complete in ~15 seconds (backend timeout warnings are normal if Next.js is not running).

---

## 4. Run with Live APIs

```bash
python sierra_blue_api_integration.py
```

This requires valid keys in `.env` for HubSpot, WhatsApp, and Google Calendar.

---

## 6-Step Workflow

| Step | Action | Mock? |
|---|---|---|
| 1 | Send Arabic greeting to client | ✅ |
| 2 | Check unit availability in Firestore | ✅ |
| 3 | Report result + show alternatives if taken | ✅ |
| 4 | Collect preferences → HubSpot contact upsert | ✅ (live needs `HUBSPOT_API_KEY`) |
| 5 | Schedule viewing → Google Calendar event | ✅ (live needs `GOOGLE_SERVICE_ACCOUNT_JSON`) |
| 6 | Human handover → alert agent via WhatsApp | ✅ (live needs `META_WA_ACCESS_TOKEN`) |

---

## Connecting to the Next.js Backend

The bot notifies the Next.js app at `SIERRA_API_URL/api/whatsapp/notify` after key events.
Start the Next.js server first:

```bash
cd "h:\Sierra Blue SaaS Program Locally V2\my-app"
npm run dev
```

Then run the bot — the `Backend notify failed` warnings will stop.

---

## Files

| File | Purpose |
|---|---|
| `sierra_blue_bot_implementation.py` | Core bot — 6-step workflow with mock APIs |
| `sierra_blue_api_integration.py` | Live API integrations (HubSpot, WhatsApp, Calendar) |
| `requirements_bot.txt` | Python dependencies |
| `.env.example` | Environment variable template |
| `config.py` | Shared configuration loader |
| `sierra_bot.py` | Alternative entry point (Telegram interface) |
