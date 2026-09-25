/**
 * packages/VTekOfficeSuit/electron/runner.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * VTek Office Suite — Electron Dev Runner
 *
 * Starts the Next.js dev server on port 3035 and spawns the Electron shell.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const DEFAULT_PORT = 3035;
const packageRoot = path.resolve(__dirname, "..");
const mainScriptPath = path.join(__dirname, "main.cjs");

function isPortActive(targetPort) {
  return new Promise((resolve) => {
    const request = http.get(`http://localhost:${targetPort}`, (response) => {
      response.destroy();
      resolve(true);
    });
    request.on("error", () => resolve(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(targetPort, maxWaitMs = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const active = await isPortActive(targetPort);
    if (active) return true;
    await new Promise((res) => setTimeout(res, 500));
  }
  return false;
}

async function main() {
  const port = process.env.VTEK_OFFICE_PORT || process.env.PORT || DEFAULT_PORT;
  const alreadyRunning = await isPortActive(port);

  let nextProcess = null;
  if (!alreadyRunning) {
    console.log(`[VTek Electron Runner] Launching Next.js server on port ${port}...`);
    nextProcess = spawn("npx", ["next", "dev", "-p", String(port)], {
      cwd: packageRoot,
      stdio: "inherit",
      env: { ...process.env, PORT: String(port) },
    });
  } else {
    console.log(`[VTek Electron Runner] Next.js server already responding on port ${port}`);
  }

  const serverReady = await waitForServer(port);
  if (!serverReady) {
    console.warn(`[VTek Electron Runner] Server did not respond within timeout, proceeding with Electron launch anyway.`);
  }

  console.log(`[VTek Electron Runner] Spawning Electron desktop shell...`);
  const electronProc = spawn("npx", ["electron", mainScriptPath], {
    cwd: packageRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      ELECTRON_START_URL: `http://localhost:${port}`,
      VTEK_OFFICE_PORT: String(port),
    },
  });

  electronProc.on("exit", (code) => {
    if (nextProcess) nextProcess.kill("SIGTERM");
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error(`[VTek Electron Runner] Fatal:`, err);
  process.exit(1);
});
