/**
 * Packages/OfficePack/electron/runner.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK OfficePack — Electron Desktop Development Runner & Orchestrator
 *
 * Checks/starts the OfficePack server runtime on port 3100, waits for HTTP
 * readiness, and launches the Electron desktop application.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require("node:child_process");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const fileSystem = require("node:fs");

function resolveOfficePackPortFromEnv() {
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env.PORT) {
        const parsedPort = parseInt(process.env.PORT, 10);
        if (!Number.isNaN(parsedPort) && parsedPort > 0) {
          return parsedPort;
        }
      }
      if (process.env.OFFICEPACK_PORT) {
        const parsedPort = parseInt(process.env.OFFICEPACK_PORT, 10);
        if (!Number.isNaN(parsedPort) && parsedPort > 0) {
          return parsedPort;
        }
      }
    }

    const packageRoot = path.resolve(__dirname, "..");
    const candidateEnvFiles = [
      path.join(packageRoot, ".env"),
      path.join(packageRoot, ".env.local"),
      path.join(packageRoot, ".env.development"),
    ];

    for (const envFilePath of candidateEnvFiles) {
      if (fileSystem.existsSync(envFilePath)) {
        const content = fileSystem.readFileSync(envFilePath, "utf8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
          const [key, ...values] = trimmed.split("=");
          const rawValue = values.join("=").trim().replace(/^["']|["']$/g, "");
          if (key.trim() === "PORT" || key.trim() === "OFFICEPACK_PORT") {
            const parsed = parseInt(rawValue, 10);
            if (!Number.isNaN(parsed) && parsed > 0) return parsed;
          }
        }
      }
    }
  } catch (error) {
    console.error("[OfficePack Runner] Port resolution error:", error);
  }

  return 3100;
}

let officePackTargetPort = resolveOfficePackPortFromEnv();
let officePackServerUrl = `http://localhost:${officePackTargetPort}`;
const MAXIMUM_POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 500;

let serverProcess = null;
let electronProcess = null;

function isPortAvailable(targetPort, hostAddress = "127.0.0.1") {
  return new Promise((resolve) => {
    try {
      const probeServer = net.createServer();
      probeServer.once("error", () => {
        resolve(false);
      });
      probeServer.once("listening", () => {
        probeServer.close(() => {
          resolve(true);
        });
      });
      probeServer.listen(targetPort, hostAddress);
    } catch {
      resolve(false);
    }
  });
}

async function findAvailablePort(preferredPort, maxAttempts = 100, hostAddress = "127.0.0.1") {
  for (let offset = 0; offset < maxAttempts; offset++) {
    const candidatePort = preferredPort + offset;
    const available = await isPortAvailable(candidatePort, hostAddress);
    if (available) {
      return candidatePort;
    }
  }
  return preferredPort;
}

function checkServerReady(targetUrl = officePackServerUrl) {
  try {
    return new Promise((resolve) => {
      const healthUrl = `${targetUrl}/health`;
      const request = http.get(healthUrl, (response) => {
        resolve(response.statusCode >= 200 && response.statusCode < 400);
        response.resume();
      });

      request.on("error", () => {
        if (healthUrl.includes("localhost:")) {
          const fallbackUrl = healthUrl.replace("localhost:", "127.0.0.1:");
          const fallbackRequest = http.get(fallbackUrl, (fallbackResponse) => {
            resolve(fallbackResponse.statusCode >= 200 && fallbackResponse.statusCode < 400);
            fallbackResponse.resume();
          });
          fallbackRequest.on("error", () => resolve(false));
          fallbackRequest.setTimeout(800, () => {
            fallbackRequest.destroy();
            resolve(false);
          });
        } else {
          resolve(false);
        }
      });

      request.setTimeout(1000, () => {
        request.destroy();
        resolve(false);
      });
    });
  } catch (e) {
    return Promise.resolve(false);
  }
}

async function waitForServerReadiness(targetUrl = officePackServerUrl) {
  console.log(`[OfficePack Runner] Probing OfficePack service on ${targetUrl}...`);
  for (let attempt = 1; attempt <= MAXIMUM_POLL_ATTEMPTS; attempt++) {
    const isReady = await checkServerReady(targetUrl);
    if (isReady) {
      console.log(`[OfficePack Runner] OfficePack service is ready! (attempt ${attempt})`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  return false;
}

function startOfficePackServer(portToUse = officePackTargetPort) {
  try {
    console.log(`[OfficePack Runner] Launching background OfficePack server on port ${portToUse}...`);
    const packageRoot = path.resolve(__dirname, "..");
    const serverPath = path.join(packageRoot, "server.ts");

    serverProcess = spawn("npx", ["tsx", serverPath, "--port", String(portToUse)], {
      cwd: packageRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: String(portToUse),
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    });

    serverProcess.on("error", (error) => {
      console.error("[OfficePack Runner] Server process error:", error);
    });

    serverProcess.on("exit", (code, signal) => {
      console.log(`[OfficePack Runner] Server process exited with code ${code}, signal ${signal}`);
      serverProcess = null;
    });
  } catch (spawnError) {
    console.error("[OfficePack Runner] Failed to spawn server process:", spawnError);
  }
}

function launchElectronApp(portToUse = officePackTargetPort) {
  try {
    console.log("[OfficePack Runner] Launching Electron desktop window...");
    const packageRoot = path.resolve(__dirname, "..");
    const mainScriptPath = path.join(__dirname, "main.cjs");

    let electronExecutable = "electron";
    try {
      const electronModulePath = require("electron");
      if (typeof electronModulePath === "string") {
        electronExecutable = electronModulePath;
      }
    } catch {}

    electronProcess = spawn(electronExecutable, [mainScriptPath], {
      cwd: packageRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: String(portToUse),
        OFFICEPACK_PORT: String(portToUse),
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    });

    electronProcess.on("error", (error) => {
      console.error("[OfficePack Runner] Failed to start Electron:", error);
    });

    electronProcess.on("exit", (code, signal) => {
      const exitCode = typeof code === "number" ? code : 0;
      console.log(`[OfficePack Runner] Electron closed with code ${exitCode}`);
      cleanUpProcesses();
      process.exit(exitCode);
    });
  } catch (electronError) {
    console.error("[OfficePack Runner] Error launching Electron:", electronError);
  }
}

function cleanUpProcesses() {
  if (serverProcess && !serverProcess.killed) {
    try {
      serverProcess.kill("SIGTERM");
    } catch {}
    serverProcess = null;
  }
  if (electronProcess && !electronProcess.killed) {
    try {
      electronProcess.kill("SIGTERM");
    } catch {}
    electronProcess = null;
  }
}

process.on("SIGINT", () => {
  cleanUpProcesses();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanUpProcesses();
  process.exit(0);
});

process.on("exit", () => {
  cleanUpProcesses();
});

async function main() {
  const isAlreadyRunning = await checkServerReady(officePackServerUrl);
  if (!isAlreadyRunning) {
    const isAvailable = await isPortAvailable(officePackTargetPort);
    if (!isAvailable) {
      const newPort = await findAvailablePort(officePackTargetPort);
      if (newPort !== officePackTargetPort) {
        console.warn(
          `[OfficePack Runner] Port ${officePackTargetPort} is already in use by another process. Auto-discovered new available port ${newPort} for OfficePack server.`
        );
        officePackTargetPort = newPort;
        officePackServerUrl = `http://localhost:${officePackTargetPort}`;
      }
    }
    startOfficePackServer(officePackTargetPort);
  } else {
    console.log(`[OfficePack Runner] Existing OfficePack server detected on port ${officePackTargetPort}`);
  }

  const serverReady = await waitForServerReadiness(officePackServerUrl);
  if (!serverReady) {
    console.warn("[OfficePack Runner] Warning: Server readiness check timed out. Launching Electron anyway...");
  }

  launchElectronApp(officePackTargetPort);
}

if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
  main().catch((err) => {
    console.error("[OfficePack Runner Fatal Error]:", err);
    cleanUpProcesses();
    process.exit(1);
  });
}

module.exports = {
  resolveOfficePackPortFromEnv,
  checkServerReady,
  waitForServerReadiness,
  isPortAvailable,
  findAvailablePort,
  startOfficePackServer,
  launchElectronApp,
  getOfficePackPort: () => officePackTargetPort,
};
