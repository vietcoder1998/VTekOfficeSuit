"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Container,
  Div,
  DivBetween,
  DivCenter,
  DivCol,
  DivGrid,
  DivRow,
  IdeIcon,
} from "@/components/bases";

interface SuiteApplicationItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly iconName: string;
  readonly port: number;
}

const SUITE_APPLICATIONS: readonly SuiteApplicationItem[] = [
  {
    id: "word",
    name: "Word Document Studio",
    description: "Rich text authoring, typography, formatting, and docx processing.",
    iconName: "FileText",
    port: 3026,
  },
  {
    id: "excel",
    name: "Excel Spreadsheet Studio",
    description: "Cell calculations, formula engine, row-column grids, and xlsx parsing.",
    iconName: "Table",
    port: 3027,
  },
  {
    id: "presentation",
    name: "Presentation Slide Studio",
    description: "Slide deck designer, shapes, animations, and presenter mode.",
    iconName: "Presentation",
    port: 3029,
  },
  {
    id: "pdf",
    name: "PDF Studio & Reader",
    description: "Document reading, highlights, annotations, and format conversions.",
    iconName: "FileSpreadsheet",
    port: 3028,
  },
  {
    id: "notes",
    name: "Notes & Memos",
    description: "Fast markdown notebooks, checklists, search, and instant auto-save.",
    iconName: "StickyNote",
    port: 3030,
  },
  {
    id: "forms",
    name: "Forms & Survey Studio",
    description: "Dynamic questionnaires, responses analytics, and survey designer.",
    iconName: "CheckSquare",
    port: 3031,
  },
  {
    id: "ai-assistant",
    name: "Autonomous AI Assistant",
    description: "AI Copilot studio, multi-tab intelligence, and instance manipulation.",
    iconName: "Bot",
    port: 3024,
  },
  {
    id: "super-chat",
    name: "SuperChat Messenger",
    description: "Multi-channel aggregated messaging, thread conversations, and sync.",
    iconName: "MessageSquare",
    port: 3016,
  },
  {
    id: "cloud",
    name: "Cloud Storage Explorer",
    description: "Central file synchronization, cloud persistence, and folder manager.",
    iconName: "Cloud",
    port: 3018,
  },
  {
    id: "hub",
    name: "Hub Application Launcher",
    description: "Desktop process manager, application runner, and container coordinator.",
    iconName: "LayoutGrid",
    port: 3020,
  },
];

