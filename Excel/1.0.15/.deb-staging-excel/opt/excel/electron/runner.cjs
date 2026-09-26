/**
 * packages/Excel/electron/runner.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Excel Spreadsheet Studio — Electron Development Orchestrator
 *
 * Checks/starts the Next.js dev server on port 3026, waits for HTTP readiness,
 * and launches the Electron desktop application.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const fileSystem = require("node:fs");

function resolvePortFromEnv() {
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env.PORT) {
        const parsedPort = parseInt(process.env.PORT, 10);
        if (!Number.isNaN(parsedPort) && parsedPort > 0) {
          return parsedPort;
        }
      }
      if (process.env.EXCEL_PORT) {
        const parsedAppPort = parseInt(process.env.EXCEL_PORT, 10);
        if (!Number.isNaN(parsedAppPort) && parsedAppPort > 0) {
          return parsedAppPort;
        }
      }
    }

    const appRootDirectory = path.resolve(__dirname, "..");
    const candidateEnvironmentFiles = [
      path.join(appRootDirectory, ".env"),
      path.join(appRootDirectory, ".env.local"),
      path.join(appRootDirectory, ".env.development"),
    ];

    for (const candidateEnvironmentFilePath of candidateEnvironmentFiles) {
      if (fileSystem.existsSync(candidateEnvironmentFilePath)) {
        const fileContentString = fileSystem.readFileSync(candidateEnvironmentFilePath, "utf8");
        const fileLines = fileContentString.split(/\r?\n/);
        for (const singleLine of fileLines) {
          const trimmedLine = singleLine.trim();
          if (trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
            continue;
          }
          const separatorIndex = trimmedLine.indexOf("=");
          const variableKey = trimmedLine.slice(0, separatorIndex).trim();
          if (variableKey === "PORT" || variableKey === "EXCEL_PORT") {
            const rawVariableValue = trimmedLine.slice(separatorIndex + 1).trim();
            const cleanVariableValue = rawVariableValue.replace(/^["']|["']$/g, "");
            const parsedPort = parseInt(cleanVariableValue, 10);
            if (!Number.isNaN(parsedPort) && parsedPort > 0) {
              return parsedPort;
            }
          }
        }
      }
    }
  } catch (resolvePortError) {
    console.error("[Excel Runner Error] Failed resolving port from env:", resolvePortError);
  }

  return 3026;
}

const TARGET_PORT = resolvePortFromEnv();
const DEV_SERVER_URL = `http://localhost:${TARGET_PORT}`;
const MAXIMUM_POLL_ATTEMPTS = 120;
const POLL_INTERVAL_MILLISECONDS = 500;

let nextServerProcess = null;
let electronChildProcess = null;

function checkServerReady(targetUrl = DEV_SERVER_URL) {
  try {
    return new Promise((resolve) => {
      const request = http.get(targetUrl, (response) => {
        resolve(true);
        response.resume();
      });

      request.on("error", () => {
        if (targetUrl.includes("localhost:")) {
          const fallbackUrl = targetUrl.replace("localhost:", "127.0.0.1:");
          const fallbackRequest = http.get(fallbackUrl, (fallbackResponse) => {
            resolve(true);
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

      request.setTimeout(800, () => {
        request.destroy();
        resolve(false);
      });
    });
  } catch (checkError) {
    console.error("[Excel Runner Error] checkServerReady unexpected failure:", checkError);
    return Promise.resolve(false);
  }
}

async function waitForServer(targetUrl = DEV_SERVER_URL) {
  console.log(`[Excel Runner] Waiting for dev server at ${targetUrl}...`);
  for (let attemptNumber = 1; attemptNumber <= MAXIMUM_POLL_ATTEMPTS; attemptNumber += 1) {
    const isReady = await checkServerReady(targetUrl);
    if (isReady) {
      console.log(`[Excel Runner] Dev server is ready at ${targetUrl} (attempt ${attemptNumber})`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MILLISECONDS));
  }
  console.warn(`[Excel Runner] Server did not become ready after ${MAXIMUM_POLL_ATTEMPTS} attempts, launching anyway.`);
  return false;
}

function resolveElectronCommand(appDirectory) {
  const isWindows = process.platform === "win32";
  const workspaceRootDirectory = path.resolve(appDirectory, "..", "..");

  const directBinaryCandidates = [
    path.join(appDirectory, "node_modules", "electron", "dist", isWindows ? "electron.exe" : "electron"),
    path.join(workspaceRootDirectory, "node_modules", "electron", "dist", isWindows ? "electron.exe" : "electron"),
    path.join(appDirectory, "node_modules", ".bin", isWindows ? "electron.cmd" : "electron"),
    path.join(workspaceRootDirectory, "node_modules", ".bin", isWindows ? "electron.cmd" : "electron"),
  ];

  for (const candidateBinaryPath of directBinaryCandidates) {
    if (fileSystem.existsSync(candidateBinaryPath)) {
      return { command: candidateBinaryPath, argsPrefix: [] };
    }
  }

  const cliJsCandidates = [
    path.join(appDirectory, "node_modules", "electron", "cli.js"),
    path.join(workspaceRootDirectory, "node_modules", "electron", "cli.js"),
  ];

  for (const candidateCliPath of cliJsCandidates) {
    if (fileSystem.existsSync(candidateCliPath)) {
      return { command: process.execPath, argsPrefix: [candidateCliPath] };
    }
  }

  return { command: isWindows ? "npx.cmd" : "npx", argsPrefix: ["electron"] };
}

async function startDevelopmentWorkflow() {
  const appDirectory = path.resolve(__dirname, "..");
  const isAlreadyRunning = await checkServerReady(DEV_SERVER_URL);

  if (!isAlreadyRunning) {
    console.log(`[Excel Runner] Starting Excel Next.js server on port ${TARGET_PORT}...`);
    const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

    nextServerProcess = spawn(npmCommand, ["run", "dev"], {
      cwd: appDirectory,
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: String(TARGET_PORT),
        EXCEL_PORT: String(TARGET_PORT),
      },
    });

    nextServerProcess.on("error", (spawnError) => {
      console.error("[Excel Runner] Failed to spawn Next.js dev server:", spawnError);
    });
  } else {
    console.log(`[Excel Runner] Dev server is already active on port ${TARGET_PORT}`);
  }

  await waitForServer(DEV_SERVER_URL);

  const { command: electronExecutableCommand, argsPrefix: electronArgumentsPrefix } =
    resolveElectronCommand(appDirectory);

  console.log(`[Excel Runner] Launching Electron with ${electronExecutableCommand}...`);
  const finalElectronArguments = [...electronArgumentsPrefix, "."];

  electronChildProcess = spawn(electronExecutableCommand, finalElectronArguments, {
    cwd: appDirectory,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(TARGET_PORT),
      EXCEL_PORT: String(TARGET_PORT),
      ELECTRON_IS_DEV: "1",
    },
  });

  electronChildProcess.on("exit", (exitCode) => {
    console.log(`[Excel Runner] Electron exited with code ${exitCode}`);
    if (nextServerProcess && !nextServerProcess.killed) {
      nextServerProcess.kill();
    }
    process.exit(exitCode || 0);
  });

  const cleanupSignalHandler = () => {
    if (electronChildProcess && !electronChildProcess.killed) {
      electronChildProcess.kill();
    }
    if (nextServerProcess && !nextServerProcess.killed) {
      nextServerProcess.kill();
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanupSignalHandler);
  process.on("SIGTERM", cleanupSignalHandler);
}

if (require.main === module) {
  startDevelopmentWorkflow().catch((runnerError) => {
    console.error("[Excel Runner Error] Execution failed:", runnerError);
    process.exit(1);
  });
}

module.exports = {
  resolvePortFromEnv,
  checkServerReady,
  resolveElectronCommand,
};
