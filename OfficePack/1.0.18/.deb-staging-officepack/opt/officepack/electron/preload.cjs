/**
 * Packages/OfficePack/electron/preload.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK OfficePack — Electron Preload Bridge
 *
 * Exposes a typed, isolated context bridge interface (window.officepackDesktop
 * and window.electronAPI) for secure communication between desktop renderer
 * and the Electron main process.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function loadElectronModule() {
  try {
    return require("electron");
  } catch (loadError) {
    console.warn(
      "[OfficePack Preload] Electron module not available in current environment:",
      loadError && loadError.message ? loadError.message : loadError
    );
    return {};
  }
}

const electronModule = loadElectronModule();
const { contextBridge, ipcRenderer } = electronModule;

const electronBridgeApi = {
  isElectron: true,
  platform: process.platform || "linux",
  isWindows: process.platform === "win32",
  isMac: process.platform === "darwin",
  isLinux: process.platform === "linux",

  /**
   * Window Controls
   */
  minimizeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:minimize");
      }
      return Promise.resolve(true);
    } catch (minimizeError) {
      console.error("[OfficePack Preload Error] minimizeWindow failed:", minimizeError);
      return Promise.resolve(false);
    }
  },

  maximizeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:maximize");
      }
      return Promise.resolve(true);
    } catch (maximizeError) {
      console.error("[OfficePack Preload Error] maximizeWindow failed:", maximizeError);
      return Promise.resolve(false);
    }
  },

  closeWindow: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:close");
      }
      return Promise.resolve(true);
    } catch (closeError) {
      console.error("[OfficePack Preload Error] closeWindow failed:", closeError);
      return Promise.resolve(false);
    }
  },

  killElectron: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:kill");
      }
      return Promise.resolve(true);
    } catch (killError) {
      console.error("[OfficePack Preload Error] killElectron failed:", killError);
      return Promise.resolve(false);
    }
  },

  isMaximized: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:is-maximized");
      }
      return Promise.resolve(false);
    } catch (checkMaximizedError) {
      console.error("[OfficePack Preload Error] isMaximized failed:", checkMaximizedError);
      return Promise.resolve(false);
    }
  },

  zoomIn: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:zoom-in");
      }
      return Promise.resolve(1.1);
    } catch (zoomInError) {
      console.error("[OfficePack Preload Error] zoomIn failed:", zoomInError);
      return Promise.resolve(1.0);
    }
  },

  zoomOut: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:zoom-out");
      }
      return Promise.resolve(0.9);
    } catch (zoomOutError) {
      console.error("[OfficePack Preload Error] zoomOut failed:", zoomOutError);
      return Promise.resolve(1.0);
    }
  },

  resetZoom: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:zoom-reset");
      }
      return Promise.resolve(1.0);
    } catch (resetZoomError) {
      console.error("[OfficePack Preload Error] resetZoom failed:", resetZoomError);
      return Promise.resolve(1.0);
    }
  },

  getZoomLevel: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("window:get-zoom");
      }
      return Promise.resolve(1.0);
    } catch (getZoomError) {
      return Promise.resolve(1.0);
    }
  },

  onWindowStateChange: (callback) => {
    if (!ipcRenderer || typeof ipcRenderer.on !== "function") {
      return () => {};
    }
    const listener = (_event, isMaximizedState) => {
      try {
        if (typeof callback === "function") {
          callback(Boolean(isMaximizedState));
        }
      } catch (listenerError) {
        console.error("[OfficePack Preload Error] onWindowStateChange listener error:", listenerError);
      }
    };
    ipcRenderer.on("window:maximized-change", listener);
    return () => {
      try {
        ipcRenderer.removeListener("window:maximized-change", listener);
      } catch (removeError) {
        console.error("[OfficePack Preload Error] Failed to remove listener:", removeError);
      }
    };
  },

  /**
   * Native Document File Dialogs
   */
  openDocumentDialog: (options = {}) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("dialog:open-document", options);
      }
      return Promise.resolve({ canceled: true, filePaths: [] });
    } catch (openDialogError) {
      console.error("[OfficePack Preload Error] openDocumentDialog failed:", openDialogError);
      return Promise.resolve({ canceled: true, filePaths: [] });
    }
  },

  saveDocumentDialog: (options = {}) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("dialog:save-document", options);
      }
      return Promise.resolve({ canceled: true, filePath: "" });
    } catch (saveDialogError) {
      console.error("[OfficePack Preload Error] saveDocumentDialog failed:", saveDialogError);
      return Promise.resolve({ canceled: true, filePath: "" });
    }
  },

  /**
   * Native Document File Read/Write Helpers
   */
  readDocumentFile: (targetFilePath) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("fs:read-document-file", targetFilePath);
      }
      return Promise.resolve({ success: false, error: "IPC unavailable" });
    } catch (readError) {
      console.error("[OfficePack Preload Error] readDocumentFile failed:", readError);
      return Promise.resolve({ success: false, error: readError.message });
    }
  },

  writeDocumentFile: (targetFilePath, base64Content) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("fs:write-document-file", targetFilePath, base64Content);
      }
      return Promise.resolve({ success: false, error: "IPC unavailable" });
    } catch (writeError) {
      console.error("[OfficePack Preload Error] writeDocumentFile failed:", writeError);
      return Promise.resolve({ success: false, error: writeError.message });
    }
  },

  /**
   * Application & Environment Info
   */
  getAppVersion: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:get-version");
      }
      return Promise.resolve("1.0.0");
    } catch (versionError) {
      return Promise.resolve("1.0.0");
    }
  },

  getServiceUrl: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:get-service-url");
      }
      return Promise.resolve("http://localhost:3100");
    } catch (urlError) {
      return Promise.resolve("http://localhost:3100");
    }
  },

  getPlatform: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("app:get-platform");
      }
      return Promise.resolve(process.platform || "linux");
    } catch (platformError) {
      return Promise.resolve("linux");
    }
  },

  /**
   * Multi-Process Instance Management
   */
  listInstances: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:list");
      }
      return Promise.resolve([]);
    } catch (error) {
      console.error("[OfficePack Preload Error] listInstances failed:", error);
      return Promise.resolve([]);
    }
  },

  startInstance: (instanceId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:start", instanceId);
      }
      return Promise.resolve(false);
    } catch (error) {
      console.error("[OfficePack Preload Error] startInstance failed:", error);
      return Promise.resolve(false);
    }
  },

  stopInstance: (instanceId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:stop", instanceId);
      }
      return Promise.resolve(false);
    } catch (error) {
      console.error("[OfficePack Preload Error] stopInstance failed:", error);
      return Promise.resolve(false);
    }
  },

  restartInstance: (instanceId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:restart", instanceId);
      }
      return Promise.resolve(false);
    } catch (error) {
      console.error("[OfficePack Preload Error] restartInstance failed:", error);
      return Promise.resolve(false);
    }
  },

  createInstance: (config) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:create", config);
      }
      return Promise.resolve(null);
    } catch (error) {
      console.error("[OfficePack Preload Error] createInstance failed:", error);
      return Promise.resolve(null);
    }
  },

  removeInstance: (instanceId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:remove", instanceId);
      }
      return Promise.resolve(false);
    } catch (error) {
      console.error("[OfficePack Preload Error] removeInstance failed:", error);
      return Promise.resolve(false);
    }
  },

  getInstanceLogs: (instanceId) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:logs", instanceId);
      }
      return Promise.resolve([]);
    } catch (error) {
      console.error("[OfficePack Preload Error] getInstanceLogs failed:", error);
      return Promise.resolve([]);
    }
  },

  onInstanceStatusChanged: (callback) => {
    if (!ipcRenderer || typeof ipcRenderer.on !== "function") {
      return () => {};
    }
    const listener = (_event, eventData) => {
      try {
        if (typeof callback === "function") {
          callback(eventData);
        }
      } catch (err) {
        console.error("[OfficePack Preload Error] onInstanceStatusChanged listener error:", err);
      }
    };
    ipcRenderer.on("instance:status-changed", listener);
    return () => {
      try {
        ipcRenderer.removeListener("instance:status-changed", listener);
      } catch (err) {
        console.error("[OfficePack Preload Error] Failed to remove listener:", err);
      }
    };
  },

  getKeepProcessesOnClose: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:get-keep-on-close");
      }
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(true);
    }
  },

  setKeepProcessesOnClose: (enabled) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instance:set-keep-on-close", Boolean(enabled));
      }
      return Promise.resolve(Boolean(enabled));
    } catch (e) {
      return Promise.resolve(Boolean(enabled));
    }
  },

  emptyPorts: (customPorts = null) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("instances:empty-ports", customPorts);
      }
      return Promise.resolve({ success: true, releasedPorts: [], freedCount: 0, message: "OK" });
    } catch (emptyPortsError) {
      console.error("[OfficePack Preload Error] emptyPorts failed:", emptyPortsError);
      return Promise.resolve({
        success: false,
        releasedPorts: [],
        freedCount: 0,
        message: String(emptyPortsError),
      });
    }
  },

  onInstanceLogAdded: (callback) => {
    if (!ipcRenderer || typeof ipcRenderer.on !== "function") {
      return () => {};
    }
    const listener = (_event, logData) => {
      try {
        if (typeof callback === "function") {
          callback(logData);
        }
      } catch (err) {
        console.error("[OfficePack Preload Error] onInstanceLogAdded listener error:", err);
      }
    };
    ipcRenderer.on("instance:log-added", listener);
    return () => {
      try {
        ipcRenderer.removeListener("instance:log-added", listener);
      } catch (err) {
        console.error("[OfficePack Preload Error] Failed to remove log listener:", err);
      }
    };
  },

  /**
   * gRPC Daily Log Files & Empty Logs Management
   */
  emptyGrpcLogs: (targetDate = "all") => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("grpc:empty-logs", targetDate);
      }
      return Promise.resolve({ success: true, emptiedCount: 0, files: [] });
    } catch (e) {
      return Promise.resolve({ success: false, error: e.message });
    }
  },

  getGrpcLogFiles: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("grpc:list-files");
      }
      return Promise.resolve([]);
    } catch (e) {
      return Promise.resolve([]);
    }
  },

  readGrpcDailyLogs: (targetDate) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("grpc:read-logs", targetDate);
      }
      return Promise.resolve([]);
    } catch (e) {
      return Promise.resolve([]);
    }
  },

  getCloudSyncStatus: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("cloud:status");
      }
      return Promise.resolve({ isRunning: false, totalSyncedFiles: 0 });
    } catch (e) {
      return Promise.resolve({ isRunning: false, totalSyncedFiles: 0 });
    }
  },

  syncCloudData: (options) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("cloud:sync", options);
      }
      return Promise.resolve({ success: true, pulledCount: 0, pushedCount: 0 });
    } catch (e) {
      return Promise.resolve({ success: false, error: String(e) });
    }
  },

  listCloudFiles: (provider, targetPath) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("cloud:files", provider, targetPath);
      }
      return Promise.resolve([]);
    } catch (e) {
      return Promise.resolve([]);
    }
  },

  pullCloudData: (fileIdOrPath, provider) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("cloud:pull", fileIdOrPath, provider);
      }
      return Promise.resolve(null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },

  pushCloudData: (fileName, content, provider) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("cloud:push", fileName, content, provider);
      }
      return Promise.resolve(null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },

  getBroadcastStatus: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("broadcast:status");
      }
      return Promise.resolve({ mode: "disabled", center: { isListening: false }, client: { isConnected: false } });
    } catch (e) {
      return Promise.resolve({ mode: "disabled" });
    }
  },

  setBroadcastMode: (options) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("broadcast:set-mode", options);
      }
      return Promise.resolve({ mode: "disabled" });
    } catch (e) {
      return Promise.resolve({ mode: "disabled", error: String(e) });
    }
  },

  sendBroadcastMessage: (payload) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("broadcast:send", payload);
      }
      return Promise.resolve(null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },

  getBroadcastMessages: (channel, limit) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("broadcast:messages", channel, limit);
      }
      return Promise.resolve([]);
    } catch (e) {
      return Promise.resolve([]);
    }
  },

  getBroadcastClients: () => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("broadcast:clients");
      }
      return Promise.resolve([]);
    } catch (e) {
      return Promise.resolve([]);
    }
  },
};


// Expose safe desktop bridge to renderer process
if (contextBridge && typeof contextBridge.exposeInMainWorld === "function") {
  try {
    contextBridge.exposeInMainWorld("officepackDesktop", electronBridgeApi);
    contextBridge.exposeInMainWorld("electronAPI", electronBridgeApi);
  } catch (exposeError) {
    console.error("[OfficePack Preload Error] Failed to expose contextBridge:", exposeError);
  }
} else {
  try {
    window.officepackDesktop = electronBridgeApi;
    window.electronAPI = electronBridgeApi;
  } catch (fallbackError) {
    // Renderer sandbox might prevent direct assignment
  }
}

module.exports = { electronBridgeApi };
