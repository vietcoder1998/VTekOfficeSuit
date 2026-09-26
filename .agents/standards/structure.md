# Package Architectural Structure Standard: VTek Office Suite

<!-- Standard Specification: Packages/VTekOfficeSuit/.agents/standards/structure.md -->
<!-- Rule Conformance: Rule 64 (Target Immutability) & Rule 68 (Package Standards) -->

## 1. Canonical Purpose & Domain Boundary
- **Canonical Target**: **Dedicated repository strictly used only for saving downloads files only (`use only for save downloads files only`), no script, no handle**.
- **Domain Scope**: Storage repository for all cross-platform distribution packages (.deb, .exe, .zip), checksums (SHA256SUMS.txt), and release manifests (release-manifest.json) under `downloads/{projectName}/{version}/`.
- **Architectural Policy**: Zero code logic, zero executable scripts, zero execution handlers.

## 2. Directory Layout & File Organization
```
packages/VTekOfficeSuit/
├── downloads/                # All cross-platform release packages (.deb, .exe, .zip)
│   ├── Hub/                  # 2-TEK Hub Desktop releases
│   │   └── 1.0.0/            # Versioned packages (.deb, .exe, SHA256SUMS.txt, release-manifest.json)
│   ├── Word/                 # Word releases
│   ├── Excel/                # Excel releases
│   ├── Presentation/         # Presentation releases
│   ├── Pdf/                  # PDF releases
│   ├── SuperChat/            # SuperChat releases
│   ├── Tasks/                # Tasks releases
│   ├── Cloud/                # Cloud releases
│   ├── .standards/           # Download schemas and structure specifications
│   ├── .example/             # Sample release manifest fixtures
│   ├── PROJECT_TARGET.md     # Downloads canonical target
│   └── README.md             # Downloads directory documentation
├── .agents/                  # Governance, rules, and feature queue
│   ├── standards/
│   │   ├── structure.md      # Directory layout and domain boundaries
│   │   └── designs.md        # Design system specifications
│   ├── rules/                # Package-local rules
│   └── features/             # Daily task changelogs
├── LICENSE                   # MIT License
├── package.json              # Package metadata (no scripts, no handlers)
├── PROJECT_TARGET.md         # Canonical package target & anti-goals (Rule 69)
└── README.md                 # Central package documentation (Rule 64)
```

## 3. Strict Prohibitions & Anti-Goals
1. **Zero Code Logic**: Prohibited to add application runtime source code, components, services, or engines to this package.
2. **No Scripts, No Handles**: Prohibited to add build scripts, package builders, runners, or gRPC/API handlers (`no script, no handle`).
3. **Downloads Storage Only**: Repository exists exclusively for persisting application download packages.

## 4. Module Aliases & Shared Governance
- **Shared Assets**: Documentation and packaging manifests reference shared branding, theme tokens, and icons via `@Shared`.
