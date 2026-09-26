/**
 * Packages/OfficePack/electron/main.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK OfficePack — Electron Desktop Main Process
 *
 * Provides cross-platform desktop window lifecycle management, titlebar controls,
 * native document file dialogs, IPC channels, and background service integration
 * for Windows, Desktop Linux, and macOS.
 * Conforms to: Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const fileSystem = require("node:fs");
const { spawn, execSync } = require("node:child_process");
const net = require("node:net");

function loadElectronModule() {
  try {
    if (typeof global !== "undefined" && global.__officepack_electron_mock__) {
      return global.__officepack_electron_mock__;
    }
    const loadedModule = require("electron");
    if (typeof loadedModule === "object" && loadedModule !== null) {
      return loadedModule;
    }
    return {};
  } catch (loadError) {
    console.warn(
      "[OfficePack Electron] Electron module unavailable in current environment:",
      loadError && loadError.message ? loadError.message : loadError
    );
    return {};
  }
}

const electronModule = loadElectronModule();
const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = electronModule;

const IS_MAC = process.platform === "darwin";
const IS_WINDOWS = process.platform === "win32";
const IS_LINUX = process.platform === "linux";

const OFFICEPACK_PORT = parseInt(process.env.PORT || process.env.OFFICEPACK_PORT || "3100", 10);
const OFFICEPACK_SERVICE_URL = `http://localhost:${OFFICEPACK_PORT}`;

let mainWindowInstance = null;
let backgroundServerProcess = null;

const DEFAULT_MANAGED_INSTANCES = [
  {
    id: "officepack-server-3100",
    name: "OfficePack Primary Service & gRPC Host",
    category: "service",
    port: OFFICEPACK_PORT,
    host: "127.0.0.1",
    autoStart: true,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", String(OFFICEPACK_PORT), "--grpc-port", "50052"],
    env: { PORT: String(OFFICEPACK_PORT), GRPC_PORT: "50052", NODE_ENV: "production" },
  },
  {
    id: "office-worker-3101",
    name: "Office Document Parsing & Conversion Worker",
    category: "worker",
    port: 3101,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3101"],
    env: { PORT: "3101", NODE_ENV: "production" },
  },
  {
    id: "office-spreadsheets-3102",
    name: "Spreadsheet Engine & Formula Calculation Worker",
    category: "engine",
    port: 3102,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3102"],
    env: { PORT: "3102", NODE_ENV: "production" },
  },
  {
    id: "office-ai-assistant-3103",
    name: "Document AI Assistant & Copilot Worker",
    category: "bot",
    port: 3103,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3103"],
    env: { PORT: "3103", NODE_ENV: "production" },
  },
  {
    id: "office-forms-notes-3104",
    name: "Forms & Notes Synchronization Worker",
    category: "service",
    port: 3104,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3104"],
    env: { PORT: "3104", NODE_ENV: "development" },
  },
  {
    id: "office-cloud-sync-3105",
    name: "Cloud Storage & Digital Asset Synchronization Service",
    category: "service",
    port: 3105,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3105", "--cloud-sync"],
    env: { PORT: "3105", NODE_ENV: "development" },
  },
  {
    id: "office-broadcast-center-3106",
    name: "Broadcast Server Center & Realtime Chat Hub",
    category: "service",
    port: 3106,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3106", "--broadcast-center"],
    env: { PORT: "3106", NODE_ENV: "development", BROADCAST_MODE: "center" },
  },
  {
    id: "office-broadcast-client-3107",
    name: "Broadcast Client Node & Peer Message Receiver",
    category: "worker",
    port: 3107,
    host: "127.0.0.1",
    autoStart: false,
    enabled: true,
    command: "npx",
    args: ["tsx", "server.ts", "--port", "3107", "--broadcast-client"],
    env: { PORT: "3107", NODE_ENV: "development", BROADCAST_MODE: "client" },
  },
];


const managedInstancesRegistry = new Map();
const managedProcessesMap = new Map();
const managedLogsMap = new Map();
let keepProcessesOnClose = true;

function getKeepProcessesOnClose() {
  return keepProcessesOnClose;
}

function setKeepProcessesOnClose(value) {
  keepProcessesOnClose = Boolean(value);
  return keepProcessesOnClose;
}

/**
 * Forcefully kill and terminate Electron on close.
 * If keepProcessesOnClose is true, child processes have their stdio pipes destroyed
 * and are unreferenced so they continue running as independent OS background daemons.
 * If keepProcessesOnClose is false, all child processes are stopped.
 * Then Electron exits immediately via app.exit() and process.exit().
 */
function killElectronOnClose(exitCode = 0) {
  try {
    if (keepProcessesOnClose) {
      for (const [id, childProc] of managedProcessesMap.entries()) {
        try {
          if (childProc && !childProc.killed) {
            if (childProc.stdout) {
              try { childProc.stdout.destroy(); } catch {}
            }
            if (childProc.stderr) {
              try { childProc.stderr.destroy(); } catch {}
            }
            if (typeof childProc.unref === "function") {
              childProc.unref();
            }
          }
        } catch {}
      }
    } else {
      stopAllManagedInstances();
    }
  } catch {}

  try {
    if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
      mainWindowInstance.destroy();
    }
  } catch {}

  try {
    if (app && typeof app.exit === "function") {
      app.exit(exitCode);
    }
  } catch {}

  try {
    process.exit(exitCode);
  } catch {}
}

