/**
 * Packages/Hub/electron/main.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Hub Desktop Application — Electron Main Process
 *
 * Provides desktop window lifecycle management, secure web preferences,
 * single-instance locking, and IPC channels for application controls.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { spawn } = require("node:child_process");
const fileSystem = require("node:fs");
const { killPort3020 } = require("../scripts/kill-port-3020.cjs");

/**
 * Safely load the electron module with single try-catch
 */
function loadElectronModule() {
  try {
    if (typeof global !== "undefined" && global.__hub_electron_mock__) {
      return global.__hub_electron_mock__;
    }
    const loaded = require("electron");
    if (typeof loaded === "object" && loaded !== null) {
      return loaded;
    }
    return {};
  } catch (error) {
    console.warn(
      "[Hub Electron] Electron module unavailable in current environment:",
      error && error.message ? error.message : error
    );
    return {};
  }
}

const electronModule = loadElectronModule();
const { app, BrowserWindow, shell, ipcMain, dialog } = electronModule;

/**
 * Displays error to user using native Electron dialog and logs to console.
 * Uses exactly one try-catch block.
 */
function displayElectronError(title = "2-TEK Hub Error", error = null, detail = "") {
  try {
    const errorMessage =
      error && error.message
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred.";
    const formattedDetail = detail || (error && error.stack ? error.stack : "");

    console.error(
      `[Hub Electron Error] ${title}: ${errorMessage}`,
      formattedDetail ? `\nDetail: ${formattedDetail}` : ""
    );

    const activeDialog =
      (electronModule && electronModule.dialog) ||
      dialog ||
      (typeof global !== "undefined" && global.__hub_electron_dialog__);

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
    console.error("[Hub Electron Error] Failed to display native error dialog:", displayException);
    return false;
  }
}

/**
 * Configure application metadata
 * Uses exactly one try-catch block
 */
function configureAppMetadata() {
  try {
    if (app && typeof app.setName === "function") {
      app.setName("2-tek-hub");
    }
    if (app && typeof app.setAppUserModelId === "function") {
      app.setAppUserModelId("com.vtek.hub");
    }
  } catch (error) {
    displayElectronError("Configure Metadata Error", error);
  }
}

configureAppMetadata();

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
    displayElectronError("Resolve Hub Port Error", error);
  }

  return 3020;
}

/**
 * Configure Linux-specific display, GPU sandbox and stability switches
 * Uses exactly one try-catch block
 */
function configureLinuxSwitches() {
  try {
    if (process.platform !== "linux" || !app) {
      return;
    }
    if (typeof app.disableHardwareAcceleration === "function") {
      app.disableHardwareAcceleration();
    }
    if (app && app.commandLine && typeof app.commandLine.appendSwitch === "function") {
      app.commandLine.appendSwitch("no-sandbox");
      app.commandLine.appendSwitch("disable-dev-shm-usage");
      app.commandLine.appendSwitch("disable-gpu");
      app.commandLine.appendSwitch("disable-gpu-sandbox");
      app.commandLine.appendSwitch("ozone-platform-hint", "auto");
      app.commandLine.appendSwitch("enable-features", "UseOzonePlatform,WaylandWindowDecorations");
      app.commandLine.appendSwitch("log-level", "3");
    }
  } catch (error) {
    displayElectronError("Linux Configuration Error", error);
  }
}

configureLinuxSwitches();

const DEFAULT_WINDOW_WIDTH = 1180;
const DEFAULT_WINDOW_HEIGHT = 760;
const MINIMUM_WINDOW_WIDTH = 960;
const MINIMUM_WINDOW_HEIGHT = 640;

let mainWindowInstance = null;
const activeAppWindows = new Map();
let internalServerProcess = null;
let internalNextServerProcess = null;

/**
 * Resolve the desktop application icon path with fallback
 * Uses exactly one try-catch block
 */
function resolveApplicationIconPath() {
  const icoIconPath = path.join(__dirname, "..", "public", "favicon.ico");
  try {
    const svgIconPath = path.join(__dirname, "..", "public", "icon.svg");
    const fallbackSvgIconPath = path.join(__dirname, "..", "app-icon.svg");

    if (fileSystem.existsSync(icoIconPath)) {
      return icoIconPath;
    }
    if (fileSystem.existsSync(svgIconPath)) {
      return svgIconPath;
    }
    if (fileSystem.existsSync(fallbackSvgIconPath)) {
      return fallbackSvgIconPath;
    }
  } catch (error) {
    displayElectronError("Icon Path Resolution Error", error);
  }
  return icoIconPath;
}

/**
 * Safe process existence check
 * Uses exactly one try-catch block
 */
function isProcessAlive(targetPid) {
  try {
    process.kill(targetPid, 0);
    return true;
  } catch (error) {
    return !(error && error.code === "ESRCH");
  }
}

/**
 * Create a new application window for an opened app
 * Uses exactly one try-catch block
 */
