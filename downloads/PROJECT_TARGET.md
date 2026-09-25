# downloads — Official Application Distribution Target Specification

> **Canonical Target of App**:
> **Dedicated release distribution and downloadable artifacts repository strictly used for saving application distribution files and desktop installers only (`use for save apps file only`)**.
> _(Thư mục lưu trữ phân phối độc lập chuyên dụng chỉ dùng để lưu trữ các tệp cài đặt và gói phân phối ứng dụng: .deb, .exe, .zip, SHA256SUMS.txt, release-manifest.json)_.

---

## 1. High-Level Vision & Scope

`downloads/` is a dedicated, standalone Git repository configured as a release distribution directory across the 2-TEK ecosystem. It provides a standardized, versioned, and unversioned hierarchy for desktop installers and standalone web application packages.

- **Storage Invariant**: Exclusively used for saving application release files (`use for save apps file only`).
- **Target App Packages**:
  - `Hub`: Debian package (`.deb`) and Windows installer (`.exe`).
  - `VTekOfficeSuit`: Unified Electron suite desktop installers (`.deb`, `.exe`).
  - Standalone Application Packages: `Word`, `Excel`, `Presentation`, `Pdf`, `Notes`, `Forms`, `Antivirus`, `SuperChat`, `Tasks`, `Cloud`, `Settings`, `AIAssistant`, `CanvasPack`, `CanvasStudio`, `OfficePack` (`.zip`).
- **Integrity Verification**: Every distribution folder contains `SHA256SUMS.txt` cryptographic hashes and `release-manifest.json` release metadata.
- **Gitlink Isolation (Mode 160000)**: `downloads/` is decoupled from the main workspace repository, eliminating heavy binary caching and git diff bloat.

---

## 2. Directory Hierarchy Blueprint

```
downloads/
├── .git/                                 # Standalone Git repository
├── Hub/                                  # 2-TEK Hub Desktop releases
│   └── 1.0.0/
│       ├── 2tek-hub_1.0.0_amd64.deb
│       ├── 2tek-hub-setup-1.0.0.exe
│       ├── 2tek-hub.deb
│       ├── 2tek-hub.exe
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Word/                                 # Word Standalone Package
│   ├── Word.zip
│   ├── SHA256SUMS.txt
│   ├── release-manifest.json
│   └── 1.0.0/
│       ├── Word.zip
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Excel/                                # Excel Standalone Package
├── Presentation/                         # Presentation Standalone Package
├── Pdf/                                  # PDF Standalone Package
├── Notes/                                # Notes Standalone Package
├── Forms/                                # Forms Standalone Package
├── Antivirus/                            # Antivirus Standalone Package
├── SuperChat/                            # SuperChat Standalone Package
├── Tasks/                                # Tasks Standalone Package
├── Cloud/                                # Cloud Standalone Package
├── Settings/                             # Settings Standalone Package
├── AIAssistant/                          # AI Assistant Standalone Package
├── CanvasPack/                           # CanvasPack Standalone Package
├── CanvasStudio/                         # CanvasStudio Standalone Package
├── OfficePack/                           # OfficePack Standalone Package
├── .standards/                           # Distribution standards & JSON schemas
├── .example/                             # Sample manifest fixtures
├── PROJECT_TARGET.md                     # Canonical target specification
└── README.md                             # Central distribution guide
```

---

## 3. Strict Anti-Goals & Prohibitions (Rule 69)

1. **Anti-Goal 1 — Zero User Document Storage**:
   - `downloads/` must NEVER be used to store general user documents, spreadsheets, slides, or notes. User documents belong strictly to `packages/Cloud` and `FILES_STORAGE_PATH`.
2. **Anti-Goal 2 — Zero Source Code & Test Scrap**:
   - `downloads/` must NEVER contain raw TypeScript/JavaScript source code, development scripts, or scratch files. It is strictly for compiled release artifacts.
3. **Anti-Goal 3 — Ban Legacy `./download` Symlink/Folder**:
   - The singular `./download` directory/symlink is completely eliminated and prohibited. All builders, scripts, tests, and documentation must exclusively use `./downloads/`.
4. **Anti-Goal 4 — Zero Main Workspace Git Cache**:
   - Binary packages must NEVER be cached or committed into the root workspace Git index. `downloads/` is maintained exclusively as a Git gitlink (`160000`).
