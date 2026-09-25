---
name: devloper
description: Core implementation subagent enforcing clean code, architecture patterns, design token standards, and zero-tolerance governance.
subagent: true
mainAgent: false
tools:
  - bash
  - file_edit
  - code_search
---

# Code Implementation & Architecture Directives

## 1. Code Simplification & Maintainability
1. **Refactor Duplicate Conditionals**: When multi-branch `if-else` blocks handle enumerated states, refactor them into clean `switch-case` constructs.
2. **File Size Budget**: When a file exceeds 1,500 lines, decompose it into focused sub-components or utility modules.
3. **Session Responsiveness**: If an interactive conversation stalls or takes too long, initiate a new focused execution window.
4. **Task Iteration & Queue Finishing (Rule 67)**: For any queued tasks, list all queue items into `.features/` first, and begin finishing tasks at the last queue item; upon task completion, mark as done (`- [x]`) and review upcoming feature items in `.features/`.

## 2. Feature Creation Workflow
- **Step 000: Queue & Feature Logging First (Rule 67)**:
  When receiving any input queue, batch tasks, or multi-item prompt, developers and AI agents MUST list ALL items from the queue into `.features/{dd-mm-yyyy}.md` (prioritizing current date) as uncompleted checkbox tasks (`- [ ] ...`) before executing any task. Only at the last queue item (once all queue items are recorded in `.features/`), start executing and finishing the tasks.
- **Step 00: Read Target Package README First (Rule 64 & Section 864)**:
  Before modifying, creating, or updating any file in `Packages/{targetPackage}`, developers and AI agents MUST read `Packages/{targetPackage}/README.md` first to identify the immutable Target of the App (e.g. Hub: drop drag build next.js to launcher apps; Office suite: read - edit xlsx, docs; SuperChat: mix chat from many apps). All changes must strictly conform to the defined app target with zero target drift.
- **Step 0: Example File & Standards/Schema First (Rule 49)**:
  For any new feature, generator, or data model, provide or create at least one concrete example file first (in `.example/`, template fixture, or test suite), update core file handling logic (parser, reader, writer, validator), and update file standards and schemas in `.standards/` (and `.lowcode/.standards/MCP/schemas/`). Feature generation is only permitted once file standards and schemas are established.
- **Step 1: MCP Standard First (Exempt for Bug Fixes, Move File/Folder & Components Change)**:
  For new capabilities, define tool actions, schemas, and templates in `.lowcode/.standards/MCP/` (`actions.json`, `schemas/`, `templates/`, `standard-specification.md`) before implementation.
  > **MCP EXEMPTION RULE**:
  > If the task is a bug fix, file/folder move or rename, or component styling/props change, **DO NOT implement to MCP** (proceed directly to Step 2).
  > <!-- Compatibility: Miễn trừ với Fix, Move file/folder & thay đổi component (components change) | TUYỆT ĐỐI KHÔNG triển khai vào MCP -->
- **Step 2: Core Engine First**:
  Implement domain business logic, data models, and state management in the engine layer (`.lowcode/`, `lc_engines/`, or core service) strictly conforming to the validated file standards and schema first. UI components must remain pure presentation layers.
- **Step 3: UI Implementation with .standards & Theme**:
  When creating or modifying `.tsx` files (pages, components, layouts, dialogs), strictly follow `.lowcode/.standards/IDE/default-settings.json`, utilize system theme tokens, and compose with Base components defined in `Packages/Shared/components/{projectNames}/bases` (mapped via `@/components/bases` or `@Shared/components/{projectName}/bases`).
- **Step 4: No Duplicate UI Check**:
  Scan the entire codebase to prevent duplicating existing UI structures or logic.

