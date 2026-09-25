# VTek Office Suite (VTekOfficeSuit)

> **Canonical Target of App**:
> **Unified Electron Desktop Application & Multi-Platform Distribution Packager for 2-TEK Office Suite**
> _(Bộ ứng dụng văn phòng máy tính để bàn hợp nhất và hệ thống đóng gói phân phối đa nền tảng cho hệ sinh thái 2-TEK Office)_.

---

## 1. Overview & Architectural Scope

`VTekOfficeSuit` is the official desktop application and release packager for the 2-TEK Office Suite. It provides:

1. **Unified Desktop Shell (Electron)**: A unified, native windowing environment hosting all suite modules: Word, Excel, Presentation, PDF Reader, Forms, Notes, AIAssistant, and Hub Launcher.
2. **Multi-Platform Distribution Builder**: Compiles, packages, and outputs production desktop installers and executables:
   - **Linux**: `.deb` installer packages (Debian / Ubuntu amd64)
   - **Windows**: `.exe` Portable & Setup PE32+ GUI executables
   - **Checksums & Manifests**: SHA-256 verification hashes and release manifests
3. **Dedicated Downloads Distribution Pipeline**: Automatically builds and outputs distribution packages directly to `@/home/tranduyviet/Projects/2tek-office-packs/downloads` (configured via `DOWNLOADS_PATH` / `APP_DOWNLOADS_PATH` in `.env`).

---

## 2. Directory Structure

```
packages/VTekOfficeSuit/
├── downloads/                # All cross-platform release packages (.deb, .exe, .zip)
│   ├── Word/                 # Document Studio installer packages
│   ├── Excel/                # Spreadsheet Studio installer packages
│   ├── Hub/                  # 2-TEK Hub Desktop installer packages
│   └── ...                   # All 17 workspace application packages
├── scripts/                  # Packaging & distribution build scripts
│   ├── build-desktop-packages.ts  # Multi-platform builder engine
│   └── build-desktop-packages.mjs # CLI launcher
├── .standards/               # Design and structure specifications (Rule 68)
│   ├── structure.md
│   └── designs.md
├── PROJECT_TARGET.md         # Canonical package target & anti-goals (Rule 69)
└── package.json              # Package metadata and build scripts
```

---

## 3. Quick Start & Execution

### Run Desktop Application in Development

```bash
# Start VTek Office Suite desktop client
npm run desktop

# Or from workspace root
npm run desktop:vtek
```

### Build Distribution Packages to Downloads

```bash
# Build all packages (.deb and .exe) to downloads/
npm run build:desktop

# Build Linux .deb package only
npm run build:desktop:deb

# Build Windows .exe package only
npm run build:desktop:exe
```

All built packages will be saved to the configured downloads folder:
`DOWNLOADS_PATH=./downloads` (or `@/home/tranduyviet/Projects/2tek-office-packs/downloads`).

---

## 4. Architectural Boundaries (Rule 69 Conformance)

- **Owner of**: Electron packaging, desktop windowing shell, multi-module suite navigation, and distribution builds targeting `downloads/`.
- **Anti-Goals**:
  - Does NOT replace individual standalone document engines (Word, Excel, Presentation remain independent).
  - Does NOT run file storage cloud services (belongs to `packages/Cloud`).
  - Does NOT act as the raw application compiler (belongs to `Hub` and `BuilderBot`).
