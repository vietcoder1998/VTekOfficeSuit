# downloads — Official Public Projects & Built Files Distribution Target Specification (Rule 69)

> **Canonical Target of App (Repository Target)**:
> **Dedicated repository strictly used for displaying public projects of 2tek-office-packages, no more, not script, no package.json, just save builded file (use for save apps file only)**.
> _(Kho lưu trữ chuyên dụng được sử dụng duy nhất để hiển thị các dự án công khai của 2tek-office-packages, không có thêm gì khác, không có script, không có package.json, chỉ lưu trữ các tệp đã build — use for save apps file only)_.

---

## 1. High-Level Vision & Scope

The `downloads/` repository serves as the official public distribution showcase and persistent binary storage for all applications across the `2tek-office-packages` ecosystem.

1. **Display Public Projects of 2tek-office-packages**:
   - Structured versioned release directories for each public project in the suite:
     - `Hub`: 2-TEK Hub Desktop Application & System Launcher (`.deb`, `.exe`, `.zip`)
     - `OfficePack`: Official Office Suite Services & Setting Portal (`.deb`, `.exe`, `.zip`)
     - `CanvasPack` & `CanvasStudio`: Vector Diagramming & Visual Canvas Engines (`.deb`, `.exe`, `.zip`)
     - `Word`: Document Studio (`.deb`, `.exe`, `.zip`)
     - `Excel`: Spreadsheet Studio (`.deb`, `.exe`, `.zip`)
     - `Presentation`: Presentation & Slide Studio (`.deb`, `.exe`, `.zip`)
     - `Pdf`: PDF Reader & Editor Studio (`.deb`, `.exe`, `.zip`)
     - `Notes`: Note & Memo Taking Studio (`.deb`, `.exe`, `.zip`)
     - `Forms`: Survey & Form Builder Studio (`.deb`, `.exe`, `.zip`)
     - `Antivirus`: Security, Malware Scanner & System Health (`.deb`, `.exe`, `.zip`)
     - `Cloud`: Cloud Storage & Workspace File Sync (`.deb`, `.exe`, `.zip`)
     - `SuperChat`: AI Messaging & Communication Client (`.deb`, `.exe`, `.zip`)
     - `Tasks`: Task, Project & Calendar Planner (`.deb`, `.exe`, `.zip`)
     - `AIAssistant`: Autonomous Copilot Platform (`.deb`, `.exe`, `.zip`)
   - Each project contains structured version subdirectories (`{projectName}/{version}/`) with cryptographic checksums (`SHA256SUMS.txt`) and release manifests (`release-manifest.json`).

2. **Just Save Builded File**:
   - Stores strictly compiled binary packages and installers: `.deb` (Debian/Ubuntu), `.exe` (Windows installer/PE32+), `.zip` (portable bundles), checksums (`SHA256SUMS.txt`), and manifests (`release-manifest.json`).
   - Zero unbuilt raw source code, zero intermediate build artifacts.

3. **No More, Not Script, No package.json**:
   - **No package.json**: This repository is NOT an npm package, has zero npm dependencies, and must never contain `package.json`.
   - **Not Script**: This repository contains strictly ZERO executable build scripts, runner scripts, or service handlers. Packaging, compilation, and synchronization are handled externally by workspace runners or Builder Bot.
   - **No More**: Exclusively limited to displaying public projects and saving built distribution files. No extraneous services, no web servers, no tests.

---

## 2. Directory Hierarchy Blueprint

```
downloads/
├── .agents/
│   ├── standards/
│   │   ├── structure.md                  # Distribution architecture standards
│   │   ├── designs.md                    # Visual & theme standards (no UI)
│   │   └── download-app-structure-schema.json # JSON Schema for downloads structure
│   ├── features/                         # Feature changelogs & task trackers
│   │   └── 26-09-2026.md
│   └── PROJECT_TARGET.md                 # Canonical target specification
├── .example/                             # Sample manifest fixtures (Rule 49)
│   └── download-app-structure-example.json
├── Hub/                                  # 2-TEK Hub Desktop releases
│   └── 1.0.0/
│       ├── 2tek-hub_1.0.0_amd64.deb
│       ├── 2tek-hub-setup-1.0.0.exe
│       ├── 2tek-hub.deb
│       ├── 2tek-hub.exe
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Word/                                 # Word Standalone Package
│   └── 1.0.0/
│       ├── Word.deb
│       ├── Word.exe
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
├── PROJECT_TARGET.md                     # Symlink to .agents/PROJECT_TARGET.md
├── README.md                             # Public distribution guide
└── LICENSE                               # MIT License
```

---

## 3. Strict Anti-Goals & Invariants (Rule 69)

1. **Anti-Goal 1 — Zero Scripts (`not script`)**:
   - Prohibited to have scripts, runners, or handlers inside `downloads/`. Build logic belongs to parent workspace builders.
2. **Anti-Goal 2 — No package.json (`no package.json`)**:
   - Prohibited to have `package.json` in `downloads/`. It is not an npm package.
3. **Anti-Goal 3 — Just Save Builded File**:
   - Strictly reserved for built binary packages and distribution files. Zero source code, zero TypeScript files.
4. **Anti-Goal 4 — Display Public Projects Only (`display public projects of 2tek-office-packages, no more`)**:
   - Strictly reserved for the public projects of 2tek-office-packages. Zero personal files, zero user documents.
