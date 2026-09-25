# 2-TEK Ecosystem & VTek Office Suite — Official Downloads & Distribution Center

> **Official Binary Release Directory Structure**:
> All desktop application packages and release distributions are compiled and published using the canonical app-scoped versioned structure:
> **`downloads/{app}/{version}/{name}.{type}`** _(or `downloads/{projectName}/{version}/{name}.{type}`)_
> _(Thư mục lưu trữ chính thức toàn bộ bộ cài đặt desktop và standalone packages cho các ứng dụng hệ sinh thái 2-TEK và VTek Office Suite theo cấu trúc phân cấp chuẩn theo ứng dụng và phiên bản)_.
>
> 🎯 **Canonical Target**:
> Dedicated release distribution repository strictly used for saving application distribution files and desktop packages only (`use for save apps file only`). The unused legacy `./download` directory/symlink is completely removed.
>
> 🔒 **Standalone Git Repository (`downloads/.git`)**:
> `downloads/` is an independent, dedicated download-only repository. The main workspace tracks `downloads/` strictly as a Git gitlink (mode `160000`), completely eliminating binary build caches and bloated diffs from the primary source tree.

---

## 1. Directory Structure Standard

```
downloads/
├── .git/                                 # Dedicated distribution Git repository
├── Hub/                                  # 2-TEK Hub Desktop releases
│   └── 1.0.0/
│       ├── 2tek-hub_1.0.0_amd64.deb      # Linux Debian package (amd64)
│       ├── 2tek-hub.deb                  # Unversioned convenience alias
│       ├── 2tek-hub-setup-1.0.0.exe      # Windows PE32+ GUI installer (x64)
│       ├── 2tek-hub.exe                  # Unversioned convenience alias
│       ├── SHA256SUMS.txt                # SHA-256 verification hashes
│       └── release-manifest.json         # Automated release metadata
├── Word/                                 # Document Studio package
│   └── 1.0.0/
│       ├── Word.deb                      # Linux Debian package (amd64)
│       ├── Word.exe                      # Windows PE32+ GUI installer (x64)
│       ├── Word.zip                      # Standalone portable application package
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Excel/                                # Spreadsheet Studio package
│   └── 1.0.0/
│       ├── Excel.deb                     # Linux Debian package (amd64)
│       ├── Excel.exe                     # Windows PE32+ GUI installer (x64)
│       ├── Excel.zip
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Presentation/                         # Slide Studio package
│   └── 1.0.0/
│       ├── Presentation.deb
│       ├── Presentation.exe
│       ├── Presentation.zip
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Pdf/                                  # PDF Studio package
├── Notes/                                # Notes Studio package
├── Forms/                                # Forms Studio package
├── Antivirus/                            # Security Scanner package
├── SuperChat/                            # Realtime Chat package
├── Tasks/                                # Planner & Tasks package
├── Cloud/                                # Cloud Storage package
├── Settings/                             # Settings Portal package
├── AIAssistant/                          # AI Assistant package
├── CanvasPack/                           # Canvas Engine package
├── CanvasStudio/                         # Visual Canvas Studio package
├── OfficePack/                           # Office Core Engine package
├── .example/
│   └── download-app-structure-example.json
└── .standards/
    ├── download-app-structure-schema.json
    └── structure.md
```

---

## 2. Available Desktop Packages by Application

### 📝 Workspace Applications Cross-Platform Packages (`downloads/{name}/{version}/`)

Every application in the workspace is built into cross-platform distributions:

| Platform      | Architecture   | Package Format        | Download Path                                      | Description                                             |
| ------------- | -------------- | --------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| **Linux**     | x86_64 / amd64 | Debian (`.deb`)       | `downloads/{name}/{version}/{name}.deb`            | Native Linux Debian installer for Ubuntu, Debian, Mint. |
| **Windows**   | x86_64 / x64   | PE32+ GUI (`.exe`)    | `downloads/{name}/{version}/{name}.exe`            | Portable Windows installer for Windows 10 & 11.         |
| **Universal** | all            | Portable Zip (`.zip`) | `downloads/{name}/{version}/{name}.zip`            | Universal standalone application bundle.                |
| **All**       | Verification   | SHA-256 Hashes        | `downloads/{name}/{version}/SHA256SUMS.txt`        | Cryptographic checksums of all package artifacts.       |
| **All**       | Metadata       | JSON Manifest         | `downloads/{name}/{version}/release-manifest.json` | Automated release manifest describing all packages.     |

### 🚀 2-TEK Hub Desktop (`downloads/hub/{version}/`)

Example path: `downloads/hub/{version}/{name}.{type}`

