import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

console.log("--- SIERRA BLU INTELLIGENCE GRID: SYSTEM DIAGNOSTIC ---");

function checkDrive() {
  const currentDir = process.cwd();
  console.log(`Current Hub: ${currentDir}`);

  if (currentDir.startsWith("C:")) {
    console.log("WARNING: Operational node active on System Volume (C:). Windows shell lock may interfere with spawning.");
    console.log("ADVISORY: Consider migrating the intelligence node to I: (Sierra Blu) or H: (Open-Claw).");
  }
}

function testSpawn() {
  console.log("Attempting to spawn Next.js process...");

  try {
    const nextCliUrl = new URL("../node_modules/next/dist/bin/next", import.meta.url);
    const nextCliPath = fileURLToPath(nextCliUrl);
    const child = spawn(process.execPath, [nextCliPath, "--version"]);

    child.stdout.on("data", (data) => {
      console.log(`SUCCESS: Next.js Responsive: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`ERROR: Node synchronization failed: ${data}`);
      console.log("PROBABLE CAUSE: npm promise-spawn exception. Check antivirus or drive permissions.");
    });

    child.on("error", (error) => {
      console.error(`ERROR: Node synchronization failed: ${error.message}`);
      console.log("PROBABLE CAUSE: child process execution is blocked by shell policy or host permissions.");
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("STRATEGIC STATUS: All systems operational.");
      } else {
        console.log(`STRATEGIC STATUS: Critical failure (Code ${code}). Reinitializing build artifacts is required.`);
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: Node synchronization failed: ${message}`);
    console.log("PROBABLE CAUSE: local Next.js CLI could not be resolved from node_modules.");
  }
}

checkDrive();
testSpawn();
