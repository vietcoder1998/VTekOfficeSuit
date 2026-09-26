---
trigger: always_on
---

1. **[MANDATORY WORKFLOW FOR CREATING NEW FEATURES — MCP FIRST (EXEMPTION FOR BUG FIXES, MOVE/RENAME & COMPONENT CHANGES)]**:
   <!-- Compatibility: QUY TRÌNH BẮT BUỘC KHI TẠO FEATURE MỚI — MCP FIRST (MIỄN TRỪ VỚI FIX, MOVE FILE/FOLDER & COMPONENTS CHANGE) -->
   - **MCP EXEMPTION RULE — ZERO TOLERANCE**:
     - **For Bug Fixes, File/Folder Moves or Renames, and Component Changes (`thay đổi component / UI modifications / styling / props / subcomponents`)**: **STRICTLY PROHIBITED TO IMPLEMENT TO MCP** (`TUYỆT ĐỐI KHÔNG ĐƯỢC triển khai vào MCP` — do not implement to MCP, do not add actions to `Lowcode/.agents/standards/MCP/actions.json`, do not generate JSON Schemas or templates, and do not add MCP sections in `standard-specification.md`). Bypass Step 1 (MCP First), proceed directly to Step 2 (Engine First / UI Component), and execute the bug fix, file move, or component update.
     - **Else (New Features, Tools, Services, or Capabilities)**: **100% MANDATORY to implement MCP Standard first** following these sequential steps:
       - **Step 0 — Example File & Standards/Schema First (Rule 49)**: Mandatory to have at least one concrete example file first (sample data, template fixture, mock file in `.example/` or test suites), update core file handling logic to ingest and validate the format, and update file standards and schemas in `.agents/standards/` (and `Lowcode/.agents/standards/MCP/schemas/`) BEFORE allowing feature generation.
       - **Step 1 — Register MCP Standard First (MCP FIRST)**: Mandatory to register and define tools, actions, payload schemas, and templates in `Lowcode/.agents/standards/MCP/` (`actions.json`, `schemas/`, `templates/`, `standard-specification.md`) BEFORE implementation.
       - **Step 2 — Complete .lowcode Core Engine / Backend Service FIRST**: Mandatory to design, implement, and verify all core logic, state machines, validators, and core services in the `Lowcode/` engine layer (`Lowcode/`, `lc_engines/`, or core service logic) strictly conforming to the validated file standards and schemas BEFORE writing any UI code. The UI layer serves purely as presentation and trigger (display only / pure presentation).
       - **Step 3 — Develop UI / .tsx Conforming to .agents/standards & Theme**: Construct interface elements with complete reference to `Lowcode/.agents/standards/*` (particularly `Lowcode/.agents/standards/IDE/default-settings.json`, `Lowcode/.agents/standards/UI/*`), applying system themes (Accent `#6938ef`, font `Inter`, 8-pt grid, dark/light surface), and composing exclusively from Base components `app/components/bases/*.tsx`.
       - **Step 4 — Verify No Duplicate UI**: Scan the entire codebase to ensure no duplicate UI is introduced as mandated by Rule 7 below.
2. When creating sample components for templates, place them in `.example/Templates` or `Lowcode/Components`.
3. For Design and UI creation tasks (`.tsx`), mandatory to follow IDE standards and themes in `Lowcode/.agents/standards/IDE/*` (`default-settings.json`, `standard-specification.md`) combined with `Lowcode/.agents/standards/UI/*` to ensure uniform code and CSS styling.
4. When modifications occur in `Lowcode/.agents/standards/UI/*` or `Lowcode/.agents/standards/IDE/*`, automatically scan all `app/*`, `components/*`, `*.css` files to synchronize theme tokens with `.agents/standards`.
5. Automatically permit `git *`, `python *`, `python3 *`, `pip *`, `pip3 *`, `pytest *`, `npm *`, `node *` commands for browsers and AI coding agents.
6. All new and updated components and `.tsx` files must comply with IDE Standards (`Lowcode/.agents/standards/IDE/*` & `Lowcode/.agents/standards/*`) with the default theme (`default-settings.json`), and must compose exclusively from Base components in `app/components/bases/*.tsx` (`Button`, `Input`, `Select`, `Dialog`, `Modal`, `Container`, `Card`, `Badge`, `Tabs`, `Switch`, `Tooltip`, `Dropdown`, etc.).
7. **[NO DUPLICATE UI — ZERO TOLERANCE]** Strictly prohibited to generate duplicate UI components. This rule is absolute and cannot be bypassed.

   ### 🔍 MANDATORY PRE-CREATION AUDIT FOR ANY COMPONENT/UI:

   **Step 1 — Codebase Scan:**

   ```
   Scan: app/, components/, Lowcode/Components/, .example/Templates/
   Search: Existing components with similar names, layouts, or purposes
   Tools: grep/search by identifier, props, and functionality
   ```

   **Step 2 — Similarity Assessment:**
   - Similarity >= 90% -> **MANDATORY REUSE**, do NOT create a new file
   - Similarity 70-89% -> **Extend props/variants** of existing component
   - Similarity < 70% -> Allowed to create new component in modular directory

   **Step 3 — Decision Gate:**

   ```
   Does this component already exist?
   |-- YES -> Reuse / Extend props -> DO NOT create new file
   +-- NO  -> Create new component in modular directory
   ```

   **Step 4 — Prohibited Practices:**
   - ❌ Creating a new component with the same name as an existing component
   - ❌ Creating a new component with the same layout or functional scope
   - ❌ Copy-pasting UI blocks across multiple files (extract into shared component)
   - ❌ Creating pages or sections without checking `.example/Templates/`
   - ❌ Duplicate inline JSX styles already covered by Base components (`app/components/bases/*.tsx`)

   **Step 5 — Refactoring Protocol:**
   - When duplicate UI is discovered, refactor immediately: delete duplicate and reference shared component.
   - Document detected duplicates before applying fixes.

8. When more than 10 tabs are opened in VSCode, run `Ctrl K + Ctrl W` to close all tabs.
9. **[LOWCODE ENGINE-FIRST PRINCIPLE — MANDATORY]**: When building or enhancing any feature, domain business logic, state machines, and core algorithms must be finalized in the Core Engine (`Lowcode/` engine, `lc_engines`, stores, core services) FIRST. The UI layer serves strictly as presentation and event dispatchers (display only / pure presentation); zero core business logic belongs in UI components.
10. All new components and `.tsx` files must inherit color tokens, typography, spacing, and visual effects from `Lowcode/.agents/standards/IDE/` and Base components.
11. **[STANDARD FOR CREATING .TSX FILES ACCORDING TO .agents/standards/IDE THEME]**:
    - When creating any `.tsx` file (Page, Component, Modal, Layout, Widget):
      - **Theme Colors**: Must use tokens from `Lowcode/.agents/standards/IDE/default-settings.json` (Accent: `#6938ef`, Primary: `var(--primary, #6938ef)`, Border: `var(--border, #e2e8f0)`, Text Muted: `var(--text-muted, #64748b)`, Surfaces compatible with Light, Dark, Midnight, and Sepia themes).
      - **Typography**: Standard font `Inter, sans-serif`, density size `11px - 13px` (`uiFontSize: "normal"`).
      - **Spacing & 8-pt Grid**: Adhere to 8px grid intervals (`snapToGrid: 8`, margin/padding `8px`, `16px`, `24px`; micro-spacing `4px`, `6px`).
      - **Base Component Composition**: Compose from `app/components/bases/*.tsx` (`Button`, `Input`, `Select`, `Dialog`, `Modal`, `Container`, `Card`, `Badge`, `Tabs`, `Switch`, `Tooltip`, `Dropdown`); avoid bare HTML tags with repetitive styling.
      - **Visual Effects**: Glassmorphism (`backdrop-filter: blur(...)`), standard border radii `6px - 8px`, smooth transitions `0.15s ease`.
12. **[PROHIBITED INLINE STYLES FOR THEME/SYSTEM — MANDATORY CSS CLASSES FOR THEMES]**:
    - **Strictly Prohibited**: Never use inline styles (`style={{ ... }}`) with hardcoded colors (e.g. `backgroundColor: "#ffffff"`, `color: "#1e293b"`, `borderColor: "#e2e8f0"`) for components, modals, navbars, dropdowns, or list items.
    - **Mandatory**: Use semantic Theme CSS classes with system CSS variables (`var(--surface)`, `var(--surface-muted)`, `var(--border)`, `var(--text)`, `var(--primary)`), pass `data-theme={effectiveTheme}` and `${effectiveTheme}-theme` at container levels, and compose 100% with Base components `app/components/bases/*.tsx`.
13. **[MANDATORY ID ATTRIBUTE ON DIV OR CONTAINER (DEFAULT ADD ID FOR DIV/CONTAINER)]**:
    - When creating any HTML `<div>` or Base `Container` / `Div` component (`<Container>`, `<Div>`, `<DivRow>`, `<DivCol>`, `<DivCenter>`, `<DivBetween>`, `<DivGrid>`, `<DivCard>`, `<DivPanel>`, etc.) in `.tsx` files:
      - **MANDATORY**: Assign a unique, descriptive kebab-case semantic ID (e.g. `<div id="project-list-header">`, `<Container id="dashboard-stats-container">`).
      - Never create anonymous `<div>` or `Container` elements without an `id`.
      - IDs are required for automated testing (E2E / Playwright / Vitest), element inspection in LowCode Canvas Inspector / Virtual Browser, SEO optimization, and Accessibility (ARIA) tracking.
      - Base components provide an automated fallback via `React.useId()` to ensure an ID is rendered even if not explicitly passed.
14. **[MANDATORY USE OF IDE ICONS FOR ALL NEW COMPONENTS (ALWAYS USE IDE ICON RULE)]**:
    - When creating or updating any component, UI interface (`.tsx`), button (`Button`), card (`Card`), label (`Label`), tab (`Tabs`), menu item, modal dialog, inspector subpanel, or UI block:
      - **100% MANDATORY** to use `<IdeIcon>` from `@/components/bases` (or direct Lucide vector SVG icons conforming to IDE standards).
      - **Strictly Prohibited** to use raw emojis (e.g. `📊`, `📈`, `✨`, `⚙️`, `➡️`, `🔔`, `🚫`, `🔒`, `⚡`, `🔍`, `🎾`, `🔄`, `📦`, `📱`, `🌐`, `🧱`, `📏`, `🔠`) or crude text symbols as interface iconography.
      - All IDE icons are centrally managed by core engine `LcIdeIconEngine` (`Lowcode/lc-ide-icon-engine.ts`), registered in `lc_engines.ideIcon`, and integrated into MCP (`Lowcode/.agents/standards/MCP/schemas/ide-icon.schema.json`).
      - Icon colors must inherit from theme tokens (`currentColor` or `var(--primary, #6938ef)`), with standard preset sizes (`xs`, `sm`, `md`, `lg`, `xl`).
15. **[MANDATORY STRICT USER-DEFINED UI — ZERO UNSOLICITED UI & NO DUPLICATION (STRICT USER-DEFINED UI RULE)]**:
    - When developing or updating UI features:
      - **MANDATORY**: Only construct UI components, buttons, tabs, dropdowns, dialogs, forms, and controls that are **DIRECTLY AND EXPLICITLY REQUESTED BY THE USER**.
      - **ZERO TOLERANCE**: Never invent speculative features, auxiliary buttons, unrequested tabs, extra settings panels, or bloated UI (no unsolicited buttons like Settings, Share, Export, Filter, Refresh, Help, More Options...).
      - **NO DUPLICATE UI**: Never duplicate controls already present in the Toolbar, Sidebar, Subbar, Bottom Bar, or Detail Right Bar. Every functionality must have exactly one clear point of interaction.
      - **3-Step Pre-Implementation Gate**:
        - _Step 1 (User Spec Check)_: Did the user request this element? If NO -> DO NOT CREATE.
        - _Step 2 (Anti-Duplication Scan)_: Does this capability exist elsewhere? If YES -> DO NOT DUPLICATE.
        - _Step 3 (Bloat Cleanup)_: Are there extraneous elements not serving the spec? If YES -> REMOVE IMMEDIATELY.
      - Governed by `LcStrictUserDefinedUiEngine` (`Lowcode/lc-strict-user-defined-ui-engine.ts`, `lc_engines.strictUiScope`) and MCP action `enforce_strict_user_defined_ui_no_bloat`.
16. **[MANDATORY DECOMPOSITION OF LONG FILES INTO SUB-COMPONENTS & MODULES (BREAK LONG FILES INTO MULTI-COMPONENTS RULE)]**:
    - When creating or refactoring components, UI files (`.tsx`), modals, or logic files (`.ts`):
      - **LINE COUNT THRESHOLDS**:
        - _Optimal_: `< 300 lines` — Single Responsibility Principle.
        - _Warning_: `400 - 500 lines` — Plan decomposition.
        - _Hard Limit (ZERO TOLERANCE)_: `> 500 lines` for React `.tsx` (and `> 700 lines` for Core Engine `.ts`) — **100% MANDATORY TO DECOMPOSE**.
      - **DECOMPOSITION STANDARDS**:
        - _UI Section Extraction_: Extract `[component]-header.tsx`, `[component]-body.tsx`, `[component]-footer.tsx`, `[component]-item.tsx`.
        - _Modal / Dialog Separation_: 100% of modals and dialogs must reside in standalone `.tsx` files; never embed hundreds of lines of modal JSX inline.
        - _State & Logic Isolation_: Extract custom hooks (`use[Feature]State.ts`) for complex state; move calculation logic to `Lowcode/` core engine; isolate `types.ts` for data contracts.
        - _Modular Folder Structure_: Group sub-components in a dedicated folder with clean barrel export `index.ts`.
      - Governed by `LcBreakLongFileComponentsEngine` (`Lowcode/lc-break-long-file-components-engine.ts`, `lc_engines.breakLongFile`).
17. **[MANDATORY SINGLE SCREEN NO DUPLICATE FUNCTION (SINGLE SCREEN NO DUPLICATE FUNCTION RULE — ZERO TOLERANCE)]**:
    - Within the same screen, page, workspace view, modal dialog, or inspector panel:
      - **MANDATORY**: Each feature, action, or tool must have **EXACTLY ONE INTERACTION POINT (Single Source of Action)**.
      - **ZERO TOLERANCE**: Prohibited to duplicate buttons, floating shortcuts, or controls performing identical actions in the same view (e.g. "Save" in navbar and canvas toolbar; "Run/Preview" in header and floating panel).
      - **ELIMINATE DUPLICATES**: When duplicate action points are discovered, remove the duplicate and preserve only the primary action zone.
      - Governed by `LcSingleScreenNoDuplicateFunctionEngine` (`Lowcode/lc-single-screen-no-duplicate-function-engine.ts`, `lc_engines.singleScreenNoDuplicateFunction`).
