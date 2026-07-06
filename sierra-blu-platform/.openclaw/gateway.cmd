@echo off
rem OpenClaw Gateway (v2026.4.1)
set "GEMINI_API_KEY=AIzaSyCcaHWIPRCaC_9iM7sORI--niNmAfFq4rY"
set "TELEGRAM_BOT_TOKEN=8719045454:AAH4E11VUdXiK_HldPX2ZSllSFPgntamC0I"
set "TMPDIR=C:\Users\sierr\AppData\Local\Temp"
set "OPENCLAW_GATEWAY_PORT=18789"
set "OPENCLAW_SYSTEMD_UNIT=openclaw-gateway.service"
set "OPENCLAW_WINDOWS_TASK_NAME=OpenClaw Gateway"
set "OPENCLAW_SERVICE_MARKER=openclaw"
set "OPENCLAW_SERVICE_KIND=gateway"
set "OPENCLAW_SERVICE_VERSION=2026.4.1"
"C:\Program Files\nodejs\node.exe" C:\Users\sierr\AppData\Roaming\npm\node_modules\openclaw\dist\entry.js gateway --port 18789
