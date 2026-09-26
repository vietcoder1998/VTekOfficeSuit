# Mandatory Rule: Always Move /{projectName}/components/bases to @Shared/components/{projectName}/bases (Rule 59)

<!-- Compatibility: QUY TẮC BẮT BUỘC: LUÔN DI CHUYỂN /{projectName}/components/bases SANG @Shared/components/{projectName}/bases (ALWAYS MOVE PROJECT BASES TO SHARED BASES RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 59. **[MANDATORY RULE: ALWAYS MOVE /{projectName}/components/bases TO @Shared/components/{projectName}/bases (RULE 59)]** -->

> **ZERO TOLERANCE**:
> Across all packages and projects in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/SuperChat`, `Packages/OfficePack`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/AiAssistant`, `Packages/Server`, `Packages/Shared`, etc.):
> 1. **MANDATORY 100% MOVE `/{projectName}/components/bases` TO `@Shared/components/{projectName}/bases`**:
>    - Whenever any base components exist, are discovered, or are created inside a project-local `components/bases` directory (`/{projectName}/components/bases`, `Packages/{projectName}/components/bases`, `app/components/bases`, `src/components/bases`), developers, AI Agents, refactoring tools, and code generators **MUST ALWAYS MOVE THEM** to `@Shared/components/{projectName}/bases` (`Packages/Shared/components/{projectName}/bases`).
>    - No base components (`Button`, `Input`, `Card`, `Modal`, `Dialog`, `IdeIcon`, `Container`, `Table`, `Tabs`, `Sidebar`, `Toast`, `Select`, `Dropdown`, `Combobox`, `Skeleton`, `LogViewer`, `CommonMenu`, etc.) are permitted to remain or reside in project-local `components/bases`.
> 2. **STRICTLY PROHIBITED TO RETAIN OR MAINTAIN PROJECT-LOCAL `components/bases`**:
>    - Strictly prohibited to keep, duplicate, or maintain unshared, diverging local base components in `/{projectName}/components/bases`.
>    - Once moved to `@Shared/components/{projectName}/bases`, the project-local `components/bases` directory must be completely removed, ensuring a single source of truth in `Packages/Shared/components/{projectName}/bases`.
> 3. **MANDATORY RE-IMPORT AND CANONICAL IMPORT SPECIFIERS**:
>    - All project files and components consuming those bases must update their imports to canonical `@Shared` path aliases:
>      `import { Button, IdeIcon } from '@Shared/components/{projectName}/bases';`
>      or the project's tsconfig-mapped alias `@/components/bases` (which maps directly to `../Shared/components/{projectName}/bases`).
>    - Deep relative climbing paths (e.g. `../../../../Packages/Shared/...`) remain strictly prohibited under Rule 58.
> 4. **MANDATORY TSCONFIG PATH ALIAS MAPPING**:
>    - In every project `tsconfig.json`, `@/components/bases` and `@/components/bases/*` must map directly to `../Shared/components/{projectName}/bases` and `../Shared/components/{projectName}/bases/*`.
> 5. **MANDATORY COMPLIANCE IN CODE GENERATION & AGENT WORKFLOWS**:
>    - AI coding agents (`devloper`, `coder`, `designer`, `leader`, `test-editor`) must never leave base components in local `components/bases`. Any detected local base folder must be immediately migrated to `@Shared/components/{projectName}/bases`.

---

## 1. Core Purpose & Architectural Rationale

1. **Elimination of UI Fragmentation & Out-of-Sync Local Primitives**:
   - Allowing projects to retain unshared local copies of base components in `/{projectName}/components/bases` inevitably leads to divergent implementations, broken theming, missing translations, and duplicate styling.
   - Forcing every project to move its base components to `Packages/Shared/components/{projectName}/bases` ensures centralized maintenance, universal compliance with IDE Theme tokens, and zero code drift.

2. **Single Source of Truth in `Packages/Shared`**:
   - Each project maintains its project-isolated base directory in `Packages/Shared/components/{projectName}/bases` (complying with Rule 50/51).
   - This prevents cross-project style contamination while allowing the entire monorepo to benefit from centralized tooling, type checking, and translation guards.

3. **Deterministic Resolution for AI Agents**:
   - AI coding assistants often get confused when both `Packages/{projectName}/components/bases` and `Packages/Shared/components/{projectName}/bases` exist.
   - Enforcing Rule 59 guarantees that there is strictly ONE place where base components reside: `@Shared/components/{projectName}/bases`.

---

## 2. Migration Protocol: Moving Local Bases to Shared

Whenever a project has or introduces `/{projectName}/components/bases`:

```
[Local Base Components Found in /{projectName}/components/bases]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Ensure Target Directory Exists                      │
│ • Packages/Shared/components/{projectName}/bases/           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Move / Merge Files into Shared                      │
│ • Move all base component files (.tsx, .ts, .css)          │
│ • Update Packages/Shared/components/{projectName}/bases/    │
│   index.ts to export all primitives                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Remove Local components/bases Folder                │
│ • Delete /{projectName}/components/bases                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Configure tsconfig.json Path Alias                  │
│ • "@/components/bases":                                     │
│   ["../Shared/components/{projectName}/bases"]              │
│ • "@/components/bases/*":                                   │
│   ["../Shared/components/{projectName}/bases/*"]            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Update Imports Across the Project                   │
│ • Use @Shared/components/{projectName}/bases or             │
│   mapped @/components/bases                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Standard Path Aliases Matrix

| Import Pattern | Target Resolution | Permitted / Prohibited |
|---|---|---|
| `import { Button } from '@Shared/components/{projectName}/bases';` | `Packages/Shared/components/{projectName}/bases` | ✅ **MANDATORY CANONICAL** |
| `import { Button } from '@/components/bases';` (mapped via tsconfig) | `../Shared/components/{projectName}/bases` | ✅ **MANDATORY MAPPED** |
| `import { Button } from './components/bases';` (local folder) | Project-local `components/bases` | ❌ **STRICTLY PROHIBITED** |
| `import { Button } from '../../../components/bases';` | Deep relative local climbing path | ❌ **STRICTLY PROHIBITED** |

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to retain or maintain `components/bases` within any project directory (`/{projectName}/components/bases`).
2. ❌ **FORBIDDEN** to create new base components inside project-local `components/bases` instead of `Packages/Shared/components/{projectName}/bases`.
3. ❌ **FORBIDDEN** to leave local `components/bases` un-migrated when refactoring, editing, or touching a project.
4. ❌ **FORBIDDEN** to omit the `@/components/bases` -> `../Shared/components/{projectName}/bases` mapping in `tsconfig.json`.
5. ❌ **FORBIDDEN** to import base components from unshared local relative paths.
