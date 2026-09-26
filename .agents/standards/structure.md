# Downloads & Distribution Directory Architecture Specification (Rule 68)

> **Canonical Target**:
> **Dedicated repository strictly used for displaying public projects of 2tek-office-packages, no more, not script, no package.json, just save builded file**.
> _(Kho lưu trữ chuyên dụng được sử dụng duy nhất để hiển thị các dự án công khai của 2tek-office-packages, không có thêm gì khác, không có script, không có package.json, chỉ lưu trữ các tệp đã build)_.
> Every application build and installer binary distributed across the 2-TEK ecosystem MUST be published into this structured directory hierarchy: `{projectName}/{version}/{name}.{type}`.

---

## 1. Directory Structure Blueprint

```
downloads/
├── .git/                                 # Dedicated distribution Git repository
├── .agents/
│   ├── standards/                        # Standards & JSON Schemas (Rule 68)
│   │   ├── structure.md                  # This architecture specification
│   │   ├── designs.md                    # Visual & theme standards (no UI)
│   │   └── download-app-structure-schema.json # JSON Schema for downloads structure
│   ├── features/                         # Feature changelogs & task trackers
│   │   └── 26-09-2026.md
│   └── PROJECT_TARGET.md                 # Canonical target specification (Rule 69)
├── .example/                             # Sample data fixtures (Rule 49)
│   └── download-app-structure-example.json
├── Hub/                                  # 2-TEK Hub Desktop releases
│   └── 1.0.0/
│       ├── Hub-1.0.0.deb                 # Linux Debian package with version endpoint
│       ├── Hub-1.0.0.exe                 # Windows PE32+ GUI installer with version endpoint
│       ├── Hub-1.0.0.zip                 # Universal portable zip with version endpoint
│       ├── 2tek-hub_1.0.0_amd64.deb      # Linux Debian package (amd64)
│       ├── 2tek-hub-setup-1.0.0.exe      # Windows PE32+ GUI installer (x64)
│       ├── 2tek-hub.deb                  # Canonical unversioned copy
│       ├── 2tek-hub.exe                  # Canonical unversioned copy
│       ├── SHA256SUMS.txt                # Cryptographic checksums
│       └── release-manifest.json         # Automated JSON release manifest
├── Word/                                 # Document Studio package
│   └── 1.0.0/
│       ├── Word-1.0.0.deb                # Versioned Linux Debian installer package
│       ├── Word.deb                      # Backward-compatible unversioned alias
│       ├── Word-1.0.0.exe                # Versioned Windows PE32+ GUI installer
│       ├── Word.exe                      # Backward-compatible unversioned alias
│       ├── Word-1.0.0.zip                # Versioned standalone portable application package
│       ├── Word.zip                      # Backward-compatible unversioned alias
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Excel/                                # Spreadsheet Studio package
├── Presentation/                         # Slide Studio package
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
├── PROJECT_TARGET.md                     # Symlink to .agents/PROJECT_TARGET.md
└── README.md                             # Central distribution documentation
```

---

## 2. Invariants & Rules

1. **Path Format**: `{projectName}/{version}/{name}.{type}`
   - `{projectName}`: Canonical project identifier (e.g. `Word`, `Excel`, `Hub`, `SuperChat`).
   - `{version}`: Semantic version without leading 'v' (e.g. `1.0.0`).
   - `{name}.{type}`: Artifact name and extension (`.deb`, `.exe`, `.zip`).
2. **Display Public Projects of 2tek-office-packages**: Shows the public distributions and installers of all ecosystem applications for easy access, installation, and inspection.
3. **No Script, No package.json**: Contains strictly ZERO build scripts, runner scripts, or service handlers. Does NOT contain `package.json`.
4. **Just Save Builded File**: Strictly dedicated to storing compiled distribution binary artifacts, checksums (`SHA256SUMS.txt`), and manifests (`release-manifest.json`).
5. **Standalone Git Repository & Gitlink**: `downloads/` maintains its own independent `.git` directory. The main workspace tracks `downloads/` strictly as a Git gitlink (mode `160000`).
6. **Release Metadata**: Every version directory MUST include `SHA256SUMS.txt` and `release-manifest.json`.
7. **Environment Invariant (Rule 72)**: Governed via `process.env.DOWNLOADS_PATH` and `process.env.APP_DOWNLOADS_PATH` with fallback to `workspaceRoot/downloads`.
8. **Standards in .agents/standards**: All standards and schemas are maintained exclusively in `.agents/standards/`.