18. **[MANDATORY NO INLINE STYLE — USE IDE THEME CLASSES ONLY (NO INLINE STYLE — USE IDE THEME CLASSES ONLY RULE — ZERO TOLERANCE)]**:
    - When creating or modifying components, UI interfaces (`.tsx`), buttons, cards, labels, tabs, menus, or dialogs:
      - **ZERO TOLERANCE**: Never use inline styles (`style={{ ... }}`) for colors, backgrounds, borders, padding, margins, dimensions, or static layouts.
      - **MANDATORY**: 100% styling via IDE Theme CSS classes (`styles/theme.css`, `styles/bases.css`, `styles/base.css`, `styles/layout.css`), standard CSS variables (`var(--surface)`, `var(--border)`, `var(--text)`, `var(--primary, #6938ef)`), and Base components from `@/components/bases`.
      - **Single Technical Exception**: Only dynamic geometric runtime values (drag x/y coordinates, zoom transforms) calculated at runtime by the Canvas engine may use the `style` prop (no static colors, borders, or typography).
      - Governed by `LcNoInlineStyleEngine` (`Lowcode/lc-no-inline-style-engine.ts`, `lc_engines.noInlineStyle`).
19. **[MANDATORY SEARCH IN /components FIRST (FIND IN /components FIRST RULE — ZERO TOLERANCE)]**:
    - When receiving any request to create, extend, or generate a UI component:
      - **100% MANDATORY TO SEARCH `/components/` FIRST**: Scan `/components/` (`bases/`, `editor/`, `lowcode/`, `vms/`, `dashboard/`, `projects/`).
      - **SIMILARITY DECISION MATRIX**:
        - _Similarity >= 90% (REUSE)_: 100% mandatory reuse of existing component; prohibited to create a new file.
        - _Similarity 70% - 89% (EXTEND)_: Mandatory to extend props or variants of existing component; prohibited to duplicate.
        - _Similarity < 70% (ALLOW_NEW)_: Allowed to create a new component in the proper modular folder only if no existing component serves the semantic purpose.
      - Inherits all project rules: Rule 7 (No Duplicate UI), Rule 13 (Default ID), Rule 14 (IdeIcon), Rule 15 (Strict UI), Rule 16 (Break Long Files), Rule 18 (No Inline Styles).
      - Governed by `LcFindInComponentsFirstEngine` (`Lowcode/lc-find-in-components-first-engine.ts`, `lc_engines.findInComponentsFirst`).
20. **[MANDATORY INITIALIZATION WITH CSS CLASS — NO INLINE STYLE (ALL NEW COMPONENTS CREATED WITH CLASS NO INLINE STYLE RULE — ZERO TOLERANCE)]**:
    - When creating any component, `.tsx` interface, button, card, label, tab, menu, dialog, or UI block:
      - **100% MANDATORY**: Style using IDE Theme CSS classes (`styles/theme.css`, `styles/bases.css`), system CSS variables (`var(--surface)`, `var(--border)`, `var(--text)`, `var(--primary, #6938ef)`), and `@/components/bases`.
      - **ZERO TOLERANCE**: Prohibited to use inline styles on new components. Add new classes to appropriate stylesheets if custom styles are required.
      - **Single Exception**: Dynamic geometric values (canvas coordinates, zoom transforms) calculated at runtime.
      - Governed by `LcNewComponentClassStyleEngine` (`Lowcode/lc-new-component-class-style-engine.ts`, `lc_engines.newComponentClassStyle`).
21. **[MANDATORY CREATION OF TRANSLATION TEXT FOR ALL NEW COMPONENTS (ALWAYS CREATE TRANSLATION TEXT FOR NEW COMPONENTS RULE — ZERO TOLERANCE)]**:
    - When creating any component, `.tsx` interface, button, card, label, input, tab, menu, dialog, or UI block:
      - **100% MANDATORY**: All user-facing strings (labels, placeholders, tooltips, titles, action text, messages) must have corresponding translation keys in the multilingual dictionary (`messages/vi.ts` under `components.[namespace]` and `lib/i18n-translations.ts`).
      - **MANDATORY**: Use the safe hook `useSafeTranslations` from `@/lib/i18n/use-safe-translations` or `@/components/bases`: `const t = useSafeTranslations("components.[namespace]");` with default fallback `t("key", "Default Text")` to safeguard test runners and prevent `MISSING_MESSAGE` errors.
      - **ZERO TOLERANCE**: Prohibited to hardcode unlocalized raw string literals in JSX or component props.
      - Governed by `LcComponentsTranslationRuleEngine` (`Lowcode/engines/lc-components-translation-rule-engine.ts`, `lc_engines.componentsTranslationRule`).
