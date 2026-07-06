$ErrorActionPreference = "Stop"

$stateDir = "C:\Users\sierr\.openclaw"
$nodeExe = "C:\Program Files\nodejs\node.exe"
$entryJs = "C:\Users\sierr\AppData\Roaming\npm\node_modules\openclaw\dist\index.js"
$port = if ($env:OPENCLAW_GATEWAY_PORT) { $env:OPENCLAW_GATEWAY_PORT } else { "18789" }
$logPath = Join-Path $stateDir "gateway-supervisor.log"
$stopFile = Join-Path $stateDir "gateway-supervisor.stop"
$baseDelaySeconds = 5
$maxDelaySeconds = 60
$attempt = 0

if (-not (Test-Path $nodeExe)) {
  throw "Node executable not found at $nodeExe"
}

if (-not (Test-Path $entryJs)) {
  throw "OpenClaw entrypoint not found at $entryJs"
}

function Write-SupervisorLog {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssK"
  Add-Content -Path $logPath -Value "$timestamp $Message"
}

Write-SupervisorLog "supervisor starting (port=$port pid=$PID)"

while ($true) {
  if (Test-Path $stopFile) {
    Write-SupervisorLog "stop file detected; supervisor exiting"
    Remove-Item $stopFile -Force -ErrorAction SilentlyContinue
    exit 0
  }

  $attempt += 1
  Write-SupervisorLog "launch attempt=$attempt"

  $child = Start-Process -FilePath $nodeExe -ArgumentList @($entryJs, "gateway", "run", "--port", $port) -PassThru
  Write-SupervisorLog "gateway child pid=$($child.Id)"
  Wait-Process -Id $child.Id
  $exitCode = $child.ExitCode
  Write-SupervisorLog "gateway exited code=$exitCode"

  if (Test-Path $stopFile) {
    Write-SupervisorLog "stop file detected after exit; supervisor exiting"
    Remove-Item $stopFile -Force -ErrorAction SilentlyContinue
    exit $exitCode
  }

  $delaySeconds = [Math]::Min($baseDelaySeconds * [Math]::Max(1, $attempt), $maxDelaySeconds)
  Write-SupervisorLog "restarting in ${delaySeconds}s"
  Start-Sleep -Seconds $delaySeconds
}