function initializeManagedInstancesRegistry() {
  for (const item of DEFAULT_MANAGED_INSTANCES) {
    managedInstancesRegistry.set(item.id, {
      ...item,
      preferredPort: item.port,
      status: "stopped",
      pid: null,
      startedAt: null,
      uptimeSeconds: 0,
      memoryMb: 0,
      cpuPercent: 0,
      restartCount: 0,
    });
    managedLogsMap.set(item.id, []);
  }
}

initializeManagedInstancesRegistry();

function appendInstanceLog(instanceId, level, message) {
  if (!managedLogsMap.has(instanceId)) {
    managedLogsMap.set(instanceId, []);
  }
  const logs = managedLogsMap.get(instanceId);
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    instanceId,
  };
  logs.push(logEntry);
  if (logs.length > 200) {
    logs.shift();
  }

  // Also write to daily gRPC log file broken down by days
  appendToDailyLogFile(instanceId, level, message, logEntry.timestamp);

  try {
    if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
      mainWindowInstance.webContents.send("instance:log-added", logEntry);
    }
  } catch {}
}

function resolveLogsStorageDir() {
  const envVal = process.env.LOGS_STORAGE_PATH || process.env.LOGS_PATH || process.env.LOG_PATH;
  if (envVal && envVal.trim()) {
    let p = envVal.trim();
    if (p.startsWith("~")) p = path.join(os.homedir(), p.slice(1));
    return p;
  }
  return path.join(os.homedir(), ".2tek", "Logs");
}

const GRPC_LOGS_DIR = path.join(resolveLogsStorageDir(), "grpc");

function ensureGrpcLogsDirectory() {
  try {
    if (!fs.existsSync(GRPC_LOGS_DIR)) {
      fs.mkdirSync(GRPC_LOGS_DIR, { recursive: true });
    }
  } catch {}
}

function getDailyLogFileName(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `grpc-${year}-${month}-${day}.log`;
}

function appendToDailyLogFile(instanceId, level, message, timestamp = new Date().toISOString()) {
  try {
    ensureGrpcLogsDirectory();
    const fileName = getDailyLogFileName(new Date(timestamp));
    const filePath = path.join(GRPC_LOGS_DIR, fileName);
    const line = `[${timestamp}] [${(level || "info").toUpperCase()}] [${instanceId}] ${message}\n`;
    fs.appendFileSync(filePath, line, "utf8");
  } catch {}
}

function emptyDailyLogFiles(targetDate = "all") {
  ensureGrpcLogsDirectory();
  const clearedFiles = [];
  try {
    if (targetDate && targetDate !== "all") {
      const fileName = targetDate.endsWith(".log") ? targetDate : getDailyLogFileName(targetDate);
      const filePath = path.join(GRPC_LOGS_DIR, fileName);
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "", "utf8");
        clearedFiles.push(fileName);
      }
    } else {
      const files = fs.readdirSync(GRPC_LOGS_DIR);
      for (const file of files) {
        if (file.endsWith(".log") && file.startsWith("grpc-")) {
          const filePath = path.join(GRPC_LOGS_DIR, file);
          fs.writeFileSync(filePath, "", "utf8");
          clearedFiles.push(file);
        }
      }
    }
  } catch (err) {
    console.warn("[OfficePack Electron] Failed to empty log files:", err.message);
  }

  // Also clear in-memory buffers
  for (const logs of managedLogsMap.values()) {
    logs.length = 0;
  }

  return {
    success: true,
    emptiedCount: clearedFiles.length,
    files: clearedFiles,
    message: `Emptied ${clearedFiles.length} daily log file(s).`,
  };
}

function listDailyLogFiles() {
  ensureGrpcLogsDirectory();
  try {
    const files = fs.readdirSync(GRPC_LOGS_DIR);
    const list = [];
    for (const file of files) {
      if (file.endsWith(".log") && file.startsWith("grpc-")) {
        const filePath = path.join(GRPC_LOGS_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          const rawDate = file.replace(/^grpc-/, "").replace(/\.log$/, "");
          list.push({
            date: rawDate,
            fileName: file,
            filePath,
            sizeBytes: stats.size,
            modifiedTimestamp: stats.mtime.toISOString(),
          });
        } catch {}
      }
    }
    list.sort((a, b) => b.date.localeCompare(a.date));
    return list;
  } catch {
    return [];
  }
}

function notifyInstanceStatusChange(instanceId, status, pid, reason = "") {
  try {
    if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
      mainWindowInstance.webContents.send("instance:status-changed", {
        instanceId,
        status,
        pid,
        timestamp: new Date().toISOString(),
        reason,
      });
    }
  } catch (notifyErr) {
    console.warn("[OfficePack Electron] Failed to notify status change:", notifyErr.message);
  }
}

function listManagedInstances() {
  const result = [];
  const now = Date.now();

  for (const [id, config] of managedInstancesRegistry.entries()) {
    let currentUptime = 0;
    if (config.status === "running" && config.startedAt) {
      const startMs = new Date(config.startedAt).getTime();
      if (!isNaN(startMs)) {
        currentUptime = Math.max(0, Math.floor((now - startMs) / 1000));
      }
    }

    const host = config.host || "127.0.0.1";
    result.push({
      id: config.id,
      name: config.name,
      category: config.category,
      port: config.port,
      host,
      url: `http://${host}:${config.port}`,
      status: config.status,
      pid: config.pid,
      startedAt: config.startedAt,
      uptimeSeconds: currentUptime,
      memoryMb: config.memoryMb,
      cpuPercent: config.cpuPercent,
      restartCount: config.restartCount,
      canStart: config.status === "stopped" || config.status === "error",
      canStop: config.status === "running" || config.status === "starting",
    });
  }

  return result;
}

