/**
 * Packages/Hub/electron/runner.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Hub Desktop Application — Development Orchestrator
 *
 * Checks/starts the Next.js dev server on port 3020, waits for HTTP readiness,
 * and launches the Electron desktop application.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require("node:fs");
const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const { killPort3020, killHubElectronProcesses, cleanStaleSingletonLocks } = require("../scripts/kill-port-3020.cjs");

/**
 * Loads and resolves the Hub server port dynamically from .env or process.env (fallback: 3020)
 * Uses exactly one try-catch block
 */
function resolveHubPortFromEnv() {
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env.PORT) {
        const parsedPort = parseInt(process.env.PORT, 10);
        if (!Number.isNaN(parsedPort) && parsedPort > 0) {
          return parsedPort;
        }
      }
      if (process.env.HUB_PORT) {
        const parsedHubPort = parseInt(process.env.HUB_PORT, 10);
        if (!Number.isNaN(parsedHubPort) && parsedHubPort > 0) {
          return parsedHubPort;
        }
      }
    }

    const fs = require("node:fs");
    const hubRootDirectory = path.resolve(__dirname, "..");
    const workspaceRootDirectory = path.resolve(hubRootDirectory, "..", "..");
    const candidateEnvironmentFiles = [
      path.join(hubRootDirectory, ".env"),
      path.join(hubRootDirectory, ".env.local"),
      path.join(hubRootDirectory, ".env.development"),
      path.join(workspaceRootDirectory, ".env"),
      path.join(workspaceRootDirectory, ".env.local"),
      path.join(workspaceRootDirectory, ".env.development"),
    ];

    for (const candidateEnvironmentFilePath of candidateEnvironmentFiles) {
      if (fs.existsSync(candidateEnvironmentFilePath)) {
        const fileContentString = fs.readFileSync(candidateEnvironmentFilePath, "utf8");
        const fileLines = fileContentString.split(/\r?\n/);
        for (const singleLine of fileLines) {
          const trimmedLine = singleLine.trim();
          if (trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
            continue;
          }
          const separatorIndex = trimmedLine.indexOf("=");
          const variableKey = trimmedLine.slice(0, separatorIndex).trim();
          if (variableKey === "PORT" || variableKey === "HUB_PORT") {
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
  } catch (error) {
    console.error("[Hub Runner Error] Failed resolving port from env:", error);
  }

  return 3020;
}

const HUB_TARGET_PORT = resolveHubPortFromEnv();
const HUB_DEV_SERVER_URL = `http://localhost:${HUB_TARGET_PORT}`;
const MAXIMUM_POLL_ATTEMPTS = 120;
const POLL_INTERVAL_MILLISECONDS = 500;

let nextServerProcess = null;
let electronChildProcess = null;

/**
 * Check whether the local server on the target URL is responding
 * Uses exactly one try-catch block
 */
function checkServerReady(targetUrl = HUB_DEV_SERVER_URL) {
  try {
    return new Promise((resolve) => {
      const request = http.get(targetUrl, (response) => {
        resolve(true);
        response.resume();
      });

      request.on("error", () => {
        if (targetUrl.includes("localhost:")) {
          const ipv4Url = targetUrl.replace("localhost:", "127.0.0.1:");
          const fallbackRequest = http.get(ipv4Url, (fallbackResponse) => {
            resolve(true);
            fallbackResponse.resume();
          });
          fallbackRequest.on("error", () => {
            resolve(false);
          });
          fallbackRequest.setTimeout(800, () => {
            fallbackRequest.destroy();
            resolve(false);
          });
          return;
        }
        resolve(false);
      });

      request.setTimeout(1000, () => {
        request.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    console.error("[Hub Runner Error] checkServerReady exception:", error);
    return Promise.resolve(false);
  }
}

/**
 * Poll the server URL until it responds or exceeds maximum attempts
 * Uses exactly one try-catch block
 */
async function waitForServerReady(
  targetUrl = HUB_DEV_SERVER_URL,
  maxAttempts = MAXIMUM_POLL_ATTEMPTS,
  intervalMilliseconds = POLL_INTERVAL_MILLISECONDS
) {
  try {
    for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex += 1) {
      const isReady = await checkServerReady(targetUrl);
      if (isReady) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMilliseconds));
    }
    return false;
  } catch (error) {
    console.error("[Hub Runner Error] waitForServerReady exception:", error);
    return false;
  }
}

/**
 * Clean up spawned child processes
 * Uses exactly one try-catch block
 */
function cleanUpProcesses() {
  try {
    if (electronChildProcess && !electronChildProcess.killed) {
      electronChildProcess.kill("SIGTERM");
      electronChildProcess = null;
    }

    if (nextServerProcess && !nextServerProcess.killed) {
      nextServerProcess.kill("SIGTERM");
      nextServerProcess = null;
    }

    // Ensure port 3020 (PORT of app) is always killed when dev runner task closes
    killPort3020(HUB_TARGET_PORT);
  } catch (error) {
    console.error("[Hub Runner Error] Failed during process cleanup:", error);
  }
}

const cleanupChildProcesses = cleanUpProcesses;

/**
 * Resolves the optimal Electron binary or executable launcher command
 * Uses exactly one try-catch block
 */
function resolveElectronLauncher(hubDirectory) {
  try {
    const fs = require("node:fs");
    const { execSync } = require("node:child_process");
    const workspaceRootDirectory = path.resolve(hubDirectory, "..", "..");
    const isWindows = process.platform === "win32";

    // 1. Try resolving via electron package dist binary
    const candidateElectronDirectories = [
      path.join(hubDirectory, "node_modules", "electron"),
      path.join(workspaceRootDirectory, "node_modules", "electron"),
    ];
    for (const electronDirectory of candidateElectronDirectories) {
      if (fs.existsSync(electronDirectory)) {
        const pathTxtFilePath = path.join(electronDirectory, "path.txt");
        const executableFileName = fs.existsSync(pathTxtFilePath)
          ? fs.readFileSync(pathTxtFilePath, "utf8").trim()
          : (isWindows ? "electron.exe" : "electron");
        const directBinaryFilePath = path.join(electronDirectory, "dist", executableFileName);
        if (fs.existsSync(directBinaryFilePath)) {
          return { command: directBinaryFilePath, argsPrefix: [] };
        }
      }
    }

    // 2. Check local or workspace .bin/electron
    const candidateBinPaths = [
      path.join(hubDirectory, "node_modules", ".bin", isWindows ? "electron.cmd" : "electron"),
      path.join(workspaceRootDirectory, "node_modules", ".bin", isWindows ? "electron.cmd" : "electron"),
    ];
    for (const binCandidatePath of candidateBinPaths) {
      if (fs.existsSync(binCandidatePath)) {
        return { command: binCandidatePath, argsPrefix: [] };
      }
    }

    // 3. Check electron/cli.js with node
    const candidateCliPaths = [
      path.join(hubDirectory, "node_modules", "electron", "cli.js"),
      path.join(workspaceRootDirectory, "node_modules", "electron", "cli.js"),
    ];
    for (const cliCandidatePath of candidateCliPaths) {
      if (fs.existsSync(cliCandidatePath)) {
        return { command: process.execPath, argsPrefix: [cliCandidatePath] };
      }
    }

    // 4. Check any cached or backup .electron-*/dist/electron
    const rootNodeModulesDirectory = path.join(workspaceRootDirectory, "node_modules");
    if (fs.existsSync(rootNodeModulesDirectory)) {
      const dotElectronDirectories = fs
        .readdirSync(rootNodeModulesDirectory)
        .filter((entryName) => entryName.startsWith(".electron-"));
      for (const dotElectronDirectory of dotElectronDirectories) {
        const fallbackBinaryPath = path.join(
          rootNodeModulesDirectory,
          dotElectronDirectory,
          "dist",
          isWindows ? "electron.exe" : "electron"
        );
        if (fs.existsSync(fallbackBinaryPath)) {
          return { command: fallbackBinaryPath, argsPrefix: [] };
        }
      }
    }

    // 5. Check system PATH via which/where
    const whichCommand = isWindows ? "where electron" : "which electron";
    const systemBinaryOutput = execSync(whichCommand, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim().split(/\r?\n/)[0];
    if (systemBinaryOutput && fs.existsSync(systemBinaryOutput)) {
      return { command: systemBinaryOutput, argsPrefix: [] };
    }
  } catch (error) {
    console.error("[Hub Runner Error] Exception resolving Electron launcher binary:", error);
  }

  // 6. Ultimate fallback to npx electron
  return { command: "npx", argsPrefix: ["electron"] };
}

function runAutoDownloadRequirementsScript() {
  try {
    const { execSync } = require("node:child_process");
    const autoDownloadScript = path.join(__dirname, "..", "scripts", "auto-download-requirements.mjs");
    execSync(`"${process.execPath}" "${autoDownloadScript}"`, { stdio: "inherit" });
  } catch (scriptErr) {
    console.warn("[Hub Runner] Requirement auto-download note:", scriptErr);
  }
}

/**
 * Launch the development runner
 * Uses exactly one try-catch block
 */
async function startDevRunner() {
  try {
    const hubRootDirectory = path.resolve(__dirname, "..");
    const isServerAlreadyRunning = await checkServerReady(HUB_DEV_SERVER_URL);

    if (isServerAlreadyRunning) {
      console.log(`[Hub Runner] Next.js dev server is already running on port ${HUB_TARGET_PORT}.`);
    } else {
      killPort3020(HUB_TARGET_PORT);
      runAutoDownloadRequirementsScript();

      const os = require("node:os");
      const candidateServerPaths = [
        path.join(hubRootDirectory, "server.js"),
        path.join(hubRootDirectory, ".next", "standalone", "packages", "Hub", "server.js"),
        path.join(hubRootDirectory, ".next", "standalone", "server.js"),
        path.join(os.homedir(), ".2tek", "Applications", "hub", "server.js"),
        path.join(os.homedir(), ".2tek", "Applications", "hub", "packages", "Hub", "server.js"),
      ];
      let resolvedServerPath = null;
      for (const candidate of candidateServerPaths) {
        if (fs.existsSync(candidate)) {
          resolvedServerPath = candidate;
          break;
        }
      }
      const serverJsPath = resolvedServerPath || path.join(hubRootDirectory, "server.js");
      const isStandaloneMode =
        process.env.NODE_ENV === "production" ||
        resolvedServerPath !== null ||
        fs.existsSync(serverJsPath);

      if (isStandaloneMode && resolvedServerPath) {
        console.log(`[Hub Runner] Dual-starting Hub Next.js standalone server (${resolvedServerPath}) on port ${HUB_TARGET_PORT}...`);
        nextServerProcess = spawn(process.execPath, [resolvedServerPath], {
          cwd: hubRootDirectory,
          stdio: "inherit",
          env: {
            ...process.env,
            PORT: String(HUB_TARGET_PORT),
            HOSTNAME: "0.0.0.0",
            NODE_ENV: "production",
          },
        });
      } else {
        console.log(`[Hub Runner] Starting Next.js dev server on port ${HUB_TARGET_PORT}...`);
        nextServerProcess = spawn("npx", ["next", "dev", "-p", String(HUB_TARGET_PORT)], {
          cwd: hubRootDirectory,
          stdio: "inherit",
          shell: true,
          env: {
            ...process.env,
            PORT: String(HUB_TARGET_PORT),
            WATCHPACK_POLLING: "true",
          },
        });
      }

      nextServerProcess.on("error", (spawnError) => {
        console.error("[Hub Runner Error] Failed to start Next.js process:", spawnError);
      });
    }

    console.log(`[Hub Runner] Waiting for ${HUB_DEV_SERVER_URL} to be ready...`);
    const isReady = await waitForServerReady(HUB_DEV_SERVER_URL);

    if (!isReady) {
      console.error(`[Hub Runner Error] Timed out waiting for ${HUB_DEV_SERVER_URL}. Exiting.`);
      cleanUpProcesses();
      process.exit(1);
    }

    if (process.env.NO_ELECTRON === "1" || process.env.WORKSPACE_RUNNER === "1") {
      console.log("[Hub Runner] NO_ELECTRON or WORKSPACE_RUNNER active. Skipping Electron desktop window spawn.");
      return;
    }

    console.log("[Hub Runner] Server is ready. Preparing desktop window...");
    killHubElectronProcesses();
    cleanStaleSingletonLocks();
    console.log("[Hub Runner] Launching Electron desktop window...");
    const electronEntryFile = path.join(__dirname, "main.cjs");
    const electronCommandArguments = [electronEntryFile];
    if (process.platform === "linux") {
      electronCommandArguments.push(
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-gpu-sandbox",
        "--log-level=3"
      );
    }

    const electronLauncher = resolveElectronLauncher(hubRootDirectory);
    console.log(`[Hub Runner] Using Electron executable: ${electronLauncher.command}`);

    electronChildProcess = spawn(
      electronLauncher.command,
      [...electronLauncher.argsPrefix, ...electronCommandArguments],
      {
        cwd: hubRootDirectory,
        stdio: "inherit",
        shell: process.platform === "win32" && electronLauncher.command.endsWith(".cmd"),
        env: {
          ...process.env,
          ELECTRON_START_URL: HUB_DEV_SERVER_URL,
        },
      }
    );

    electronChildProcess.on("exit", (exitCode) => {
      console.log(`[Hub Runner] Electron process exited with code ${exitCode}. Cleaning up...`);
      cleanUpProcesses();
      process.exit(exitCode || 0);
    });

    electronChildProcess.on("error", (launchError) => {
      console.error("[Hub Runner Error] Failed to launch Electron:", launchError);
      cleanUpProcesses();
      process.exit(1);
    });
  } catch (error) {
    console.error("[Hub Runner Error] Critical exception in startDevRunner:", error);
    cleanUpProcesses();
    process.exit(1);
  }
}

/**
 * Configure process signal listeners safely
 * Uses exactly one try-catch block
 */
function setupRunnerSignalListeners() {
  try {
    const RUNNER_LISTENERS_ATTACHED = Symbol.for("hub.electron_runner_listeners_attached");
    if (global[RUNNER_LISTENERS_ATTACHED]) {
      return;
    }
    global[RUNNER_LISTENERS_ATTACHED] = true;

    if (typeof process !== "undefined") {
      if (typeof process.getMaxListeners === "function" && typeof process.setMaxListeners === "function") {
        const currentMaximumListeners = process.getMaxListeners();
        if (currentMaximumListeners < 30) {
          process.setMaxListeners(30);
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
    }
  } catch (error) {
    console.error("[Hub Runner Error] Failed setting up process signal listeners:", error);
  }
}

setupRunnerSignalListeners();

if (require.main === module) {
  void startDevRunner();
}

module.exports = {
  checkServerReady,
  waitForServerReady,
  cleanUpProcesses,
  startDevRunner,
  killPort3020,
  resolveHubPortFromEnv,
  resolveElectronLauncher,
  setupRunnerSignalListeners,
  HUB_TARGET_PORT,
  HUB_DEV_SERVER_URL,
};