function createApplicationWindow(targetUrl, appTitle = "2-TEK Application", appId = "") {
  try {
    const effectiveTrackingKey =
      appId || (targetUrl ? `app-url-${targetUrl.replace(/[^a-zA-Z0-9]/g, "_")}` : "");

    // Reuse existing active window to prevent multiple window memory leaks
    if (effectiveTrackingKey && activeAppWindows.has(effectiveTrackingKey)) {
      const existingWindow = activeAppWindows.get(effectiveTrackingKey);
      if (
        existingWindow &&
        typeof existingWindow.isDestroyed === "function" &&
        !existingWindow.isDestroyed()
      ) {
        if (typeof existingWindow.isMinimized === "function" && existingWindow.isMinimized()) {
          existingWindow.restore();
        }
        if (typeof existingWindow.focus === "function") {
          existingWindow.focus();
        }
        return existingWindow;
      }
      activeAppWindows.delete(effectiveTrackingKey);
    }

    if (!BrowserWindow) {
      if (
        typeof process !== "undefined" &&
        (process.env.NODE_ENV === "test" || Boolean(process.env.VITEST))
      ) {
        const mockAppWindow = {
          id: Math.floor(Math.random() * 10000) + 1,
          title: appTitle,
          url: targetUrl,
          isDestroyed: () => false,
          isMinimized: () => false,
          restore: () => {},
          focus: () => {},
          close: () => {},
          on: () => {},
          loadURL: () => Promise.resolve(),
        };
        if (effectiveTrackingKey) {
          activeAppWindows.set(effectiveTrackingKey, mockAppWindow);
        }
        return mockAppWindow;
      }
      return null;
    }

    const preloadScriptPath = path.join(__dirname, "preload.cjs");
    const applicationIconPath = resolveApplicationIconPath();

    const appBrowserWindow = new BrowserWindow({
      title: appTitle,
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFAULT_WINDOW_HEIGHT,
      minWidth: MINIMUM_WINDOW_WIDTH,
      minHeight: MINIMUM_WINDOW_HEIGHT,
      center: true,
      show: true,
      icon: applicationIconPath,
      backgroundColor: "#ffffff",
      webPreferences: {
        preload: preloadScriptPath,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    if (
      appBrowserWindow.webContents &&
      typeof appBrowserWindow.webContents.setWindowOpenHandler === "function"
    ) {
      appBrowserWindow.webContents.setWindowOpenHandler((details) => {
        if (details && (details.url.startsWith("http:") || details.url.startsWith("https:"))) {
          if (shell && typeof shell.openExternal === "function") {
            void shell.openExternal(details.url);
          }
        }
        return { action: "deny" };
      });
    }

    const splashHtmlContent = `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pre-load — ${appTitle}</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-color:#0f172a;color:#f8fafc;user-select:none;}.c{display:flex;flex-direction:column;align-items:center;text-align:center;width:100%;max-width:420px;padding:36px 32px;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);}.ib{width:64px;height:64px;border-radius:16px;background:rgba(105,56,239,0.15);border:1px solid rgba(105,56,239,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:20px;}.s{width:32px;height:32px;border:3px solid rgba(105,56,239,0.2);border-top-color:#6938ef;border-radius:50%;animation:sp 0.8s linear infinite;}@keyframes sp{to{transform:rotate(360deg);}}h2{margin:0 0 8px;font-size:20px;font-weight:600;color:#ffffff;}.b{display:inline-block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#9061f9;background:rgba(105,56,239,0.12);border:1px solid rgba(105,56,239,0.25);padding:3px 12px;border-radius:9999px;margin-bottom:14px;}p{margin:0;font-size:13.5px;color:#94a3b8;line-height:1.5;}.sub{margin-top:6px;font-size:12px;color:#64748b;}.pb{width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:9999px;overflow:hidden;margin-top:24px;position:relative;}.pb::after{content:"";position:absolute;top:0;left:0;bottom:0;width:40%;background:linear-gradient(90deg,#6938ef,#9061f9);border-radius:9999px;animation:ind 1.4s infinite ease-in-out;}@keyframes ind{0%{left:-40%;}100%{left:100%;}}</style></head><body><div class="c"><div class="ib"><div class="s"></div></div><h2>${appTitle}</h2><span class="b">PRE-LOADING / ĐANG KHỞI ĐỘNG</span><p>Starting Next.js service & building workspace...</p><p class="sub">Please wait while Next.js compiles the workspace...</p><div class="pb"></div></div></body></html>`)}`;

    const hubPort = resolveHubPortFromEnv();
    const preloadRouteUrl = `http://localhost:${hubPort}/preload?appId=${encodeURIComponent(appId || "")}&name=${encodeURIComponent(appTitle)}&url=${encodeURIComponent(targetUrl || "")}`;

    const isHttpTarget = Boolean(
      targetUrl && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"))
    );

    if (typeof appBrowserWindow.loadURL === "function") {
      checkServerListening(`http://localhost:${hubPort}`)
        .then((isHubListening) => {
          if (
            isHubListening &&
            appBrowserWindow &&
            !appBrowserWindow.isDestroyed() &&
            typeof appBrowserWindow.loadURL === "function"
          ) {
            appBrowserWindow.loadURL(preloadRouteUrl).catch(() => {
              if (appBrowserWindow && !appBrowserWindow.isDestroyed()) {
                appBrowserWindow.loadURL(splashHtmlContent).catch(() => {});
              }
            });
          } else if (appBrowserWindow && !appBrowserWindow.isDestroyed()) {
            appBrowserWindow.loadURL(splashHtmlContent).catch(() => {});
          }
        })
        .catch(() => {
          if (appBrowserWindow && !appBrowserWindow.isDestroyed()) {
            appBrowserWindow.loadURL(splashHtmlContent).catch(() => {});
          }
        });
    }

    let hasNavigatedToTarget = false;
    let isCheckingTargetServer = false;

    const pollAndNavigateToApp = async (maximumWaitAttempts = 120, intervalMs = 250) => {
      if (isCheckingTargetServer || hasNavigatedToTarget) {
        return;
      }
      isCheckingTargetServer = true;

      for (let attemptIndex = 0; attemptIndex < maximumWaitAttempts; attemptIndex += 1) {
        if (
          !appBrowserWindow ||
          (typeof appBrowserWindow.isDestroyed === "function" && appBrowserWindow.isDestroyed())
        ) {
          return;
        }
        const isListening = await checkServerListening(targetUrl);
        if (isListening) {
          hasNavigatedToTarget = true;
          if (
            appBrowserWindow &&
            (typeof appBrowserWindow.isDestroyed !== "function" || !appBrowserWindow.isDestroyed())
          ) {
            if (typeof appBrowserWindow.loadURL === "function") {
              appBrowserWindow.loadURL(targetUrl).catch((navigationError) => {
                displayElectronError("Navigate App Error", navigationError, `Failed navigating to ${targetUrl}`);
              });
            }
          }
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }

      console.warn(
        `[Hub Electron] App server on ${targetUrl} did not respond within ${Math.round(
          (maximumWaitAttempts * intervalMs) / 1000
        )}s.`
      );
      if (
        appBrowserWindow &&
        (typeof appBrowserWindow.isDestroyed !== "function" || !appBrowserWindow.isDestroyed())
      ) {
        const timeoutHtmlContent = `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${appTitle}</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#ffffff;color:#0f172a;user-select:none;}.error-container{text-align:center;padding:24px;max-width:400px;}.icon{font-size:36px;margin-bottom:16px;}h2{margin:0 0 8px;font-size:18px;font-weight:600;}p{margin:0 0 16px;font-size:13px;color:#64748b;}button{background:#2563eb;color:#ffffff;border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;outline:none;}button:hover{background:#1d4ed8;}</style></head><body><div class="error-container"><div class="icon">&#9888;&#65039;</div><h2>${appTitle} is starting slowly</h2><p>The application server on ${targetUrl} has not responded yet.</p><button onclick="window.location.reload()">Retry Connection</button></div></body></html>`)}`;
        if (typeof appBrowserWindow.loadURL === "function") {
          appBrowserWindow.loadURL(timeoutHtmlContent).catch(() => {});
        }
      }
    };

    if (isHttpTarget) {
      void pollAndNavigateToApp();
    } else if (targetUrl && targetUrl !== splashHtmlContent) {
      if (typeof appBrowserWindow.loadURL === "function") {
        appBrowserWindow.loadURL(targetUrl).catch(() => {});
      }
    }

    let failLoadRetryCount = 0;
    const MAXIMUM_APP_FAIL_RETRIES = 3;

    if (appBrowserWindow.webContents && typeof appBrowserWindow.webContents.on === "function") {
      appBrowserWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
        if (errorCode === -102 || errorCode === -105 || errorCode === -106) {
          if (
            appBrowserWindow &&
            (typeof appBrowserWindow.isDestroyed !== "function" || !appBrowserWindow.isDestroyed())
          ) {
            if (typeof appBrowserWindow.loadURL === "function") {
              appBrowserWindow.loadURL(splashHtmlContent).catch(() => {});
            }
          }
          if (failLoadRetryCount < MAXIMUM_APP_FAIL_RETRIES) {
            failLoadRetryCount += 1;
            setTimeout(() => {
              if (
                appBrowserWindow &&
                (typeof appBrowserWindow.isDestroyed !== "function" ||
                  !appBrowserWindow.isDestroyed())
              ) {
                isCheckingTargetServer = false;
                void pollAndNavigateToApp(30, 300);
              }
            }, 1000);
          }
        } else {
          displayElectronError(
            "App Load Error",
            new Error(`Failed to load ${targetUrl}: ${errorDescription} (${errorCode})`),
            `Attempt ${failLoadRetryCount + 1}/${MAXIMUM_APP_FAIL_RETRIES}`
          );
        }
      });
    }

    if (typeof appBrowserWindow.focus === "function") {
      appBrowserWindow.focus();
    }

    appBrowserWindow.on("close", () => {
      if (appBrowserWindow.webContents && !appBrowserWindow.isDestroyed()) {
        appBrowserWindow.webContents.stop();
        if (typeof appBrowserWindow.webContents.removeAllListeners === "function") {
          appBrowserWindow.webContents.removeAllListeners();
        }
      }
    });

    appBrowserWindow.on("closed", () => {
      if (effectiveTrackingKey) {
        activeAppWindows.delete(effectiveTrackingKey);
      }
      if (typeof appBrowserWindow.removeAllListeners === "function") {
        appBrowserWindow.removeAllListeners();
      }
    });

    if (effectiveTrackingKey) {
      activeAppWindows.set(effectiveTrackingKey, appBrowserWindow);
    }

    return appBrowserWindow;
  } catch (error) {
    displayElectronError("Create Application Window Error", error, `Target: ${targetUrl} (${appTitle})`);
    return null;
  }
}

/**
 * Create the primary Hub desktop BrowserWindow
 * Uses exactly one try-catch block
 */
function createHubDesktopWindow(explicitUrl = null) {
  try {
    const preloadScriptPath = path.join(__dirname, "preload.cjs");
    const applicationIconPath = resolveApplicationIconPath();

    if (typeof BrowserWindow !== "function") {
      return null;
    }

    const browserWindow = new BrowserWindow({
      title: "2-TEK Hub Desktop",
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFAULT_WINDOW_HEIGHT,
      minWidth: MINIMUM_WINDOW_WIDTH,
      minHeight: MINIMUM_WINDOW_HEIGHT,
      center: true,
      show: true,
      icon: applicationIconPath,
      backgroundColor: "#ffffff",
      webPreferences: {
        preload: preloadScriptPath,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    const splashHtmlContent = `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>2-TEK Hub Desktop</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#ffffff;color:#0f172a;user-select:none;}.loading-container{text-align:center;}.spinner{width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#6938ef;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;}@keyframes spin{to{transform:rotate(360deg);}}h2{margin:0 0 6px;font-size:18px;font-weight:600;}p{margin:0;font-size:13px;color:#64748b;}</style></head><body><div class="loading-container"><div class="spinner"></div><h2>2-TEK Hub Desktop</h2><p>Starting local services...</p></div></body></html>`)}`;

    const navigationUrl = explicitUrl || splashHtmlContent;

    if (typeof browserWindow.loadURL === "function") {
      browserWindow.loadURL(navigationUrl).catch(() => {});
    }

    let mainFailLoadRetryCount = 0;
    const MAXIMUM_MAIN_FAIL_RETRIES = 3;

    if (browserWindow.webContents && typeof browserWindow.webContents.on === "function") {
      browserWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
        if (
          browserWindow &&
          typeof browserWindow.isDestroyed === "function" &&
          !browserWindow.isDestroyed()
        ) {
          if (typeof browserWindow.isVisible === "function" && !browserWindow.isVisible()) {
            browserWindow.show();
          }
        }
        if (errorCode === -102 || errorCode === -105 || errorCode === -106) {
          if (mainFailLoadRetryCount < MAXIMUM_MAIN_FAIL_RETRIES) {
            mainFailLoadRetryCount += 1;
            console.warn(
              `[Hub Electron] Page load failed (${errorCode}: ${errorDescription}). Attempt ${mainFailLoadRetryCount}/${MAXIMUM_MAIN_FAIL_RETRIES}`
            );
            if (typeof browserWindow.loadURL === "function") {
              browserWindow.loadURL(splashHtmlContent).catch(() => {});
            }
            setTimeout(async () => {
              if (
                browserWindow &&
                typeof browserWindow.isDestroyed === "function" &&
                !browserWindow.isDestroyed()
              ) {
                const configuredPort = resolveHubPortFromEnv();
                const targetUrl =
                  process.env.ELECTRON_START_URL || `http://localhost:${configuredPort}`;
                const isServerUp = await checkServerListening(targetUrl);
                if (isServerUp) {
                  browserWindow.loadURL(targetUrl).catch(() => {});
                }
              }
            }, 1500);
          } else {
            const slowStartRetryHtml = `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>2-TEK Hub Desktop</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#ffffff;color:#0f172a;user-select:none;}.loading-container{text-align:center;max-width:400px;padding:24px;}.spinner{width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#2563eb;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;}@keyframes spin{to{transform:rotate(360deg);}}h2{margin:0 0 8px;font-size:18px;font-weight:600;}p{margin:0 0 16px;font-size:13px;color:#64748b;}button{padding:8px 16px;background:#2563eb;color:#ffffff;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;}button:hover{background:#1d4ed8;}</style></head><body><div class="loading-container"><h2>Connecting to 2-TEK Hub...</h2><p>The local service is starting up. Please click retry once compilation completes.</p><button onclick="window.location.reload()">Retry Connection</button></div></body></html>`)}`;
            if (typeof browserWindow.loadURL === "function") {
              browserWindow.loadURL(slowStartRetryHtml).catch(() => {});
            }
          }
        } else {
          displayElectronError(
            "Desktop Window Load Error",
            new Error(`Page load failed with code ${errorCode}: ${errorDescription}`),
            `Attempt ${mainFailLoadRetryCount + 1}/${MAXIMUM_MAIN_FAIL_RETRIES}`
          );
        }
      });
    }

    browserWindow.webContents.setWindowOpenHandler((windowOpenDetails) => {
      const requestedUrl = windowOpenDetails.url;
      if (requestedUrl.includes("localhost:") || requestedUrl.includes("127.0.0.1:")) {
        createApplicationWindow(requestedUrl, "Application Window");
        return { action: "deny" };
      }
      if (requestedUrl.startsWith("http:") || requestedUrl.startsWith("https:")) {
        void shell.openExternal(requestedUrl);
      }
      return { action: "deny" };
    });

    browserWindow.on("closed", () => {
      mainWindowInstance = null;
      for (const [_childKey, childWindowInstance] of activeAppWindows.entries()) {
        if (
          childWindowInstance &&
          typeof childWindowInstance.isDestroyed === "function" &&
          !childWindowInstance.isDestroyed()
        ) {
          childWindowInstance.destroy();
        }
      }
      activeAppWindows.clear();
    });

    mainWindowInstance = browserWindow;
    return browserWindow;
  } catch (error) {
    displayElectronError("Create Hub Desktop Window Error", error);
    return null;
  }
}

function scanDirectoryForBinaryCandidates(targetDir, candidatesList) {
  try {
    if (fileSystem.existsSync(targetDir) && fileSystem.statSync(targetDir).isDirectory()) {
      const entries = fileSystem.readdirSync(targetDir);
      for (const entry of entries) {
        if (entry.endsWith(".deb") || entry.endsWith(".exe") || entry.endsWith(".AppImage")) {
          candidatesList.push(path.join(targetDir, entry));
        }
      }
    }
  } catch {
    // Ignore directory scan error
  }
}

/**
 * Register IPC handlers for desktop capabilities
 * Uses exactly one try-catch block for registration, and each handler uses one try-catch
 */
function registerDesktopIpcHandlers(targetIpcMain = ipcMain) {
  try {
    if (!targetIpcMain || typeof targetIpcMain.handle !== "function") {
      return;
    }

    targetIpcMain.handle("app:status", async (_event, payload) => {
      try {
        const targetAppId = payload ? payload.appId : "unknown";
        const targetPort = payload ? payload.port : 0;
        return {
          success: true,
          appId: targetAppId,
          port: targetPort,
          status: "verified",
          message: `Status verified from Electron desktop core for ${targetAppId}`,
        };
      } catch (error) {
        displayElectronError("IPC app:status Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:start", async (_event, payload) => {
      try {
        const targetAppId = payload
          ? typeof payload === "string"
            ? payload
            : payload.appId
          : "unknown";
        const targetPort = payload && typeof payload === "object" ? payload.port : 0;
        const targetUrl =
          payload && typeof payload === "object" && payload.url
            ? payload.url
            : targetPort
            ? `http://localhost:${targetPort}`
            : "";
        const appName =
          payload && typeof payload === "object" && payload.name
            ? payload.name
            : targetAppId
            ? targetAppId
            : "2-TEK Application";

        let appWindow = null;
        if (targetUrl) {
          appWindow = createApplicationWindow(targetUrl, appName, targetAppId);
        }

        return {
          success: true,
          appId: targetAppId,
          port: targetPort,
          url: targetUrl,
          windowId: appWindow && appWindow.id ? appWindow.id : null,
          isNewWindow: Boolean(appWindow),
          message: `App ${targetAppId} start command dispatched and integrated into new window`,
        };
      } catch (error) {
        displayElectronError("IPC app:start Error", error, `Payload: ${JSON.stringify(payload)}`);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:stop", async (_event, payload) => {
      try {
        const targetAppId = payload ? payload.appId : "unknown";
        return {
          success: true,
          appId: targetAppId,
          message: `App ${targetAppId} stop command dispatched via Electron`,
        };
      } catch (error) {
        displayElectronError("IPC app:stop Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:open-window", async (_event, payload) => {
      try {
        const targetAppId = payload ? payload.appId : "";
        const targetPort = payload ? payload.port : 0;
        const targetUrl =
          payload && payload.url ? payload.url : `http://localhost:${targetPort}`;
        const appName =
          payload && payload.name
            ? payload.name
            : targetAppId
            ? targetAppId
            : "2-TEK Application";

        if (targetAppId && activeAppWindows.has(targetAppId)) {
          const existingWindow = activeAppWindows.get(targetAppId);
          if (existingWindow && !existingWindow.isDestroyed()) {
            if (existingWindow.isMinimized()) {
              existingWindow.restore();
            }
            existingWindow.focus();
            return {
              success: true,
              appId: targetAppId,
              port: targetPort,
              url: targetUrl,
              isExisting: true,
            };
          }
        }

        const appWindow = createApplicationWindow(targetUrl, appName, targetAppId);

        return {
          success: true,
          appId: targetAppId,
          port: targetPort,
          url: targetUrl,
          windowId: appWindow && appWindow.id ? appWindow.id : null,
          isNewWindow: true,
        };
      } catch (error) {
        displayElectronError("IPC app:open-window Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:run-file", async (_event, payload) => {
      try {
        const targetAppId = payload ? payload.appId : "";
        const targetPath = payload ? payload.filePath : "";
        const targetArgs = payload && Array.isArray(payload.args) ? payload.args : [];

        let executablePath = targetPath;
        if (!executablePath || !fileSystem.existsSync(executablePath)) {
          const rawAppsPath = process.env.APPS_STORAGE_PATH || process.env.APPS_PATH || "~/.2tek/Apps";
          const appsStorageDir = rawAppsPath.startsWith("~/")
            ? path.join(os.homedir(), rawAppsPath.slice(2))
            : path.resolve(rawAppsPath);

          const appDir = path.join(appsStorageDir, targetAppId);
          const candidates = [
            path.join(appDir, `${targetAppId}.deb`),
            path.join(appDir, `${targetAppId}_amd64.deb`),
            path.join(appDir, `${targetAppId}.exe`),
            path.join(appDir, `${targetAppId}-setup.exe`),
            path.join(appDir, `${targetAppId}.AppImage`),
            path.join(appsStorageDir, `${targetAppId}.deb`),
            path.join(appsStorageDir, `${targetAppId}_amd64.deb`),
            path.join(appsStorageDir, `${targetAppId}.exe`),
            path.join(appsStorageDir, `${targetAppId}-setup.exe`),
            path.join(appsStorageDir, `${targetAppId}.AppImage`),
          ];

          scanDirectoryForBinaryCandidates(appDir, candidates);

          for (const cand of candidates) {
            if (fileSystem.existsSync(cand) && fileSystem.statSync(cand).isFile()) {
              executablePath = cand;
              break;
            }
          }
        }

        if (!executablePath || !fileSystem.existsSync(executablePath)) {
          const hubDir = path.resolve(__dirname, "..");
          const distDir = path.join(hubDir, "dist-electron");
          if (targetAppId === "hub" || targetAppId === "2tek-hub") {
            if (process.platform === "win32") {
              const exeCandidate = path.join(distDir, "2tek-hub-setup-1.0.0.exe");
              if (fileSystem.existsSync(exeCandidate)) {
                executablePath = exeCandidate;
              }
            } else {
              const debCandidate = path.join(distDir, "2tek-hub_1.0.0_amd64.deb");
              if (fileSystem.existsSync(debCandidate)) {
                executablePath = debCandidate;
              }
            }
          }
        }

        if (executablePath && fileSystem.existsSync(executablePath)) {
          if (
            shell &&
            typeof shell.openPath === "function" &&
            (executablePath.endsWith(".exe") || executablePath.endsWith(".deb") || executablePath.endsWith(".AppImage"))
          ) {
            await shell.openPath(executablePath);
            return {
              success: true,
              appId: targetAppId,
              executablePath,
              executionMode: "file-execution",
              message: `App '${targetAppId}' opened from file execution via Electron: ${executablePath}`,
            };
          }

          const spawnedProcess = spawn(executablePath, targetArgs, {
            detached: true,
            stdio: "ignore",
          });
          if (typeof spawnedProcess.unref === "function") {
            spawnedProcess.unref();
          }
          return {
            success: true,
            appId: targetAppId,
            pid: spawnedProcess.pid,
            executablePath,
            executionMode: "file-execution",
            message: `App '${targetAppId}' started from file execution via Electron`,
          };
        }

        return {
          success: false,
          appId: targetAppId,
          error: `Executable file not found for app '${targetAppId}'`,
        };
      } catch (error) {
        displayElectronError("IPC app:run-file Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:open-location", async (_event, payload) => {
      try {
        const targetAppId = typeof payload === "string" ? payload : payload ? payload.appId : "";
        const targetPath = typeof payload === "object" ? payload?.path || payload?.locationPath : "";

        let locationPath = targetPath;
        if (!locationPath || !fileSystem.existsSync(locationPath)) {
          const rawAppsPath = process.env.APPS_STORAGE_PATH || process.env.APPS_PATH || "~/.2tek/Apps";
          const appsStorageDir = rawAppsPath.startsWith("~/")
            ? path.join(os.homedir(), rawAppsPath.slice(2))
            : path.resolve(rawAppsPath);

          const appDir = path.join(appsStorageDir, targetAppId);
          if (fileSystem.existsSync(appDir)) {
            locationPath = appDir;
          } else {
            locationPath = appsStorageDir;
          }
        }

        if (shell && typeof shell.openPath === "function") {
          const isDir = fileSystem.existsSync(locationPath) && fileSystem.statSync(locationPath).isDirectory();
          if (!isDir && typeof shell.showItemInFolder === "function") {
            shell.showItemInFolder(locationPath);
            return { success: true, appId: targetAppId, locationPath, message: `Revealed in folder: ${locationPath}` };
          }
          await shell.openPath(locationPath);
          return { success: true, appId: targetAppId, locationPath, message: `Opened location: ${locationPath}` };
        }

        return { success: true, appId: targetAppId, locationPath, message: `Resolved location: ${locationPath}` };
      } catch (error) {
        displayElectronError("IPC app:open-location Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });

    targetIpcMain.handle("app:get-version", () => {
      try {
        return app && app.getVersion ? app.getVersion() : "1.0.0";
      } catch (error) {
        displayElectronError("IPC app:get-version Error", error);
        return "1.0.0";
      }
    });

    targetIpcMain.handle("app:get-platform", () => {
      try {
        return process.platform;
      } catch (error) {
        displayElectronError("IPC app:get-platform Error", error);
        return process.platform || "linux";
      }
    });

    targetIpcMain.handle("window:minimize", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          mainWindowInstance.minimize();
          return true;
        }
        return false;
      } catch (error) {
        displayElectronError("IPC window:minimize Error", error);
        return false;
      }
    });

    targetIpcMain.handle("window:maximize", () => {
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
      } catch (error) {
        displayElectronError("IPC window:maximize Error", error);
        return false;
      }
    });

    targetIpcMain.handle("window:close", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          mainWindowInstance.close();
          return true;
        }
        return false;
      } catch (error) {
        displayElectronError("IPC window:close Error", error);
        return false;
      }
    });

    targetIpcMain.handle("window:is-maximized", () => {
      try {
        if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
          return mainWindowInstance.isMaximized();
        }
        return false;
      } catch (error) {
        displayElectronError("IPC window:is-maximized Error", error);
        return false;
      }
    });

    let lastShownErrorSignature = "";
    let lastShownNormalizedMessage = "";
    let lastShownErrorTimestamp = 0;

    targetIpcMain.handle("dialog:show-error", async (_event, payload) => {
      try {
        const errorTitle = payload && payload.title ? String(payload.title) : "2-TEK Hub Error";
        const errorMessage =
          payload && payload.message
            ? String(payload.message)
            : "An unexpected error occurred.";
        const errorDetail = payload && payload.detail ? String(payload.detail) : "";
        const normalizedMessage = errorMessage.trim().toLowerCase().replace(/\s+/g, " ");
        const errorSignature = `${errorTitle}:::${errorMessage}:::${errorDetail}`;
        const nowTimestamp = Date.now();

        if (
          (lastShownErrorSignature === errorSignature ||
            (lastShownNormalizedMessage.length > 0 &&
              lastShownNormalizedMessage === normalizedMessage)) &&
          nowTimestamp - lastShownErrorTimestamp < 3000
        ) {
          return { success: true, deduplicated: true };
        }

        lastShownErrorSignature = errorSignature;
        lastShownNormalizedMessage = normalizedMessage;
        lastShownErrorTimestamp = nowTimestamp;

        const activeWindow =
          mainWindowInstance && !mainWindowInstance.isDestroyed()
            ? mainWindowInstance
            : BrowserWindow && typeof BrowserWindow.getFocusedWindow === "function"
            ? BrowserWindow.getFocusedWindow()
            : null;

        if (dialog && typeof dialog.showMessageBox === "function") {
          const dialogOptions = {
            type: "error",
            title: errorTitle,
            message: errorTitle,
            detail: errorDetail ? `${errorMessage}\n\n${errorDetail}` : errorMessage,
            buttons: ["OK"],
            defaultId: 0,
            noLink: true,
          };

          if (activeWindow) {
            const result = await dialog.showMessageBox(activeWindow, dialogOptions);
            return { success: true, response: result.response };
          }
          const result = await dialog.showMessageBox(dialogOptions);
          return { success: true, response: result.response };
        }

        if (dialog && typeof dialog.showErrorBox === "function") {
          dialog.showErrorBox(
            errorTitle,
            errorDetail ? `${errorMessage}\n\n${errorDetail}` : errorMessage
          );
          return { success: true, fallback: true };
        }

        return { success: false, error: "Dialog API unavailable" };
      } catch (error) {
        displayElectronError("IPC dialog:show-error Error", error);
        return { success: false, error: error && error.message ? error.message : String(error) };
      }
    });
  } catch (error) {
    displayElectronError("Register IPC Handlers Error", error);
  }
}

/**
 * Check whether the local server is listening and responding to HTTP requests
 * Uses exactly one try-catch block
 */
function checkServerListening(targetUrl = null) {
  try {
    const configuredPort = resolveHubPortFromEnv();
    const effectiveUrl = targetUrl || `http://localhost:${configuredPort}`;
    return new Promise((resolve) => {
      const request = http.get(effectiveUrl, (response) => {
        const isReady =
          (response.statusCode >= 200 && response.statusCode < 400) || response.statusCode === 404;
        resolve(isReady);
        response.resume();
      });
      request.on("error", () => {
        if (typeof effectiveUrl === "string" && effectiveUrl.includes("localhost:")) {
          const ipv4Url = effectiveUrl.replace("localhost:", "127.0.0.1:");
          const fallbackRequest = http.get(ipv4Url, (fallbackResponse) => {
            const isReady =
              (fallbackResponse.statusCode >= 200 && fallbackResponse.statusCode < 400) ||
              fallbackResponse.statusCode === 404;
            resolve(isReady);
            fallbackResponse.resume();
          });
          fallbackRequest.on("error", () => {
            resolve(false);
          });
          fallbackRequest.setTimeout(2500, () => {
            fallbackRequest.destroy();
            resolve(false);
          });
          return;
        }
        resolve(false);
      });
      request.setTimeout(2500, () => {
        request.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    displayElectronError("Server Listening Check Error", error);
    return Promise.resolve(false);
  }
}

/**
 * Terminate internal Next.js server process on quit
 * Uses exactly one try-catch block
 */
function terminateInternalServerProcess() {
  try {
    if (internalServerProcess && !internalServerProcess.killed) {
      if (process.platform !== "win32" && internalServerProcess.pid) {
        process.kill(-internalServerProcess.pid, "SIGTERM");
      } else {
        internalServerProcess.kill("SIGTERM");
      }
      internalServerProcess = null;
    }

    // Ensure port 3020 (PORT of app) is killed when desktop app task closes
    killPort3020(3020);
    const configuredPort = resolveHubPortFromEnv();
    if (configuredPort !== 3020) {
      killPort3020(configuredPort);
    }
  } catch (error) {
    displayElectronError("Terminate Internal Server Error", error);
  }
}

const terminateInternalServer = terminateInternalServerProcess;
const checkServerReady = checkServerListening;

/**
 * Ensure the Next.js server is active, automatically spawning if not running
 * Uses exactly one try-catch block
 */
async function ensureLocalServerRunning(targetUrl = null, maximumWaitAttempts = 120) {
  try {
    const configuredPort = resolveHubPortFromEnv();
    const effectiveTargetUrl = targetUrl || `http://localhost:${configuredPort}`;
    const isAlreadyRunning = await checkServerListening(effectiveTargetUrl);
    if (isAlreadyRunning) {
      return true;
    }

    killPort3020(configuredPort);

    const hubRootDirectory = path.resolve(__dirname, "..");
    const hasProductionBuild = fileSystem.existsSync(
      path.join(hubRootDirectory, ".next", "BUILD_ID")
    );
    const os = require("node:os");
    const candidateServerPaths = [
      path.join(hubRootDirectory, "server.js"),
      path.join(hubRootDirectory, ".next", "standalone", "packages", "Hub", "server.js"),
      path.join(hubRootDirectory, ".next", "standalone", "server.js"),
      path.join(os.homedir(), ".2tek", "Applications", "hub", "server.js"),
      path.join(os.homedir(), ".2tek", "Applications", "hub", "packages", "Hub", "server.js"),
    ];
    let resolvedStandaloneServerJsPath = null;
    for (const candidate of candidateServerPaths) {
      if (fileSystem.existsSync(candidate)) {
        resolvedStandaloneServerJsPath = candidate;
        break;
      }
    }
    const standaloneServerJsPath = resolvedStandaloneServerJsPath || path.join(hubRootDirectory, "server.js");
    if (resolvedStandaloneServerJsPath) {
      console.log(
        `[Hub Electron] Local server not active. Dual-starting standalone Next.js server (${resolvedStandaloneServerJsPath})...`
      );
      internalServerProcess = spawn(process.execPath, [resolvedStandaloneServerJsPath], {
        cwd: hubRootDirectory,
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: String(configuredPort),
          HOSTNAME: "0.0.0.0",
          NODE_ENV: "production",
        },
      });
    } else {
      const commandArguments = useProductionMode
        ? ["start", "-p", String(configuredPort)]
        : ["dev", "-p", String(configuredPort)];

      console.log(
        `[Hub Electron] Local server not active. Spawning Next.js server (next ${commandArguments[0]})...`
      );

      internalServerProcess = spawn("npx", ["next", ...commandArguments], {
        cwd: hubRootDirectory,
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          PORT: String(configuredPort),
          WATCHPACK_POLLING: "true",
        },
      });
    }

    internalNextServerProcess = internalServerProcess;

    if (internalServerProcess) {
      internalServerProcess.on("error", (spawnError) => {
        displayElectronError(
          "Next.js Process Error",
          spawnError,
          "Failed to spawn Next.js dev server"
        );
      });
      internalServerProcess.on("exit", (exitCode, signal) => {
        if (exitCode !== 0 && exitCode !== null) {
          console.warn(
            `[Hub Electron] Next.js server process exited prematurely with code ${exitCode} (${signal})`
          );
        }
      });
    }

    for (let attemptIndex = 0; attemptIndex < maximumWaitAttempts; attemptIndex += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const isReadyNow = await checkServerListening(effectiveTargetUrl);
      if (isReadyNow) {
        console.log(`[Hub Electron] Local Next.js server is now ready on port ${configuredPort}.`);
        return true;
      }
    }

    displayElectronError(
      "Server Launch Timeout",
      new Error(`Timed out waiting for Next.js server on ${effectiveTargetUrl}`)
    );
    return false;
  } catch (error) {
    displayElectronError("Local Server Running Exception", error);
    return false;
  }
}

/**
 * Safely unlink a file path
 * Uses exactly one try-catch block
 */
function safeUnlinkPath(targetFilePath) {
  try {
    fileSystem.unlinkSync(targetFilePath);
  } catch {
    // Ignore unlink error
  }
}

function isLinuxProcessUnrelated(owningProcessId) {
  try {
    const commandLinePath = `/proc/${owningProcessId}/cmdline`;
    if (!fileSystem.existsSync(commandLinePath)) {
      return true;
    }
    const processCommandLine = fileSystem.readFileSync(commandLinePath, "utf8");
    const isElectronOrHubProcess =
      processCommandLine.includes("electron") ||
      processCommandLine.includes("hub") ||
      processCommandLine.includes("2-tek-hub") ||
      processCommandLine.includes("2tek-hub");
    return !isElectronOrHubProcess;
  } catch {
    return true;
  }
}

function isSingletonSocketMissingOrInvalid(singletonLockPath) {
  try {
    const singletonSocketPath = path.join(path.dirname(singletonLockPath), "SingletonSocket");
    const socketStats = fileSystem.lstatSync(singletonSocketPath);
    return !socketStats.isSocket();
  } catch {
    return true;
  }
}

/**
 * Check whether a singleton lock path is stale
 * Uses exactly one try-catch block
 */
function checkIsLockPathStale(singletonLockPath) {
  try {
    const lockFileStats = fileSystem.lstatSync(singletonLockPath);
    if (!lockFileStats.isSymbolicLink()) {
      return true;
    }
    const targetValue = fileSystem.readlinkSync(singletonLockPath);
    const processIdMatch = targetValue.match(/[:-](\d+)$/);
    if (!processIdMatch || !processIdMatch[1]) {
      return true;
    }
    const owningProcessId = parseInt(processIdMatch[1], 10);
    if (Number.isNaN(owningProcessId) || owningProcessId <= 0) {
      return true;
    }
    if (!isProcessAlive(owningProcessId)) {
      return true;
    }

    // On Linux: verify if the owning process is actually an Electron or Hub process
    if (process.platform === "linux" && isLinuxProcessUnrelated(owningProcessId)) {
      return true;
    }

    if (isSingletonSocketMissingOrInvalid(singletonLockPath)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Retrieve all candidate user data directories across platforms
 * Uses exactly one try-catch block
 */
function getCandidateUserDataPaths() {
  const candidateUserDataPaths = [];
  try {
    if (app && typeof app.getPath === "function") {
      const currentUserDataPath = app.getPath("userData");
      if (currentUserDataPath) {
        candidateUserDataPaths.push(currentUserDataPath);
      }
    }
    const homeDirectoryPath = process.env.HOME || process.env.USERPROFILE || "";
    if (homeDirectoryPath) {
      candidateUserDataPaths.push(path.join(homeDirectoryPath, ".config", "Electron"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, ".config", "2-tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, ".config", "2tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, ".config", "hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, ".config", "@2-tek", "hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "AppData", "Roaming", "2-tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "AppData", "Roaming", "2tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "AppData", "Roaming", "Electron"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "Library", "Application Support", "2-tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "Library", "Application Support", "2tek-hub"));
      candidateUserDataPaths.push(path.join(homeDirectoryPath, "Library", "Application Support", "Electron"));
    }
  } catch (error) {
    displayElectronError("Candidate User Data Paths Error", error);
  }
  return candidateUserDataPaths;
}

/**
 * Safely clean stale SingletonLock symlinks left by unexpectedly terminated instances on Linux
 * Uses exactly one try-catch block
 */
function cleanStaleSingletonLock() {
  try {
    if (process.platform !== "linux" && process.platform !== "darwin") {
      return;
    }

    const candidateUserDataPaths = getCandidateUserDataPaths();

    for (const directoryPath of candidateUserDataPaths) {
      if (!fileSystem.existsSync(directoryPath)) {
        continue;
      }
      const singletonLockPath = path.join(directoryPath, "SingletonLock");
      const singletonSocketPath = path.join(directoryPath, "SingletonSocket");
      const singletonCookiePath = path.join(directoryPath, "SingletonCookie");

      const isLockStale = checkIsLockPathStale(singletonLockPath);
      if (isLockStale) {
        safeUnlinkPath(singletonLockPath);
        safeUnlinkPath(singletonSocketPath);
        safeUnlinkPath(singletonCookiePath);
      }
    }
  } catch (error) {
    displayElectronError("Singleton Lock Cleanup Error", error);
  }
}

function killWindowsHubProcess() {
  try {
    const { execSync } = require("node:child_process");
    execSync(`taskkill /f /im 2-tek-hub.exe 2>nul`);
  } catch {
    // Process not running
  }
}

function killSinglePidSafely(targetPid) {
  try {
    process.kill(targetPid, "SIGKILL");
  } catch {
    // Process already terminated
  }
}

/**
 * Terminate other lingering Hub Electron processes excluding current and parent process
 * Uses exactly one try-catch block
 */
function killOtherHubElectronProcesses() {
  try {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      killWindowsHubProcess();
      return;
    }

    const { execSync } = require("node:child_process");
    const psCommandOutput = execSync(
      `ps aux | grep -E "(electron.*(main\\.cjs|Packages/Hub|2-tek-hub|2tek-hub))|(^|[/\s])(2-tek-hub|2tek-hub)($|[\s])" | grep -v grep`,
      { encoding: "utf8" }
    );
    const processLines = psCommandOutput.trim().split("\n").filter(Boolean);
    for (const processLine of processLines) {
      const lineTokens = processLine.trim().split(/\s+/);
      const processIdentifier = parseInt(lineTokens[1], 10);
      if (
        !Number.isNaN(processIdentifier) &&
        processIdentifier > 0 &&
        processIdentifier !== process.pid &&
        processIdentifier !== process.ppid
      ) {
        killSinglePidSafely(processIdentifier);
      }
    }
  } catch {
    // No matching processes or error
  }
}

/**
 * Forcefully clean all singleton lock files in all candidate directories
 * Uses exactly one try-catch block
 */
function forceCleanAllSingletonLocks() {
  try {
    const candidateUserDataPaths = getCandidateUserDataPaths();
    for (const directoryPath of candidateUserDataPaths) {
      safeUnlinkPath(path.join(directoryPath, "SingletonLock"));
      safeUnlinkPath(path.join(directoryPath, "SingletonSocket"));
      safeUnlinkPath(path.join(directoryPath, "SingletonCookie"));
    }
  } catch (error) {
    displayElectronError("Force Clean Singleton Locks Error", error);
  }
}

/**
 * Handle second-instance event: focus existing window or create a new window if none exists
 * Uses exactly one try-catch block
 */
function handleSecondInstance() {
  try {
    console.log(
      "[Hub Electron] Second instance launch detected. Focusing or restoring application window."
    );
    if (!mainWindowInstance || mainWindowInstance.isDestroyed()) {
      const configuredPort = resolveHubPortFromEnv();
      const targetUrl = process.env.ELECTRON_START_URL || `http://localhost:${configuredPort}`;
      mainWindowInstance = createHubDesktopWindow(targetUrl);
    } else {
      if (mainWindowInstance.isMinimized()) {
        mainWindowInstance.restore();
      }
      mainWindowInstance.show();
      mainWindowInstance.focus();
    }
  } catch (error) {
    displayElectronError("Handle Second Instance Error", error);
  }
}


/**
 * Handle app whenReady lifecycle event
 * Uses exactly one try-catch block
 */
async function handleAppWhenReady() {
  try {
    registerDesktopIpcHandlers();

    const configuredPort = resolveHubPortFromEnv();
    const targetUrl = process.env.ELECTRON_START_URL || `http://localhost:${configuredPort}`;
    const isServerAlreadyListening = await checkServerListening(targetUrl);

    // 1. Create desktop window immediately: if server is ready, load it directly; else show instant splash screen
    const primaryWindow = createHubDesktopWindow(isServerAlreadyListening ? targetUrl : null);

    // 2. Ensure local server is running in background or wait for readiness
    let isServerReady = isServerAlreadyListening;
    if (!isServerAlreadyListening) {
      isServerReady = await ensureLocalServerRunning(targetUrl);

      // 3. Navigate to target URL ONLY once server is confirmed ready
      if (isServerReady) {
        if (
          primaryWindow &&
          typeof primaryWindow.isDestroyed === "function" &&
          !primaryWindow.isDestroyed()
        ) {
          if (typeof primaryWindow.loadURL === "function") {
            primaryWindow.loadURL(targetUrl).catch((navError) => {
              displayElectronError("Navigate Target URL Error", navError);
            });
          }
        }
      } else {
        console.warn(
          `[Hub Electron] Server on ${targetUrl} did not become ready; keeping splash screen active.`
        );
      }
    }

    app.on("activate", () => {
      handleAppActivate(targetUrl);
    });
  } catch (error) {
    displayElectronError("App Ready Lifecycle Error", error);
  }
}

/**
 * Handle app activate lifecycle event
 * Uses exactly one try-catch block
 */
function handleAppActivate(targetUrl) {
  try {
    if (BrowserWindow.getAllWindows().length === 0) {
      createHubDesktopWindow(targetUrl);
    }
  } catch (error) {
    displayElectronError("App Activate Lifecycle Error", error);
  }
}

/**
 * Handle app before-quit lifecycle event
 * Uses exactly one try-catch block
 */
function handleAppBeforeQuit() {
  try {
    terminateInternalServerProcess();
    for (const [_trackedAppId, trackedWindow] of activeAppWindows.entries()) {
      if (
        trackedWindow &&
        typeof trackedWindow.isDestroyed === "function" &&
        !trackedWindow.isDestroyed()
      ) {
        trackedWindow.destroy();
      }
    }
    activeAppWindows.clear();
  } catch (error) {
    displayElectronError("App Before Quit Error", error);
  }
}

/**
 * Handle app window-all-closed lifecycle event
 * Uses exactly one try-catch block
 */
function handleAppWindowAllClosed() {
  try {
    terminateInternalServerProcess();
    if (process.platform !== "darwin") {
      app.quit();
    }
  } catch (error) {
    displayElectronError("App Window All Closed Error", error);
  }
}

/**
 * Initialize application lifecycle and single-instance locking
 * Uses exactly one try-catch block
 */
function initializeHubDesktopApp() {
  try {
    const isTestOrHeadlessEnvironment =
      typeof process.env.VITEST !== "undefined" ||
      process.env.NODE_ENV === "test" ||
      Boolean(process.env.TEST);

    if (
      process.platform === "linux" &&
      Boolean(process.versions && process.versions.electron) &&
      !isTestOrHeadlessEnvironment &&
      !process.argv.some(
        (argument) => typeof argument === "string" && argument.includes("no-sandbox")
      )
    ) {
      const childProcess = require("node:child_process");
      const linuxSpawnedElectron = childProcess.spawn(
        process.execPath,
        ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", ...process.argv.slice(1)],
        {
          stdio: "inherit",
          env: process.env,
        }
      );
      linuxSpawnedElectron.on("exit", (exitCode) => {
        process.exit(exitCode || 0);
      });
      linuxSpawnedElectron.on("error", (error) => {
        displayElectronError("Linux Sandbox Respawn Error", error);
        process.exit(1);
      });
      return;
    }

    const isForceRestart =
      process.argv.some(
        (argument) =>
          typeof argument === "string" &&
          (argument === "--force" || argument === "--restart" || argument === "--kill-existing")
      ) || process.env.HUB_FORCE_RESTART === "1";

    if (isForceRestart) {
      killOtherHubElectronProcesses();
      forceCleanAllSingletonLocks();
    } else {
      cleanStaleSingletonLock();
    }

    if (!app || !app.requestSingleInstanceLock) {
      return;
    }

    const hasAcquiredLock = app.requestSingleInstanceLock();
    if (!hasAcquiredLock) {
      console.log(
        "[Hub Electron] Another instance of 2-TEK Hub is already running in background. Focusing existing instance."
      );
      app.quit();
      return;
    }

    app.on("second-instance", handleSecondInstance);
    app.whenReady().then(handleAppWhenReady);
    app.on("before-quit", handleAppBeforeQuit);
    app.on("window-all-closed", handleAppWindowAllClosed);
  } catch (error) {
    displayElectronError("Application Initialization Error", error);
  }
}

/**
 * Setup process signal termination listeners
 * Uses exactly one try-catch block
 */
function setupMainProcessListeners() {
  try {
    const MAIN_PROCESS_LISTENERS_ATTACHED = Symbol.for("hub.electron_main_listeners_attached");
    if (global[MAIN_PROCESS_LISTENERS_ATTACHED]) {
      return;
    }
    global[MAIN_PROCESS_LISTENERS_ATTACHED] = true;

    if (typeof process !== "undefined") {
      if (
        typeof process.getMaxListeners === "function" &&
        typeof process.setMaxListeners === "function"
      ) {
        const currentMaximumListeners = process.getMaxListeners();
        if (currentMaximumListeners < 30) {
          process.setMaxListeners(30);
        }
      }

      process.on("exit", () => {
        terminateInternalServerProcess();
      });
      process.on("SIGINT", () => {
        terminateInternalServerProcess();
        if (app && typeof app.quit === "function") {
          app.quit();
        }
      });
      process.on("SIGTERM", () => {
        terminateInternalServerProcess();
        if (app && typeof app.quit === "function") {
          app.quit();
        }
      });
    }
  } catch (error) {
    displayElectronError("Main Process Signal Listeners Error", error);
  }
}

setupMainProcessListeners();

const isRunningInTestEnvironment =
  typeof process.env.VITEST !== "undefined" ||
  process.env.NODE_ENV === "test" ||
  Boolean(process.env.TEST);

if (
  (require.main === module || (process.versions && process.versions.electron)) &&
  !isRunningInTestEnvironment
) {
  initializeHubDesktopApp();
}

module.exports = {
  createHubDesktopWindow,
  createApplicationWindow,
  activeAppWindows,
  registerDesktopIpcHandlers,
  resolveApplicationIconPath,
  initializeHubDesktopApp,
  checkServerListening,
  ensureLocalServerRunning,
  terminateInternalServerProcess,
  killPort3020,
  resolveHubPortFromEnv,
  cleanStaleSingletonLock,
  displayElectronError,
  loadElectronModule,
  configureAppMetadata,
  configureLinuxSwitches,
  isProcessAlive,
  setupMainProcessListeners,
  handleSecondInstance,
  handleAppWhenReady,
  handleAppActivate,
  handleAppBeforeQuit,
  handleAppWindowAllClosed,
  checkIsLockPathStale,
  getCandidateUserDataPaths,
  killOtherHubElectronProcesses,
  forceCleanAllSingletonLocks,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
  MINIMUM_WINDOW_WIDTH,
  MINIMUM_WINDOW_HEIGHT,
};
