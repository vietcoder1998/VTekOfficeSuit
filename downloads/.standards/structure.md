# Downloads & Distribution Directory Architecture Specification

> **Canonical Target**: **Application-Scoped Versioned Download Tree (`downloads/{projectName}/{version}/{name}.{type}`)**
> Every application build and installer binary distributed across the 2-TEK ecosystem MUST be published into this structured directory hierarchy.
> `downloads/` is a dedicated distribution-only repository strictly used for saving application distribution files and desktop installers only (`use for save apps file only`), with its own `.git` repository, linked into the main workspace via a Git gitlink (`160000`). Flat-file sprawl, main-repo binary caching, and the legacy `./download` folder/symlink are strictly prohibited.

---

## 1. Directory Structure Blueprint

```
downloads/
├── .git/                                 # Dedicated distribution Git repository
├── hub/                                  # 2-TEK Hub Desktop releases
│   └── 1.0.0/
│       ├── 2tek-hub_1.0.0_amd64.deb      # Linux Debian package (amd64)
│       ├── 2tek-hub-setup-1.0.0.exe      # Windows PE32+ GUI installer (x64)
│       ├── 2tek-hub.deb                  # Canonical unversioned symlink/copy
│       ├── 2tek-hub.exe                  # Canonical unversioned symlink/copy
│       ├── SHA256SUMS.txt                # Cryptographic checksums
│       └── release-manifest.json         # Automated JSON release manifest
├── Word/                                 # Document Studio package
│   └── 1.0.0/
│       ├── Word.deb                      # Linux Debian installer package (amd64)
│       ├── Word.exe                      # Windows PE32+ GUI installer (x64)
│       ├── Word.zip                      # Standalone portable application package
│       ├── SHA256SUMS.txt
│       └── release-manifest.json
├── Excel/                                # Spreadsheet Studio package
│   └── 1.0.0/
│       ├── Excel.deb                     # Linux Debian installer package (amd64)
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
├── .example/                             # Sample data fixtures (Rule 49)
│   └── download-app-structure-example.json
├── .standards/                           # Standards & JSON Schemas
│   ├── download-app-structure-schema.json
│   └── structure.md
└── README.md                             # Central distribution documentation
```

---

## 2. Invariants & Rules

1. **Path Format**: `downloads/{projectName}/{version}/{name}.{type}`
   - `{projectName}`: Canonical project identifier (e.g. `Word`, `Excel`, `hub`, `vtek-office-suit`).
   - `{version}`: Semantic version without leading 'v' (e.g. `1.0.0`).
   - `{name}.{type}`: Artifact name and extension (`.deb`, `.exe`, `.zip`).
2. **Standalone Git Repository & Gitlink**: `downloads/` maintains its own independent `.git` directory. The main workspace tracks `downloads/` strictly as a Git gitlink (mode `160000`), completely eliminating binary build caches from the primary source tree.
3. **Dedicated App Files Only Target**: `downloads/` is strictly used for saving application distribution files and desktop installers only (`use for save apps file only`). The unused legacy `./download` folder/symlink is completely eliminated and prohibited.
4. **Release Metadata**: Every version directory MUST include `SHA256SUMS.txt` and `release-manifest.json`.
5. **Universal Project Builder**: Running `npm run build:downloads` or `node scripts/build.mjs --downloads` builds all workspace projects directly into `downloads/{projectName}/{version}/{name}.{deb|exe|zip}`.
6. **Environment Invariant (Rule 72)**: Governed via `process.env.DOWNLOADS_PATH` and `process.env.APP_DOWNLOADS_PATH` with fallback to `workspaceRoot/downloads`.
7. **Strictly Zero Unversioned Duplicate Files**: All distribution packages, checksums, and manifests MUST be stored exclusively inside version subdirectories `downloads/{name}/{version}/`. Storing unversioned duplicate files directly in `downloads/{name}/` is strictly prohibited.
