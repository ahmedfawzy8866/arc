# Sierra Blu — WhatsApp Scraper Bot

A standalone Node.js service that listens to WhatsApp groups and forwards broker messages to the Sierra Blu platform API for AI-powered parsing via Gemini.

## How It Works

1. The bot authenticates with WhatsApp Web using `whatsapp-web.js`.
2. It monitors all WhatsApp chats it is added to.
3. Every incoming message is forwarded via HTTP POST to `/api/webhooks/whatsapp` on the Sierra Blu Next.js platform.
4. The platform's `WhatsAppParserService` then parses the message using Gemini 1.5 Flash and stores structured listing data in Firestore.

## Setup

### Prerequisites
- Node.js 18+
- A WhatsApp account (personal or business) to use as the bot session
- The Sierra Blu platform running (locally or deployed)

### Install

```bash
cd apps/whatsapp-scraper-bot
npm install
```

### Configure

Set the environment variable `SIERRA_BLU_API_URL` to point to the webhook endpoint.

For local development:
```
SIERRA_BLU_API_URL=http://localhost:3000/api/webhooks/whatsapp
```

For production (Vercel or other):
```
SIERRA_BLU_API_URL=https://your-vercel-domain.vercel.app/api/webhooks/whatsapp
```

### Run

```bash
npm start
```

Scan the QR code shown in the terminal with your WhatsApp mobile app.

## Commands

| Message | Response |
|---------|----------|
| `!status` | Bot replies with its current online status |

## Important Notes

- **Auth session**: The `LocalAuth` strategy stores session data in `.wwebjs_auth/`. This folder is excluded from git via `.gitignore`.
- **Chromium cache**: `.wwebjs_cache/` is also excluded from git (large binary).
- **Not serverless**: This bot must run as a long-lived Node.js process. It is **not** suitable for Vercel or other serverless platforms. Host it on a VPS, Docker container, or a platform like Railway/Render.

## Integration with Sierra Blu Platform

The webhook at `/api/webhooks/whatsapp` in the main Next.js app receives messages in this format:

```json
{
  "from": "string (WhatsApp ID)",
  "Body": "string (message content)",
  "groupName": "string (group name or 'Direct Message')",
  "timestamp": "number (Unix timestamp)"
}
```

Source: Imported from `ahmedfawzy8866/New-folder` (whatsapp-scraper-bot/).
