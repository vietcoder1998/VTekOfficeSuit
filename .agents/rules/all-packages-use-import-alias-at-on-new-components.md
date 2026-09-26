# Mandatory Rule: All Packages Must Use Import with Alias @ When Creating New Components (Rule 58)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TẤT CẢ PACKAGES BẮT BUỘC SỬ DỤNG IMPORT VỚI ALIAS @ KHI TẠO COMPONENT MỚI (ALL PACKAGES USE IMPORT ALIAS @ ON NEW COMPONENTS RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 58. **[MANDATORY RULE: FOR ALL PACKAGES, ALWAYS USE IMPORT WITH ALIAS @ WHEN CREATING NEW COMPONENTS (RULE 58)]** -->

> **ZERO TOLERANCE**:
> Across all packages in the 2-TEK workspace (`Packages/SuperChat`, `Packages/OfficePack`, `Packages/Bots`, `Packages/Lowcode`, `Packages/LowcodeStudio`, `Packages/Office`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/Server`, `Packages/Shared`, `Packages/AiAssistant`, etc.) and whenever authoring, scaffolding, refactoring, or generating new components:
> 1. **MANDATORY 100% USE PATH ALIASES STARTING WITH `@` FOR ALL IMPORTS**:
>    - When creating any new component (`.tsx` or `.ts`: pages, layouts, modals, dialogs, cards, buttons, widgets, inspector subpanels, forms, toolbars, or visual UI blocks), developers and AI Agents **MUST** use path aliases starting with `@` for all import specifiers:
>      - **Intra-package imports**: Use `@/...` (e.g. `@/components/bases`, `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/types/...`, `@/messages/...`, `@/sources/...`).
>      - **Immediate same-folder siblings**: Local relative `./[name]` is allowed strictly for immediate child/sibling modules within the identical directory (e.g. `./types`, `./sub-part`).
>      - **Cross-package imports**: Use canonical package aliases starting with `@` (e.g. `@Shared/...`, `@Shared/components/{projectName}/bases`, `@Lowcode/...`, `@Server/...`, `@Bots/...`, `@Office/...`, `@SuperChat/...`, `@OfficePack/...`).
> 2. **STRICTLY PROHIBITED: DEEP RELATIVE CLIMBING IMPORTS (`../../...`)**:
>    - **NEVER** use deep relative path traversal such as `../../components/...`, `../../../lib/...`, `../../../../Shared/...`, `../bases/...`, `../../types/...` when creating new components.
>    - Deep relative imports break refactoring, degrade IDE navigation and auto-imports, create duplicate bundler chunks, and cause path ambiguity when files are relocated.
> 3. **MANDATORY `@` ALIAS CONFIGURATION IN `tsconfig.json`**:
>    - Every package in `Packages/` must declare canonical `@` path mappings in `tsconfig.json` under `compilerOptions.paths`:
>      - `@/*` mapped to package source directory (`./*`, `./sources/*`, etc.).
>      - `@Shared/*` and `@Shared` mapped to `../Shared/*` and `../Shared` (or `.` for Shared).
>      - Cross-package aliases `@<PackageName>/*` mapped to `../<PackageName>/*`.
> 4. **TOOLING & AUTOMATED AUDIT INTEGRATION**:
>    - Standardized and enforced by `scripts/scan-and-alias-imports.ts` (`npm run scan:imports`, `npm run alias:imports`).
>    - AI coding agents (`coder`, `designer`, `leader`, `test-auditor`) must strictly verify that all new components use `@` aliases before certifying any task as completed.

---

## 1. Core Purpose & Architectural Rationale

1. **Refactoring Resilience & Location Agility**:
   - Deep relative paths (`../../../../...`) are fragile and break whenever a component is moved, extracted into a subcomponent, or relocated.
   - Path aliases starting with `@` decouple file location from its dependencies, allowing smooth file movement without updating import ladders.

2. **Clean & Readable Codebase**:
   - `@/components/bases` or `@Shared/components/Hub/bases` is immediately readable, unambiguous, and self-documenting.
   - Developers and AI agents instantly recognize where dependencies originate without counting `../` levels.

3. **Monorepo Uniformity & Bundle Deduplication**:
   - Next.js and Vite bundlers optimize module resolution when aliased uniformly, avoiding duplicate module instantiation caused by conflicting relative path representations.

---

## 2. Comparison Matrix: Prohibited vs. Mandatory

| Scenario | Prohibited Deep Relative Approach ❌ | Mandatory Path Alias Approach ✅ |
|---|---|---|
| Importing Base Components | `import { Button } from "../../../components/bases";` | `import { Button } from "@/components/bases";` |
| Importing Shared Bases | `import { Card } from "../../../../Shared/components/Office/bases";` | `import { Card } from "@Shared/components/Office/bases";` |
| Importing Project Lib/Store | `import { useAuth } from "../../lib/auth-store";` | `import { useAuth } from "@/lib/auth-store";` |
| Importing Hooks/Utils | `import { formatDate } from "../../../utils/date";` | `import { formatDate } from "@/utils/date";` |
| Cross-Package Imports | `import { chatService } from "../../Server/sources/v2/chat";` | `import { chatService } from "@Server/sources/v2/chat";` |
| Immediate Same-Folder Sibling | Allowed only for immediate sibling `./sibling` | Both `./sibling` and `@/...` permitted |

---

## 3. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to use `../` or `../../` climbing imports to access components, bases, lib, utils, or types when authoring new components.
2. ❌ **FORBIDDEN** to import from other packages using relative paths (e.g. `../../Shared/...`, `../../Server/...`). Always use `@Shared/...`, `@Server/...`.
3. ❌ **FORBIDDEN** to omit `"@/*"` in `tsconfig.json` of any package in `Packages/`.
4. ❌ **FORBIDDEN** to bypass `@` alias standards in AI-generated components.
