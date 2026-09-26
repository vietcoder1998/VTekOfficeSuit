/**
 * packages/Pdf/electron/main.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK PDF Reader & Studio — Electron Main Process
 *
 * Provides desktop window lifecycle management, titlebar controls,
 * native file dialogs, and IPC channels for 2-TEK PDF Reader & Studio.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("node:path");
const http = require("node:http");
const fileSystem = require("node:fs");

function loadElectronModule() {
  try {
    if (typeof global !== "undefined" && global.__pdf_electron_mock__) {
      return global.__pdf_electron_mock__;
    }
    const loadedModule = require("electron");
    if (typeof loadedModule === "object" && loadedModule !== null) {
      return loadedModule;
    }
    return {};
  } catch (loadError) {
    console.warn(
      "[Pdf Electron] Electron module unavailable in current environment:",
      loadError && loadError.message ? loadError.message : loadError
    );
    return {};
  }
}

const electronModule = loadElectronModule();
const { app, BrowserWindow, ipcMain, dialog } = electronModule;

/**
 * Native error dialog helper conforming to single try-catch pattern
 */
function displayElectronError(title = "2-TEK PDF Reader & Studio Error", error = null, detail = "") {
  try {
    const errorMessage =
      error && error.message
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred.";
    const formattedDetail = detail || (error && error.stack ? error.stack : "");

    console.error(
      `[Pdf Electron Error] ${title}: ${errorMessage}`,
      formattedDetail ? `\nDetail: ${formattedDetail}` : ""
    );

    const activeDialog =
      (electronModule && electronModule.dialog) ||
      dialog ||
      (typeof global !== "undefined" && global.__pdf_electron_dialog__);

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
    console.error("[Pdf Electron Error] Failed to display native error dialog:", displayException);
    return false;
  }
}

/**
 * Configure application metadata
 */
function configureAppMetadata() {
  try {
    if (app && typeof app.setName === "function") {
      app.setName("2-tek-pdf");
    }
    if (app && typeof app.setAppUserModelId === "function") {
      app.setAppUserModelId("com.vtek.pdf");
    }
  } catch (metadataError) {
    displayElectronError("Configure Metadata Error", metadataError);
  }
}

configureAppMetadata();

/**
 * Resolve target port (default: 3028)
 */