export function VTekOfficeSuiteApp(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"apps" | "downloads" | "about">("apps");
  const [isBuildingDesktop, setIsBuildingDesktop] = useState<boolean>(false);
  const [buildStatusMessage, setBuildStatusMessage] = useState<string>("");

  const handleBuildPackages = async (targetType: "all" | "deb" | "exe"): Promise<void> => {
    setIsBuildingDesktop(true);
    setBuildStatusMessage(`Building desktop package (${targetType.toUpperCase()}) to downloads...`);

    try {
      if (typeof window !== "undefined" && window.electronAPI?.buildDesktopPackage) {
        const buildResult = await window.electronAPI.buildDesktopPackage({ target: targetType });
        if (buildResult.success) {
          setBuildStatusMessage("Desktop package built successfully into downloads directory!");
        } else {
          setBuildStatusMessage("Desktop build encountered an error. Check terminal logs.");
        }
      } else {
        setBuildStatusMessage(
          "Build triggered. In web preview mode, run: npm run build:desktop in terminal to output to downloads/."
        );
      }
    } catch {
      setBuildStatusMessage("Error triggering build. Please execute build:desktop via terminal.");
    } finally {
      setIsBuildingDesktop(false);
    }
  };

  const handleOpenDownloads = async (): Promise<void> => {
    if (typeof window !== "undefined" && window.electronAPI?.openDownloadsFolder) {
      await window.electronAPI.openDownloadsFolder();
    } else {
      alert("Downloads destination folder: /home/tranduyviet/Projects/2tek-office-packs/downloads");
    }
  };

  return (
    <Container id="vtek-suite-main-container" className="div-col flex-1 p-6 gap-6">
      {/* Top Navigation Bar */}
      <DivBetween id="vtek-suite-navbar" className="theme-surface-card p-4 rounded-xl border theme-border">
        <DivRow id="vtek-suite-brand" className="items-center gap-3">
          <DivCenter id="vtek-suite-logo-badge" className="w-10 h-10 rounded-lg bg-primary text-white">
            <IdeIcon name="Briefcase" size="lg" />
          </DivCenter>
          <DivCol id="vtek-suite-brand-text">
            <h1 id="vtek-suite-heading" className="text-lg font-bold tracking-tight">
              VTek Office Suite
            </h1>
            <span id="vtek-suite-subtitle" className="text-xs theme-text-muted">
              Unified Desktop Application & Distribution Center
            </span>
          </DivCol>
        </DivRow>

        <DivRow id="vtek-suite-nav-actions" className="items-center gap-2">
          <Button
            id="vtek-tab-apps-button"
            variant={activeTab === "apps" ? "primary" : "secondary"}
            onClick={() => setActiveTab("apps")}
          >
            <IdeIcon name="LayoutGrid" size="sm" />
            Applications
          </Button>
          <Button
            id="vtek-tab-downloads-button"
            variant={activeTab === "downloads" ? "primary" : "secondary"}
            onClick={() => setActiveTab("downloads")}
          >
            <IdeIcon name="Download" size="sm" />
            Downloads & Builds
          </Button>
          <Button
            id="vtek-tab-about-button"
            variant={activeTab === "about" ? "primary" : "secondary"}
            onClick={() => setActiveTab("about")}
          >
            <IdeIcon name="Info" size="sm" />
            Suite Info
          </Button>
        </DivRow>
      </DivBetween>

      {/* Tab: Applications Grid */}
      {activeTab === "apps" && (
        <DivCol id="vtek-apps-section" className="gap-4">
          <DivBetween id="vtek-apps-header" className="items-center">
            <DivCol id="vtek-apps-title-col">
              <h2 id="vtek-apps-heading" className="text-base font-semibold">
                Suite Application Modules
              </h2>
              <span id="vtek-apps-description" className="text-xs theme-text-muted">
                Launch and interact with the discrete office applications in the VTek suite.
              </span>
            </DivCol>
            <Button
              id="vtek-open-downloads-quick-button"
              variant="secondary"
              onClick={handleOpenDownloads}
            >
              <IdeIcon name="FolderDown" size="sm" />
              Open Downloads Folder
            </Button>
          </DivBetween>

          <DivGrid id="vtek-apps-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUITE_APPLICATIONS.map((appItem: SuiteApplicationItem) => (
              <Card
                key={appItem.id}
                id={`vtek-app-card-${appItem.id}`}
                className="theme-surface p-4 rounded-xl border theme-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(`http://localhost:${appItem.port}`, "_blank");
                  }
                }}
              >
                <DivRow id={`vtek-app-card-header-${appItem.id}`} className="items-center gap-3 mb-2">
                  <DivCenter
                    id={`vtek-app-icon-${appItem.id}`}
                    className="w-9 h-9 rounded-lg bg-surface-muted text-primary"
                  >
                    <IdeIcon name={appItem.iconName} size="md" />
                  </DivCenter>
                  <DivCol id={`vtek-app-title-col-${appItem.id}`} className="flex-1">
                    <h3 id={`vtek-app-title-${appItem.id}`} className="text-sm font-semibold">
                      {appItem.name}
                    </h3>
                    <span id={`vtek-app-port-${appItem.id}`} className="text-xs theme-text-muted">
                      Port: {appItem.port}
                    </span>
                  </DivCol>
                </DivRow>
                <p id={`vtek-app-desc-${appItem.id}`} className="text-xs theme-text-muted leading-relaxed">
                  {appItem.description}
                </p>
              </Card>
            ))}
          </DivGrid>
        </DivCol>
      )}

      {/* Tab: Downloads & Packaging */}
      {activeTab === "downloads" && (
        <DivCol id="vtek-downloads-section" className="gap-6">
          <DivBetween id="vtek-downloads-header" className="items-center">
            <DivCol id="vtek-downloads-title-col">
              <h2 id="vtek-downloads-heading" className="text-base font-semibold">
                Desktop Application Packaging & Downloads
              </h2>
              <span id="vtek-downloads-subtext" className="text-xs theme-text-muted">
                Compiled binary distributions are published directly to @/downloads.
              </span>
            </DivCol>
            <DivRow id="vtek-downloads-actions-row" className="gap-2">
              <Button
                id="vtek-build-all-button"
                variant="primary"
                disabled={isBuildingDesktop}
                onClick={() => handleBuildPackages("all")}
              >
                <IdeIcon name="Cpu" size="sm" />
                {isBuildingDesktop ? "Building..." : "Build All Packages to Downloads"}
              </Button>
              <Button
                id="vtek-open-folder-button"
                variant="secondary"
                onClick={handleOpenDownloads}
              >
                <IdeIcon name="Folder" size="sm" />
                Open Downloads Folder
              </Button>
            </DivRow>
          </DivBetween>

          {buildStatusMessage && (
            <Div
              id="vtek-build-status-box"
              className="p-3 rounded-lg bg-surface-muted border theme-border text-xs text-primary"
            >
              {buildStatusMessage}
            </Div>
          )}

          <DivGrid id="vtek-packages-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linux Package Card */}
            <Card id="vtek-package-card-linux" className="p-5 rounded-xl border theme-border theme-surface">
              <DivRow id="vtek-card-linux-header" className="items-center gap-3 mb-3">
                <DivCenter id="vtek-card-linux-icon" className="w-10 h-10 rounded-lg bg-surface-muted text-primary">
                  <IdeIcon name="Terminal" size="lg" />
                </DivCenter>
                <DivCol id="vtek-card-linux-title-col">
                  <h3 id="vtek-card-linux-title" className="text-sm font-semibold">
                    Linux Debian Package (.deb)
                  </h3>
                  <span id="vtek-card-linux-arch" className="text-xs theme-text-muted">
                    Architecture: amd64 / x86_64
                  </span>
                </DivCol>
              </DivRow>
              <p id="vtek-card-linux-desc" className="text-xs theme-text-muted mb-4 leading-relaxed">
                Native Debian/Ubuntu installer package. Automatically installs to /opt/vtek-office-suit and
                registers desktop launchers in /usr/share/applications.
              </p>
              <DivRow id="vtek-card-linux-actions" className="gap-2">
                <Button
                  id="vtek-build-deb-button"
                  variant="secondary"
                  disabled={isBuildingDesktop}
                  onClick={() => handleBuildPackages("deb")}
                >
                  <IdeIcon name="RefreshCw" size="sm" />
                  Rebuild .deb Package
                </Button>
                <Button
                  id="vtek-download-deb-link-button"
                  variant="primary"
                  onClick={handleOpenDownloads}
                >
                  <IdeIcon name="Download" size="sm" />
                  Get .deb from Downloads
                </Button>
              </DivRow>
            </Card>

            {/* Windows Package Card */}
            <Card id="vtek-package-card-windows" className="p-5 rounded-xl border theme-border theme-surface">
              <DivRow id="vtek-card-windows-header" className="items-center gap-3 mb-3">
                <DivCenter id="vtek-card-windows-icon" className="w-10 h-10 rounded-lg bg-surface-muted text-primary">
                  <IdeIcon name="AppWindow" size="lg" />
                </DivCenter>
                <DivCol id="vtek-card-windows-title-col">
                  <h3 id="vtek-card-windows-title" className="text-sm font-semibold">
                    Windows Executable (.exe)
                  </h3>
                  <span id="vtek-card-windows-arch" className="text-xs theme-text-muted">
                    Architecture: x64 PE32+ GUI
                  </span>
                </DivCol>
              </DivRow>
              <p id="vtek-card-windows-desc" className="text-xs theme-text-muted mb-4 leading-relaxed">
                Standalone PE32+ portable GUI binary and setup executable for Windows 10 &amp; 11 with
                embedded application runtime bundle.
              </p>
              <DivRow id="vtek-card-windows-actions" className="gap-2">
                <Button
                  id="vtek-build-exe-button"
                  variant="secondary"
                  disabled={isBuildingDesktop}
                  onClick={() => handleBuildPackages("exe")}
                >
                  <IdeIcon name="RefreshCw" size="sm" />
                  Rebuild .exe Package
                </Button>
                <Button
                  id="vtek-download-exe-link-button"
                  variant="primary"
                  onClick={handleOpenDownloads}
                >
                  <IdeIcon name="Download" size="sm" />
                  Get .exe from Downloads
                </Button>
              </DivRow>
            </Card>
          </DivGrid>

          {/* Path Configuration Note */}
          <Card id="vtek-downloads-path-info-card" className="p-4 rounded-xl border theme-border bg-surface-muted">
            <DivRow id="vtek-path-info-row" className="items-center gap-3">
              <IdeIcon name="FolderCheck" size="md" />
              <DivCol id="vtek-path-info-text-col">
                <span id="vtek-path-info-title" className="text-xs font-semibold">
                  Canonical Downloads Destination (Rule 72 Conformance)
                </span>
                <span id="vtek-path-info-path" className="text-xs theme-text-muted">
                  DOWNLOADS_PATH configured to: <code>./downloads</code> (resolved to @/downloads)
                </span>
              </DivCol>
            </DivRow>
          </Card>
        </DivCol>
      )}

      {/* Tab: About & Ecosystem Invariants */}
      {activeTab === "about" && (
        <DivCol id="vtek-about-section" className="gap-4">
          <Card id="vtek-about-card" className="p-6 rounded-xl border theme-border theme-surface">
            <h2 id="vtek-about-heading" className="text-base font-semibold mb-2">
              About VTek Office Suite
            </h2>
            <p id="vtek-about-desc" className="text-xs theme-text-muted leading-relaxed mb-4">
              VTek Office Suite is the flagship desktop application and unified release packager for the 2-TEK
              software ecosystem. Operating as an independent repository (
              <a
                href="https://github.com/vietcoder1998/VTekOfficeSuit.git"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                https://github.com/vietcoder1998/VTekOfficeSuit.git
              </a>
              ), it orchestrates Electron desktop packaging for Linux (.deb) and Windows (.exe) and outputs
              production distribution packages directly to the central downloads repository.
            </p>
            <DivRow id="vtek-about-meta-row" className="gap-4 text-xs theme-text-muted">
              <span id="vtek-about-meta-version">Version: 1.0.0</span>
              <span id="vtek-about-meta-port">Port: 3035</span>
              <span id="vtek-about-meta-repo">Remote: github.com/vietcoder1998/VTekOfficeSuit</span>
            </DivRow>
          </Card>
        </DivCol>
      )}
    </Container>
  );
}
