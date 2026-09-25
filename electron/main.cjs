/**
 * packages/VTekOfficeSuit/electron/main.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * VTek Office Suite — Electron Desktop Application Main Process
 *
 * Hosts the unified Office Suite window shell and handles desktop integration.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("node:path");
const http = require("node:http");
const fileSystem = require("node:fs");
const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");

const DEFAULT_PORT = 3035;
const APP_TITLE = "VTek Office Suite";

function resolveDownloadsDirectory() {
  const customDownloadsPath = process.env.DOWNLOADS_PATH || process.env.APP_DOWNLOADS_PATH;
  if (customDownloadsPath) {
    if (customDownloadsPath.startsWith("~")) {
      const os = require("node:os");
      return path.join(os.homedir(), customDownloadsPath.slice(1));
    }
    if (path.isAbsolute(customDownloadsPath)) {
      return customDownloadsPath;
    }
    return path.resolve(__dirname, "../../..", customDownloadsPath);
  }
  return path.resolve(__dirname, "../../../downloads");
}

let mainWindow = null;

function createMainWindow() {
  const isDev = process.env.NODE_ENV !== "production";
  const port = process.env.VTEK_OFFICE_PORT || process.env.PORT || DEFAULT_PORT;
  const targetUrl = process.env.ELECTRON_START_URL || `http://localhost:${port}`;

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    title: APP_TITLE,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  mainWindow.loadURL(targetUrl).catch((navigationError) => {
    console.warn(`[VTek Electron] Initial load failed: ${navigationError.message}. Retrying...`);
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(targetUrl).catch((retryError) => {
          console.error(`[VTek Electron] Retry failed: ${retryError.message}`);
        });
      }
    }, 1500);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Window controls IPC
ipcMain.on("window-minimize", () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
});

ipcMain.on("get-downloads-path-sync", (event) => {
  event.returnValue = resolveDownloadsDirectory();
});

ipcMain.handle("open-downloads-folder", async () => {
  const downloadsPath = resolveDownloadsDirectory();
  if (fileSystem.existsSync(downloadsPath)) {
    shell.openPath(downloadsPath);
    return true;
  }
  return false;
});

ipcMain.handle("open-external-url", async (_event, url) => {
  if (url && typeof url === "string") {
    shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle("build-desktop-package", async (_event, options) => {
  try {
    const { spawn } = require("node:child_process");
    const buildScriptPath = path.resolve(__dirname, "../scripts/build-desktop-packages.mjs");
    return new Promise((resolve) => {
      const args = [];
      if (options && options.target === "deb") args.push("--deb");
      else if (options && options.target === "exe") args.push("--exe");
      else args.push("--all");

      const proc = spawn(process.execPath, [buildScriptPath, ...args], {
        cwd: path.resolve(__dirname, ".."),
        env: { ...process.env, NODE_ENV: "production" },
      });

      proc.on("exit", (code) => {
        resolve({ success: code === 0, code });
      });
      proc.on("error", (err) => {
        resolve({ success: false, error: err.message });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