22. **[QUY TẮC BẮT BUỘC: CHO PHÉP THỰC THI LỆNH GIT, PYTHON, NODE, NPM (ALLOW GIT & PYTHON COMMANDS RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY PERMISSION FOR GIT, PYTHON, NODE, AND NPM COMMANDS EXECUTION -->
    - When interacting with shells, terminals, subprocesses, automation scripts, or configuring execution permissions for AI Agents and browsers:
      - **100% MANDATORY**: Always permit (`effect: "allow"`) developer commands in categories: `git *`, `git`, `python *`, `python`, `python3 *`, `python3`, `pip *`, `pip`, `pip3 *`, `pip3`, `pytest *`, `pytest`, `npm *`, `npm`, `node *`, `node`.
      - **ZERO TOLERANCE**: Prohibited to block, deny, or require manual interactive confirmation for standard development commands.
      - **AGENT MANIFEST ALIGNMENT**: All agent manifests (`.github/agents/*.json`) must specify `permissions.rules` matching `git *`, `python *`, `python3 *`, `npm *`, `node *`.
      - Governed by `LcAllowCommandsEngine` (`Lowcode/engines/lc-allow-commands-engine.ts`, `lc_engines.allowCommands`) and MCP action `allow_git_python_shell_commands` in Section 510.
23. **[QUY TẮC BẮT BUỘC: VÒNG ĐỜI NHÁNH GIT CHO TỪNG TASK — CHECKOUT TỪ TASKS VÀ MERGE VỀ PARENT BRANCH KHI HOÀN THÀNH (GIT TASK BRANCH LIFECYCLE RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY GIT TASK BRANCH LIFECYCLE — CHECKOUT FROM TASKS AND MERGE TO PARENT ON COMPLETION -->
    - When creating or implementing any task, feature, or bug fix:
      - **TASK CREATION PHASE (MANDATORY)**: Checkout an isolated task branch from `tasks` (or specified parent branch, e.g. `main`) using the standard prefix `task/<task-id>-<slug>`:
        ```bash
        git checkout tasks && git pull origin tasks && git checkout -b task/<task-id>-<slug>
        ```
        STRICTLY PROHIBITED to commit directly on main or shared parent branches without creating a task branch.
      - **TASK DONE & MERGE PHASE (MANDATORY)**: Once all work is implemented and verified:
        1. Switch back to parent branch: `git checkout <parent-branch>`
        2. Pull latest remote changes: `git pull origin <parent-branch>`
        3. Resolve conflicts (`resolve conflict`) and merge from task branch: `git merge <task-branch>`
        4. Run automated tests and fast typecheck to ensure zero regressions.
        5. Push merged commits to remote: `git push origin <parent-branch>`
        6. Clean up local task branch if appropriate: `git branch -d <task-branch>`
      - **ZERO TOLERANCE**: Committing directly on parent branches, merging with unresolved conflicts, or force pushing.
      - Governed by `LcGitTaskBranchWorkflowEngine` (`Lowcode/engines/lc-git-task-branch-workflow-engine.ts`, `lc_engines.gitTaskBranchWorkflow`) and MCP action `enforce_git_task_branch_lifecycle_rule` in Section 522.
24. **[MANDATORY AGENT STANDARDIZATION FOR mcp.lc AND 3th.mcp.lc TO ENABLE AI CHAT UI AND SERVICE UPDATES (AGENTS STANDARD RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: CẤU HÌNH AGENTS CHUẨN HÓA mcp.lc VÀ 3th.mcp.lc CHO PHÉP AI ASSISTANT CẬP NHẬT UI VÀ SERVICES TRONG CHAT -->
    - When configuring, initializing, or granting permissions to AI Assistants / Copilot Studio:
      - **100% MANDATORY COMPLIANCE WITH `Lowcode/.agents/standards/Agents/`**:
        - Project-internal MCP capabilities must be declared in `mcp.lc` with UI update tools (`uiUpdates.enabled: true`, `update_component`, `insert_component`, `modify_styles`, `create_page`) and backend service tools (`servicesUpdates.enabled: true`, `update_service`, `create_controller`, `create_usecase`, `bind_service_route`).
        - Extended third-party MCP servers must be defined in `3th.mcp.lc` with standard transports (`http`, `sse`, `stdio`), endpoints, secure headers, and auth timeouts.
        - Agent profiles, identities, system prompts, and permission flags must be defined in `agents.lc` and validated via `LcAgentsStandardEngine`.
      - **MANDATORY GOVERNANCE OF CHAT-DRIVEN UI & SERVICE UPDATES**:
        - UI updates must never use inline styles (Rules 18 & 20), and must apply IDE Theme CSS classes.
        - All containers must have unique IDs (Rule 13), and 100% of icons must use Base `<IdeIcon>` (Rule 14).
        - Service updates must generate `.controller.lc`, `.usecase.lc` files and register routes in `routes.lc`.
      - Governed by `LcAgentsStandardEngine` (`Lowcode/engines/lc-agents-standard-engine.ts`, `lc_engines.agentsStandard`) and MCP action `configure_agents_standard`.
25. **[MANDATORY CLEAN CODE — ZERO ANY TYPES & FULL WORD DESCRIPTIVE NAMING (CLEAN CODE: ZERO ANY & FULL WORD NAMING RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: CLEAN CODE — TUYỆT ĐỐI KHÔNG DÙNG KIỂU ANY & BẮT BUỘC DÙNG TỪ ĐẦY ĐỦ NGỮ NGHĨA, NGHIÊM CẤM BIẾN VIẾT TẮT -->
    - When authoring TypeScript code, React components (`.tsx`), Core Engine files (`.ts`), stores, services, API handlers, or tests:
      - **ZERO `any` TYPES (100% STRICT TYPING)**: Never use `: any`, `as any`, `<any>`, `any[]`, `Record<string, any>`. Explicit strict typing is mandatory (interfaces, types, unions, generics). For unknown dynamic data, use `unknown` with type narrowing guards (`typeof`, `instanceof`, predicates).
      - **ZERO SHORT IDENTIFIERS / FAST-TEXT VARIABLES**: Prohibited to use cryptic 1-2 character abbreviations such as `d`, `n`, `i`, `e`, `p`, `u`, `r`, `s`, `k`, `v`, `t`, `m`, `c`, `b`, `a`, `o`, `idx`, `el`, `val`, `res`, `req`, `fn`, `cb`, `obj`, `arr`, `str`, `num` for variables, function parameters, callbacks, or loop iterators.
      - **MANDATORY FULL WORD DESCRIPTIVE NAMES**: Identifiers must precisely describe the underlying domain entity (e.g. `dataRecord`, `totalCount`, `iterationIndex`, `eventPayload`, `projectItem`, `userProfile`, `serviceDefinition`, `httpRequest`, `executionResult`).
      - **TECHNICAL EXCEPTIONS**:
        - 2D/3D spatial coordinates: `x`, `y`, `z` (`{ x: number; y: number }`).
        - TypeScript generic type parameters: `<T>`, `<TData>`, `<TResult>`.
      - Governed by `LcCleanCodeNamingEngine` (`Lowcode/engines/lc-clean-code-naming-engine.ts`, `lc_engines.cleanCodeNaming`) and MCP action `enforce_clean_code_no_any_full_word_naming` in Section 569.
26. **[MANDATORY CLEAN CODE — PREFER SWITCH-CASE OVER EXCESSIVE IF-ELSE (PREFER SWITCH-CASE OVER EXCESSIVE IF-ELSE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: CLEAN CODE — KHÔNG DÙNG QUÁ NHIỀU IF-ELSE, BẮT BUỘC DÙNG SWITCH-CASE HOẶC LOOKUP MAP -->
    - When writing TypeScript code, React components, Core Engines, stores, services, handlers, or tests:
      - **NO EXCESSIVE IF-ELSE CHAINS**: Prohibited to write sequential branching ladders `if (...) else if (...) else if (...) else ...` of 3 or more branches evaluating the same discriminator.
      - **MANDATORY REFACTORING TO SWITCH-CASE OR LOOKUP MAP**: When 3 or more condition branches exist, 100% mandatory to refactor into `switch (expression) { case ...: break; default: ...; }` or constant lookup maps (`const MAP: Record<string, ...> = { ... }`).
      - **MANDATORY DEFAULT CASE**: Every `switch` construct must provide a `default:` branch to handle fallback states safely and prevent unhandled state bugs.
      - **EXCEPTIONS**: Simple binary conditions (1-2 branches: `if (...) else ...`), guard clauses (`if (!input) return;`), or independent unrelated conditions.
      - Governed by `LcSwitchCaseRuleEngine` (`Lowcode/engines/lc-switch-case-rule-engine.ts`, `lc_engines.switchCaseRule`) and MCP action `enforce_switch_case_over_excessive_if_else` in Section 570.
27. **[MANDATORY CANCEL PUSH & TYPE-CHECK ON DIRTY WORKING TREE (CANCEL PUSH & CANCEL TYPE-CHECK ON CODE CHANGES — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI PUSH CODE NẾU CÓ THAY ĐỔI TỪ CODE THÌ HỦY PUSH CODE (CHỈ ĐẨY CODE ĐÃ COMMIT SẠCH / STAGED AS COMMIT ONLY) VÀ HỦY CHẠY TYPE CHECK -->
    - When pushing code to remote repositories (`git push`):
      - **MANDATORY CANCEL PUSH ON UNCOMMITTED CHANGES**: If `git status --porcelain` detects uncommitted modifications (modified, unstaged, uncommitted staged, or untracked files):
        - Immediately abort `git push` (`exit 1`).
        - ZERO TOLERANCE for pushing to remote with a dirty working tree. Only clean, fully committed commits (_staged as commit only_) may be pushed.
      - **MANDATORY CANCEL TYPE-CHECK ON DIRTY TREE**: When uncommitted changes exist, cancel `npm run type-check` immediately; do not spend CPU cycles type-checking in-flight dirty code.
      - **EXPLICIT BYPASS FLAGS**: Support `SKIP_TYPECHECK=1` or `CANCEL_TYPECHECK=1` (`SKIP_TYPECHECK=1 git push`) for emergency pushes where pre-push typecheck was already verified.
      - Governed by `.husky/pre-push`, `LcCancelPushOnCodeChangesEngine` (`Lowcode/engines/lc-cancel-push-on-code-changes-engine.ts`, `lc_engines.cancelPushOnCodeChanges`), and MCP action `cancel_push_and_typecheck_on_code_changes` in Section 579.
28. **[MANDATORY EXECUTION OF TYPE-CHECK ONLY ON PUSH CODE (ONLY RUN CHECK TYPE WHEN PUSH CODE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: CHỈ CHẠY CHECK TYPE KHI PUSH CODE — TUYỆT ĐỐI KHÔNG CHẠY KHI COMMIT HOẶC TRONG CÁC BƯỚC KHÁC -->
    - Throughout software development, automation scripts, AI Agents, and git hooks:
      - **100% MANDATORY**: TypeScript type checking (`npm run type-check`, `npm run type-check:fast`, `scripts/fast-typecheck.mjs`, `tsc --noEmit`) **IS PERMITTED TO RUN EXCLUSIVELY ON GIT PUSH (`git push`)** via `.husky/pre-push`.
      - **ZERO TOLERANCE**: Prohibited to run type-check in other phases:
        - Never run during `pre-commit` or `git commit` (purge completely from `pre-commit` scripts).
        - Never run during file saves or live-reload loops.
        - Never run during unit testing runs (`npm test`, `vitest`).
        - Never run during task branch merge to parent (merge only runs unit tests to check for regressions).
      - **SINGLE GATEWAY**: Pre-push hook `.husky/pre-push` is the sole validation gateway: if the tree is clean, execute `npm run type-check:fast`; if clean, proceed with push; if typing errors exist, cancel push.
      - Governed by `LcCancelPushOnCodeChangesEngine` (`Lowcode/engines/lc-cancel-push-on-code-changes-engine.ts`) and MCP action `enforce_only_run_typecheck_when_push_code` in Section 580.
29. **[QUY TẮC BẮT BUỘC: KHI HOÀN TẤT CẬP NHẬT TỆP, BẮT BUỘC KIỂM TRA EOF TRÊN TỆP ĐÓ TRƯỚC, NẾU OK MỚI CHUYỂN SANG CẬP NHẬT TỆP TIẾP THEO (CHECK EOF ON FILE UPDATE RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY EOF VALIDATION ON COMPLETED FILE UPDATE BEFORE PROCEEDING TO NEXT FILE -->
    - When creating, updating, generating, refactoring, or editing any file (`.ts`, `.tsx`, `.json`, `.md`, `.css`, `.mjs`, etc.):
      - **100% MANDATORY**: Validate End-of-File (EOF) integrity on the updated file before touching any other file.
      - **ONLY WHEN** EOF validation passes (`valid === true`, `status === "OK"`), is execution permitted to proceed to the next file.
      - **MANDATORY EOF SPECIFICATIONS**:
        - File must end with exactly one newline character (`\n`, 0x0A), eliminating 100% of Git diff `\ No newline at end of file` warnings.
        - No syntax truncation at EOF: all brackets `{}`, `()`, `[]`, template literals ` ``` ` must be cleanly closed, JSX tags `<Component>` / `<div>` balanced, and Markdown code fences ``` must occur in even counts.
        - Maximum 1 trailing newline; zero redundant trailing empty lines.
      - **IMMEDIATE AUTO-FIX**: If `\n` is missing, `LcCheckEofEngine` automatically appends `\n` before proceeding.
      - **ZERO TOLERANCE**: Never leave a file truncated, missing trailing newlines, or with syntax errors to begin editing another file.
      - Governed by `LcCheckEofEngine` (`Lowcode/engines/lc-check-eof-engine.ts`, `lc_engines.checkEof`) and MCP action `enforce_check_eof_on_file_update` in Section 581.
30. **[MANDATORY CANCEL PREVIOUS TYPE-CHECK ON NEW PUSH OR COMMIT (CANCEL LAST TYPE-CHECK ON PUSH / COMMIT RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: HỦY TYPE-CHECK TRƯỚC ĐÓ KHI CÓ PUSH HOẶC COMMIT MỚI -->
    - When initiating `git push`, creating `git commit`, or starting a new type-check run:
      - **100% MANDATORY TO TERMINATE STALE IN-FLIGHT TYPE-CHECK PROCESSES**:
        - If a TypeScript typecheck process (`fast-typecheck.mjs`, `tsc --noEmit`, `npm run type-check:fast`) is running in the background, send immediate termination signals (`SIGTERM` / `SIGKILL`) to abort the entire process tree.
        - Zero tolerance for allowing orphaned typecheck processes to consume CPU/RAM and produce obsolete diagnostics.
      - **AUTOMATIC CANCEL IN PRE-COMMIT**: Triggers `node scripts/cancel-typecheck.mjs --trigger=commit --silent` to clean up background processes in < 25ms.
      - **AUTOMATIC CANCEL IN PRE-PUSH**: Triggers `node scripts/cancel-typecheck.mjs --trigger=push` on the first line of the hook before tree validation.
      - **AUTOMATIC CANCEL ON NEW RUNNER**: `scripts/fast-typecheck.mjs` terminates prior sessions (tracked in `.Cache/fast-typecheck.pid`) before logging new PID.
      - Governed by `LcCancelTypecheckOnPushCommitEngine` (`Lowcode/engines/lc-cancel-typecheck-on-push-commit-engine.ts`, `lc_engines.cancelTypecheckOnPushCommit`) and MCP action `cancel_last_typecheck_on_push_commit` in Section 582.
31. **[MANDATORY SINGLETON DESIGN PATTERN WITH DEPENDENCY INJECTION (DI) FOR LOWCODE (USE SINGLETON WITH DI FOR LOWCODE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI XỬ LÝ VỚI LOWCODE, BẮT BUỘC SỬ DỤNG SINGLETON DESIGN PATTERN KẾT HỢP DEPENDENCY INJECTION (DI) -->
    - When creating, updating, or refactoring classes, services, modules, managers, registries, or engines in `Lowcode/` (including `lc_engines`, `Lowcode/*.ts`):
      - **100% MANDATORY SINGLETON PATTERN**:
        - Constructor must be `private` or `protected` to forbid arbitrary `new ClassName()` instantiations.
        - Static instance field: `private static singletonInstance: ClassName | null = null;`.
        - Global access method: `public static getInstance(dependencies?: ...): ClassName`.
        - Canonical exported constant: `export const lc_<name>_engine = ClassName.getInstance();`.
      - **100% MANDATORY DEPENDENCY INJECTION (DI)**:
        - External dependencies (LocalDB, StorageAdapter, filesystem, sub-engines) must be injected via constructor interfaces or dependency objects.
        - Dependencies argument is optional (`dependencies?: Partial<DependenciesInterface>`), defaulting to canonical singletons for production runtime while allowing 100% mock injection in unit tests.
      - **ZERO TOLERANCE**: Public constructors or hardcoding new dependency instances within classes without injection capability.
      - Governed by `LcSingletonDiEngine` (`Lowcode/engines/lc-singleton-di-engine.ts`, `lc_engines.singletonDi`) and MCP action `enforce_singleton_with_di_for_lowcode` in Section 583.
32. **[MANDATORY NAMESPACE GROUPING FOR MULTIPLE INTERFACES IN A LOWCODE FILE (DEFINE INTERFACES IN NAMESPACE WHEN MULTIPLE IN FILE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI TỆP TRONG .LOWCODE CÓ NHIỀU INTERFACES, BẮT BUỘC ĐỊNH NGHĨA TRONG NAMESPACE -->
    - When creating, modifying, or refactoring logic files, core engines, modules, or services in `Lowcode/`:
      - **100% MANDATORY NAMESPACE GROUPING WHEN >= 3 INTERFACES EXIST (`threshold >= 3`)**:
        - Prohibited to leave 3 or more interfaces scattered at top-level scope without structure.
        - Group interfaces into `export namespace Lc<ModuleName>Types { export interface ... }` with `PascalCase` naming.
      - **100% BACKWARD COMPATIBILITY PRESERVATION**:
        - Every interface placed into a namespace must be re-exported at file level: `export type InterfaceName = Lc<ModuleName>Types.InterfaceName;` to ensure existing consumers and tests continue to work without regression.
      - Governed by `LcNamespaceInterfacesEngine` (`Lowcode/engines/lc-namespace-interfaces-engine.ts`, `lc_engines.namespaceInterfaces`) and MCP action `enforce_namespace_interfaces_for_lowcode` in Section 587.
33. **[MANDATORY DOMAIN FEATURE FOLDER RESTRUCTURING IN .LOWCODE (FEATURE FOLDERS RESTRUCTURE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: QUY HOẠCH VÀ TÁI CẤU TRÚC THƯ MỤC TÍNH NĂNG CHUYÊN BIỆT TRONG .LOWCODE -->
    - Files in `Lowcode/` must be structured into dedicated domain subfolders (`core/`, `stores/`, `compiler/`, `bridge/`, `lifecycle/`, `projects/`, `ui/`, `services/`, `standards/`, `controllers/`), cleanly re-exported via `index.ts` and subpath exports in `package.json`.
34. **[MANDATORY CONTROLLERS ARCHITECTURE DEFINING API ROUTES & AUTO-GENERATING CONTROLLERS FOR NEW FEATURES (CONTROLLERS ARCHITECTURE & AUTO-GENERATE CONTROLLER FOR NEW FEATURE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: THƯ MỤC CONTROLLERS ĐỊNH NGHĨA API ROUTES & TỰ ĐỘNG SINH CONTROLLER CHO TÍNH NĂNG MỚI -->
    - In the LowCode framework when creating or extending features:
      - **100% MANDATORY API ROUTE DEFINITION IN `Lowcode/controllers/`**: All API endpoints must reside in `Lowcode/controllers/`, inherit from `BaseController` (`base-controller.ts`), and register with `ControllersRouter` (`controllers-router.ts`).
      - **AUTO-GENERATE CONTROLLER FOR NEW FEATURES**: For each new feature file in `.agents/features/*.md`, automatically generate a corresponding TypeScript controller in `Lowcode/controllers/` mapping API routes under `/api/{feature-slug}`.
      - **STARTUP SUMMARY ON SERVER.TS**: When `server.ts` starts, scan and display all mapped controllers and API routes on the console, routing HTTP requests accordingly.
      - **FULL GOVERNANCE COMPLIANCE**: Controllers must comply with Rule 25 (Clean Code Zero Any), Rule 26 (Prefer Switch-Case), Rule 29 (Check EOF), Rule 31 (Singleton DI), and Rule 32 (Namespace Interfaces).
      - Governed by `LcFeatureControllerGeneratorEngine` (`Lowcode/engines/lc-feature-controller-generator-engine.ts`, `lc_engines.featureControllerGenerator`) and MCP action `auto_generate_controller_for_new_feature` in Section 606.
35. **[MANDATORY REMOVAL OF UNUSED MIGRATION/RE-IMPORT SCRIPTS AFTER EXECUTION (REMOVE UNUSED SCRIPTS AFTER RE-IMPORT OR MOVE FILE RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI RE-IMPORT HOẶC DI CHUYỂN FILE, NẾU TRƯỚC ĐÓ ĐÃ DÙNG SCRIPT MÀ HIỆN KHÔNG CÒN DÙNG THÌ PHẢI XÓA BỎ -->
    - When performing re-import operations (barrel updates, domain imports migration) or moving/renaming files or folders:
      - **100% MANDATORY REMOVAL OF COMPLETED ONE-OFF SCRIPTS (ZERO DANGLING MIGRATION SCRIPTS)**:
        - If temporary migration scripts (`scripts/migrate-*.ts`, `scripts/reimport-*.js`, `scripts/merge-*.ts`, `scripts/temp-*`) were generated or used to perform the migration:
        - Must delete them immediately upon task completion before merging.
        - Prohibited to leave dangling migration scripts polluting `scripts/` and causing false typing/linting errors.
      - **PRESERVE SYSTEM PIPELINE RUNNERS**:
        - Never delete permanent system scripts registered in `package.json` (`fast-build.mjs`, `fast-test.mjs`, `fast-typecheck.mjs`, `cancel-typecheck.mjs`, `generate-feature-follow.mjs`, `validate-projects.ts`) or `.husky/` hooks.
      - Governed by `LcRemoveUnusedScriptsEngine` (`Lowcode/sources/ui/lc-remove-unused-scripts-engine.ts`, `lc_engines.removeUnusedScripts`) and MCP action `remove_unused_scripts_after_reimport_or_move` in Section 636.
36. **[MANDATORY REMOVAL OF MANUAL TEST ATTEMPTS ON UPDATE PROJECTS — TESTING IS AUTOMATED ON GIT COMMIT (REMOVE TRYING TEST ON UPDATE PROJECTS — TEST IS AUTO ON GIT COMMIT RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: LOẠI BỎ VIỆC THỬ CHẠY TEST KHI CẬP NHẬT PROJECTS — KIỂM THỬ TỰ ĐỘNG KHI GIT COMMIT -->
    - When updating projects, adding features, fixing bugs, refactoring, or modifying source code:
      - **100% STRICTLY PROHIBITED TO RUN MANUAL INTERMEDIATE TESTS (NO TRYING TEST ON UPDATE PROJECTS)**:
        - Strictly prohibited to repeatedly execute `npm test`, `npm run test:fast`, `vitest run`, `node scripts/fast-test.mjs`, or `npx vitest` mid-implementation while updating files.
        - Do not insert manual testing commands into intermediate steps before commit, as it wastes time and disrupts developer flow.
      - **CORE RATIONALE: TESTING IS 100% AUTOMATED ON GIT COMMIT**:
        - The testing cycle runs automatically via `.husky/pre-commit` (`node scripts/fast-test.mjs --staged --fast`).
        - On `git commit`, the system scans and runs tests relevant to staged changes. If no tests are affected, it exits in < 20ms with exit code 0. If errors occur, the commit aborts with actionable errors.
      - **STANDARD DEVELOPMENT WORKFLOW**:
        - Focus on completing code, syntax, logic, IDE/Theme compliance, and Rule 29 EOF (single `\n`).
        - Run `git add` and `git commit`; let the pre-commit hook validate. Only fix errors if commit output indicates a failure.
      - **EMERGENCY BYPASS**: Use `SKIP_TEST=1` or `FAST_COMMIT=1` (`SKIP_TEST=1 git commit -m "..."`) for emergency commits.
      - Governed by `LcRemoveTryingTestOnUpdateProjectsEngine` (`Lowcode/sources/ui/lc-remove-trying-test-on-update-projects-engine.ts`, `lc_engines.removeTryingTestOnUpdateProjects`) and MCP action `remove_trying_test_on_update_projects` in Section 672.
37. **[MANDATORY i18n INTEGRATION WHEN EDITING OR FIXING COMPONENTS (EDIT OR FIX COMPONENTS INTEGRATE WITH I18N RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI CHỈNH SỬA HOẶC SỬA LỖI COMPONENT BẮT BUỘC PHẢI TÍCH HỢP I18N CHO CÁC CHUỖI VĂN BẢN BÊN TRONG -->
    - When receiving any task to edit, refactor, update, or bugfix any component, `.tsx` interface, button, card, label, input, tab, menu, modal, navbar, inspector panel, or UI block:
      - **100% MANDATORY TO INTEGRATE ALL INTERNAL USER-FACING STRINGS WITH i18n**:
        - Every user-facing string (button labels, titles, descriptions, placeholders, tooltips, `aria-label`, empty state messages, confirmation text) **MUST** be wrapped with `{t("keyName", "Fallback Vietnamese Text")}`.
        - Use safe hook `useSafeTranslations(namespace)` from `@/components/bases` or `@/lib/i18n/use-safe-translations` with 5-tier fallback ensuring zero crash from `[next-intl] No intl context found`.
        - Update and link keys in `messages/vi.ts` and `lc-vi.ts`.
      - **ZERO TOLERANCE**:
        - Leaving behind or adding hardcoded string literals during edit or fix workflows.
        - Calling `useTranslations` directly in shared components instead of `useSafeTranslations`.
        - Calling `t("key")` without the fallback default text parameter (`t("key", "Default Fallback Text")`).
      - Governed by `LcEditFixComponentsI18nRuleEngine` (`Lowcode/sources/components/lc-edit-fix-components-i18n-rule-engine.ts`, `lc_engines.editFixComponentsI18nRule`).
38. **[MANDATORY BLOCK OF DIRECT BUILD EXECUTION ON PUSH & DELEGATE ALL BUILDS TO BUILDER BOT (BLOCK ANTIGRAVITY IN BUILDER & DELEGATE BUILDS TO BUILDER BOT RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: NGHIÊM CẤM ANTIGRAVITY CẬP NHẬT TỆP TRONG BUILDER — GIAO TOÀN BỘ VIỆC BUILD CHO BUILDER BOT -->
    - During source code development and task execution across all projects:
      - **DEVELOPMENT OCCURS EXCLUSIVELY IN PRIMARY WORKSPACES (ZERO TOLERANCE)**:
        - Antigravity AI operates, edits, and creates files exclusively in primary project workspaces (`LowcodeStudio`, `Office`, `SuperChat`, `bot`).
        - Zero tolerance for creating or maintaining secondary builder clones.
      - **DELEGATE ALL BUILDS TO BUILDER BOT (NO BUILD AFTER PUSH)**:
        - Never trigger local build processes after pushing code.
        - All compilation, packaging, and release assembly is exclusively managed by Builder Bot (`BuilderBot`).
      - Governed by `.agents/rules/block-antigravity-builder-update.md` and `.agents/rules/no-build-after-push-delegate-to-builder-bot.md`.
39. **[MANDATORY SINGLETON DESIGN PATTERN WITH DEPENDENCY INJECTION (DI) FOR ALL CODE FILES (SINGLETON RULE FOR CODE FILES — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: MỌI CODE FILE (SERVICES, ENGINES, MANAGERS, HANDLERS) BẮT BUỘC PHẢI SỬ DỤNG SINGLETON DESIGN PATTERN KẾT HỢP DEPENDENCY INJECTION (DI) (SINGLETON RULE FOR CODE FILES — ZERO TOLERANCE) -->
    - When creating, updating, refactoring, or maintaining any code file (`.ts`, `.js`, `.mjs`) managing state, business logic, system orchestration, or external integrations (Services, Engines, Managers, Handlers, Controllers, Adapters, Bridges):
      - **100% MANDATORY SINGLETON PATTERN**:
        - Constructor must be declared `private` or `protected` to prevent external instantiation via `new ClassName()`.
        - Static instance property: `private static singletonInstance: ClassName | null = null;`.
        - Global accessor: `public static getInstance(dependencies?: Partial<DependenciesInterface>): ClassName`.
        - Canonical exported constant: `export const <name>Service = ClassName.getInstance();` (or snake_case `lc_<name>_engine = ClassName.getInstance();`).
        - Testing harness utilities: `public static resetInstance(): void` and `public static setInstanceForTesting(instance: ClassName | null): void`.
      - **100% MANDATORY DEPENDENCY INJECTION (DI)**:
        - All external dependencies (Databases, APIs, filesystems, loggers, sub-services) must be typed via explicit interfaces (Zero Any — Rule 25).
        - Dependencies argument in constructor and `getInstance()` is optional (`dependencies?: Partial<DependenciesInterface>`), defaulting to canonical singletons.
        - Strictly prohibited to hardcode new dependency instantiations (`this.db = new Database()`) without allowing mock/stub injection for testing.
      - **ZERO TOLERANCE**:
        - Declaring `public constructor` for Service, Engine, Manager, Store, or Coordinator classes.
        - Instantiating multiple instances with `new ClassName()` in components, controllers, or routers.
        - Using `any` in dependencies interfaces (violates Rule 25).
      - Governed by `.agents/rules/singleton-rule-for-code-files.md`.
40. **[MANDATORY VERIFICATION OF BUILD SUCCESS & AUTOMATIC BUG FIXING (VERIFY BUILD SUCCESS & AUTO FIX BUGS RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KIỂM TRA BUILD THÀNH CÔNG — NẾU GẶP LỖI BẮT BUỘC TÌM VÀ SỬA TRIỆT ĐỂ (VERIFY BUILD SUCCESS & AUTO FIX BUGS RULE — ZERO TOLERANCE) -->
    - When adding features, fixing bugs, refactoring, updating configurations, Dockerfiles, dependencies, or source code across all projects (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
      - **100% MANDATORY TO VERIFY BUILD SUCCESS (ZERO BROKEN BUILDS)**:
        - Corresponding build process (`npm run build`, Next.js build, TypeScript compilation, Docker image build, compose build, or post-push runner) must be verified to complete successfully (Exit Code 0, Zero Fatal Errors, container health `healthy`).
        - Strictly prohibited to mark tasks as done, close PRs, commit/merge, or exit workspace when builds are failing or containers are crash-looping.
      - **100% MANDATORY TO AUTOMATICALLY FIND AND FIX BUGS UPON FAILURE**:
        - _Step 1 (Log Collection & Analysis)_: Inspect `data/logs/docker-build.log`, terminal output, stderr/stdout, or stack traces to pinpoint the exact file, line, broken syntax, or faulty Docker directive.
        - _Step 2 (Root Cause Diagnosis)_: Identify whether error stems from TypeScript compilation, missing module, invalid import path, Dockerfile syntax, missing manifest, or port conflict.
        - _Step 3 (Root Remediation)_: Fix directly in source code or configuration. Never use hacks (`@ts-ignore`, disabling typechecks, assigning `any`, `--force`).
        - _Step 4 (Comprehensive Retest)_: Re-run build to verify Exit Code 0 before completing task.
      - Governed by `.agents/rules/check-build-success-and-fix-errors.md`.
41. **[MANDATORY NO BUILD AFTER PUSH — DELEGATE ALL BUILDS TO BUILDER BOT (NO BUILD AFTER PUSH — DELEGATE TO BUILDER BOT RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHÔNG BUILD SAU KHI PUSH CODE — GIAO TOÀN BỘ VIỆC BUILD CHO BUILDER BOT ĐẢM NHẬN (NO BUILD AFTER PUSH — DELEGATE TO BUILDER BOT RULE — ZERO TOLERANCE) -->
    - When executing `git push` across all repositories (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
      - **STRICTLY PROHIBITED TO BUILD AFTER PUSH CODE**:
        - After `git push` succeeds, NEVER run any build process (no `docker build`, no `docker compose build`, no server build, no production compilation, no background watchers).
        - `git push` solely validates code cleanliness (clean working tree, fast typecheck) to push commits quickly and reliably.
      - **DELEGATE ALL BUILDS EXCLUSIVELY TO BUILDER BOT**:
        - All build workflows, Docker packaging, container healthchecks, and deployments are the sole responsibility of **Builder Bot** (`BuilderBot`).
        - Builder Bot orchestrates builds via `/build` commands, Mission Control UI, or automated triggers, completely decoupled from developer and AI agent git pushes.
      - Governed by `.agents/rules/no-build-after-push-delegate-to-builder-bot.md`.
42. **[MANDATORY DOCKER IMAGE BACKUP BEFORE BUILD & PROMOTE RELEASE ON SUCCESS (BACKUP DOCKER BEFORE BUILD & REPLACE BUILD-BACKUP BY RELEASE VERSION RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TỰ ĐỘNG SAO LƯU DOCKER IMAGE TRƯỚC KHI BUILD VÀ THAY THẾ BẢN BUILD-BACKUP BẰNG RELEASE VERSION KHI BUILD THÀNH CÔNG -->
    - When executing any Docker build process (`docker build`, `docker compose build`, post-push runner, runtime build service) for any service in the project (`bot`, `studio`, `builder`, `server`, `web`, `all`):
      - **100% MANDATORY PRE-BUILD BACKUP**:
        - Verify existence of current image in local Docker registry (`${baseImage}:latest` or `${baseImage}:release`).
        - If image exists, immediately tag backup: `docker tag ${baseImage}:latest ${baseImage}:build-backup`.
        - Log confirmation: `📦 [Docker Backup] Backed up current version ${baseImage}:latest -> ${baseImage}:build-backup before build.`
      - **100% MANDATORY POST-BUILD RELEASE PROMOTION ON SUCCESS**:
        - Upon build completion with Exit Code 0, tag new release: `${baseImage}:release` and `${baseImage}:latest`.
        - Replace `${baseImage}:build-backup` with this new release version as backup for the next build cycle.
        - Log confirmation: `🎉 [Docker Release] Build OK! Replaced build-backup version by release version (${baseImage}:release & ${baseImage}:latest).`
      - **100% MANDATORY ROLLBACK ON FAILURE**:
        - If build fails (Exit Code != 0), restore `${baseImage}:latest` and `${baseImage}:release` from `${baseImage}:build-backup`.
        - Activate Rule 40 (Verify Build Success & Auto-Fix Bugs Rule) to diagnose and fix errors.
      - Governed by `.agents/rules/backup-docker-before-build-replace-release.md`.
43. **[MANDATORY CHECK & FIX TYPESCRIPT RUNTIME PROBLEMS BEFORE COMMIT (CHECK & FIX TYPESCRIPT RUNTIME PROBLEMS BEFORE COMMIT RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KIỂM TRA VÀ SỬA TRIỆT ĐỂ LỖI TYPESCRIPT RUNTIME TRƯỚC KHI COMMIT (CHECK & FIX TYPESCRIPT RUNTIME PROBLEMS BEFORE COMMIT RULE — ZERO TOLERANCE) -->
    - Prior to executing `git commit` across all repositories (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
      - **100% MANDATORY PRE-COMMIT RUNTIME CHECK**:
        - Run validation via `npm run check:runtime` (`node scripts/check-typescript-runtime.mjs`) or pre-commit hook.
        - Three mandatory verification gates:
          - _Step 1 (Type Checking)_: `tsc --noEmit` must pass with 0 errors.
          - _Step 2 (Node 22 Native Type-Stripping Syntax)_: `node --check` syntax check on 100% of `src/**/*.ts`.
          - _Step 3 (ESM Runtime Import Extensions)_: Validate 100% of relative imports include explicit runtime extensions (`.ts`, `.js`, `.mjs`, `.json`).
      - **FIX BEFORE COMMIT**:
        - Strictly prohibited to commit with compiler errors, syntax faults, or missing extensions.
        - Prohibited to use `@ts-ignore`, `@ts-nocheck`, or `any` to silence errors; fix root causes in source files.
      - **ENFORCED VIA HUSKY PRE-COMMIT HOOK**: Aborts commit (`exit 1`) upon any detected runtime problem.
      - Governed by `.agents/rules/check-typescript-runtime-problems-before-commit.md`.
44. **[QUY TẮC BẮT BUỘC: BẮT BUỘC KHAI BÁO RÕ RÀNG KIỂU DỮ LIỆU CỦA BIẾN TRƯỚC CÚ PHÁP GÁN '=' (EXPLICIT VARIABLE TYPE ANNOTATION BEFORE '=' SYNTAX RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY EXPLICIT VARIABLE TYPE ANNOTATION BEFORE '=' ASSIGNMENT SYNTAX -->
    - When writing TypeScript code, React components (`.tsx`), Core Engine files (`.ts`), controllers, stores, services, API routes, or scripts across all repositories (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
      - **100% MANDATORY EXPLICIT TYPE ANNOTATION BEFORE '=' (`: Type =`)**:
        - Every variable declared with `const` or `let` MUST have an explicit type annotation before the assignment `=` symbol (`const variableName: Type = initialValue;`, `let variableName: Type = initialValue;`).
        - Strictly prohibited to declare variables with `=` without explicit typing (implicit type inference / untyped variable assignment: `const foo = ...` is a STRICT VIOLATION).
      - **CORE BENEFITS**:
        - _Type Safety_: Prevents unintended implicit inference or empty collections typed as `any[]` / `never[]`.
        - _Self-Documenting Code_: Reading code immediately reveals types without tracing return signatures.
        - _Assignment Site Errors_: Compiler flags mismatches directly at assignment lines.
      - **PROHIBITED EXAMPLES**:
        - PROHIBITED: `const count = 10;` -> MANDATORY: `const count: number = 10;`
        - PROHIBITED: `let title = 'Home';` -> MANDATORY: `let title: string = 'Home';`
        - PROHIBITED: `const list = [];` -> MANDATORY: `const list: ProjectItem[] = [];`
        - PROHIBITED: `const res = await fetch(...);` -> MANDATORY: `const res: Response = await fetch(...);`
        - PROHIBITED: Using `: any = ...` (violates Rule 25).
      - Governed by `.agents/rules/define-variable-type-before-assignment.md`.
45. **[QUY TẮC BẮT BUỘC: NẾU CÓ NHIỀU BUILD CÙNG LÚC, GIỮ LẠI LẦN BUILD CUỐI CÙNG VÀ HỦY CÁC TIẾN TRÌNH ĐANG CHẠY KHÁC (KEEP LAST BUILD AND CANCEL CONCURRENT PROCESSING BUILDS RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY KEEP LAST BUILD AND CANCEL CONCURRENT PROCESSING BUILDS RULE — ZERO TOLERANCE -->
    > **NGHIÊM CẤM VI PHẠM (ZERO TOLERANCE)**:
    > Quy Tắc Bắt Buộc: Nếu Có Nhiều Build Cùng Lúc, Giữ Lại Lần Build Cuối Cùng Và Hủy Các Tiến Trình Đang Chạy Khác
    - When multiple build requests (Docker build, web build, runtime build service, post-push builder runner) are triggered simultaneously, or when a new build request arrives while a previous build is executing:
      - **100% MANDATORY TO KEEP LATEST BUILD**:
        - The newest build request (last / latest time) represents the freshest state of the codebase and takes absolute execution priority.
      - **100% MANDATORY TO CANCEL PRIOR PROCESSING BUILDS**:
        - Send immediate termination signals (`SIGTERM` / `SIGKILL` or `stopProcessGroup`) to all currently running build processes.
        - Update build record in database to `status: 'canceled'` with clear message: `Canceled: superseded by newer build request (keep last time and cancel another processing)`.
        - Roll back intermediate Docker tags if necessary (`rollbackDockerImage`) to avoid daemon resource and port conflicts.
      - **UNIFIED ACROSS ALL BUILD LAYERS**:
        - Backend Service Layer: `src/services/buildService.ts` (`startBuild` cancels in-flight builds before dispatching new builds).
        - CLI / Runner Layer: `scripts/post-push-docker.mjs` (concurrency guard via lock/pid files, terminates stale runners when new runner starts).
        - Web UI Layer: `app/components/tabs/builds-tab.tsx` allows triggering new builds anytime to supersede running builds immediately.
      - Governed by `.agents/rules/keep-last-build-cancel-processing.md`.
46. **[QUY TẮC BẮT BUỘC: DUY TRÌ VÀ BẢO VỆ MỤC TIÊU DỰ ÁN KHÔNG THAY ĐỔI — LEADER AGENT GOVERNANCE (PROJECT TARGET IMMUTABILITY & LEADER GOVERNANCE RULE — ZERO TOLERANCE)]**:
    <!-- English: MANDATORY PROJECT TARGET IMMUTABILITY & LEADER AGENT GOVERNANCE RULE — ZERO TOLERANCE -->
    - When creating, developing, extending features, refactoring, or interacting via AI Agents across the entire 2-TEK ecosystem:
      - **100% MANDATORY TO PRESERVE CANONICAL PROJECT TARGETS WITHOUT DRIFT (MAKE PROJECT TARGET NOT CHANGE)**:
        - _Office_: `Office: file suite edit with word, office, exel, slide` — Dedicated office suite editor (`.docx`, `.xlsx`, `.pptx`, document canvases, formatting toolbars, rulers, pagination). NEVER turn Office into a commercial website, Lowcode canvas IDE, production bot, or business app combo.
        - _LowcodeStudio_: `LowcodeStudio: Lowcode IDE` — Visual Lowcode Studio & Canvas Editor (component drag-and-drop tree, inspector panels, AST schemas, 4 IDE Themes, Base components). NEVER turn LowcodeStudio into an office suite editor, end-user commercial app, or production bot.
        - _bot_: `bot: control feature in Production` — Central production control and feature monitoring hub (Mission Control Bot port 3012, Telegram/Box Chat sync, Antigravity AI queue dispatcher, feature notification monitoring `.agents/features/`, Docker build gating, release controls). NEVER convert bot into a document editor or visual canvas.
        - _.lowcode_: `.lowcode: LowcodePrograming` — Core LowcodeProgramming runtime and system standards (AST schemas, `.agents/standards/` specifications, MCP `actions.json` definitions, headless engines, cross-platform code generators). NEVER introduce temporary UI logic or office file parsers into `.lowcode`.
      - **ROLE & MISSION OF LEADER AGENT (`.agents/agents/leader.md`)**:
        - The Leader Agent acts as Master Project Leader & Chief Architect, guaranteeing Zero Target Drift and coordinating the 4 subagents (`devloper`, `Designer`, `git-specialist`, `test-auditor`) strictly within canonical boundaries.
      - Governed by `.agents/rules/project-target-immutability.md` and `.agents/agents/leader.md`.
47. **[MANDATORY LOWCODE FRAMEWORK TARGET WASM & SEMANTIC HTML5 DUAL-BUILD RUNTIME RULE — ZERO TOLERANCE]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: ĐỊNH HƯỚNG MỤC TIÊU LÕI .LOWCODE LÀ FRAMEWORK HỢP NHẤT UI, DESIGN, SERVICE VỚI MCP CONTROL — TỰ ĐỘNG BUILD SERVICES SANG WASM & CLIENT SANG HTML, HỖ TRỢ BUILD ANDROID, IOS (FRAMEWORK TARGET WASM HTML RUNTIME RULE — ZERO TOLERANCE) -->
    - In `LowcodeStudio` and the `.lowcode` ecosystem:
      - **100% MANDATORY RECOGNITION OF .LOWCODE AS A UNIFIED FRAMEWORK**:
        - Unifies 3 core pillars: **UI** (User Interface), **Design** (Visual System), and **Service** (Domain Business Logic), centrally governed by **MCP Control** (Model Context Protocol) optimized for AI Coding Agents.
      - **100% MANDATORY AUTOMATIC DUAL-BUILD RUNTIME PIPELINE**:
        - **Instances Services -> WASM**: All services, use cases, and domain logic are automatically compiled into sandboxed WebAssembly bytecode (`.wasm`) for native performance and security.
        - **Client UI -> Semantic HTML5**: UI trees and ASTs are automatically compiled into semantic HTML5 with CSS theme tokens and JS bridges for direct browser rendering and fast FCP.
      - **FULL CROSS-PLATFORM TARGET SUPPORT**:
        - **Browser** (default): HTML5 client + WASM services.
        - **Android**: APK container / Android Web runtime (Min SDK >= 26).
        - **iOS**: iOS app bundle / WebKit runtime container (Deployment Target >= 15.0).
      - Governed by `.agents/rules/lowcode-framework-target-wasm-html-runtime.md` and MCP action `update_lowcode_framework_target_wasm_html_runtime` in Section 726.
48. **[MANDATORY AUTOMATIC COMMIT AND PUSH CODE ON DONE TASK (AUTO COMMIT & PUSH CODE ON DONE TASK RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TỰ ĐỘNG TẠO COMMIT VÀ PUSH CODE KHI HOÀN THÀNH TASK (DONE TASK AUTO COMMIT & PUSH RULE — ZERO TOLERANCE) -->
    - When any task, feature, bug fix, refactor, UI improvement, or configuration change is completed or marked "done" across all projects (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
      - **100% MANDATORY AUTOMATIC COMMIT ON TASK DONE**:
        - Never mark a task done while leaving uncommitted changes or untracked files in the working directory.
        - Check `git status --porcelain`: if dirty, stage modified/created files (`git add .` or target files) and create a Conventional Commit immediately (`feat(<scope>): <description> (done task <id>)`, `fix(...)`, `refactor(...)`).
      - **100% MANDATORY AUTOMATIC PUSH TO REMOTE REPOSITORY ON TASK DONE**:
        - Immediately push clean commits to remote origin (`git push origin <branch>`).
        - Pre-push hook `.husky/pre-push` validates clean tree and executes fast typecheck (Rule 28).
        - Ensure remote repository is immediately synchronized for team collaboration, CI, and deployment.
      - **100% MANDATORY DELEGATION OF BUILDS TO BUILDER BOT**:
        - Pushing code upon task done does not trigger local Docker builds. All packaging and release builds are delegated exclusively to Builder Bot under Rules 37 & 41.
      - **AI CODING AGENTS DISCIPLINE**:
        - AI agents (`devloper`, `git-specialist`, `leader`, `test-auditor`) must automatically commit and push upon finishing work on a task without waiting for manual human prompts.
      - Governed by `.agents/rules/auto-commit-and-push-code-on-done-task.md`.
49. **[MANDATORY EXAMPLE FILE AND STANDARDS FIRST BEFORE FEATURE GENERATION (FILE EXAMPLE & STANDARDS FIRST RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: MỌI TÍNH NĂNG MỚI PHẢI CÓ ÍT NHẤT MỘT FILE VÍ DỤ TRƯỚC (CẬP NHẬT XỬ LÝ FILE VÀ TIÊU CHUẨN CHO FILE) SAU ĐÓ MỚI CHO PHÉP TẠO VÀ XỬ LÝ TÍNH NĂNG THEO TIÊU CHUẨN CỦA FILE, SCHEMA (FILE EXAMPLE & STANDARDS FIRST BEFORE FEATURE GENERATION RULE — ZERO TOLERANCE) -->
    - In all 2-TEK projects (`LowcodeStudio`, `bot`, `Office`, `SuperChat`, `.lowcode`, etc.):
      - **100% MANDATORY AT LEAST ONE EXAMPLE FILE FIRST**:
        - Every new feature, data model, tool, or generator must have at least one representative example file provided or created first (in `.example/`, fixtures, templates, or test suites).
        - Demonstrates expected data formats, syntax, structures, and behavior.
      - **100% MANDATORY UPDATE FILE HANDLING CAPABILITIES FIRST**:
        - System file handlers, parsers, readers, writers, validators, and serializers must be implemented or updated first to ensure clean file ingestion and output.
      - **100% MANDATORY UPDATE STANDARDS & SCHEMA FOR THE FILE**:
        - Formal file standards, TypeScript interfaces, and JSON Schemas must be updated and verified in `.agents/standards/` (or `Lowcode/.agents/standards/MCP/schemas/`) prior to feature generation.
      - **GATED FEATURE GENERATION — ZERO TOLERANCE**:
        - Strictly prohibited to generate feature logic, controllers, components, or UI before having an example file and updating standards for file and schema.
        - Once prerequisites pass, feature generation is permitted and must strictly follow the established file standards and schema.
      - **EXEMPTION**: Bug fixes, file/folder moves or renames, and minor component styling/prop adjustments that do not introduce new formats or feature generation are exempt.
      - Governed by `.agents/rules/file-example-and-standards-first-before-feature-generation.md`.
50. **[MANDATORY FE RULE: ALWAYS DEFINE BASE IN SHARED/COMPONENTS AS /Shareds/components/{projectName} (PROJECT-ISOLATED SHARED BASE COMPONENTS RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TOÀN BỘ BASE COMPONENTS PHẢI ĐỊNH NGHĨA TRONG Shared/components DƯỚI DẠNG /Shareds/components/{projectName} (PROJECT-ISOLATED SHARED BASE COMPONENTS RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 51. **[MANDATORY FE RULE: ALWAYS DEFINE BASE IN SHARED/COMPONENTS AS /Shareds/components/{projectName} (Rule 51)]** -->
    - Across all Frontend (FE) projects in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/SuperChat`, `Packages/OfficePack`, etc.):
      - **100% MANDATORY DEFINE BASE COMPONENTS IN `Shared/components/{projectName}`**:
        - All base components (`Button`, `Input`, `Card`, `Modal`, `Dialog`, `IdeIcon`, `Container`, `Table`, `Tabs`, `Sidebar`, `Toast`, `Select`, `Dropdown`, `Combobox`, etc.) MUST be defined and maintained in `Packages/Shared/components/{projectName}/bases` (or `Shared/components/{projectName}/bases`).
        - Base components are strictly isolated per project (`SuperChat`, `Office`, `LowcodeStudio`, `Bots`) to eliminate style leakage and namespace collisions while centralizing design tokens within `Packages/Shared`.
      - **100% MANDATORY CANONICAL IMPORT SPECIFIERS & PATH ALIASES**:
        - All FE components and applications MUST import their base components using project-isolated shared aliases:
          `import { Button, IdeIcon } from '@Shared/components/{projectName}/bases';`
          or alias `@Shareds/components/{projectName}/bases` / `/Shareds/components/{projectName}`
          or project-mapped `@/components/bases` (pointing directly to `../Shared/components/{projectName}/bases`).
      - **STRICT PROHIBITION OF UN-ISOLATED DIVERGENT LOCAL BASES (ZERO TOLERANCE)**:
        - Frontend projects are strictly prohibited from maintaining unshared, diverging local base components in their own `components/bases` directories without keeping them synchronized with `Packages/Shared/components/{projectName}/bases`.
        - All updates, enhancements, bug fixes, or additions to base components must occur in (or synchronize immediately to) `Packages/Shared/components/{projectName}/bases`.
      - **ZERO CROSS-PROJECT BASE CONTAMINATION**:
        - A project (e.g. `SuperChat`) must never import directly from another project's isolated bases (e.g. `Shared/components/Office/bases`). Every project uses its designated `{projectName}` folder.
      - **100% MANDATORY ALL BASE COMPONENTS WHEN GENERATING CODE DEFINED IN `Packages/Shared/components/{projectNames}`**:
        - Whenever code generation is performed (by AI coding agents `devloper`, `coder`, `designer`, `leader`, code generators, scaffolding tools, AST generators, or developers):
        - ALL base components (`Button`, `Input`, `Card`, `Modal`, `Dialog`, `IdeIcon`, `Container`, `Table`, `Tabs`, `Sidebar`, `Toast`, `Select`, `Dropdown`, `Combobox`, `Skeleton`, etc.) MUST be defined in `Packages/Shared/components/{projectNames}` (specifically under `Packages/Shared/components/{projectNames}/bases`).
        - Strictly prohibited to generate base components into project-local directories without defining them in `Packages/Shared/components/{projectNames}`.
        - Generated UI components and pages must import base components from `@Shared/components/{projectName}/bases` or `@Shareds/components/{projectName}/bases` (or `/Shareds/components/{projectName}`, or mapped `@/components/bases`).
      - Governed by `.agents/rules/always-define-base-in-shared-components-per-project.md`.
51. **[MANDATORY CLIENT UI RULE: ALWAYS USE LAZYLOAD & SKELETON LOADING (CLIENT UI LAZYLOAD & SKELETON LOADING RULE — ZERO TOLERANCE)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TOÀN BỘ CLIENT UI PHẢI LUÔN SỬ DỤNG LAZYLOAD VÀ SKELETON LOADING (CLIENT UI LAZYLOAD & SKELETON LOADING RULE — ZERO TOLERANCE) -->
    - Across all Frontend (FE) projects and Client UI in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/SuperChat`, `Packages/OfficePack`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, etc.):
      - **100% MANDATORY LAZY LOADING FOR CLIENT UI ROUTES & NON-CRITICAL MODULES**:
        - All secondary views, feature tabs, heavy panels, modal dialogs, drawers, charting modules, code editors, and below-the-fold components MUST be loaded asynchronously via **Lazy Loading** (`React.lazy`, Next.js `dynamic(() => import(...))`, or Intersection Observer).
        - Prohibited to bundle heavy client-only UI into synchronous entry points, preventing monolithic JavaScript bundles and excessive First Contentful Paint (FCP) latency.
      - **100% MANDATORY SKELETON LOADING FOR ALL ASYNC & LAZY-LOADED STATES**:
        - Every lazy-loaded component, asynchronous data fetch, and view transition MUST render a **Skeleton Loading placeholder** (`<Skeleton>`, `<BaseSkeleton>`, `<LazyBoundary>`, or project-specific skeleton presets).
        - Prohibited to show blank white flashes, empty transparent containers, or unstyled bare spinners that cause layout shifts (Cumulative Layout Shift — CLS) during loading.
      - **100% MANDATORY CONTEXT-PRESERVING SKELETON PRESETS**:
        - Skeletons must reflect the target layout structure (`card`, `table`, `page`, `avatar`, `text`, `list`) with smooth theme-aware shimmer animations (`.vtek-skeleton-shimmer`).
        - Skeletons must inherit system theme tokens (`var(--surface-muted)`, `var(--border)`) without hardcoded colors (Rule 18 & Rule 20).
      - **100% MANDATORY EXPOSURE IN SHARED BASE PRIMITIVES (RULE 50 ALIGNMENT)**:
        - Every project's base components directory (`Packages/Shared/components/{projectName}/bases`) MUST define and export `Skeleton`, `BaseSkeleton`, `LazyBoundary`, and contextual skeleton presets.
      - Governed by `.agents/rules/client-ui-lazyload-skeleton-loading.md`.
52. **[MANDATORY RULE: BOTS & SUPERCHATS — GENERATE API WITH USECASES, MODELS AND INTEGRATE FIRST FOR NEW FEATURES (RULE 52)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: VỚI BOTS VÀ SUPERCHATS, KHI TẠO FEATURE MỚI CHỈ GENERATE API CÙNG USECASES, MODELS VÀ INTEGRATE TRƯỚC (BOTS & SUPERCHATS API-FIRST RULE — ZERO TOLERANCE) -->
    - When creating, planning, or implementing any new feature across `Bots` (`Packages/Bots`, `bot`) and `SuperChats` (`Packages/SuperChat`, `super-chat`):
      - **100% MANDATORY API & BACKEND-FIRST (MODELS, USECASES, INTEGRATION FIRST)**:
        - For any new feature request in `Bots` and `SuperChats`, developers and AI Agents **MUST ONLY generate and integrate the backend foundation first**:
          1. **Models & Data Contracts**: Explicitly define Domain Models, Data Transfer Objects (DTOs), Entities, request/response interfaces, and validation schemas (`types/`, `dtos/`, `entities/`, `interfaces/`). Zero `any` types (Rule 25), explicit variable type annotations before `=` (Rule 44).
          2. **Usecases & Core Business Services**: Encapsulate all business logic, AI interactions, workflows, database/storage operations, and orchestration in dedicated Use Cases or Service classes (`lib/`, `services/`, `.agents/features/`, `app/_/services/`). Follow Singleton + Dependency Injection (Rule 39).
          3. **API Endpoints & Route Handlers**: Implement standard API routes or controllers (`app/api/{feature-slug}/route.ts` or controllers) handling HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), HTTP status codes, input validation, and structured JSON responses.
          4. **Integration & Automated Tests**: Connect all layers end-to-end and implement automated integration and unit tests (`tests/`, `test/`) verifying payload contracts, business rules, and error handling before touching any user interface.
      - **STRICT PROHIBITION OF PREMATURE OR UNBOUND UI GENERATION (ZERO TOLERANCE)**:
        - Prohibited to generate front-end UI components (`.tsx`), pages, views, interactive forms, tabs, or modal dialogs before the API, usecases, models, and integration tests are 100% completed and passing.
        - Generating mock UI, speculative UI, or UI bound to non-existent API routes is strictly prohibited.
      - **PHASED FEATURE GATING (API/BACKEND FIRST, UI CONSUMPTION SECOND)**:
        - The primary initial deliverable for new features in Bots and SuperChats is strictly the working, tested API layer with integrated usecases and models.
        - Only after backend integration tests exit with code 0 and endpoints are verified may client UI components be constructed to consume the live API (strictly adhering to Rule 14 IdeIcon, Rule 18/20 No Inline Styles, Rule 13 Default ID, Rule 50 Shared Bases, and Rule 51 LazyLoad & Skeleton Loading).
      - Governed by `.agents/rules/bots-superchats-api-usecases-models-integrate-first.md`.
53. **[MANDATORY RULE: DYNAMIC SCANNING OF PACKAGES REPOSITORIES ON CODE PULL (RULE 53)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI PULL CODE CÁC PACKAGES, PHẢI SCAN CÁC REPOSITORIES TRONG PACKAGES (CÓ THỂ CÓ REPOSITORY MỚI HOẶC 0) VÀ PULL ĐẦY ĐỦ (SCAN PACKAGES REPOSITORIES ON PULL CODE RULE — ZERO TOLERANCE) -->
    - When pulling code, synchronizing workspace repositories, or refreshing dependencies:
      - **100% MANDATORY DYNAMIC DISCOVERY OF PACKAGES REPOSITORIES**:
        - Developers and AI Agents MUST dynamically scan the `Packages/` directory to discover all Git repositories (subdirectories containing `.git` directory or submodule pointer).
        - **NEVER** rely on a static, hardcoded list of package names. The workspace architecture allows new packages and independent repositories to be added dynamically (e.g. `Packages/Cloud`, `Packages/DeviceFarms`, or zero newly added repositories) at any time.
      - **100% MANDATORY COMPREHENSIVE PULL ACROSS ALL DISCOVERED REPOSITORIES**:
        - Execute code pull (`git pull` or `git pull --rebase origin <branch>`, or canonical command `npm run fetch:pull` / `node scripts/fetch-all.mjs --pull`) across every discovered repository in `Packages/*` as well as the root workspace repository.
        - Ensure every newly created, cloned, or existing repository is updated to its latest remote commit before starting work or merging branches.
      - **SAFE SYNCHRONIZATION & CONFLICT PREVENTION**:
        - Inspect each repository's working tree status before pulling. If uncommitted changes exist, safely handle or alert according to Rule 27 & Section 579 to prevent divergence.
      - Governed by `.agents/rules/scan-packages-repositories-on-pull-code.md`.
54. **[MANDATORY RULE: ALWAYS USE TRANSLATION WHEN CONSUMING OR ADDING NEW COMPONENTS (RULE 54)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI SỬ DỤNG HOẶC THÊM COMPONENT MỚI, LUÔN LUÔN SỬ DỤNG KÈM TRANSLATION (USE TRANSLATION WITH NEW COMPONENTS RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 54. **[MANDATORY RULE: WHEN USING A NEW COMPONENT, ALWAYS ADD WITH TRANSLATION (RULE 54)]** -->
    - When consuming, adding, instantiating, or rendering any component in pages (`app/**/*.tsx`), layouts, containers, widgets, modals, forms, or parent views across all projects:
      - **100% MANDATORY INITIALIZATION WITH SAFE TRANSLATION HOOK**:
        - Developers and AI Agents MUST initialize and use `useSafeTranslations("components.[namespace]")` from `@Shared/components/{projectName}/bases` (or `@/components/bases`).
      - **100% MANDATORY TRANSLATION WRAPPING FOR ALL PROPS & TEXT CHILDREN**:
        - All user-facing string props (e.g. `label`, `title`, `placeholder`, `description`, `aria-label`, `alt`, `tooltip`, `header`, `confirmText`, `cancelText`, `emptyText`, `helperText`) passed to the component MUST be wrapped using `{t("keyName", "Default Fallback Text")}`.
        - All textual children passed into components (e.g. `<Button id="submit-btn">{t("action.save", "Lưu thay đổi")}</Button>`, `<Badge id="status-badge">{t("status.active", "Hoạt động")}</Badge>`, `<Tab title={t("tab.general", "Cài đặt chung")}>`) MUST be wrapped in `{t("keyName", "Fallback Text")}`.
      - **ZERO TOLERANCE FOR UNLOCALIZED RAW STRINGS**:
        - Strictly prohibited to pass raw, hardcoded string literals directly to component props or text children when using components (e.g. `<Button label="Save" />` or `<Input placeholder="Enter username..." />` or `<Card title="Settings">Submit</Card>`).
      - **MANDATORY SAFE DEFAULT FALLBACK**:
        - Every translation call MUST provide a fallback default text parameter (`t("key", "Default Fallback Text")`), ensuring complete resilience against `MISSING_MESSAGE` errors during testing, SSR, or unpopulated dictionaries.
      - **DICTIONARY SYNCHRONIZATION**:
        - New translation keys introduced during component usage must be registered in the project's dictionary (`messages/vi.ts` under `components.[namespace]` or `lib/i18n-translations.ts`).
      - Governed by `.agents/rules/always-use-translation-when-using-new-components.md`.
55. **[MANDATORY RULE: WHEN CREATING NEW COMPONENTS, USE BASES WITH TRANSLATION FIRST FROM Shared/components/{ProjectNames} (RULE 55)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KHI TẠO COMPONENT MỚI, SỬ DỤNG BASES KÈM THEO TRANSLATION TRƯỚC TIÊN TỪ Shared/components/{ProjectNames} (CREATE NEW COMPONENTS USE BASES WITH TRANSLATION FIRST RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 55. **[MANDATORY RULE: WHEN CREATING NEW COMPONENTS, USE BASES WITH TRANSLATION FIRST FROM Shared/components/{ProjectNames} (RULE 55)]** -->
    - When creating, authoring, scaffolding, or generating any new component, interface (`.tsx`), modal, card, panel, dialog, form, button, list, layout, or UI block across all projects:
      - **100% MANDATORY COMPOSITION FROM SHARED BASE COMPONENTS**:
        - All UI elements MUST be composed exclusively from standardized Base primitives defined in `Packages/Shared/components/{projectName}/bases` (or `Shared/components/{projectName}/bases`), imported via `@Shared/components/{projectName}/bases` (or project-mapped `@/components/bases` / `@Shareds/components/{projectName}/bases`).
        - Strictly prohibited: using bare unstyled HTML interactive tags (`<button>`, `<input>`, `<select>`, `<textarea>`), creating diverging unshared local base components, using bare `<div>` without semantic kebab-case `id` or Base container (`<DivCard>`, `<DivRow>`, `<DivCol>`, `<Container>`), using raw emojis (Rule 14), or applying inline styles (Rule 18 & 20).
      - **100% MANDATORY USE TRANSLATION FIRST (`useSafeTranslations` FIRST)**:
        - At the very beginning of the component body, the translation hook MUST be called FIRST:
          `const t = useSafeTranslations("components.[componentName]");`
          imported from `@Shared/components/{projectName}/bases` (or `@/components/bases`).
        - Strictly prohibited: creating components without translation initialization or placing translation lookups secondary/scattered after unlocalized JSX.
      - **100% MANDATORY TRANSLATION WRAPPING FOR ALL PROPS & TEXT CHILDREN WITH SAFE FALLBACKS**:
        - All user-facing string props (`label`, `title`, `placeholder`, `description`, `aria-label`, `alt`, `tooltip`, `header`, `confirmText`, `cancelText`, `emptyText`, `helperText`) and textual children MUST be wrapped using `{t("keyName", "Default Fallback Text")}`.
        - Every call to `t(...)` MUST supply a non-empty second argument default fallback string to eliminate `MISSING_MESSAGE` errors during testing and SSR.
      - **100% MANDATORY DICTIONARY SYNCHRONIZATION**:
        - All new translation keys must be registered under their respective namespace in `messages/vi.ts` (and `lib/i18n-translations.ts`).
      - Governed by `.agents/rules/create-new-components-use-bases-with-translation-first.md`.
56. **[MANDATORY RULE: FOR ALL NEXT.JS PROJECTS, USE COMPONENTS FROM @Shared FIRST, THEN {projectName}/components (RULE 56)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: THỨ TỰ ƯU TIÊN COMPONENT CHO CÁC DỰ ÁN NEXT.JS — SỬ DỤNG COMPONENTS TỪ @Shared TRƯỚC TIÊN, SAU ĐÓ MỚI ĐẾN {projectName}/components (RULE 56 — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 56. **[MANDATORY RULE: FOR ALL NEXT.JS PROJECTS, USE COMPONENTS FROM @Shared FIRST, THEN {projectName}/components (RULE 56)]** -->
    - When creating, developing, scaffolding, or authoring components, pages, views, layouts, or feature modules across all Next.js projects (`Packages/LowcodeStudio`, `Packages/Office`, `Packages/Bots`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/SuperChat`, `Packages/OfficePack`, etc.):
      - **100% MANDATORY PRIORITY 1: USE COMPONENTS FROM `@Shared` FIRST**:
        - Search and reuse components from `@Shared` FIRST (`@Shared/components/{projectName}/bases`, `@Shared/components/bases`, `@Shared/components/theme`, `@Shared/components`).
        - Prohibited to recreate or duplicate components already provided by `@Shared`.
      - **100% MANDATORY PRIORITY 2: USE `{projectName}/components` ONLY FOR PROJECT-SPECIFIC UN-SHARED COMPONENTS**:
        - Only when the component does NOT exist in `@Shared` AND represents unique project-specific domain logic, views, or workflows, define or consume it inside `{projectName}/components` (`Packages/{projectName}/components/...` or `components/...`).
        - All components in `{projectName}/components` must compose exclusively from Base components in `@Shared/components/{projectName}/bases`, comply with theme CSS classes (Rule 18 & 20), semantic IDs (Rule 13), `<IdeIcon>` (Rule 14), and `useSafeTranslations` (Rule 21 & 54).
      - **MANDATORY COMPONENT PROMOTION TO `@Shared`**:
        - Base components or reusable primitives created in `{projectName}/components` must be migrated/promoted to `Packages/Shared/components/{projectName}/bases` and exported via `@Shared`.
      - **MANDATORY PATH ALIAS CONFIGURATION (`tsconfig.json`)**:
        - Every Next.js project must configure `@Shared/*`, `@Shared`, `@Shareds/*`, and `@/components/bases` mappings in `tsconfig.json`.
      - Governed by `.agents/rules/nextjs-projects-use-shared-components-first.md`.
57. **[MANDATORY RULE: LOGIN FIRST FOR ALL PROTECTED NEXT.JS APPLICATIONS AND ROUTES (RULE 57)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: SETUP TẤT CẢ CÁC PROJECT NEXT.JS PHẢI LOGIN TRƯỚC (LOGIN FIRST FOR NEXT.JS PROJECTS RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 57. **[MANDATORY RULE: SETUP ALL NEXT.JS PROJECTS THAT NEED TO BE LOGIN FIRST (RULE 57)]** -->
    - Across all Next.js applications and services in the 2-TEK ecosystem (`OfficePack`, `SuperChat`, `Cloud`, `Office`, `DeviceFarms`, `Bots`, `LowcodeStudio`):
      - **100% MANDATORY LOGIN FIRST ENFORCEMENT ON PROTECTED APPLICATIONS & ROUTES**:
        - All private portals, administration suites, or user workspaces (`OfficePack`, `SuperChat`, `Cloud`, `Office`, `DeviceFarms`, `Bots`, `LowcodeStudio`) MUST enforce authentication before granting access to dashboard views, data records, or workspace features.
        - When an unauthenticated client attempts to access any protected route, the request MUST NOT render private views or return unauthenticated HTTP 200 responses.
        - The system MUST immediately redirect the client to the canonical authentication/login route (e.g. `/${locale}/login`, `/${locale}/auth`, or `/login`), encoding the original requested destination in a `?redirect=<path>` query parameter.
      - **STRICT PROHIBITION OF DEV MODE AUTHENTICATION BYPASS**:
        - Strictly prohibited to bypass route guards using loose environment checks (such as `if (!isDevMode && !token)`). Authentication guards must execute deterministically across all environments.
      - **STANDARDIZED TOKEN RESOLUTION & EDGE MIDDLEWARE GUARDS**:
        - All Next.js projects must implement route guards at the Next.js Edge Middleware layer (`middleware.ts`) using standardized token extraction (cookies: `access_token`, `super_chat_token`, `auth_token`, `vtek_session`, `session_id`; headers: `Authorization: Bearer <token>`, `X-API-Key`, `X-VTEK-Key`), using `enforceEdgeLoginFirst` from `@Shared/components/auth/edge-auth-guard`.
      - **EXEMPTIONS FOR PUBLIC PATHS**:
        - Public marketing pages, authentication pages (`/login`, `/register`, `/auth`), health checks (`/api/health-check`), and static assets (`/_next/*`, `favicon.ico`) are explicitly exempt.
      - Governed by `.agents/rules/all-nextjs-projects-need-login-first.md`.
58. **[MANDATORY RULE: ALL PACKAGES MUST USE IMPORT WITH ALIAS @ WHEN CREATING NEW COMPONENTS (RULE 58)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TẤT CẢ PACKAGES BẮT BUỘC SỬ DỤNG IMPORT VỚI ALIAS @ KHI TẠO COMPONENT MỚI (ALL PACKAGES USE IMPORT ALIAS @ ON NEW COMPONENTS RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 58. **[MANDATORY RULE: FOR ALL PACKAGES, ALWAYS USE IMPORT WITH ALIAS @ WHEN CREATING NEW COMPONENTS (RULE 58)]** -->
    - Across all packages in the 2-TEK workspace (`Packages/SuperChat`, `Packages/OfficePack`, `Packages/Bots`, `Packages/Lowcode`, `Packages/LowcodeStudio`, `Packages/Office`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/Server`, `Packages/Shared`, `Packages/AiAssistant`, etc.):
      - **100% MANDATORY PATH ALIASES STARTING WITH `@` FOR ALL IMPORTS**:
        - When creating, authoring, scaffolding, refactoring, or generating any new component (`.tsx` or `.ts`: pages, layouts, modals, dialogs, cards, buttons, widgets, inspector subpanels, forms, toolbars, or visual UI blocks), all imports MUST use path aliases starting with `@`:
          - Intra-package imports: Use `@/...` (e.g. `@/components/bases`, `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/types/...`, `@/messages/...`, `@/sources/...`).
          - Immediate same-folder siblings: Local relative `./[name]` is allowed strictly for immediate child/sibling modules within the identical directory.
          - Cross-package imports: Use canonical package aliases starting with `@` (e.g. `@Shared/...`, `@Shared/components/{projectName}/bases`, `@Lowcode/...`, `@Server/...`, `@Bots/...`, `@Office/...`, `@SuperChat/...`, `@OfficePack/...`).
      - **STRICTLY PROHIBITED DEEP RELATIVE CLIMBING IMPORTS (`../../...`)**:
        - Strictly prohibited to use `../` or `../../` climbing imports to access components, bases, lib, utils, or types when authoring new components.
      - **MANDATORY `@` ALIAS CONFIGURATION IN `tsconfig.json`**:
        - Every package in `Packages/` must declare canonical `@` path mappings (`@/*`, `@Shared/*`, `@Shared`) under `compilerOptions.paths` in `tsconfig.json`.
      - Governed by `.agents/rules/all-packages-use-import-alias-at-on-new-components.md`.
59. **[MANDATORY RULE: ALWAYS MOVE /{projectName}/components/bases TO @Shared/components/{projectName}/bases (RULE 59)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: LUÔN DI CHUYỂN /{projectName}/components/bases SANG @Shared/components/{projectName}/bases (ALWAYS MOVE PROJECT BASES TO SHARED BASES RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 59. **[MANDATORY RULE: ALWAYS MOVE /{projectName}/components/bases TO @Shared/components/{projectName}/bases (RULE 59)]** -->
    - Across all packages and projects in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/SuperChat`, `Packages/OfficePack`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/AiAssistant`, `Packages/Server`, `Packages/Shared`, etc.):
      - **100% MANDATORY MOVE `/{projectName}/components/bases` TO `@Shared/components/{projectName}/bases`**:
        - Whenever any base components exist, are discovered, or are created inside a project-local `components/bases` directory (`/{projectName}/components/bases`, `Packages/{projectName}/components/bases`, `app/components/bases`, `src/components/bases`), developers, AI Agents, refactoring tools, and code generators **MUST ALWAYS MOVE THEM** to `@Shared/components/{projectName}/bases` (`Packages/Shared/components/{projectName}/bases`).
        - Zero base components (`Button`, `Input`, `Card`, `Modal`, `Dialog`, `IdeIcon`, `Container`, `Table`, `Tabs`, `Sidebar`, `Toast`, `Select`, `Dropdown`, `Combobox`, `Skeleton`, `LogViewer`, `CommonMenu`, etc.) are permitted to remain or reside in project-local `components/bases`.
      - **STRICTLY PROHIBITED TO RETAIN OR MAINTAIN PROJECT-LOCAL `components/bases`**:
        - Strictly prohibited to keep, duplicate, or maintain unshared, diverging local base components in `/{projectName}/components/bases`.
        - Once moved to `@Shared/components/{projectName}/bases`, the project-local `components/bases` directory must be completely removed, ensuring a single source of truth in `Packages/Shared/components/{projectName}/bases`.
      - **MANDATORY RE-IMPORT AND CANONICAL IMPORT SPECIFIERS**:
        - All project files and components consuming those bases must update their imports to canonical `@Shared` path aliases:
          `import { Button, IdeIcon } from '@Shared/components/{projectName}/bases';`
          or the project's tsconfig-mapped alias `@/components/bases` (pointing directly to `../Shared/components/{projectName}/bases`).
      - **MANDATORY TSCONFIG PATH ALIAS MAPPING**:
        - In every project `tsconfig.json`, `@/components/bases` and `@/components/bases/*` must map directly to `../Shared/components/{projectName}/bases` and `../Shared/components/{projectName}/bases/*`.
      - Governed by `.agents/rules/always-move-project-bases-to-shared.md`.
60. **[MANDATORY RULE: OFFICE TOOLBARS DESIGN — MULTI-GROUP TOOLBARS DISPLAYED AS TABS (RULE 60 / RULE 55 ALIAS)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: THIẾT KẾ THANH CÔNG CỤ OFFICE — BẮT BUỘC CÓ NHIỀU NHÓM CÔNG CỤ HIỂN THỊ THEO TAB (OFFICE TOOLBARS MULTI-GROUP TABBED DESIGN RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 55 / OFFICE TOOLBARS DESIGN — MULTI-GROUP TOOLBARS DISPLAYED AS TABS -->
    - Across the entire Office Suite (Word/Document, Excel/Spreadsheet, PowerPoint/Presentation, Combo):
      - **MANDATORY TABBED RIBBON ARCHITECTURE (BẮT BUỘC KIẾN TRÚC THANH CÔNG CỤ NHIỀU NHÓM HIỂN THỊ DẠNG TAB)**:
        - All toolbars in Office editors MUST NOT be designed or rendered as a single monolithic flat bar or cluttered unorganized strip.
        - Toolbars MUST be structured into Multiple Functional Groups displayed as Tabs (Ribbon Tabbed Toolbar Architecture) allowing users to switch between cohesive tool groups seamlessly.
      - **STANDARDIZED TAB GROUPS PER MODULE**:
        - Document (Word/Docs): Minimum 4 required tabs: `home` (Trang Đầu), `insert` (Chèn), `layout` (Bố Cục), `view` (Xem & Tiện Ích).
        - Spreadsheet (Excel/Sheets): Minimum 4 required tabs: `home` (Trang Đầu), `insert` (Chèn), `data` (Dữ Liệu), `view` (Xem & Tiện Ích).
        - Presentation (PowerPoint/Slides): Minimum 3 required tabs: `home` (Trang Đầu), `insert` (Chèn), `design` / `view` (Thiết Kế & Trình Chiếu).
      - **STRUCTURAL & SEMANTIC STANDARDS**:
        - Each tabbed toolbar must declare an outer wrapper (`[module]-toolbar-wrapper`), a tab strip header (`[module]-toolbar-tabs-strip`), and a nav group (`[module]-toolbar-tabs-group`).
        - Tab buttons must have IDs (`[module]-tab-btn-[tabId]`), and tab panes must have IDs (`[module]-tab-pane-[tabId]`).
      - Governed by `.agents/rules/office-toolbars-multi-groups-tab-design.md`.
61. **[MANDATORY RULE: BLOCK CROSS-PROJECT UPDATES TO SHARED/COMPONENTS BASES (RULE 61 / RULE 51 ALIAS)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: CHẶN CẬP NHẬT BASE COMPONENTS TRONG Shared/components GIỮA CÁC DỰ ÁN (BLOCK UPDATE SHARED/COMPONENTS BASE BETWEEN PROJECTS RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 51 / BLOCK UPDATE SHARED/COMPONENTS BASE BETWEEN PROJECTS RULE -->
    - Across all projects and packages in the 2-TEK workspace:
      - **STRICT PROJECT ISOLATION OF BASE COMPONENTS**:
        - All base components in `Shared/components/{projectName}/bases` belong EXCLUSIVELY to `{projectName}`.
        - Edits originating from Project X may only modify `Shared/components/{projectX}/bases`.
      - **ZERO CROSS-PROJECT MODIFICATIONS**:
        - Developers and AI agents are STRICTLY PROHIBITED from updating, renaming, moving, adding, or deleting files in `Shared/components/{otherProject}/bases`.
      - **PROTECTION OF UNIVERSAL SHARED BASES**:
        - Universal components in `Shared/components/bases/` serve the entire ecosystem; individual projects are strictly blocked from unilaterally modifying them.
      - **ZERO CROSS-PROJECT BASE IMPORTS**:
        - Components in `Shared/components/{projectA}/bases` must NEVER import directly from `Shared/components/{projectB}/bases`.
      - Governed by `.agents/rules/block-update-shared-components-base-between-projects.md`.
62. **[MANDATORY RULE: FETCHING DATA FROM LOCAL MUST USE REAL DIRECTORY (SECTION 825 / RULE 62 / RULE 50 ALIAS)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: FETCH DATA TỪ LOCAL PHẢI SỬ DỤNG THƯ MỤC THẬT (REAL DIRECTORY) — TUYỆT ĐỐI KHÔNG DÙNG DUMMY DATA (FETCH LOCAL USE REAL DIR RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 50 / FETCH LOCAL USE REAL DIR RULE -->
    - Across all 2-TEK projects:
      - **MANDATORY 100% USE REAL DIRECTORY & REAL VALUES**:
        - All file and directory operations for local storage must resolve real, authentic filesystem paths (e.g. real workspace directory `./`, project root, actual user home `~`, or user-selected folders via HTML5 File System Access API / OS filesystem).
        - Every document or file entry must represent an authentic file with its real filename, actual extension, exact size in bytes (`sizeBytes`), authentic modification timestamp (`updatedAt`), and real file content.
      - **STRICTLY PROHIBITED 100%: DUMMY / MOCK DATA FOR LOCAL STORAGE**:
        - Strictly forbidden to hardcode fabricated dummy documents (e.g. placeholder files like `bao-cao-cong-viec.docx`, `bang-tinh-ngan-sach.xlsx`, fake IoT sensor telemetry, or synthetic mock records) as computer disk data.
      - **MULTI-ENVIRONMENT RESOLUTION ARCHITECTURE**:
        - Server / Node / API Routes: Access filesystem using standard Node.js `fs` / `path` modules.
        - Browser / Client: Utilize native File System Access API (`showDirectoryPicker`, `FileSystemDirectoryHandle`).
      - Governed by `.agents/rules/fetch-data-from-local-use-real-dir.md`.
63. **[MANDATORY RULE: KILL PORT 3020 ON CLOSE TASK (RULE 63)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: KILL PORT 3020 KHI CLOSE TASK / DONE TASK (KILL PORT 3020 ON CLOSE TASK RULE — ZERO TOLERANCE) -->
    - Whenever closing or completing any task across the workspace:
      - Mandatory 100% to terminate port 3020 (PORT of app: 2-TEK Hub) via `node scripts/kill-port-3020.mjs` or `fuser -k -9 3020/tcp 2>/dev/null || true`.
      - Prevents orphaned Next.js dev server processes from remaining bound to port 3020.
64. **[MANDATORY RULE: READ TARGET PACKAGE README.MD BEFORE ANY FILE UPDATE (RULE 64 & SECTION 864)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TRƯỚC KHI CẬP NHẬT BẤT KỲ FILE NÀO TRONG PACKAGE PHẢI ĐỌC FILE README.MD CỦA PACKAGE ĐÓ ĐỂ XÁC ĐỊNH ĐÚNG MỤC TIÊU CỦA APP (READ PACKAGE README BEFORE UPDATE RULE — ZERO TOLERANCE) -->
    <!-- Legacy Title / Test Alias: 64. **[MANDATORY RULE: READ TARGET PACKAGE README.MD BEFORE ANY UPDATE (RULE 64)]** -->
    - Across all packages in the 2-TEK workspace (`Packages/Hub`, `Packages/Office`, `Packages/SuperChat`, `Packages/LowcodeStudio`, `Packages/Lowcode`, `Packages/Bots`, `Packages/OfficePack`, `Packages/DeviceFarms`, `Packages/Settings`, `Packages/AiAssistant`, `Packages/Iconbuilder`, `Packages/Cloud`, `Packages/Server`, `Packages/Shared`):
      - **100% MANDATORY: READ TARGET PACKAGE README.MD FIRST**:
        - Before modifying, refactoring, or generating any file or component in `Packages/{packageName}`, developers and AI Agents MUST read `Packages/{packageName}/README.md` first.
        - Must inspect and verify the Canonical Target of App (e.g. Hub: drop drag build next.js to launcher apps; Office suite: read - edit xlsx, docs; SuperChat: mix chat from many apps).
      - **100% MANDATORY: ZERO TARGET DRIFT**:
        - All code, components, endpoints, and architectural changes must strictly adhere to the defined Canonical Target of App.
        - Strictly prohibited to contaminate a package with features belonging to another package or alter the canonical target.
      - Governed by `.agents/rules/read-package-readme-before-update.md`.
65. **[MANDATORY RULE: ONLY DISPLAY ICON IN TOOLBAR FOR ALL OF APPS (RULE 65)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: THANH CÔNG CỤ CHỈ HIỂN THỊ ICON CHO TẤT CẢ CÁC ỨNG DỤNG (TOOLBAR ONLY DISPLAY ICONS RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 65 / TOOLBAR ONLY DISPLAY ICONS RULE -->
    - Across all applications in the 2-TEK workspace (`Packages/Bots`, `Packages/Office`, `Packages/LowcodeStudio`, `Packages/Lowcode`, `Packages/OfficePack`, `Packages/SuperChat`, `Packages/Cloud`, `Packages/Tasks`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/Settings`, etc.):
      - **MANDATORY 100% ICON-ONLY TOOLBAR BUTTONS**:
        - All action buttons, toggle buttons, and controls rendered inside toolbars, ribbons, and control bars MUST ONLY DISPLAY ICONS (using `<IdeIcon>` from `@/components/bases` or `@Shared/components/{projectName}/bases`, or Lucide SVG icons).
        - Strictly prohibited to render visible text labels or non-`sr-only` text spans inside toolbar buttons.
      - **TOOLTIPS & ACCESSIBILITY STANDARD**:
        - Button labels and explanations must be provided via `title` (native tooltip) and `aria-label` (screen reader accessibility), or `<span className="sr-only">`.
      - Governed by `.agents/rules/toolbar-only-display-icons.md`.
66. **[MANDATORY RULE: ALL APPS IN PACKAGES USE LOWCODE VIA GRPC WITH ZERO DIRECT LOGIC IMPORTS — LOWCODE RUNS AS INSTANCE SERVICE UNDER HUB WITH SLEEP MODE BY DEFAULT (RULE 66)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TẤT CẢ ỨNG DỤNG TRONG PACKAGES DÙNG LOWCODE QUA GỌI GRPC VÀ XÓA LOGIC IMPORT — LOWCODE CHẠY NHƯ DỊCH VỤ DƯỚI HUB Ở CHẾ ĐỘ SLEEP (RULE 66) -->
    <!-- Test Alias: RULE 66 / ALL APPS IN PACKAGES USE LOWCODE VIA GRPC RULE — ZERO TOLERANCE -->
    - Across the entire workspace and all applications in `Packages/`:
      - **MANDATORY 100%: ALL APPS USE LOWCODE VIA GRPC**:
        - Every app in `Packages/` (`AiAssistant`, `LowcodeStudio`, `Office`, `Word`, `Excel`, `Presentation`, `Pdf`, `Forms`, `Notes`, `SuperChat`, `Cloud`, `DeviceFarms`, `Bots`, `Server`, etc.) that requires Lowcode capabilities or services MUST communicate exclusively via package-local gRPC clients (`@/lib/grpc` or `@/app/api/_grpc`). `@Shared` must no longer be used for gRPC calls.
      - **STRICTLY PROHIBITED 100%: DIRECT LOGIC IMPORTS FROM LOWCODE**:
        - Strictly prohibited to import runtime logic, core engines, stores, calculators, or backend controllers directly from Lowcode (`@Lowcode/sources/*` or `../Lowcode/*`).
        - Only static TypeScript type definitions are allowed (`import type { ... } from "@Lowcode/types"` or local package types).
      - **MANDATORY 100%: LOWCODE RUNS AS INSTANCE SERVICE UNDER HUB**:
        - Lowcode runs as an instance service managed directly under 2-TEK Hub (`Packages/Hub`).
        - When Hub starts, Hub automatically spawns and manages the Lowcode instance service via programmatic call.
      - **MANDATORY 100%: DEFAULT SLEEP MODE WITH WAKE-ON-CALL**:
        - By default, Lowcode starts and remains in sleep mode (`mode: "sleep"` / standby), keeping CPU and memory consumption minimal while listening on ports 3100 and 50052.
        - Incoming gRPC calls execute without blocking (wake-on-call). Hub and clients can inspect and toggle status using gRPC actions `service.status`, `service.wake`, and `service.sleep`.
      - **MANDATORY 100%: KILL PORT 3020 AND LOWCODE PORTS ON CLOSE TASK**:
        - When task is completed or Hub closes, all bound ports are forcefully released.
      - Governed by `.agents/rules/all-apps-use-lowcode-via-grpc.md`.
67. **[MANDATORY RULE: LIST ALL OF QUEUE INTO .FEATURES BEFORE FINISHING TASKS (RULE 67)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: GHI DANH SÁCH TOÀN BỘ QUEUE VÀO .FEATURES TRƯỚC, TẠI QUEUE CUỐI CÙNG MỚI BẮT ĐẦU HOÀN THÀNH CÁC TASK (RULE 67) -->
    <!-- Test Alias: RULE 67 / LIST ALL QUEUE INTO .FEATURES BEFORE FINISHING TASKS RULE — ZERO TOLERANCE -->
    - Across all applications, packages, repositories, bots, background runners, and AI coding agents:
      - **MANDATORY 100%: LIST ALL OF QUEUE INTO .FEATURES FIRST**:
        - Whenever any task queue, batch prompt, or multi-task request is submitted (`conversation_queue.json`, prompt list, or input batch):
        - Developers and AI agents MUST immediately extract and record ALL items from the queue into `.agents/features/{dd-mm-yyyy}.md` (prioritizing the current date, format `DD-MM-YYYY.md`, e.g. `23-09-2026.md`) as uncompleted checkbox tasks (`- [ ] <type>(<scope>): <description> — Task <id>`, and explicitly mark `[BUG]` or `bug(...)` if it is a bug).
        - The complete queue of tasks MUST be recorded in `.agents/features/` BEFORE any implementation or task execution begins.
      - **STRICTLY PROHIBITED 100%: PREMATURE TASK EXECUTION WHILE QUEUE IS PENDING REGISTRATION**:
        - Strictly prohibited to start executing, implementing code, running generators, or marking tasks done (`[x]`) for any individual item while remaining items in the queue have not yet been listed into `.agents/features`.
      - **MANDATORY 100%: IN THE LAST QUEUE, START FINISH THE TASKS**:
        - Only upon reaching the last queue item (once the entire queue is completely logged into `.agents/features`), start the execution phase to finish the tasks systematically.
        - As each task completes, its checkbox in `.agents/features` is marked as completed: `- [x] ... (done task <id>)`.
      - Governed by `.agents/rules/list-all-queue-into-features-before-finishing-tasks.md`.
68. **[MANDATORY RULE: ALL OF PACKAGES/{NAME}/ MUST HAVE .STANDARDS/ FOR DESIGNS, STRUCTURE AND DEVELOPMENT MUST FOLLOW THEIR STANDARDS (RULE 68)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TẤT CẢ PACKAGES TRONG PACKAGES/{NAME}/ PHẢI CÓ THƯ MỤC .STANDARDS/ VỚI DESIGNS VÀ STRUCTURE, VÀ MỌI CẬP NHẬT PHẢI TUÂN THỦ THEO TIÊU CHUẨN CỦA PACKAGE ĐÓ (PACKAGES FOLLOW THEIR STANDARDS RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 68 / ALL PACKAGES FOLLOW THEIR STANDARDS RULE — ZERO TOLERANCE -->
    - Across all 24 packages in `Packages/*` and all AI coding agents (`coder`, `leader`, `designer`, `test-editor`, `git-checker`):
      - **MANDATORY 100%: EVERY PACKAGE MUST HAVE .STANDARDS/ DIRECTORY**:
        - Every package under `Packages/{name}/` MUST contain a `.agents/standards/` directory.
        - Each `.agents/standards/` directory MUST contain at minimum:
          - `structure.md`: Formally specifying the package directory layout, file organization, module aliases, route definitions, entry points, and isolation boundaries.
          - `designs.md`: Formally specifying visual guidelines, 4 IDE themes (Light, Dark, Midnight, Sepia), 8-pt layout grid, composition from project-isolated Base components in `@Shared/components/{name}/bases`, zero inline styles (Rule 18 & 20), mandatory `<IdeIcon>` usage (Rule 14), default semantic container IDs (Rule 13), and localization (`useSafeTranslations`).
      - **MANDATORY 100%: ALL CODE AND UI MUST STRICTLY FOLLOW PACKAGE STANDARDS**:
        - Whenever creating, updating, refactoring, or generating code inside `Packages/{name}/`:
          - Developers and AI agents MUST inspect and comply with `Packages/{name}/.agents/standards/structure.md` and `Packages/{name}/.agents/standards/designs.md`.
          - Any code structure, export, import path, component layout, or styling pattern that deviates from the package's `.agents/standards/` is strictly prohibited.
      - **MANDATORY PRE-UPDATE DISCIPLINE (RULE 64 + RULE 68)**:
        - Before updating any file in `Packages/{name}/`:
          1. Read `Packages/{name}/README.md` to confirm the **Canonical Target of App** (Rule 64).
          2. Read `Packages/{name}/.agents/standards/` (`structure.md` and `designs.md`) to adhere to the target structure and design contracts (Rule 68).
      - Governed by `.agents/rules/packages-follow-their-standards.md`.
69. **[MANDATORY RULE: FOLLOW AND KEEP TARGET OF PROJECT VIA .AGENTS/PRODUCT_TARGET.MD — ZERO TARGET DRIFT (RULE 69)]**:
    <!-- Compatibility: QUY TẮC BẮT BUỘC: TUÂN THỦ VÀ DUY TRÌ MỤC TIÊU DỰ ÁN QUA .AGENTS/PRODUCT_TARGET.MD (PROJECT_TARGET.MD) — KHÔNG ĐỔI MỤC TIÊU VÀ CÁCH LY CHỨC NĂNG (KEEP TARGET OF PROJECT RULE — ZERO TOLERANCE) -->
    <!-- Test Alias: RULE 69 / KEEP TARGET OF PROJECT RULE — ZERO TOLERANCE -->
    <!-- Legacy Alias: PROJECT_TARGET.md -->
    - Across the entire workspace, all 24 packages in `Packages/*`, and all AI coding agents:
      - **MANDATORY 100%: ROOT MUST HAVE .AGENTS/PRODUCT_TARGET.MD AND ALL PACKAGES MUST HAVE PROJECT_TARGET.MD**:
        - The root workspace MUST maintain `.agents/PRODUCT_TARGET.md` (with legacy alias `.agents/PROJECT_TARGET.md` / `PROJECT_TARGET.md`) defining the macro mission of the 2-TEK platform and the canonical target matrix of all packages.
        - Every single package under `Packages/{packageName}/` MUST maintain a dedicated `PROJECT_TARGET.md` defining its canonical target, core scope, strict anti-goals (prohibitions), and integration contracts.
      - **MANDATORY 100%: ZERO TARGET DRIFT & PROJECT TARGET PRESERVATION**:
        - Under no circumstances may any developer or AI agent alter, dilute, blur, or cross-contaminate the canonical identity of a package.
        - Every package must strictly remain within its defined architectural scope. Features belonging to Project B must never be implemented inside Project A.
      - **MANDATORY PRE-DEVELOPMENT TARGET AUDIT GATE**:
        - Before creating, modifying, refactoring, or generating any file or component in any package or root workspace:
          1. Read `.agents/PRODUCT_TARGET.md` (at root: `.agents/PRODUCT_TARGET.md` / `PROJECT_TARGET.md` and `Packages/{packageName}/PROJECT_TARGET.md`) to confirm alignment with the canonical target.
          2. Read `README.md` to verify local operational commands and routes (Rule 64).
          3. Read `.agents/standards/` (`structure.md` and `designs.md`) to adhere to layout and theme rules (Rule 68).
        - If a requested feature or change does NOT align with the package's canonical target, the request must be rerouted to the correct owner package or rejected.
      - **STRICT PROHIBITIONS (ZERO TOLERANCE)**:
        - Strictly prohibited to create or maintain any package under `Packages/` without a dedicated `PROJECT_TARGET.md`.
        - Strictly prohibited to implement features that violate the anti-goals declared in a package's `PROJECT_TARGET.md`.
      - Governed by `.agents/rules/keep-target-of-project.md`.
70. **[MANDATORY RULE: PACKAGE TASKS MUST BE CREATED IN PACKAGES/{NAME}/.FEATURES, NOT IN ROOT ./.FEATURES/ (RULE 70)]**:
    <!-- Test Alias: RULE 70 / PACKAGE TASKS IN PACKAGE .FEATURES NOT ROOT RULE — ZERO TOLERANCE -->
    - Across all applications, packages, repositories, bots, background runners, and AI coding agents:
      - **MANDATORY 100%: PACKAGE TASKS ROUTED TO `Packages/{name}/.agents/features/`**:
        - Whenever any task, feature, bug fix, refactor, or UI modification targets or belongs to a specific package under `Packages/`:
        - Developers and AI agents MUST create, queue, and log the task exclusively into that package's local `.agents/features/` directory:
          `Packages/{name}/.agents/features/{dd-mm-yyyy}.md` as an uncompleted checkbox task (`- [ ] <type>(<scope>): <description> — Task <id>`).
      - **STRICTLY PROHIBITED 100%: CREATING PACKAGE-SPECIFIC TASKS IN ROOT `./.agents/features/`**:
        - Root `./.agents/features/` is EXCLUSIVELY RESERVED for root workspace / monorepo-level tasks that do not belong to a single package.
      - Governed by `.agents/rules/package-tasks-in-package-features-not-root.md`.
71. **[MANDATORY RULE: TOOLBAR DESIGN — ZERO BORDER AND WHITE BACKGROUND IN DEFAULT THEME (RULE 71)]**:
    <!-- Test Alias: RULE 71 / TOOLBAR ZERO BORDER WHITE BACKGROUND DEFAULT THEME RULE — ZERO TOLERANCE -->
    - Across all applications, editors, ribbons, and packages in the 2-TEK workspace (`Packages/Word`, `Packages/Excel`, `Packages/Presentation`, `Packages/Pdf`, `Packages/Notes`, `Packages/Forms`, `Packages/Studio`, `Packages/CanvasStudio`, `Packages/AIAssistant`, `Packages/Settings`, `Packages/Shared`, `Packages/SuperChat`, `Packages/Tasks`, `Packages/Hub`, `Packages/Antivirus`, `Packages/OfficePack`, etc.):
      - **MANDATORY 100%: ZERO BORDER IN TOOLBAR**:
        - All toolbars, ribbons, control strips, action bars, tab strips, and formatting panels MUST NOT USE BORDERS (`border: none;`, `border-top: none;`, `border-bottom: none;`, `border-left: none;`, `border-right: none;`).
        - Strictly prohibited to render visible borders around toolbar containers or dividers separating toolbars from adjacent canvas/viewport areas.
      - **MANDATORY 100%: DEFAULT BACKGROUND COLOR IS WHITE IN DEFAULT THEME**:
        - In the default theme (Light theme / Default IDE Theme), toolbar background color MUST BE PURE WHITE (`#ffffff` / `var(--surface, #ffffff)` / `background-color: #ffffff;`).
        - In dark/midnight/sepia themes, toolbars adapt seamlessly to their respective theme surface (`var(--surface)`).
      - **MANDATORY 100%: ALL PACKAGES .STANDARDS/DESIGNS.MD CONFORMANCE**:
        - Every package under `Packages/` must declare and enforce this rule in `Packages/{name}/.agents/standards/designs.md`.
      - Governed by `.agents/rules/toolbar-no-border-white-background.md`.
72. **[MANDATORY RULE: PATH & DIRECTORY CONFIGURATION VIA .ENV ONLY — ZERO HARDCODED PATHS (RULE 72)]**:
    <!-- Test Alias: RULE 72 / PATHS AND DIRS DEFINED IN ENV ONLY RULE — ZERO TOLERANCE -->
    - Across all applications, packages, services, background scripts, and runners in the 2-TEK workspace:
      - **MANDATORY 100%: ALL PATHS AND DIRECTORIES DEFINED IN .ENV ONLY**:
        - All filesystem paths, storage roots (`FILES_STORAGE_PATH`, `APPS_STORAGE_PATH`, `CLOUD_STORAGE_PATH`, `COMPUTER_STORAGE_PATH`), build outputs (`APP_BUILD_PATHS`, `APP_ZIP_PATHS`, `APP_HUB_PATH`, `BUILD_DIR`, `BUILDS_HUB_DIR`), examples (`EXAMPLE_PROJECTS_PATH`), seed data (`USERS_DATA_PATH`), and remote deployment targets (`REMOTE_WORKSPACE_PATH`, `REMOTE_REBUILD_SCRIPT_PATH`) MUST be defined in `.env` and `.env.example`.
        - All source code and scripts must resolve paths dynamically from `process.env` or `.env` files.
      - **STRICTLY PROHIBITED 100%: HARDCODED USER / MACHINE PATHS**:
        - Zero tolerance for hardcoded personal paths (e.g. `/home/viettd`, `/home/tranduyviet`, `/home/user`, `/Users/...`).
        - User home directories must always be resolved dynamically via `os.homedir()` / `process.env.HOME` or tilde `~` expansion.
      - Governed by `.agents/rules/paths-and-dirs-defined-in-env-only.md`.
