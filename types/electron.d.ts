export interface ElectronWindowAPI {
  platform: string;
  isElectron: boolean;
  appVersion?: string;
  downloadsPath?: string;
  buildDesktopPackage?: (options?: { target?: "deb" | "exe" | "all" }) => Promise<{ success: boolean; filePath?: string }>;
  openExternalUrl?: (url: string) => Promise<boolean>;
  openDownloadsFolder?: () => Promise<boolean>;
  minimizeWindow?: () => void;
  maximizeWindow?: () => void;
  closeWindow?: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronWindowAPI;
  }
}
