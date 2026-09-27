/**
 * Packages/Hub/electron/preload.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Hub Desktop Application — Electron Preload Bridge
 *
 * Exposes a typed, isolated context bridge interface (window.electronAPI)
 * for secure communication between renderer and main process.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Safely load electron module with single try-catch
 */
function loadElectronModule() {
  try {
    return require("electron");
  } catch (error) {
    console.warn(
      "[Hub Preload] Electron module not available in current environment:",
      error && error.message ? error.message : error
    );
    return {};
  }
}

const electronModule = loadElectronModule();
const { contextBridge, ipcRenderer } = electronModule;

const electronBridgeApi = {
  isElectron: true,
  platform: process.platform,

  /**
   * Retrieve current application version
   */
  getVersion: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:get-version");
      }
      return Promise.resolve("1.0.0");
    } catch (error) {
      console.error("[Hub Preload Error] getVersion failed:", error);
      return Promise.resolve("1.0.0");
    }
  },

  /**
   * Retrieve current OS platform
   */
  getPlatform: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:get-platform");
      }
      return Promise.resolve(process.platform || "linux");
    } catch (error) {
      console.error("[Hub Preload Error] getPlatform failed:", error);
      return Promise.resolve(process.platform || "linux");
    }
  },

  /**
   * Verify workspace application status
   */
  checkAppStatus: (appId, port) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:status", { appId, port });
      }
      return Promise.resolve({
        success: true,
        appId,
        port,
        status: "mocked",
        message: "Mocked status",
      });
    } catch (error) {
      console.error("[Hub Preload Error] checkAppStatus failed:", error);
      return Promise.resolve({
        success: false,
        appId,
        port,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Start workspace application
   */
  startApp: (appIdOrPayload, port, url, name) => {
    try {
      const payload =
        typeof appIdOrPayload === "object" && appIdOrPayload !== null
          ? appIdOrPayload
          : { appId: appIdOrPayload, port, url, name };
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:start", payload);
      }
      return Promise.resolve({ success: true, ...payload, message: "Mocked start" });
    } catch (error) {
      console.error("[Hub Preload Error] startApp failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Stop workspace application
   */
  stopApp: (appId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:stop", { appId });
      }
      return Promise.resolve({ success: true, appId, message: "Mocked stop" });
    } catch (error) {
      console.error("[Hub Preload Error] stopApp failed:", error);
      return Promise.resolve({
        success: false,
        appId,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Open workspace application in new desktop window
   */
  openAppWindow: (payload) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:open-window", payload);
      }
      return Promise.resolve({ success: true, ...payload });
    } catch (error) {
      console.error("[Hub Preload Error] openAppWindow failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Run workspace application by executing file directly
   */
  runAppFromFile: (payload) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:run-file", payload);
      }
      return Promise.resolve({
        success: true,
        ...payload,
        executionMode: "file-execution",
        message: "Mocked file execution",
      });
    } catch (error) {
      console.error("[Hub Preload Error] runAppFromFile failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Open workspace application file location on disk
   */
  openLocation: (appIdOrPayload) => {
    try {
      const payload =
        typeof appIdOrPayload === "object" && appIdOrPayload !== null
          ? appIdOrPayload
          : { appId: appIdOrPayload };
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:open-location", payload);
      }
      return Promise.resolve({
        success: true,
        ...payload,
        message: "Mocked open location",
      });
    } catch (error) {
      console.error("[Hub Preload Error] openLocation failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Window controls
   */
  minimizeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:minimize");
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error("[Hub Preload Error] minimizeWindow failed:", error);
      return Promise.resolve(false);
    }
  },

  maximizeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:maximize");
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error("[Hub Preload Error] maximizeWindow failed:", error);
      return Promise.resolve(false);
    }
  },

  closeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:close");
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error("[Hub Preload Error] closeWindow failed:", error);
      return Promise.resolve(false);
    }
  },

  isMaximized: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:is-maximized");
      }
      return Promise.resolve(false);
    } catch (error) {
      console.error("[Hub Preload Error] isMaximized failed:", error);
      return Promise.resolve(false);
    }
  },

  /**
   * Display native Electron error dialog modal
   */
  showErrorDialog: (titleOrPayload, message, detail) => {
    try {
      let payload = {};
      if (typeof titleOrPayload === "object" && titleOrPayload !== null) {
        payload = titleOrPayload;
      } else {
        payload = { title: titleOrPayload, message, detail };
      }
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("dialog:show-error", payload);
      }
      return Promise.resolve({ success: true, mocked: true, ...payload });
    } catch (error) {
      console.error("[Hub Preload Error] showErrorDialog failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },

  /**
   * Display native Electron error box modal
   */
  showErrorBox: (title, message) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("dialog:show-error", { title, message });
      }
      return Promise.resolve({ success: true, mocked: true, title, message });
    } catch (error) {
      console.error("[Hub Preload Error] showErrorBox failed:", error);
      return Promise.resolve({
        success: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  },
};

/**
 * Safely expose in main world when contextIsolation is active
 */
function exposeContextBridge(bridgeApi = electronBridgeApi) {
  try {
    if (contextBridge && typeof contextBridge.exposeInMainWorld === "function") {
      contextBridge.exposeInMainWorld("electronAPI", bridgeApi);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Hub Preload Error] exposeContextBridge failed:", error);
    return false;
  }
}

exposeContextBridge(electronBridgeApi);

module.exports = {
  electronBridgeApi,
  loadElectronModule,
  exposeContextBridge,
};