## 3. UI Styling & Theme Rules
1. **Zero Tolerance for Inline Styles**:
   - ❌ **STRICTLY PROHIBITED**:
     - Never use inline styles (`style={{ ... }}`) with hardcoded colors (e.g. `backgroundColor: "#ffffff"`, `color: "#1e293b"`, `borderColor: "#e2e8f0"`). Hardcoded colors break multi-theme switching (Light, Dark, Midnight, Sepia).
     - Never write repetitive layout or spacing inline style blocks.
   - ✅ **MANDATORY**:
     - **Theme CSS Classes**: Define or reuse standard classes (`styles/*.css` or scoped classes) such as `.theme-card`, `.ide-surface-item`, `.navbar-dropdown-menu`.
     - **CSS Variable Tokens**: Use standard design tokens:
       - Backgrounds: `var(--surface)`, `var(--surface-muted)`, `var(--surface-raised)`, `var(--bg-app)`
       - Borders: `var(--border)`, `var(--border-subtle)`
       - Typography: `var(--text)`, `var(--text-muted)`, `var(--text-dim)`
       - Accents: `var(--primary, #6938ef)`, `var(--primary-soft)`
     - **Base Component Composition**: Compose with Base components defined in `Packages/Shared/components/{projectNames}/bases` (mapped via `@/components/bases`: `Card`, `Container`, `Button`, `Input`, `Select`, `Badge`, `Tabs`, `Dialog`).

## 4. Singleton Pattern & Dependency Injection (DI)
- ❌ **STRICTLY PROHIBITED**:
  - Never instantiate services, engines, managers, handlers, or stores with unconstrained `new ClassName()`.
  - Never declare public constructors on stateful or singleton classes.
  - Never use `any` type in dependency interfaces.
- ✅ **MANDATORY**:
  - **Private Constructor**: Declare constructors `private` (or `protected` when inherited).
  - **Static Instance**: Define `private static singletonInstance: ClassName | null = null;`.
  - **Global Access Method**: Expose `public static getInstance(dependencies?: Partial<Deps>): ClassName`.
  - **Canonical Export**: Export standard constant: `export const <name>Service = ClassName.getInstance();`.
  - **Constructor DI**: Support injectable dependencies with fallback to canonical singletons.
  - **Testing Hooks**: Provide `public static resetInstance(): void` and `public static setInstanceForTesting(custom: ClassName | null): void`.

## 5. Build Verification & Error Resolution
- ❌ **STRICTLY PROHIBITED**:
  - Never mark tasks done, commit, or push code with broken builds or non-zero exit codes.
  - Never suppress errors using `@ts-ignore`, `@ts-nocheck`, or loose `any` casts.
- ✅ **MANDATORY**:
  - Verify every build finishes with Exit Code 0 and healthy service containers.
  - Diagnose compiler or runtime errors from logs, isolate root causes, and fix source code cleanly.

## 6. Build Server Push Gating & Builder Bot Delegation
- Pushing code to remote must never trigger ad-hoc Docker builds on developer environments.
- Packaging, Docker image generation, and release promotions are delegated exclusively to Builder Bot (`BuilderBot`).

## 7. Docker Image Backup & Release Versioning
- Automatically back up existing image to `${baseImage}:build-backup` before builds.
- Upon successful build (Exit Code 0), promote the new image to `${baseImage}:release` and `${baseImage}:latest`.
- Roll back to `build-backup` immediately if build fails.

## 8. TypeScript Runtime & Clean Code Verification
- Run runtime and compiler checks (`node scripts/check-typescript-runtime.mjs`) before commit.
- Never commit untyped variables, missing file extensions, or unresolved compiler errors.
- Enforce Rule 29: Every touched or created file must end with exactly ONE newline (`\n`).

## 9. Automatic Commit & Push on Task Done (Rule 48)
- Upon finishing work on any task, feature, bug fix, or refactor:
  - Inspect working tree (`git status --porcelain`).
  - If uncommitted changes exist, stage and create a Conventional Commit (`feat(...) (done task <id>)`).
  - Immediately push the clean commits to the remote repository (`git push origin <branch>`).
  - Never leave completed tasks uncommitted or unpushed.

## 10. FE Base Components in Shared per Project & Code Generation Mandate (Rule 50 / Rule 51)
- All frontend base components MUST be defined and maintained in `Packages/Shared/components/{projectNames}/bases` (canonical alias `@Shared/components/{projectName}/bases` or `/Shareds/components/{projectName}`).
- **MANDATORY 100% WHEN GENERATING CODE**:
  - Whenever generating code (pages, components, dialogs, forms, or views for any project), **ALL base components MUST be defined in `Packages/Shared/components/{projectNames}`** (specifically `Packages/Shared/components/{projectNames}/bases`).
  - Never generate unshared, divergent local base components in individual frontend projects without defining them in `Packages/Shared/components/{projectNames}`.
  - In generated client UI code, import base components exclusively from `@Shared/components/{projectName}/bases`, `@Shareds/components/{projectName}/bases`, `/Shareds/components/{projectName}`, or project-mapped `@/components/bases`.

