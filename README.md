# 2-TEK Ecosystem & VTek Office Suite — Official Downloads & Distribution Center

> **Official Binary Release Directory Structure**:
> All desktop application packages and release distributions are compiled and published using the canonical app-scoped versioned structure:
> **`downloads/{app}/{version}/{name}.{type}`** _(or `downloads/{projectName}/{version}/{name}.{type}`)_
> _(Thư mục lưu trữ chính thức toàn bộ bộ cài đặt desktop và standalone packages cho các ứng dụng hệ sinh thái 2-TEK và VTek Office Suite theo cấu trúc phân cấp chuẩn theo ứng dụng và phiên bản)_.
>
> 🎯 **Canonical Target**:
> Dedicated repository strictly used for displaying public projects of 2tek-office-packages, no more, not script, no package.json, just save builded file (use for save apps file only).
> _(Kho lưu trữ chuyên dụng được sử dụng duy nhất để hiển thị các dự án công khai của 2tek-office-packages, không có thêm gì khác, không có script, không có package.json, chỉ lưu trữ các tệp đã build — use for save apps file only)_.
>
> 🔒 **Standalone Git Repository (`downloads/.git`)**:
> `downloads/` is an independent, dedicated public project distribution repository. It contains zero source code, zero scripts, and no package.json. All distribution artifacts are built externally and saved here. The main workspace tracks `downloads/` strictly as a Git gitlink (mode `160000`).

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

### 🚀 2-TEK Hub Desktop (`downloads/Hub/{version}/`)

Example path: `downloads/Hub/{version}/{name}.{type}`

| Platform    | Architecture   | Package Format        | Download Path                                                                          | Description                                      |
| ----------- | -------------- | --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Linux**   | x86_64 / amd64 | Debian (`.deb`)       | [`downloads/Hub/1.0.0/2tek-hub_1.0.0_amd64.deb`](./Hub/1.0.0/2tek-hub_1.0.0_amd64.deb) | Native Linux installer for Ubuntu, Debian, Mint. |
| **Linux**   | x86_64 / amd64 | Debian Alias (`.deb`) | [`downloads/Hub/1.0.0/2tek-hub.deb`](./Hub/1.0.0/2tek-hub.deb)                         | Canonical unversioned Debian package alias.      |
| **Windows** | x86_64 / x64   | PE32+ GUI (`.exe`)    | [`downloads/Hub/1.0.0/2tek-hub-setup-1.0.0.exe`](./Hub/1.0.0/2tek-hub-setup-1.0.0.exe) | Portable Windows installer for Windows 10 & 11.  |
| **Windows** | x86_64 / x64   | PE32+ Alias (`.exe`)  | [`downloads/Hub/1.0.0/2tek-hub.exe`](./Hub/1.0.0/2tek-hub.exe)                         | Canonical unversioned Windows executable alias.  |
| **All**     | Verification   | SHA-256 Hashes        | [`downloads/Hub/1.0.0/SHA256SUMS.txt`](./Hub/1.0.0/SHA256SUMS.txt)                     | SHA-256 checksums for Hub packages.              |
| **All**     | Metadata       | JSON Manifest         | [`downloads/Hub/1.0.0/release-manifest.json`](./Hub/1.0.0/release-manifest.json)       | Release metadata and file sizes.                 |

### 📝 Word Document Studio (`downloads/Word/{version}/`)

Example path: `downloads/Word/{version}/{name}.{type}`

| Platform    | Architecture   | Package Format     | Download Path                                                     | Description                                   |
| ----------- | -------------- | ------------------ | ----------------------------------------------------------------- | --------------------------------------------- |
| **Linux**   | x86_64 / amd64 | Debian (`.deb`)    | [`downloads/Word/1.0.0/Word.deb`](./Word/1.0.0/Word.deb)         | Native desktop installer for Word Studio.     |
| **Windows** | x86_64 / x64   | PE32+ GUI (`.exe`) | [`downloads/Word/1.0.0/Word.exe`](./Word/1.0.0/Word.exe)         | Windows standalone document editor executable. |
| **All**     | Verification   | SHA-256 Hashes     | [`downloads/Word/1.0.0/SHA256SUMS.txt`](./Word/1.0.0/SHA256SUMS.txt) | SHA-256 checksums for Word Studio packages.   |
| **All**     | Metadata       | JSON Manifest      | [`downloads/Word/1.0.0/release-manifest.json`](./Word/1.0.0/release-manifest.json) | Release metadata and package records.         |

---

## 3. Installation Instructions

### 🐧 Linux (Ubuntu, Debian, Mint)

```bash
# Example: Install 2-TEK Hub
sudo apt install ./downloads/Hub/1.0.0/2tek-hub_1.0.0_amd64.deb

# Example: Install Word Document Studio
sudo apt install ./downloads/Word/1.0.0/Word.deb
```

### 🪟 Windows (10 / 11)

1. Navigate to `downloads/{app}/{version}/` (e.g. `downloads/Hub/1.0.0/` or `downloads/Word/1.0.0/`).
2. Double-click the `.exe` installer (e.g. `2tek-hub-setup-1.0.0.exe` or `Word.exe`).
3. The desktop application will launch immediately.

---

## 4. How to Build Desktop Packages to Downloads

```bash
# Build 2-TEK Hub desktop packages to downloads/Hub/{version}/
npm run build:desktop

# Build all workspace project packages to downloads/{projectName}/{version}/
npm run build:all
```

---

## 5. Verification & Integrity

```bash
# Verify Hub packages
cd downloads/Hub/1.0.0 && sha256sum -c SHA256SUMS.txt

# Verify Word packages
cd downloads/Word/1.0.0 && sha256sum -c SHA256SUMS.txt
```

---

## 6. Environment Configuration (Rule 72)

- `DOWNLOADS_PATH`: Path to destination folder (default: `./downloads`).
- `APP_DOWNLOADS_PATH`: Application downloads root path.

_Maintained automatically by 2-TEK Workspace Builder & Release Pipeline._
