# Mandatory Rule: Always Define Base in Shared/components as /Shareds/components/{projectName} (FE Rule — Rule 50)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TOÀN BỘ BASE COMPONENTS PHẢI ĐỊNH NGHĨA TRONG Shared/components DƯỚI DẠNG /Shareds/components/{projectName} (PROJECT-ISOLATED SHARED BASE COMPONENTS RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: Rule 51. **[MANDATORY FE RULE: ALWAYS DEFINE BASE IN SHARED/COMPONENTS AS /Shareds/components/{projectName}]** -->

> **ZERO TOLERANCE**:
> Across all Frontend (FE) projects in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/SuperChat`, `Packages/OfficePack`, etc.):
> 1. **MANDATORY 100% DEFINE BASE COMPONENTS IN `Shared/components/{projectName}`**:
>    - All base components (`Button`, `Input`, `Card`, `Modal`, `Dialog`, `IdeIcon`, `Container`, `Table`, `Tabs`, `Sidebar`, `Toast`, `Select`, `Dropdown`, `Combobox`, etc.) MUST be defined and maintained in `Packages/Shared/components/{projectName}/bases` (or `Shared/components/{projectName}/bases`).
>    - Base components must be isolated per project to prevent cross-project style pollution and namespace collisions while centralizing design tokens and primitives within `Packages/Shared`.
> 2. **MANDATORY CANONICAL IMPORT SPECIFIERS & PATH ALIASES**:
>    - All FE components and applications MUST import their base components using project-isolated shared aliases:
>      `import { Button, IdeIcon } from '@Shared/components/{projectName}/bases';`
>      or alias `@Shareds/components/{projectName}/bases` / `/Shareds/components/{projectName}`
>      or project-mapped `@/components/bases` (pointing directly to `../Shared/components/{projectName}/bases`).
>    - Prohibited to use deep messy relative paths (e.g. `../../../../Packages/Shared/...`).
> 3. **STRICT PROHIBITION OF UN-ISOLATED DIVERGENT LOCAL BASES — ALWAYS MOVE TO @Shared (RULE 59 ALIGNMENT)**:
>    - Frontend projects are **STRICTLY FORBIDDEN** from maintaining unshared, diverging local base components in their own `components/bases` directories.
>    - Whenever any base components exist, are discovered, or are created inside `/{projectName}/components/bases`, developers and AI agents **MUST ALWAYS MOVE THEM** to `Packages/Shared/components/{projectName}/bases` (`@Shared/components/{projectName}/bases`) and completely remove the local `components/bases` directory (Rule 59).
>    - All updates, enhancements, bug fixes, or additions to base components must occur in `Packages/Shared/components/{projectName}/bases`.
> 4. **ZERO CROSS-PROJECT BASE CONTAMINATION**:
>    - A project (e.g. `CompanyWeb`) must never import directly from another project's isolated bases (e.g. `Shared/components/Office/bases`). Every project uses its designated `{projectName}` folder.
> 5. **MANDATORY 100% ALL BASE COMPONENTS WHEN GENERATING CODE DEFINED IN `Packages/Shared/components/{projectNames}`**:
>    - Whenever code generation is performed (by AI coding agents `devloper`, `coder`, `designer`, `leader`, code generation tools, scaffolding scripts, AST compilers, or developers):
>      - **ALL base components MUST be defined in `Packages/Shared/components/{projectNames}`** (specifically under `Packages/Shared/components/{projectNames}/bases` or `Packages/Shared/components/{projectNames}`).
>      - **STRICTLY PROHIBITED**: Generating base components directly into project-local directories (`Packages/{projectName}/components/bases`, `app/components/bases`, `src/components/bases`) as unshared local files.
>      - If a generated UI component, view, or feature requires a new base component or an extension of an existing base component, the generator **MUST** create or update that base component inside `Packages/Shared/components/{projectNames}/bases`, export it via `Packages/Shared/components/{projectNames}/index.ts`, and import it into the generated code using `@Shared/components/{projectName}/bases` (or `@Shareds/components/{projectName}/bases` / `/Shareds/components/{projectName}`).
>      - When generating frontend code for any project in `Packages/` (`Apps`, `Office`, `LowcodeStudio`, `Bots`, `SuperChat`, `OfficePack`, `Lowcode`, `Clouds`, `DeviceFarms`, or any newly added package), the code generator must target that project's corresponding directory in `Packages/Shared/components/{projectNames}`.

---

## 1. Core Purpose & Architectural Rationale

1. **Clean Project Isolation with Centralized Code Governance**:
   - Different 2-TEK frontend applications serve distinct domains (e.g. `Office` is an office suite editor, `LowcodeStudio` is an IDE canvas, `Apps` is a web app combo, `Bots` is a production control hub per Rule 46).
   - Providing each project with an isolated base components folder (`Shared/components/{projectName}/bases`) ensures domain-specific variants, layouts, and adaptations can evolve without risk of breaking other frontend projects.

2. **Single Source of Truth in `Packages/Shared`**:
   - Placing all frontend base components under `Packages/Shared` allows shared CI/CD, centralized typing, unified linting, and reusable bundling.
   - Shared library changes are easily versioned, tested, and audited across the monorepo.

3. **Optimized for AI Coding Agents & IDE Navigation**:
   - Clear deterministic paths like `@Shared/components/{projectName}/bases` or `/Shareds/components/{projectName}` allow AI agents (`devloper`, `designer`, `coder`) to instantly locate and update components without confusion.

---

## 2. Standard Directory Layout in Packages/Shared

```
Packages/Shared/components/
├── Apps/
│   ├── bases/                     # Isolated base components for Apps
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── ide-icon.tsx
│   │   └── index.ts
│   └── website/                   # Apps website-specific shared primitives
├── Office/
│   └── bases/                     # Isolated base components for Office
│       ├── button.tsx
│       ├── code-editor.tsx
│       ├── terminal.tsx
│       └── index.ts
├── LowcodeStudio/
│   └── bases/                     # Isolated base components for LowcodeStudio
│       ├── button.tsx
│       ├── container.tsx
│       ├── modal.tsx
│       └── index.ts
├── Bots/
│   └── bases/                     # Isolated base components for Bots
│       ├── button.tsx
│       ├── terminal.tsx
│       └── index.ts
├── Clouds/
│   └── bases/                     # Isolated base components for Clouds
│       └── index.ts
├── DeviceFarms/
│   └── bases/                     # Isolated base components for DeviceFarms
│       └── index.ts
├── bases/                         # Universal common primitives (fallback)
├── theme/                         # Theme providers and theme switchers
└── index.ts                       # Shared components umbrella barrel
```

---

## 3. Standard Path Aliases Matrix

| Specifier / Alias Pattern | Target Resolution | Scope / Usage |
|---|---|---|
| `@Shared/components/{projectName}/bases` | `Packages/Shared/components/{projectName}/bases` | Primary canonical import across all FE projects |
| `@Shareds/components/{projectName}/bases` | `Packages/Shared/components/{projectName}/bases` | Standard alias supported in all `tsconfig.json` |
| `/Shareds/components/{projectName}` | `Packages/Shared/components/{projectName}` | Root-relative resolution / Vite / Webpack alias |
| `@/components/bases` | `../Shared/components/{projectName}/bases` | Internal project alias mapped in `tsconfig.json` |
| `@Shared/*` & `@Shareds/*` | `./Packages/Shared/*` | Global package-level alias |

---

## 4. Mandatory tsconfig.json Configuration

All frontend packages must declare the following path mappings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@Shared": ["../Shared"],
      "@Shared/*": ["../Shared/*"],
      "@Shareds": ["../Shared"],
      "@Shareds/*": ["../Shared/*"],
      "@/components/bases": ["../Shared/components/{projectName}/bases"],
      "@/components/bases/*": ["../Shared/components/{projectName}/bases/*"],
      "@Shared/components/{projectName}/bases": ["../Shared/components/{projectName}/bases"],
      "@Shared/components/{projectName}/bases/*": ["../Shared/components/{projectName}/bases/*"],
      "@Shareds/components/{projectName}/bases": ["../Shared/components/{projectName}/bases"],
      "@Shareds/components/{projectName}/bases/*": ["../Shared/components/{projectName}/bases/*"]
    }
  }
}
```

---

## 5. Code Generation Workflow for Base Components (Zero Divergence)

When generating code (by AI coding assistants, code generators, UI scaffolding engines, AST generators, or developers):

```
[Trigger Code Generation for Project: {projectName}]
                     │
                     ▼
[Step 1: Check Required Base Components]
• Does the generated code need Button, Input, Card, Modal, Dialog, IdeIcon, etc.?
• Does Packages/Shared/components/{projectNames}/bases exist and have the component?
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [Already Exists]        [Missing or Needs Extension]
         │                       │
         │                       ▼
         │             [Generate / Define Base Component]
         │             • Create in Packages/Shared/components/{projectNames}/bases/
         │             • Comply with Rule 14 (IdeIcon), Rule 18/20 (Theme Classes)
         │             • Comply with Rule 13 (Default ID), Rule 44 (: Type =)
         │             • Export from {projectNames}/bases/index.ts
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
[Step 2: Generate UI / Client Feature Code]
• In generated code, import base components from:
  import { Button, IdeIcon } from '@Shared/components/{projectName}/bases';
  (or @Shareds/components/{projectName}/bases, or mapped @/components/bases)
• NEVER import from project-local components/bases
• NEVER cross-import from other projects' shared bases
```

---

## 6. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to retain or maintain base components in project-local directories (`/{projectName}/components/bases`); all local base components must always be moved to `Packages/Shared/components/{projectName}/bases` (Rule 59).
2. ❌ **FORBIDDEN** to dump base components into a flat monolithic `Shared/components/bases` folder when they are specific to a project.
3. ❌ **FORBIDDEN** to cross-import bases between different projects (e.g. `CompanyWeb` importing `@Shared/components/Office/bases` or vice versa).
4. ❌ **FORBIDDEN** to use deep relative imports (e.g. `../../../../Shared/components/CompanyWeb/bases/button`) instead of standard `@Shared/*` or `@Shareds/*` aliases.
5. ❌ **FORBIDDEN** to violate Rule 14 (IdeIcon), Rule 18/20 (No Inline Styles), Rule 13 (Default ID), or Rule 21/37 (i18n) within any shared base component.
6. ❌ **FORBIDDEN** when generating code to output base components into project-local directories (`Packages/{projectName}/components/bases`, `app/components/bases`) instead of `Packages/Shared/components/{projectNames}`.
7. ❌ **FORBIDDEN** for any AI agent or code generator to produce client imports pointing to non-canonical or divergent base component paths.