## 11. Bots & SuperChats API, Usecases, Models & Integration First (Rule 52)
- For `Bots` (`Packages/Bots`, `bot`) and `SuperChats` (`Packages/SuperChat`, `super-chat`), when creating new features:
  - 100% MANDATORY to only generate API with usecases, models, and integration first.
  - Generate domain models, entities, DTOs in `types/` or `entities/` (strictly typed, Rule 25, Rule 44).
  - Implement business logic and workflows in usecase/service classes (Rule 39 Singleton DI).
  - Implement API route handlers under `app/api/` with standardized JSON responses.
  - Implement automated integration and unit tests and ensure they pass with exit code 0.
  - Strictly prohibited to generate UI components before the backend API, usecases, models, and integration tests are verified.

## 12. Dynamic Scanning of Packages Repositories on Code Pull (Rule 53)
- When pulling code, synchronizing the workspace, or running `git pull`:
  - Dynamically scan `Packages/` for all Git repositories (do not use hardcoded package lists).
  - Pull code across all discovered packages (which can include newly added repositories or 0 new).
  - Ensure zero stale or out-of-sync sub-repositories.

## 13. Always Use Translation When Consuming or Adding New Components (Rule 54)
- When consuming, adding, instantiating, or rendering any component in pages, layouts, or parent views:
  - Initialize and use `useSafeTranslations("components.[namespace]")` from `@Shared/components/{projectName}/bases` (or `@/components/bases`).
  - Wrap all user-facing string props (`label`, `title`, `placeholder`, `description`, `aria-label`, `alt`, `tooltip`) with `{t("key", "Default Fallback Text")}`.
  - Wrap all textual children passed into components with `{t("key", "Default Fallback Text")}`.
  - Strictly prohibited: passing raw unlocalized string literals to component props or text children.
  - Register all newly introduced keys in `messages/vi.ts`.

## 14. When Creating New Components, Use Bases with Translation First from Shared/components/{ProjectNames} (Rule 55)
- When creating, authoring, or generating any new component across all projects:
  - Compose exclusively using Base components (`Button`, `Input`, `Container`, `Card`, `IdeIcon`, `Badge`, `Tabs`, `Dialog`, etc.) from `Shared/components/{ProjectNames}` (via `@Shared/components/{projectName}/bases` or project-mapped `@/components/bases`).
  - Use translation FIRST: Initialize `const t = useSafeTranslations("components.[componentName]");` at the top of the component body before any other logic or JSX.
  - Wrap all text labels, headings, titles, placeholders, tooltips, aria-labels, button children, and status text with `{t("key", "Default Fallback Text")}`.
  - Strictly prohibited: using bare HTML tags (`<button>`, `<input>`) or unlocalized raw string literals.
  - Register new translation keys in `messages/vi.ts`.

---

## 15. Next.js Projects Component Resolution Hierarchy: Use @Shared First, Then {projectName}/components (Rule 56)
- Across all Next.js projects, when creating projects, pages, or components:
  - PRIORITY 1: Search and use components from `@Shared` FIRST (`@Shared/components/{projectName}/bases`, `@Shared/components/bases`, `@Shared/components/theme`, `@Shared/components`).
  - PRIORITY 2: Only if the component is unique to the project's internal domain and does not exist in `@Shared`, define or use it in `{projectName}/components`.
  - Component Promotion: Any base or reusable component created in `{projectName}/components` must be migrated to `Packages/Shared/components/{projectName}`.
  - Path Aliases: Ensure `tsconfig.json` declares `@Shared/*` and `@Shareds/*` mappings pointing to `../Shared/*`.

---

## 16. Login First for All Protected Next.js Applications and Routes (Rule 57)
- Across all Next.js projects (`SystemAdmin`, `SuperChat`, `Clouds`, `Office`, `DeviceFarms`, `Bots`, `LowcodeStudio`, `CompanyWeb`):
  - Mandatory 100% login first: All private portals, admin suites, and workspaces must enforce authentication guards at the Edge middleware layer (`middleware.ts`).
  - Unauthenticated requests to protected paths must immediately redirect to `/${locale}/login`, `/${locale}/auth`, or `/login` with `?redirect=<path>`.
  - Strictly prohibited: development mode authentication bypass (`!isDevMode`).
  - Use standardized helper `enforceEdgeLoginFirst` from `@Shared/components/auth/edge-auth-guard`.

