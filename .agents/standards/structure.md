# Package Architectural Structure Standard: VTek Office Suite

<!-- Standard Specification: Packages/VTekOfficeSuit/.standards/structure.md -->
<!-- Rule Conformance: Rule 64 (Target Immutability) & Rule 68 (Package Standards) -->

## 1. Canonical Purpose & Domain Boundary
- **Canonical Target**: **Unified Electron desktop application shell and multi-platform distribution packager for 2-TEK Office Suite**
- **Designated Port**: `3035`
- **Architectural Scope**: Electron desktop packaging, release artifact generation, distribution pipeline to `downloads/`, and unified suite shell.

## 2. Directory Layout & File Organization
```
packages/VTekOfficeSuit/
├── .standards/           # Local architectural and design standards (Rule 68)
│   ├── structure.md      # Directory layout and module resolution
│   └── designs.md        # Design system, themes, and base components
├── app/                  # Application pages, layouts, and route handlers
├── components/           # Package-specific unshared UI components
│   └── bases/            # Project-isolated Base components (Rule 61)
├── electron/             # Electron desktop main, preload, and runner scripts
├── scripts/              # Desktop distribution packager targeting downloads/
├── styles/               # Theme token classes and layout utilities
├── types/                # Electron window API definitions
├── hub.config.json       # Central Hub launcher manifest
├── package.json          # Package manifest and dependencies
├── README.md             # Canonical app target and domain definition (Rule 64)
└── tsconfig.json         # TypeScript configuration and path aliases
```

## 3. Module Aliases & Path Resolution
All imports within this package must adhere to Rule 58 (Mandatory path aliases starting with `@`):
- `@/*`: Resolves to `packages/VTekOfficeSuit/*`
- `@Shared/*`: Resolves to `packages/Shared/*`
- `@Shared/components/VTekOfficeSuit/bases`: Canonical project-isolated base components and `<IdeIcon>` (Rule 61)
- `@Shared/components/bases`: Universal ecosystem-wide base components and `<IdeIcon>` (Rule 14 & Rule 56)
- `@Shared/types/icons`: Canonical icon type definitions and contracts
- `@Shared/icons`: Ecosystem SVG vector icon assets
- `@/components/bases`: Project-local base components mapped via alias