| Platform    | Architecture   | Package Format        | Download Path                                                                          | Description                                      |
| ----------- | -------------- | --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Linux**   | x86_64 / amd64 | Debian (`.deb`)       | [`downloads/hub/1.0.0/2tek-hub_1.0.0_amd64.deb`](./hub/1.0.0/2tek-hub_1.0.0_amd64.deb) | Native Linux installer for Ubuntu, Debian, Mint. |
| **Linux**   | x86_64 / amd64 | Debian Alias (`.deb`) | [`downloads/hub/1.0.0/2tek-hub.deb`](./hub/1.0.0/2tek-hub.deb)                         | Canonical unversioned Debian package alias.      |
| **Windows** | x86_64 / x64   | PE32+ GUI (`.exe`)    | [`downloads/hub/1.0.0/2tek-hub-setup-1.0.0.exe`](./hub/1.0.0/2tek-hub-setup-1.0.0.exe) | Portable Windows installer for Windows 10 & 11.  |
| **Windows** | x86_64 / x64   | PE32+ Alias (`.exe`)  | [`downloads/hub/1.0.0/2tek-hub.exe`](./hub/1.0.0/2tek-hub.exe)                         | Canonical unversioned Windows executable alias.  |
| **All**     | Verification   | SHA-256 Hashes        | [`downloads/hub/1.0.0/SHA256SUMS.txt`](./hub/1.0.0/SHA256SUMS.txt)                     | SHA-256 checksums for Hub packages.              |
| **All**     | Metadata       | JSON Manifest         | [`downloads/hub/1.0.0/release-manifest.json`](./hub/1.0.0/release-manifest.json)       | Release metadata and file sizes.                 |

### 🏢 VTek Office Suite (`downloads/vtek-office-suit/{version}/`)

Example path: `downloads/vtek-office-suit/{version}/{name}.{type}`

| Platform    | Architecture   | Package Format     | Download Path                                                                                                                      | Description                                     |
| ----------- | -------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Linux**   | x86_64 / amd64 | Debian (`.deb`)    | [`downloads/vtek-office-suit/1.0.0/VTek-Office-Suite-linux-amd64.deb`](./vtek-office-suit/1.0.0/VTek-Office-Suite-linux-amd64.deb) | Native desktop installer for VTek Office Suite. |
| **Windows** | x86_64 / x64   | PE32+ GUI (`.exe`) | [`downloads/vtek-office-suit/1.0.0/VTek-Office-Suite-windows-x64.exe`](./vtek-office-suit/1.0.0/VTek-Office-Suite-windows-x64.exe) | Windows 10 & 11 standalone office executable.   |
| **All**     | Verification   | SHA-256 Hashes     | [`downloads/vtek-office-suit/1.0.0/SHA256SUMS.txt`](./vtek-office-suit/1.0.0/SHA256SUMS.txt)                                       | SHA-256 checksums for VTek Suite packages.      |
| **All**     | Metadata       | JSON Manifest      | [`downloads/vtek-office-suit/1.0.0/release-manifest.json`](./vtek-office-suit/1.0.0/release-manifest.json)                         | Release metadata and package records.           |

---

## 3. Installation Instructions

### 🐧 Linux (Ubuntu, Debian, Mint)

```bash
# Example: Install 2-TEK Hub
sudo apt install ./downloads/hub/1.0.0/2tek-hub_1.0.0_amd64.deb

# Example: Install VTek Office Suite
sudo apt install ./downloads/vtek-office-suit/1.0.0/VTek-Office-Suite-linux-amd64.deb
```

### 🪟 Windows (10 / 11)

1. Navigate to `downloads/{app}/{version}/` (e.g. `downloads/hub/1.0.0/` or `downloads/vtek-office-suit/1.0.0/`).
2. Double-click the `.exe` installer (e.g. `2tek-hub-setup-1.0.0.exe` or `VTek-Office-Suite-windows-x64.exe`).
3. The desktop application will launch immediately.

---

## 4. How to Build Desktop Packages to Downloads

```bash
# Build 2-TEK Hub desktop packages to downloads/hub/{version}/
npm run build:desktop

# Build VTek Office Suite desktop packages to downloads/vtek-office-suit/{version}/
npm run build:vtek
```

---

## 5. Verification & Integrity

```bash
# Verify Hub packages
cd downloads/hub/1.0.0 && sha256sum -c SHA256SUMS.txt

# Verify VTek packages
cd downloads/vtek-office-suit/1.0.0 && sha256sum -c SHA256SUMS.txt
```

---

## 6. Environment Configuration (Rule 72)

- `DOWNLOADS_PATH`: Path to destination folder (default: `./downloads`).
- `APP_DOWNLOADS_PATH`: Application downloads root path.

_Maintained automatically by 2-TEK Workspace Builder & Release Pipeline._
