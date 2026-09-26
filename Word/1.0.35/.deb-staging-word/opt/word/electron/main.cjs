/**
 * packages/Word/electron/main.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-TEK Word Document Studio — Electron Main Process
 *
 * Provides desktop window lifecycle management, titlebar controls,
 * native file dialogs, and IPC channels for 2-TEK Word Document Studio.
 * Conforms to: Electron Single Try-Catch & Mandatory Error Display Rule
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("node:path");
const http = require("node:http");
const fileSystem = require("node:fs");

function loadElectronModule() {
  try {
    if (typeof global !== "undefined" && global.__word_electron_mock__) {
      return global.__word_electron_mock__;
    }
    const loadedModule = require("electron");
    if (typeof loadedModule === "object" && loadedModule !== null) {
      return loadedModule;
    }
    return {};
  } catch (loadError) {
    console.warn(
      "[Word Electron] Electron module unavailable in current environment:",
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
function displayElectronError(title = "2-TEK Word Document Studio Error", error = null, detail = "") {
  try {
    const errorMessage =
      error && error.message
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred.";
    const formattedDetail = detail || (error && error.stack ? error.stack : "");

    console.error(
      `[Word Electron Error] ${title}: ${errorMessage}`,
      formattedDetail ? `\nDetail: ${formattedDetail}` : ""
    );

    const activeDialog =
      (electronModule && electronModule.dialog) ||
      dialog ||
      (typeof global !== "undefined" && global.__word_electron_dialog__);

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
    console.error("[Word Electron Error] Failed to display native error dialog:", displayException);
    return false;
  }
}

/**
 * Configure application metadata
 */
function configureAppMetadata() {
  try {
    if (app && typeof app.setName === "function") {
      app.setName("2-tek-word");
    }
    if (app && typeof app.setAppUserModelId === "function") {
      app.setAppUserModelId("com.vtek.word");
    }
  } catch (metadataError) {
    displayElectronError("Configure Metadata Error", metadataError);
  }
}

configureAppMetadata();

/**
 * Resolve target port (default: 3025)
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
      if (process.env.WORD_PORT) {
        const parsedAppPort = parseInt(process.env.WORD_PORT, 10);
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
          if (variableKey === "PORT" || variableKey === "WORD_PORT") {
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
    console.error("[Word Electron Error] Failed resolving port from env:", portError);
  }

  return 3025;
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
                    "name": "Word Documents",
                    "extensions": [
                              "docx",
                              "doc",
                              "html",
                              "htm",
                              "txt",
                              "json",
                              "md"
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
                    "name": "Word Documents",
                    "extensions": [
                              "docx",
                              "doc",
                              "html",
                              "htm",
                              "txt",
                              "json",
                              "md"
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
      title: "2-TEK Word Document Studio",
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
      console.warn(`[Word Electron] Retrying connection to ${APP_URL}:`, loadError.message);
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

let internalNextServerProcess = null;

/**
 * Check whether the local Next.js server is responsive on the target URL
 */
function checkServerReady(targetUrl = APP_URL) {
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
    return Promise.resolve(false);
  }
}

/**
 * Dual-start orchestrator: ensure Next.js server is running before loading view
 */
async function ensureLocalServerRunning(targetUrl = APP_URL, maximumWaitAttempts = 60) {
  try {
    const isAlreadyRunning = await checkServerReady(targetUrl);
    if (isAlreadyRunning) {
      console.log(`[Word Electron] Server is already active on ${targetUrl}`);
      return true;
    }

    const { spawn } = require("node:child_process");
    const appDirectory = path.resolve(__dirname, "..");
    const serverJsPath = path.join(appDirectory, "server.js");
    const isWindows = process.platform === "win32";

    console.log(`[Word Electron] Dual-starting Next.js server on port ${TARGET_PORT}...`);

    if (fileSystem.existsSync(serverJsPath)) {
      internalNextServerProcess = spawn(process.execPath, [serverJsPath], {
        cwd: appDirectory,
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: String(TARGET_PORT),
          HOSTNAME: "0.0.0.0",
          NODE_ENV: "production",
        },
      });
    } else {
      const npmCommand = isWindows ? "npm.cmd" : "npm";
      internalNextServerProcess = spawn(npmCommand, ["run", "dev"], {
        cwd: appDirectory,
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: String(TARGET_PORT),
          WORD_PORT: String(TARGET_PORT),
        },
      });
    }

    if (internalNextServerProcess) {
      internalNextServerProcess.on("error", (spawnError) => {
        console.error(`[Word Electron] Failed to spawn Next.js server:`, spawnError);
      });
    }

    for (let attempt = 1; attempt <= maximumWaitAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const ready = await checkServerReady(targetUrl);
      if (ready) {
        console.log(`[Word Electron] Next.js server ready at ${targetUrl} (attempt ${attempt})`);
        return true;
      }
    }

    console.warn(`[Word Electron] Server wait timed out, proceeding to load view`);
    return false;
  } catch (launchError) {
    displayElectronError("Next.js Server Launch Error", launchError);
    return false;
  }
}

/**
 * Cleanly terminates the spawned Next.js server process
 */
function terminateInternalServer() {
  try {
    if (internalNextServerProcess) {
      console.log(`[Word Electron] Terminating internal Next.js server process (pid: ${internalNextServerProcess.pid})...`);
      try {
        internalNextServerProcess.kill("SIGTERM");
      } catch {
        // Ignore kill error
      }
      internalNextServerProcess = null;
    }
  } catch (termError) {
    // Ignore termination error
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
  app.whenReady().then(async () => {
    await ensureLocalServerRunning(APP_URL);
    createMainWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    terminateInternalServer();
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("before-quit", () => {
    terminateInternalServer();
  });

  app.on("will-quit", () => {
    terminateInternalServer();
  });

  process.on("exit", () => {
    terminateInternalServer();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createMainWindow,
    resolvePortFromEnv,
    checkServerReady,
    ensureLocalServerRunning,
    terminateInternalServer,
    displayElectronError,
  };
}