function resolvePortFromEnv() {
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env.PORT) {
        const parsedPort = parseInt(process.env.PORT, 10);
        if (!Number.isNaN(parsedPort) && parsedPort > 0) {
          return parsedPort;
        }
      }
      if (process.env.PDF_PORT) {
        const parsedAppPort = parseInt(process.env.PDF_PORT, 10);
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

    for (const candidateFilePath of candidateEnvironmentFiles) {
      if (fileSystem.existsSync(candidateFilePath)) {
        const fileContentString = fileSystem.readFileSync(candidateFilePath, "utf8");
        const fileLines = fileContentString.split(/\r?\n/);
        for (const singleLine of fileLines) {
          const trimmedLine = singleLine.trim();
          if (trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
            continue;
          }
          const separatorIndex = trimmedLine.indexOf("=");
          const variableKey = trimmedLine.slice(0, separatorIndex).trim();
          if (variableKey === "PORT" || variableKey === "PDF_PORT") {
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
  } catch (portError) {
    console.error("[Pdf Electron Error] Failed resolving port from env:", portError);
  }

  return 3028;
}

const TARGET_PORT = resolvePortFromEnv();
const APP_URL = `http://localhost:${TARGET_PORT}`;

let mainWindow = null;
let pendingFileToOpen = null;

// Parse file path passed via command line arguments
if (process.argv && process.argv.length > 1) {
  for (let argumentIndex = 1; argumentIndex < process.argv.length; argumentIndex += 1) {
    const candidateArgument = process.argv[argumentIndex];
    if (
      candidateArgument &&
      !candidateArgument.startsWith("-") &&
      fileSystem.existsSync(candidateArgument) &&
      fileSystem.statSync(candidateArgument).isFile()
    ) {
      pendingFileToOpen = path.resolve(candidateArgument);
      break;
    }
  }
}

/**
 * Register IPC handlers for window controls and native file operations
 */
function registerIpcHandlers() {
  try {
    if (!ipcMain || typeof ipcMain.handle !== "function") {
      return;
    }

    // Window controls
    ipcMain.handle("window:minimize", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.minimize();
        return true;
      }
      return false;
    });

    ipcMain.handle("window:maximize", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        return true;
      }
      return false;
    });

    ipcMain.handle("window:close", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
        return true;
      }
      return false;
    });

    ipcMain.handle("window:is-maximized", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        return mainWindow.isMaximized();
      }
      return false;
    });

    // Native file dialogs & file system operations
    ipcMain.handle("file:open-dialog", async (_event, options = {}) => {
      try {
        if (!dialog || typeof dialog.showOpenDialog !== "function") {
          return { canceled: true };
        }
        const openResult = await dialog.showOpenDialog(mainWindow, {
          title: options.title || "Mở tệp (Open File)",
          defaultPath: options.defaultPath,
          buttonLabel: options.buttonLabel || "Mở (Open)",
          properties: ["openFile"],
          filters: options.filters || [
          {
                    "name": "PDF & Document Files",
                    "extensions": [
                              "pdf",
                              "epub",
                              "txt",
                              "json"
                    ]
          },
          {
                    "name": "All Files",
                    "extensions": [
                              "*"
                    ]
          }
],
        });

        if (openResult.canceled || !openResult.filePaths || openResult.filePaths.length === 0) {
          return { canceled: true };
        }

        const selectedFilePath = openResult.filePaths[0];
        const selectedFileName = path.basename(selectedFilePath);
        const fileContent = await fileSystem.promises.readFile(selectedFilePath, "utf8");

        return {
          canceled: false,
          filePath: selectedFilePath,
          fileName: selectedFileName,
          content: fileContent,
        };
      } catch (openDialogError) {
        displayElectronError("Open File Dialog Error", openDialogError);
        return { canceled: true };
      }
    });

    ipcMain.handle("file:save-dialog", async (_event, options = {}) => {
      try {
        if (!dialog || typeof dialog.showSaveDialog !== "function") {
          return { canceled: true };
        }
        const saveResult = await dialog.showSaveDialog(mainWindow, {
          title: options.title || "Lưu tệp (Save File)",
          defaultPath: options.defaultPath || "file",
          buttonLabel: options.buttonLabel || "Lưu (Save)",
          filters: options.filters || [
          {
                    "name": "PDF & Document Files",
                    "extensions": [
                              "pdf",
                              "epub",
                              "txt",
                              "json"
                    ]
          },
          {
                    "name": "All Files",
                    "extensions": [
                              "*"
                    ]
          }
],
        });

        if (saveResult.canceled || !saveResult.filePath) {
          return { canceled: true };
        }

        return {
          canceled: false,
          filePath: saveResult.filePath,
        };
      } catch (saveDialogError) {
        displayElectronError("Save File Dialog Error", saveDialogError);
        return { canceled: true };
      }
    });

    ipcMain.handle("file:read", async (_event, targetFilePath) => {
      try {
        if (!targetFilePath || !fileSystem.existsSync(targetFilePath)) {
          return { success: false, error: "File not found" };
        }
        const fileContentText = await fileSystem.promises.readFile(targetFilePath, "utf8");
        return { success: true, content: fileContentText };
      } catch (readFileError) {
        return { success: false, error: String(readFileError) };
      }
    });

    ipcMain.handle("file:write", async (_event, payload) => {
      try {
        const targetFilePath = payload && payload.targetFilePath;
        const fileContentText = payload && payload.fileContentText;
        if (!targetFilePath) {
          return { success: false, error: "Target file path required" };
        }
        await fileSystem.promises.writeFile(targetFilePath, fileContentText || "", "utf8");
        return { success: true };
      } catch (writeFileError) {
        return { success: false, error: String(writeFileError) };
      }
    });
  } catch (ipcRegistrationError) {
    displayElectronError("Register IPC Handlers Error", ipcRegistrationError);
  }
}

registerIpcHandlers();

/**
 * Create main application window
 */
function createMainWindow() {
  try {
    if (!BrowserWindow) {
      return null;
    }

    const windowOptions = {
      width: 1280,
      height: 840,
      minWidth: 800,
      minHeight: 600,
      title: "2-TEK PDF Reader & Studio",
      titleBarStyle: "hidden",
      titleBarOverlay: false,
      backgroundColor: "#0f172a",
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    };

    mainWindow = new BrowserWindow(windowOptions);

    mainWindow.once("ready-to-show", () => {
      if (mainWindow) {
        mainWindow.show();
        if (pendingFileToOpen) {
          mainWindow.webContents.send("file:open-external", pendingFileToOpen);
        }
      }
    });

    mainWindow.on("maximize", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("window:maximized-change", true);
      }
    });

    mainWindow.on("unmaximize", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("window:maximized-change", false);
      }
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });

    mainWindow.loadURL(APP_URL).catch((loadError) => {
      console.warn(`[Pdf Electron] Retrying connection to ${APP_URL}:`, loadError.message);
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL(APP_URL).catch((retryError) => {
            displayElectronError("Failed to load application", retryError);
          });
        }
      }, 1000);
    });

    return mainWindow;
  } catch (windowCreationError) {
    displayElectronError("Window Creation Error", windowCreationError);
    return null;
  }
}

// Single-instance lock
if (app && typeof app.requestSingleInstanceLock === "function") {
  const gotSingleInstanceLock = app.requestSingleInstanceLock();
  if (!gotSingleInstanceLock) {
    app.quit();
  } else {
    app.on("second-instance", (_event, commandLine) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();

        if (commandLine && commandLine.length > 2) {
          for (let argIdx = 2; argIdx < commandLine.length; argIdx += 1) {
            const candidatePath = commandLine[argIdx];
            if (
              candidatePath &&
              !candidatePath.startsWith("-") &&
              fileSystem.existsSync(candidatePath)
            ) {
              mainWindow.webContents.send("file:open-external", path.resolve(candidatePath));
              break;
            }
          }
        }
      }
    });
  }
}

if (app && typeof app.whenReady === "function") {
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
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createMainWindow,
    resolvePortFromEnv,
    displayElectronError,
  };
}
