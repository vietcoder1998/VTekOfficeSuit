# Mandatory Rule: Next.js Projects Component Resolution Hierarchy — Use @Shared First, Then {projectName}/components (Rule 56)

<!-- Compatibility: QUY TẮC BẮT BUỘC: THỨ TỰ ƯU TIÊN COMPONENT CHO CÁC DỰ ÁN NEXT.JS — SỬ DỤNG COMPONENTS TỪ @Shared TRƯỚC TIÊN, SAU ĐÓ MỚI ĐẾN {projectName}/components (RULE 56 — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 56. **[MANDATORY RULE: FOR ALL NEXT.JS PROJECTS, USE COMPONENTS FROM @Shared FIRST, THEN {projectName}/components (RULE 56)]** -->

> **ZERO TOLERANCE**:
> Across all Next.js projects in the 2-TEK workspace (`Packages/LowcodeStudio`, `Packages/Office`, `Packages/Bots`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/SuperChat`, `Packages/OfficePack`, etc.) and whenever scaffolding, initializing, or developing new Next.js projects:
> 1. **MANDATORY 100% PRIORITY 1: USE COMPONENTS FROM `@Shared` FIRST**:
>    - When creating, authoring, or assembling pages, views, layouts, dialogs, forms, or feature modules, developers and AI Agents **MUST** search for and reuse components from `@Shared` FIRST:
>      - Project-isolated base components: `@Shared/components/{projectName}/bases` (or mapped `@/components/bases`).
>      - Common primitives and base components: `@Shared/components/bases` or `@Shared/components`.
>      - Theme providers and utilities: `@Shared/components/theme`.
>    - **STRICTLY PROHIBITED 100%**: Re-implementing, recreating, or copy-pasting existing shared buttons, cards, modals, icons, inputs, toolbars, or theme elements into local project folders.
> 2. **MANDATORY PRIORITY 2: USE `{projectName}/components` ONLY FOR PROJECT-SPECIFIC / UN-SHARED COMPONENTS**:
>    - Only when a component does **NOT** exist in `@Shared` AND represents unique business domain logic, proprietary views, or one-off workflows specific to `{projectName}`:
>      - The component may be defined and consumed within `{projectName}/components` (e.g. `Packages/{projectName}/components/...` or `components/...`).
>    - Every component in `{projectName}/components` must continue to compose exclusively from Base primitives in `@Shared/components/{projectName}/bases` (Rule 55), use IDE theme CSS classes (Rule 18 & 20), semantic IDs (Rule 13), `<IdeIcon>` (Rule 14), and `useSafeTranslations` (Rule 21 & 54).
> 3. **MANDATORY COMPONENT PROMOTION & MOVE TO `@Shared` (RULE 59 ALIGNMENT)**:
>    - If a component initially placed in `{projectName}/components` is determined to be a base primitive or design system component, OR if any base component is placed in `/{projectName}/components/bases`:
>      - **IT MUST ALWAYS BE MOVED** to `Packages/Shared/components/{projectName}/bases` (or `Packages/Shared/components/bases/`), exported via its `index.ts`, and imported back using canonical `@Shared` path aliases (Rule 59).
>      - Project-local `components/bases` directories are strictly prohibited and must be completely removed.
> 4. **MANDATORY NEXT.JS PATH ALIAS CONFIGURATION (`tsconfig.json`)**:
>    - All Next.js projects must declare canonical path mappings in `tsconfig.json`:
>      ```json
>      {
>        "compilerOptions": {
>          "baseUrl": ".",
>          "paths": {
>            "@Shared": ["../Shared"],
>            "@Shared/*": ["../Shared/*"],
>            "@Shareds": ["../Shared"],
>            "@Shareds/*": ["../Shared/*"],
>            "@/components/bases": ["../Shared/components/{projectName}/bases"],
>            "@/components/bases/*": ["../Shared/components/{projectName}/bases/*"]
>          }
>        }
>      }
>      ```
>    - Build configurations (`next.config.mjs` / `next.config.ts`) must support transpilation or monorepo resolution for `@Shared` packages without bundling errors.
> 5. **GOVERNANCE & AUDIT**:
>    - AI coding agents (`coder`, `designer`, `leader`, `test-editor`) must strictly audit component imports: `@Shared` first, `{projectName}/components` second. Zero duplicated UI or divergent local base components.

---

## 1. Core Purpose & Architectural Rationale

1. **Centralized Design System & Zero Duplicate UI (Rule 7)**:
   - Reusing components from `@Shared` guarantees cohesive styling across all 2-TEK Next.js applications (accent `#6938ef`, font `Inter`, 8-pt grid, multi-theme switching).
   - Prevents code divergence and eliminates duplicate maintenance across monorepo packages.

2. **Clear Separation of Concerns**:
   - `@Shared`: Reusable primitives, isolated project bases (`Shared/components/{projectName}/bases`), shared layouts, and theme infrastructure.
   - `{projectName}/components`: Domain-specific assemblies (e.g. `LowcodeStudio/components/editor`, `Office/components/word-toolbar`, `Bots/components/runtime-monitor`).

3. **Deterministic Import Resolution for AI Agents**:
   - When AI agents generate new pages or features in Next.js projects, having an explicit 2-step hierarchy eliminates guesswork: inspect `@Shared` first; only fall back to `{projectName}/components` when no shared solution exists.

---

## 2. Component Resolution Decision Flowchart

```
[Need Component in Next.js Project: {projectName}]
                     │
                     ▼
       ┌───────────────────────────┐
       │ Does component exist in   │
       │ @Shared?                  │
       └─────────────┬─────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
        [YES]                  [NO]
          │                     │
          ▼                     ▼
[Import from @Shared]   ┌───────────────────────────┐
• @Shared/components/   │ Is it a base primitive or │
  {projectName}/bases   │ reusable across packages? │
• @Shared/components/   └─────────────┬─────────────┘
  bases                               │
• @Shared/components/      ┌──────────┴──────────┐
  theme                    ▼                     ▼
                         [YES]                  [NO]
                           │                     │
                           ▼                     ▼
                 [Define in @Shared]   [Define in {projectName}/
                 • Put in Packages/    components]
                   Shared/components/  • Put in project-local
                   {projectName}/bases   components/
                 • Export in index.ts  • Compose using bases
                 • Import via @Shared    from @Shared
```

---

## 3. Comparison Matrix: Prohibited vs. Mandatory

| Scenario | Prohibited Approach ❌ | Mandatory Architecture ✅ |
|---|---|---|
| Using Button or Input | Create local `components/bases/button.tsx` | Import from `@Shared/components/{projectName}/bases` (or `@/components/bases`) |
| Theme Provider / Switcher | Re-implement theme toggler in project | Import from `@Shared/components/theme` or `@Shared/components` |
| Common Modal Dialog | Copy modal code into `components/dialog.tsx` | Import `Modal` / `Dialog` from `@Shared/components/{projectName}/bases` |
| Project-Specific Workflow | Force unnatural abstraction into `@Shared` | Define in `Packages/{projectName}/components/{domain}/` |
| Reusable Component Evolution | Keep generic table component local to project | Promote to `Packages/Shared/components/{projectName}/` |
| Next.js Import Paths | Messy relative paths `../../Shared/components/...` | Clean path aliases `@Shared/components/...` |

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to create local copies of base components that already exist in `@Shared`.
2. ❌ **FORBIDDEN** to import local project components before checking `@Shared`.
3. ❌ **FORBIDDEN** to omit `@Shared/*` and `@Shareds/*` path aliases in any Next.js project `tsconfig.json`.
4. ❌ **FORBIDDEN** to cross-import `{projectName}/components` directly from a different project's local directory (use `@Shared` for cross-package sharing).
5. ❌ **FORBIDDEN** to violate Rule 18/20 (No Inline Styles), Rule 13 (Semantic IDs), Rule 14 (IdeIcon), or Rule 21/54 (Translation) in either `@Shared` or local `{projectName}/components`.
