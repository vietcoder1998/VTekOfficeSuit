/**
 * packages/Excel/electron/preload.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Excel Spreadsheet Studio — Electron Preload Bridge
 *
 * Exposes a typed, isolated context bridge interface (window.electronAPI)
 * for secure communication between renderer and main process.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function loadElectronModule() {
  try {
    return require("electron");
  } catch (loadError) {
    console.warn(
      "[Excel Preload] Electron module not available in current environment:",
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
      console.error("[Excel Preload Error] minimizeWindow failed:", minimizeError);
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
      console.error("[Excel Preload Error] maximizeWindow failed:", maximizeError);
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
      console.error("[Excel Preload Error] closeWindow failed:", closeError);
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
      console.error("[Excel Preload Error] isMaximized failed:", checkMaximizedError);
      return Promise.resolve(false);
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
        console.error("[Excel Preload Error] onWindowStateChange listener error:", listenerError);
      }
    };
    ipcRenderer.on("window:maximized-change", listener);
    return () => {
      try {
        ipcRenderer.removeListener("window:maximized-change", listener);
      } catch (removeError) {
        console.error("[Excel Preload Error] Failed to remove listener:", removeError);
      }
    };
  },

  /**
   * Native File Operations
   */
  openFileDialog: (options = {}) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("file:open-dialog", options);
      }
      return Promise.resolve({ canceled: true });
    } catch (openDialogError) {
      console.error("[Excel Preload Error] openFileDialog failed:", openDialogError);
      return Promise.resolve({ canceled: true });
    }
  },

  saveFileDialog: (options = {}) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("file:save-dialog", options);
      }
      return Promise.resolve({ canceled: true });
    } catch (saveDialogError) {
      console.error("[Excel Preload Error] saveFileDialog failed:", saveDialogError);
      return Promise.resolve({ canceled: true });
    }
  },

  readFile: (targetFilePath) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("file:read", targetFilePath);
      }
      return Promise.resolve({ success: false, error: "IPC unavailable" });
    } catch (readFileError) {
      console.error("[Excel Preload Error] readFile failed:", readFileError);
      return Promise.resolve({ success: false, error: String(readFileError) });
    }
  },

  writeFile: (targetFilePath, fileContentText) => {
    try {
      if (ipcRenderer && typeof ipcRenderer.invoke === "function") {
        return ipcRenderer.invoke("file:write", { targetFilePath, fileContentText });
      }
      return Promise.resolve({ success: false, error: "IPC unavailable" });
    } catch (writeFileError) {
      console.error("[Excel Preload Error] writeFile failed:", writeFileError);
      return Promise.resolve({ success: false, error: String(writeFileError) });
    }
  },

  onExternalFileOpen: (callback) => {
    if (!ipcRenderer || typeof ipcRenderer.on !== "function") {
      return () => {};
    }
    const listener = (_event, openedFilePath) => {
      try {
        if (typeof callback === "function") {
          callback(openedFilePath);
        }
      } catch (listenerError) {
        console.error("[Excel Preload Error] onExternalFileOpen listener error:", listenerError);
      }
    };
    ipcRenderer.on("file:open-external", listener);
    return () => {
      try {
        ipcRenderer.removeListener("file:open-external", listener);
      } catch (removeError) {
        console.error("[Excel Preload Error] Failed to remove listener:", removeError);
      }
    };
  },
};

if (contextBridge && typeof contextBridge.exposeInMainWorld === "function") {
  try {
    contextBridge.exposeInMainWorld("electronAPI", electronBridgeApi);
  } catch (exposeError) {
    console.error("[Excel Preload Error] Failed to expose electronAPI via contextBridge:", exposeError);
    if (typeof window !== "undefined") {
      window.electronAPI = electronBridgeApi;
    }
  }
} else if (typeof window !== "undefined") {
  window.electronAPI = electronBridgeApi;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { electronBridgeApi };
}
