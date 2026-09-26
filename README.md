# VTek Office Suite (VTekOfficeSuit)

> **Canonical Target of App**:
> **Dedicated repository strictly used only for saving downloads files only (`use only for save downloads files only`), no script, no handle**.
> _(Kho lưu trữ chuyên dụng chỉ dùng để lưu trữ các tệp tải về và gói phân phối ứng dụng: .deb, .exe, .zip, SHA256SUMS.txt, release-manifest.json — tuyệt đối không chứa logic mã nguồn, không có script, không có trình xử lý)_.

---

## 1. Overview & Architectural Scope

`VTekOfficeSuit` is the dedicated release distribution and downloadable files repository for the 2-TEK ecosystem. It provides:

1. **Centralized Downloads Storage**: A structured, versioned repository storing all pre-built cross-platform application release packages:
   - **Linux**: `.deb` installer packages (Debian / Ubuntu amd64)
   - **Windows**: `.exe` Portable & Setup PE32+ GUI executables
   - **Universal / Portable**: `.zip` standalone application bundles
   - **Integrity Verification**: `SHA256SUMS.txt` cryptographic hashes and `release-manifest.json` release manifests
2. **Zero Code Logic & Zero Scripts (`no script, no handle`)**:
   - Contains no application runtime logic, no build scripts, no execution runners, and no gRPC/service handlers.
   - All compilation, packaging, and release generation are executed externally by workspace tools (`scripts/build.mjs --downloads`) and Builder Bot.
3. **Dedicated Downloads Distribution Hierarchy**: All downloadable packages are organized under:
   `downloads/{projectName}/{version}/{name}.{type}`
   (configured via `DOWNLOADS_PATH` / `APP_DOWNLOADS_PATH` in `.env`).

---

## 2. Directory Structure

```
packages/VTekOfficeSuit/
├── downloads/                # All cross-platform release packages (.deb, .exe, .zip)
│   ├── Hub/                  # 2-TEK Hub Desktop installer packages
│   ├── Word/                 # Document Studio installer packages
│   ├── Excel/                # Spreadsheet Studio installer packages
│   ├── Presentation/         # Presentation installer packages
│   ├── Pdf/                  # PDF Studio installer packages
│   ├── SuperChat/            # SuperChat installer packages
│   ├── Tasks/                # Tasks installer packages
│   ├── Cloud/                # Cloud installer packages
│   └── ...                   # All ecosystem application release packages
├── .agents/                  # Standards, rules, and task changelogs
│   ├── standards/
│   │   ├── structure.md
│   │   └── designs.md
│   └── features/
├── PROJECT_TARGET.md         # Canonical package target & anti-goals (Rule 69)
├── LICENSE                   # MIT License
├── package.json              # Package metadata (downloads storage only, no scripts)
└── README.md                 # Central repository documentation
```

---

## 3. Architectural Boundaries (Rule 69 Conformance)

- **Owner of**: Storing and maintaining cross-platform downloadable release packages, checksums, and manifests under `downloads/`.
- **Strict Anti-Goals**:
  - **Zero Code Logic**: Does NOT contain application code, document processors, or web servers.
  - **No Scripts, No Handles**: Does NOT contain executable build scripts, CLI commands, or service handlers.
  - **Zero User Storage**: Does NOT store user working documents (managed by `packages/Cloud`).
  - **No Desktop Windowing**: Does NOT run desktop Electron windows or service daemon processes.
