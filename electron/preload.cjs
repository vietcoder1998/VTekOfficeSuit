const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  isElectron: true,
  appVersion: "1.0.0",
  downloadsPath: ipcRenderer.sendSync("get-downloads-path-sync") || "",
  buildDesktopPackage: (options) => ipcRenderer.invoke("build-desktop-package", options),
  openDownloadsFolder: () => ipcRenderer.invoke("open-downloads-folder"),
  openExternalUrl: (url) => ipcRenderer.invoke("open-external-url", url),
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
});