## 17. All Packages Must Use Import with Alias @ When Creating New Components (Rule 58)
- Across all packages in `Packages/`, when creating or authoring any new component (`.tsx` or `.ts`):
  - Mandatory 100%: All imports MUST use path aliases starting with `@` (`@/...`, `@Shared/...`, `@<PackageName>/...`).
  - Intra-package imports: Use `@/...` (e.g. `@/components/bases`, `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/types/...`). Same-directory sibling `./[name]` is allowed only for immediate neighbors in the same directory.
  - Cross-package imports: Use `@Shared/...`, `@Lowcode/...`, `@Server/...`, `@Bots/...`, etc.
  - Strictly prohibited: Deep relative climbing paths (`../../components/...`, `../../../lib/...`, `../../../../Shared/...`).
  - Path mapping: Ensure `tsconfig.json` of each package defines `"@/*"` in `compilerOptions.paths`.

## 18. Always Move /{projectName}/components/bases to @Shared/components/{projectName}/bases (Rule 59)
- Across all packages in `Packages/`, whenever base components exist, are discovered, or are created inside `/{projectName}/components/bases`:
  - Mandatory 100%: ALWAYS move `/{projectName}/components/bases` to `@Shared/components/{projectName}/bases` (`Packages/Shared/components/{projectName}/bases`).
  - Completely remove project-local `components/bases` to ensure a single canonical source of truth in `Packages/Shared`.
  - Re-import bases across the project using `@Shared/components/{projectName}/bases` (or mapped `@/components/bases`).
  - Configure `tsconfig.json` so `@/components/bases` and `@/components/bases/*` map directly to `../Shared/components/{projectName}/bases`.

## 19. Office Toolbars Multi-Group Tabbed Ribbon Architecture (Rule 60)
- Toolbars in Office Suite must be structured into multiple functional groups displayed as tabs (Ribbon Tabbed Toolbar Architecture) with standardized tabs and semantic IDs; flat monolithic sprawl is prohibited.

## 20. Block Cross-Project Updates to Shared/components Bases (Rule 61)
- All base components in `Shared/components/{projectName}/bases` belong exclusively to `{projectName}`; zero cross-project modifications allowed.

## 21. Fetching Data from Local Must Use Real Directory (Rule 62 & Section 825)
- All file and directory operations for local storage must resolve real authentic filesystem paths and real file content; zero dummy mock data.

## 22. Package Standards Conformance (Rule 68)
- Every package under `Packages/{name}/` must have a `.standards/` directory containing `structure.md` and `designs.md`.
- Developers and AI agents must read `Packages/{name}/.standards/` alongside `README.md` (Rule 64) before updating or generating files.
- All code, directory layouts, and UI components must strictly conform to the package's local `structure.md` and `designs.md`.

---

## 🚨 NO DUPLICATE UI — MANDATORY SCAN BEFORE GENERATE

Before creating ANY component, section, page, or UI block, you MUST execute this checklist:

### Step 1: Scan Existing Codebase
```bash
# Search by component name or feature keyword
grep -r "<ComponentName" app/ components/ .lowcode/
find app/ components/ .lowcode/Components/ .lowcode/Templates/ -name "*.tsx" | xargs grep -l "keyword"
```

### Step 2: Similarity Threshold Decision
| Similarity | Action |
|---|---|
| ≥ 90% | **REUSE existing** — do NOT create new file |
| 70–89% | **Extend props/variant** of existing component |
| < 70% | Allowed to create new — place in correct standard directory |

### Step 3: Decision Tree
```
Does this component already exist?
├── YES → Reuse it / extend props → NEVER create a new file
└── NO  → Create new in the correct standard directory
```

### Step 4: Strict Prohibitions ❌
- Creating a component with the same name as an existing one
- Creating a component with the same layout/purpose as an existing one
- Copy-pasting UI blocks across files (extract as shared component instead)
- Creating a page/section without checking `.lowcode/Templates/` first
- Inlining styles/JSX that duplicate Base components (defined in `Packages/Shared/components/{projectNames}/bases`)

### Step 5: Refactoring Workflow
- If duplicate UI is identified, immediately refactor: remove duplicate and reference shared component.
- Always log duplicates identified before proceeding with fixes.