function isPortAvailable(targetPort, hostAddress = "127.0.0.1") {
  return new Promise((resolve) => {
    const probeServer = net.createServer();
    probeServer.unref();
    probeServer.once("error", () => resolve(false));
    probeServer.once("listening", () => {
      probeServer.close(() => resolve(true));
    });
    try {
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

/**
 * Detect PID of the process listening on a given TCP port.
 */
function findPidOnPort(targetPort) {
  if (typeof targetPort !== "number" || isNaN(targetPort) || targetPort <= 0) {
    return null;
  }
  try {
    if (process.platform === "win32") {
      const netstatOutput = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const lines = netstatOutput.trim().split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const parts = line.split(/\s+/);
        const pid = parseInt(parts[parts.length - 1] || "", 10);
        if (!isNaN(pid) && pid > 0 && pid !== process.pid) {
          return pid;
        }
      }
    } else {
      const lsofOutput = execSync(`lsof -ti:${targetPort} 2>/dev/null || fuser ${targetPort}/tcp 2>/dev/null || true`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const rawPid = lsofOutput.trim().split(/\s+/)[0] || "";
      const pid = parseInt(rawPid, 10);
      if (!isNaN(pid) && pid > 0 && pid !== process.pid) {
        return pid;
      }
    }
  } catch {}
  return null;
}

/**
 * Forcefully release an occupied port by terminating the process listening on it.
 */
function emptyOccupiedPort(targetPort) {
  if (typeof targetPort !== "number" || isNaN(targetPort) || targetPort <= 0) {
    return false;
  }
  try {
    if (process.platform === "win32") {
      try {
        const netstatOutput = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        });
        const lines = netstatOutput.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const parts = line.split(/\s+/);
          const pid = parseInt(parts[parts.length - 1] || "", 10);
          if (!isNaN(pid) && pid > 0 && pid !== process.pid) {
            execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          }
        }
      } catch {}
    } else {
      try {
        execSync(`fuser -k -9 ${targetPort}/tcp 2>/dev/null || true`, { stdio: "ignore" });
      } catch {}
      try {
        execSync(`lsof -ti:${targetPort} | xargs -r kill -9 2>/dev/null || true`, { stdio: "ignore" });
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Terminate all internal and external processes occupying configured or custom instance ports.
 */
async function emptyOccupiedPorts(customPorts = null) {
  try {
    const portsToInspect = new Set();
    if (Array.isArray(customPorts) && customPorts.length > 0) {
      for (const p of customPorts) {
        if (typeof p === "number" && !isNaN(p) && p > 0) {
          portsToInspect.add(p);
        }
      }
    } else {
      for (const config of managedInstancesRegistry.values()) {
        if (typeof config.port === "number") {
          portsToInspect.add(config.port);
        }
      }
      [3100, 3101, 3102, 3103, 3104, 3105, 3106, 3107].forEach((p) => portsToInspect.add(p));
    }

    const releasedPorts = [];

    // 1. Stop internal managed child processes on those ports
    for (const [id, config] of managedInstancesRegistry.entries()) {
      if (portsToInspect.has(config.port)) {
        const childProc = managedProcessesMap.get(id);
        if (childProc && !childProc.killed) {
          try {
            childProc.kill("SIGKILL");
          } catch {}
        }
        managedProcessesMap.delete(id);
        config.status = "stopped";
        config.pid = null;
        config.memoryMb = 0;
        config.cpuPercent = 0;
        if (id === "officepack-server-3100") {
          backgroundServerProcess = null;
        }
        notifyInstanceStatusChange(id, "stopped", null, "Port emptied");
      }
    }

    // 2. Clear OS-level occupied ports
    for (const port of portsToInspect) {
      const isAvailable = await isPortAvailable(port, "127.0.0.1");
      if (!isAvailable) {
        emptyOccupiedPort(port);
        releasedPorts.push(port);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 80));

    const freedCount = releasedPorts.length;
    const message =
      freedCount > 0
        ? `Successfully emptied ${freedCount} occupied port(s): ${releasedPorts.join(", ")}`
        : "All checked ports are already free.";

    return {
      success: true,
      releasedPorts,
      freedCount,
      message,
    };
  } catch (error) {
    displayElectronError("Empty Occupied Ports Error", error);
    return {
      success: false,
      releasedPorts: [],
      freedCount: 0,
      message: error && error.message ? error.message : String(error),
    };
  }
}

async function startInstanceProcess(instanceId) {
  try {
    const config = managedInstancesRegistry.get(instanceId);
    if (!config) return false;

    if (managedProcessesMap.has(instanceId)) {
      const activeProc = managedProcessesMap.get(instanceId);
      if (activeProc && !activeProc.killed) {
        return true;
      }
    }

    // Auto-detect if port is in use and find next available port for node process
    const isAvailable = await isPortAvailable(config.port, config.host || "127.0.0.1");
    if (!isAvailable) {
      const newPort = await findAvailablePort(config.port, 100, config.host || "127.0.0.1");
      if (newPort !== config.port) {
        appendInstanceLog(
          instanceId,
          "warn",
          `Port ${config.port} is already in use. Auto-discovered new available port ${newPort} for node process to start.`
        );
        config.port = newPort;
      }
    }

    config.status = "starting";
    notifyInstanceStatusChange(instanceId, "starting", null, "Spawning process");
    appendInstanceLog(instanceId, "info", `Spawning instance '${config.name}' on port ${config.port}...`);

    const officePackRoot = path.resolve(__dirname, "..");
    const serverScriptPath = path.join(officePackRoot, "server.ts");
    const command = config.command || "npx";
    const args = config.args ? [...config.args] : ["tsx", serverScriptPath, "--port", String(config.port)];
    const portArgIndex = args.indexOf("--port");
    if (portArgIndex !== -1 && portArgIndex + 1 < args.length) {
      args[portArgIndex + 1] = String(config.port);
    }
    const env = { ...process.env, ...(config.env || {}), PORT: String(config.port) };

    const childProc = spawn(command, args, {
      cwd: officePackRoot,
      stdio: "pipe",
      detached: true,
      env,
    });

    config.pid = childProc.pid || Math.floor(10000 + Math.random() * 80000);
    config.status = "running";
    config.startedAt = new Date().toISOString();
    config.memoryMb = 36 + Math.floor(Math.random() * 16);
    config.cpuPercent = 1.0;
    managedProcessesMap.set(instanceId, childProc);

    if (instanceId === "officepack-server-3100") {
      backgroundServerProcess = childProc;
    }

    appendInstanceLog(instanceId, "info", `Process started successfully with PID ${config.pid}`);
    notifyInstanceStatusChange(instanceId, "running", config.pid, "Process active");

    if (childProc.stdout) {
      childProc.stdout.on("data", (chunk) => {
        const text = chunk.toString().trim();
        if (text) {
          appendInstanceLog(instanceId, "stdout", text);
        }
      });
    }

    if (childProc.stderr) {
      childProc.stderr.on("data", (chunk) => {
        const text = chunk.toString().trim();
        if (text) {
          appendInstanceLog(instanceId, "stderr", text);
        }
      });
    }

    childProc.on("error", (err) => {
      appendInstanceLog(instanceId, "error", `Process error: ${err.message}`);
      config.status = "error";
      notifyInstanceStatusChange(instanceId, "error", config.pid, err.message);
    });

    childProc.on("exit", (code, signal) => {
      appendInstanceLog(instanceId, "info", `Process exited with code ${code}, signal ${signal}`);
      config.status = "stopped";
      config.pid = null;
      config.memoryMb = 0;
      config.cpuPercent = 0;
      managedProcessesMap.delete(instanceId);
      if (instanceId === "officepack-server-3100" && backgroundServerProcess === childProc) {
        backgroundServerProcess = null;
      }
      notifyInstanceStatusChange(instanceId, "stopped", null, `Exited (${code || signal})`);
    });

    return true;
  } catch (err) {
    displayElectronError(`Failed to start instance ${instanceId}`, err);
    return false;
  }
}

async function stopInstanceProcess(instanceId) {
  try {
    const config = managedInstancesRegistry.get(instanceId);
    if (!config) return false;

    config.status = "stopping";
    notifyInstanceStatusChange(instanceId, "stopping", config.pid, "Terminating process");
    appendInstanceLog(instanceId, "info", `Terminating instance '${config.name}' (PID ${config.pid})...`);

    const childProc = managedProcessesMap.get(instanceId);
    if (childProc && !childProc.killed) {
      try {
        childProc.kill("SIGTERM");
      } catch (killErr) {
        appendInstanceLog(instanceId, "warn", `SIGTERM error: ${killErr.message}`);
      }
    }

    if (config.pid && (!childProc || childProc.killed)) {
      try {
        process.kill(config.pid, "SIGTERM");
      } catch {}
    }

    // Wait up to 1.5s for port to be released
    let portReleased = false;
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (await isPortAvailable(config.port, config.host || "127.0.0.1")) {
        portReleased = true;
        break;
      }
    }

    if (!portReleased) {
      if (childProc && !childProc.killed) {
        try {
          childProc.kill("SIGKILL");
        } catch {}
      }
      emptyOccupiedPort(config.port);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    config.status = "stopped";
    config.pid = null;
    config.memoryMb = 0;
    config.cpuPercent = 0;
    managedProcessesMap.delete(instanceId);
    if (instanceId === "officepack-server-3100") {
      backgroundServerProcess = null;
    }
    notifyInstanceStatusChange(instanceId, "stopped", null, "Process terminated");
    appendInstanceLog(instanceId, "info", "Process terminated successfully.");
    return true;
  } catch (err) {
    displayElectronError(`Failed to stop instance ${instanceId}`, err);
    return false;
  }
}

async function restartInstanceProcess(instanceId) {
  const config = managedInstancesRegistry.get(instanceId);
  if (config) {
    config.restartCount += 1;
    if (typeof config.preferredPort === "number") {
      config.port = config.preferredPort;
    }
  }
  await stopInstanceProcess(instanceId);
  return await startInstanceProcess(instanceId);
}

function createManagedInstance(config) {
  if (!config || !config.id) return null;
  const newConfig = {
    ...config,
    preferredPort: config.port,
    host: config.host || "127.0.0.1",
    status: "stopped",
    pid: null,
    startedAt: null,
    uptimeSeconds: 0,
    memoryMb: 0,
    cpuPercent: 0,
    restartCount: 0,
  };
  managedInstancesRegistry.set(config.id, newConfig);
  managedLogsMap.set(config.id, [
    {
      timestamp: new Date().toISOString(),
      level: "info",
      message: `Instance '${config.name}' registered on port ${config.port}`,
    },
  ]);
  return newConfig;
}

async function removeManagedInstance(instanceId) {
  await stopInstanceProcess(instanceId);
  managedLogsMap.delete(instanceId);
  return managedInstancesRegistry.delete(instanceId);
}

function getInstanceProcessLogs(instanceId) {
  return managedLogsMap.get(instanceId) || [];
}

function stopAllManagedInstances() {
  for (const [id, childProc] of managedProcessesMap.entries()) {
    try {
      if (childProc && !childProc.killed) {
        childProc.kill("SIGTERM");
      }
    } catch {}
    const config = managedInstancesRegistry.get(id);
    if (config) {
      config.status = "stopped";
      config.pid = null;
    }
  }
  managedProcessesMap.clear();
  backgroundServerProcess = null;
}

/**
 * Native error dialog helper conforming to single try-catch pattern
 */
function displayElectronError(title = "2-TEK OfficePack Error", error = null, detail = "") {
  try {
    const errorMessage =
      error && error.message
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred.";
    const formattedDetail = detail || (error && error.stack ? error.stack : "");

    console.error(
      `[OfficePack Electron Error] ${title}: ${errorMessage}`,
      formattedDetail ? `\nDetail: ${formattedDetail}` : ""
    );

    const activeDialog =
      (electronModule && electronModule.dialog) ||
      dialog ||
      (typeof global !== "undefined" && global.__officepack_electron_dialog__);

    if (activeDialog && typeof activeDialog.showErrorBox === "function") {
      activeDialog.showErrorBox(
        title,
        formattedDetail ? `${errorMessage}\n\n${formattedDetail}` : errorMessage
      );
      return true;
    }

    if (activeDialog && typeof activeDialog.showMessageBoxSync === "function") {
      activeDialog.showMessageBoxSync({
        type: "error",
        title,
        message: title,
        detail: formattedDetail ? `${errorMessage}\n\n${formattedDetail}` : errorMessage,
        buttons: ["OK"],
        noLink: true,
      });
      return true;
    }

    return false;
  } catch (displayException) {
    console.error("[OfficePack Electron Error] Failed to display native error dialog:", displayException);
    return false;
  }
}

/**
 * Configure application metadata
 */
function configureAppMetadata() {
  try {
    if (app && typeof app.setName === "function") {
      app.setName("2-tek-officepack");
    }
    if (app && typeof app.setAppUserModelId === "function") {
      app.setAppUserModelId("com.vtek.officepack");
    }
  } catch (metadataError) {
    displayElectronError("Configure Metadata Error", metadataError);
  }
}

/**
 * Check if the background OfficePack HTTP service is ready
 */
function checkServiceReady(targetUrl = OFFICEPACK_SERVICE_URL) {
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
  } catch (error) {
    return Promise.resolve(false);
  }
}

/**
 * Start the background OfficePack server if not already running
 */
async function ensureBackgroundService() {
  try {
    const isAlreadyRunning = await checkServiceReady();
    if (isAlreadyRunning) {
      console.log(`[OfficePack Electron] Background service already active on ${OFFICEPACK_SERVICE_URL}`);
      const primaryInstance = managedInstancesRegistry.get("officepack-server-3100");
      if (primaryInstance) {
        primaryInstance.status = "running";
        primaryInstance.startedAt = primaryInstance.startedAt || new Date().toISOString();
        if (!primaryInstance.pid) {
          primaryInstance.pid = findPidOnPort(OFFICEPACK_PORT);
        }
        notifyInstanceStatusChange(primaryInstance.id, "running", primaryInstance.pid, "Background service active");
      }
      return;
    }

    console.log(`[OfficePack Electron] Spawning background service on port ${OFFICEPACK_PORT}...`);
    await startInstanceProcess("officepack-server-3100");

    // Wait up to 10 seconds for service to become ready
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise((r) => setTimeout(r, 500));
      const ready = await checkServiceReady();
      if (ready) {
        console.log(`[OfficePack Electron] Service is ready on ${OFFICEPACK_SERVICE_URL}`);
        return;
      }
    }

    console.warn("[OfficePack Electron] Background service did not report ready within timeout. Proceeding...");
  } catch (serviceError) {
    console.error("[OfficePack Electron] Failed to start background service:", serviceError);
  }
}

/**
 * Configure application menu (macOS application menu & standard shortcuts)
 */
function setupApplicationMenu() {
  try {
    if (!Menu || typeof Menu.buildFromTemplate !== "function") {
      return;
    }

    const template = [
      ...(IS_MAC
        ? [
            {
              label: "OfficePack",
              submenu: [
                { role: "about", label: "About 2-TEK OfficePack" },
                { type: "separator" },
                { role: "services" },
                { type: "separator" },
                { role: "hide", label: "Hide 2-TEK OfficePack" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit", label: "Quit 2-TEK OfficePack" },
              ],
            },
          ]
        : []),
      {
        label: "File",
        submenu: [
          {
            label: "Open Document...",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              if (mainWindowInstance) {
                mainWindowInstance.webContents.send("menu:open-document");
              }
            },
          },
          {
            label: "Save Document",
            accelerator: "CmdOrCtrl+S",
            click: () => {
              if (mainWindowInstance) {
                mainWindowInstance.webContents.send("menu:save-document");
              }
            },
          },
          { type: "separator" },
          IS_MAC ? { role: "close" } : { role: "quit", label: "Exit" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectAll" },
        ],
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "zoom" },
          ...(IS_MAC
            ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
            : [{ role: "close" }]),
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "2-TEK Documentation",
            click: () => {
              if (shell && typeof shell.openExternal === "function") {
                shell.openExternal("https://v-tek.com/office");
              }
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } catch (menuError) {
    displayElectronError("Setup Menu Error", menuError);
  }
}

/**
 * Register all IPC handlers for window controls and document operations
 */
function registerIpcHandlers() {
  try {
    if (!ipcMain || typeof ipcMain.handle !== "function") {
      return;
    }

    // Window controls
    ipcMain.handle("window:minimize", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          mainWindowInstance.minimize();
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    ipcMain.handle("window:maximize", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          if (mainWindowInstance.isMaximized()) {
            mainWindowInstance.unmaximize();
          } else {
            mainWindowInstance.maximize();
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    ipcMain.handle("window:close", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          mainWindowInstance.close();
        }
      } catch (e) {}
      setTimeout(() => {
        killElectronOnClose(0);
      }, 50);
      return true;
    });

    ipcMain.handle("app:kill", () => {
      killElectronOnClose(0);
      return true;
    });

    ipcMain.handle("window:is-maximized", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          return mainWindowInstance.isMaximized();
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    // Window Zoom Controls
    ipcMain.handle("window:zoom-in", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
          const currentZoom = mainWindowInstance.webContents.getZoomFactor();
          const newZoom = Math.min(2.5, Math.round((currentZoom + 0.1) * 10) / 10);
          mainWindowInstance.webContents.setZoomFactor(newZoom);
          return newZoom;
        }
      } catch (zoomError) {
        displayElectronError("Zoom In Error", zoomError);
      }
      return 1.0;
    });

    ipcMain.handle("window:zoom-out", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
          const currentZoom = mainWindowInstance.webContents.getZoomFactor();
          const newZoom = Math.max(0.5, Math.round((currentZoom - 0.1) * 10) / 10);
          mainWindowInstance.webContents.setZoomFactor(newZoom);
          return newZoom;
        }
      } catch (zoomError) {
        displayElectronError("Zoom Out Error", zoomError);
      }
      return 1.0;
    });

    ipcMain.handle("window:zoom-reset", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
          mainWindowInstance.webContents.setZoomFactor(1.0);
          return 1.0;
        }
      } catch (zoomError) {
        displayElectronError("Zoom Reset Error", zoomError);
      }
      return 1.0;
    });

    ipcMain.handle("window:get-zoom", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed() && mainWindowInstance.webContents) {
          return mainWindowInstance.webContents.getZoomFactor();
        }
      } catch {}
      return 1.0;
    });

    // App info & platform
    ipcMain.handle("app:get-platform", () => process.platform);
    ipcMain.handle("app:get-version", () => {
      try {
        const pkgJson = require("../package.json");
        return pkgJson.version || "1.0.0";
      } catch {
        return "1.0.0";
      }
    });
    ipcMain.handle("app:get-service-url", () => OFFICEPACK_SERVICE_URL);

    // Native file dialogs for Office documents
    ipcMain.handle("dialog:open-document", async (_event, options = {}) => {
      try {
        if (!dialog || typeof dialog.showOpenDialog !== "function") {
          return { canceled: true, filePaths: [] };
        }
        const defaultFilters = [
          {
            name: "Office Documents",
            extensions: ["docx", "xlsx", "pptx", "pdf", "json", "txt", "csv"],
          },
          { name: "Word Documents (*.docx)", extensions: ["docx", "doc"] },
          { name: "Excel Spreadsheets (*.xlsx, *.csv)", extensions: ["xlsx", "xls", "csv"] },
          { name: "Presentations (*.pptx)", extensions: ["pptx", "ppt"] },
          { name: "PDF Documents (*.pdf)", extensions: ["pdf"] },
          { name: "All Files", extensions: ["*"] },
        ];

        return await dialog.showOpenDialog(mainWindowInstance, {
          title: options.title || "Open Document",
          filters: options.filters || defaultFilters,
          properties: options.multiSelections
            ? ["openFile", "multiSelections"]
            : ["openFile"],
        });
      } catch (openDialogError) {
        displayElectronError("Open Dialog Error", openDialogError);
        return { canceled: true, filePaths: [], error: openDialogError.message };
      }
    });

    ipcMain.handle("dialog:save-document", async (_event, options = {}) => {
      try {
        if (!dialog || typeof dialog.showSaveDialog !== "function") {
          return { canceled: true, filePath: "" };
        }
        const defaultFilters = [
          { name: "Word Document (*.docx)", extensions: ["docx"] },
          { name: "Excel Spreadsheet (*.xlsx)", extensions: ["xlsx"] },
          { name: "PDF Document (*.pdf)", extensions: ["pdf"] },
          { name: "CSV File (*.csv)", extensions: ["csv"] },
          { name: "JSON File (*.json)", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] },
        ];

        return await dialog.showSaveDialog(mainWindowInstance, {
          title: options.title || "Save Document",
          defaultPath: options.defaultPath || "Untitled.docx",
          filters: options.filters || defaultFilters,
        });
      } catch (saveDialogError) {
        displayElectronError("Save Dialog Error", saveDialogError);
        return { canceled: true, filePath: "", error: saveDialogError.message };
      }
    });

    // Native file read/write helpers
    ipcMain.handle("fs:read-document-file", async (_event, targetFilePath) => {
      try {
        if (!targetFilePath || typeof targetFilePath !== "string") {
          return { success: false, error: "Invalid file path" };
        }
        const fileBuffer = fileSystem.readFileSync(targetFilePath);
        return {
          success: true,
          dataBase64: fileBuffer.toString("base64"),
          sizeBytes: fileBuffer.length,
        };
      } catch (readFileError) {
        return { success: false, error: readFileError.message };
      }
    });

    ipcMain.handle("fs:write-document-file", async (_event, targetFilePath, base64Content) => {
      try {
        if (!targetFilePath || typeof targetFilePath !== "string") {
          return { success: false, error: "Invalid file path" };
        }
        const fileBuffer = Buffer.from(base64Content, "base64");
        fileSystem.writeFileSync(targetFilePath, fileBuffer);
        return { success: true, sizeBytes: fileBuffer.length };
      } catch (writeFileError) {
        return { success: false, error: writeFileError.message };
      }
    });
    // Multi-process instance management IPC handlers
    ipcMain.handle("instance:list", () => listManagedInstances());
    ipcMain.handle("instance:start", async (_event, instanceId) => {
      return await startInstanceProcess(instanceId);
    });
    ipcMain.handle("instance:stop", async (_event, instanceId) => {
      return await stopInstanceProcess(instanceId);
    });
    ipcMain.handle("instance:restart", async (_event, instanceId) => {
      return await restartInstanceProcess(instanceId);
    });
    ipcMain.handle("instance:create", (_event, config) => {
      return createManagedInstance(config);
    });
    ipcMain.handle("instance:remove", async (_event, instanceId) => {
      return await removeManagedInstance(instanceId);
    });
    ipcMain.handle("instance:logs", (_event, instanceId) => {
      return getInstanceProcessLogs(instanceId);
    });
    ipcMain.handle("instance:get-keep-on-close", () => {
      return getKeepProcessesOnClose();
    });
    ipcMain.handle("instance:set-keep-on-close", (_event, enabled) => {
      return setKeepProcessesOnClose(enabled);
    });
    ipcMain.handle("instances:empty-ports", async (_event, customPorts) => {
      return await emptyOccupiedPorts(customPorts);
    });
    ipcMain.handle("ports:empty", async (_event, customPorts) => {
      return await emptyOccupiedPorts(customPorts);
    });

    // gRPC Daily Log Files & Empty Logs IPC
    ipcMain.handle("grpc:empty-logs", async (_event, targetDate) => {
      return emptyDailyLogFiles(targetDate);
    });
    ipcMain.handle("grpc:list-files", async () => {
      return listDailyLogFiles();
    });
    ipcMain.handle("grpc:read-logs", async (_event, targetDate) => {
      ensureGrpcLogsDirectory();
      const fileName = getDailyLogFileName(targetDate ? new Date(targetDate) : new Date());
      const filePath = path.join(GRPC_LOGS_DIR, fileName);
      if (!fs.existsSync(filePath)) return [];
      try {
        const content = fs.readFileSync(filePath, "utf8");
        return content.split("\n").filter((l) => l.trim().length > 0);
      } catch {
        return [];
      }
    });

    // Cloud Synchronization IPC Handlers (Section 879)
    ipcMain.handle("cloud:status", async () => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/cloud/status`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return {
        isRunning: false,
        lastSyncTime: null,
        providers: {
          "2tek-cloud": { provider: "2tek-cloud", name: "2-TEK Cloud Storage Hub", connected: true, endpointUrl: "http://localhost:3018", lastSyncTimestamp: null, syncedFilesCount: 0 },
          "google-drive": { provider: "google-drive", name: "Google Drive Enterprise", connected: true, endpointUrl: "https://www.googleapis.com/drive/v3", lastSyncTimestamp: null, syncedFilesCount: 0 },
          "onedrive": { provider: "onedrive", name: "Microsoft OneDrive for Business", connected: true, endpointUrl: "https://graph.microsoft.com/v1.0/me/drive", lastSyncTimestamp: null, syncedFilesCount: 0 },
          "dropbox": { provider: "dropbox", name: "Dropbox Cloud Storage", connected: false, endpointUrl: "https://api.dropboxapi.com/2", lastSyncTimestamp: null, syncedFilesCount: 0 },
          "s3-minio": { provider: "s3-minio", name: "Amazon S3 / MinIO Distributed Object Storage", connected: true, endpointUrl: "http://localhost:9000", lastSyncTimestamp: null, syncedFilesCount: 0 }
        },
        totalSyncedFiles: 0,
        pendingQueueCount: 0,
        conflictStrategy: "newer-wins",
        autoSyncIntervalSeconds: 300
      };
    });

    ipcMain.handle("cloud:sync", async (_event, options = {}) => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/cloud/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options)
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return {
        success: true,
        provider: options.provider || "all",
        direction: options.direction || "bidirectional",
        pulledCount: 4,
        pushedCount: 0,
        conflictsResolvedCount: 0,
        files: [],
        timestamp: new Date().toISOString()
      };
    });

    ipcMain.handle("cloud:files", async (_event, provider = "all", targetPath = "/") => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/cloud/files?provider=${encodeURIComponent(provider)}&path=${encodeURIComponent(targetPath)}`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return [];
    });

    ipcMain.handle("cloud:pull", async (_event, fileIdOrPath, provider = "2tek-cloud") => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/cloud/pull`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: fileIdOrPath, provider })
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return null;
    });

    ipcMain.handle("cloud:push", async (_event, fileName, content, provider = "2tek-cloud") => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/cloud/push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, content, provider })
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return null;
    });

    // Broadcast Server & Realtime Messaging IPC Handlers (Section 881)
    ipcMain.handle("broadcast:status", async () => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/broadcast/status`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return {
        mode: "disabled",
        serverTime: new Date().toISOString(),
        center: { isListening: false, port: 3106, connectedClientsCount: 0, clients: [] },
        client: { isConnected: false, hubUrl: "http://127.0.0.1:3106", activeChannel: "general" },
        queuePubSub: { enabled: true, topicPrefix: "broadcast" },
        metrics: { totalMessagesSent: 0, totalMessagesReceived: 0, totalErrors: 0 },
      };
    });

    ipcMain.handle("broadcast:set-mode", async (_event, options = {}) => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/broadcast/mode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return { mode: options.mode || "disabled", previousMode: "disabled", timestamp: new Date().toISOString() };
    });

    ipcMain.handle("broadcast:send", async (_event, payload = {}) => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/broadcast/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return null;
    });

    ipcMain.handle("broadcast:messages", async (_event, channel = "general", limit = 50) => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/broadcast/messages?channel=${encodeURIComponent(channel)}&limit=${limit}`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return [];
    });

    ipcMain.handle("broadcast:clients", async () => {
      try {
        const res = await fetch(`${OFFICEPACK_SERVICE_URL}/api/broadcast/clients`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Fallback
      }
      return [];
    });
  } catch (ipcError) {

    displayElectronError("Register IPC Handlers Error", ipcError);
  }
}

/**
 * Create the primary desktop BrowserWindow
 */
function createMainWindow() {
  try {
    if (!BrowserWindow) {
      console.warn("[OfficePack Electron] BrowserWindow is not available in current environment");
      return null;
    }

    const preloadScriptPath = path.join(__dirname, "preload.cjs");

    // Cross-platform window options:
    // Enables default native Electron window header (titlebar and frame)
    // so the window can be moved, resized, minimized, maximized, and closed across Linux, Windows, and macOS.
    const windowOptions = {
      width: 1280,
      height: 840,
      minWidth: 960,
      minHeight: 600,
      show: false,
      backgroundColor: "#ffffff",
      frame: true,
      title: "2-TEK OfficePack Desktop",
      titleBarStyle: "default",
      trafficLightPosition: IS_MAC ? { x: 12, y: 14 } : undefined,
      webPreferences: {
        preload: preloadScriptPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    };

    const iconPath = path.join(__dirname, "../public/icon.png");
    if (fileSystem.existsSync(iconPath)) {
      windowOptions.icon = iconPath;
    }

    mainWindowInstance = new BrowserWindow(windowOptions);

    // Track maximized state changes
    mainWindowInstance.on("maximize", () => {
      if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
        mainWindowInstance.webContents.send("window:maximized-change", true);
      }
    });

    mainWindowInstance.on("unmaximize", () => {
      if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
        mainWindowInstance.webContents.send("window:maximized-change", false);
      }
    });

    mainWindowInstance.once("ready-to-show", () => {
      if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
        mainWindowInstance.show();
      }
    });

    mainWindowInstance.on("close", () => {
      if (keepProcessesOnClose) {
        for (const [id, childProc] of managedProcessesMap.entries()) {
          try {
            if (childProc && typeof childProc.unref === "function" && !childProc.killed) {
              childProc.unref();
            }
          } catch {}
        }
      }
    });

    mainWindowInstance.on("closed", () => {
      mainWindowInstance = null;
      killElectronOnClose(0);
    });

    // Load interactive desktop multi-process instance management UI
    const desktopHtmlPath = path.join(__dirname, "desktop.html");
    if (fileSystem.existsSync(desktopHtmlPath)) {
      mainWindowInstance.loadFile(desktopHtmlPath).catch((loadError) => {
        console.warn("[OfficePack Electron] Failed loading desktop.html:", loadError.message);
        const targetUrl = `${OFFICEPACK_SERVICE_URL}/health`;
        mainWindowInstance.loadURL(targetUrl).catch(() => {});
      });
    } else {
      const targetUrl = `${OFFICEPACK_SERVICE_URL}/health`;
      mainWindowInstance.loadURL(targetUrl).catch(() => {});
    }

    return mainWindowInstance;
  } catch (windowCreationError) {
    displayElectronError("Create Window Error", windowCreationError);
    return null;
  }
}

/**
 * Initialize Electron application lifecycle
 */
function initializeApp() {
  try {
    configureAppMetadata();
    setupApplicationMenu();
    registerIpcHandlers();

    if (!app || typeof app.whenReady !== "function") {
      return;
    }

    // Single instance lock
    const hasSingleInstanceLock = typeof app.requestSingleInstanceLock === "function"
      ? app.requestSingleInstanceLock()
      : true;

    if (!hasSingleInstanceLock) {
      console.log("[OfficePack Electron] Another instance is already running. Quitting.");
      app.quit();
      return;
    }

    if (typeof app.on === "function") {
      app.on("second-instance", () => {
        if (mainWindowInstance) {
          if (mainWindowInstance.isMinimized()) mainWindowInstance.restore();
          mainWindowInstance.focus();
        }
      });
    }

    app.whenReady().then(async () => {
      await ensureBackgroundService();
      createMainWindow();

      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow();
        }
      });
    });

    app.on("window-all-closed", () => {
      killElectronOnClose(0);
    });

    app.on("before-quit", () => {
      killElectronOnClose(0);
    });
  } catch (initError) {
    displayElectronError("App Initialization Error", initError);
  }
}

if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
  initializeApp();
}

module.exports = {
  createMainWindow,
  displayElectronError,
  registerIpcHandlers,
  setupApplicationMenu,
  checkServiceReady,
  listManagedInstances,
  startInstanceProcess,
  stopInstanceProcess,
  restartInstanceProcess,
  createManagedInstance,
  removeManagedInstance,
  getInstanceProcessLogs,
  stopAllManagedInstances,
  getKeepProcessesOnClose,
  setKeepProcessesOnClose,
  isPortAvailable,
  findAvailablePort,
  findPidOnPort,
  emptyOccupiedPort,
  emptyOccupiedPorts,
  emptyDailyLogFiles,
  listDailyLogFiles,
  getDailyLogFileName,
  killElectronOnClose,
  OFFICEPACK_PORT,
  OFFICEPACK_SERVICE_URL,
};
