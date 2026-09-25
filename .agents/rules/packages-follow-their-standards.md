# Mandatory Rule: All Packages Must Have .standards/ for Designs and Structure, and All Development Must Follow Package Standards (Rule 68)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TẤT CẢ PACKAGES TRONG PACKAGES/{NAME}/ PHẢI CÓ THƯ MỤC .STANDARDS/ VỚI DESIGNS VÀ STRUCTURE, VÀ MỌI CẬP NHẬT PHẢI TUÂN THỦ THEO TIÊU CHUẨN CỦA PACKAGE ĐÓ (PACKAGES FOLLOW THEIR STANDARDS RULE — ZERO TOLERANCE) -->
<!-- Test Alias: RULE 68 / ALL PACKAGES FOLLOW THEIR STANDARDS RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across all 24 packages in `Packages/*` (`AIAssistant`, `Antivirus`, `Bots`, `Cloud`, `CLow`, `CompanyWeb`, `DeviceFarms`, `Excel`, `Forms`, `HealthCheck`, `Hub`, `Iconbuilder`, `Lowcode`, `Notes`, `Pdf`, `Presentation`, `Server`, `Settings`, `Shared`, `Studio`, `SuperChat`, `SystemAdmin`, `Tasks`, `Word`) and all AI Coding Agents (`coder`, `leader`, `designer`, `test-editor`, `git-checker`):
> 1. **MANDATORY 100%: EVERY PACKAGE MUST HAVE .STANDARDS/ DIRECTORY**:
>    - Every single package directory under `Packages/{name}/` **MUST** contain a `.standards/` directory.
>    - Each `.standards/` directory **MUST** contain at minimum:
>      - `structure.md` (or `project-structure.md`): Formally specifying the package directory layout, file organization, module aliases, route definitions, entry points, isolation boundaries, and architectural rules.
>      - `designs.md` (or `design-system.md`): Formally specifying visual guidelines, 4 IDE themes (Light, Dark, Midnight, Sepia) using system CSS tokens, 8-pt layout grid, composition from project-isolated Base components in `@Shared/components/{name}/bases`, zero inline styles (Rule 18 & 20), mandatory `<IdeIcon>` usage (Rule 14), default semantic container IDs (Rule 13), and localization (`useSafeTranslations`).
> 2. **MANDATORY 100%: ALL CODE AND UI MUST STRICTLY FOLLOW PACKAGE STANDARDS**:
>    - Whenever creating, updating, refactoring, or generating code inside `Packages/{name}/`:
>      - Developers and AI agents **MUST** inspect and comply with `Packages/{name}/.standards/structure.md` and `Packages/{name}/.standards/designs.md`.
>      - Any code structure, export, import path, component layout, or styling pattern that deviates from the package's `.standards/` is strictly prohibited and constitutes an immediate build/test violation.
> 3. **MANDATORY PRE-UPDATE DISCIPLINE (RULE 64 + RULE 68)**:
>    - Before making any code change in `Packages/{name}/`:
>      1. Read `Packages/{name}/README.md` to confirm the **Canonical Target of App** (Rule 64).
>      2. Read `Packages/{name}/.standards/` (`structure.md` and `designs.md`) to adhere to the target structure and design contracts (Rule 68).
> 4. **STRICT PROHIBITIONS (ZERO TOLERANCE)**:
>    - ❌ **FORBIDDEN** to create or maintain any package under `Packages/` without a dedicated `.standards/` folder.
>    - ❌ **FORBIDDEN** to generate UI or service components that violate the package's design tokens, theme classes, or structure rules.
>    - ❌ **FORBIDDEN** to bypass reading `Packages/{name}/.standards/` prior to implementing features or refactoring.
>    - ❌ **FORBIDDEN** to introduce inline styles (`style={{ ... }}`) instead of using standard Theme CSS classes documented in `designs.md`.

---

## 1. Core Purpose & Architectural Rationale

1. **Elimination of Architectural Drift Across Multi-Package Monorepo**:
   - In a complex ecosystem with 24 distinct packages spanning compilers, micro-frontends, desktop apps, servers, and productivity suites, each package has a distinct structural personality and user experience domain.
   - Centralizing local standards inside `Packages/{name}/.standards/` ensures that architectural boundaries, module contracts, and UI conventions are explicitly documented at the package level.

2. **Autonomous AI Coding Agents Grounding**:
   - AI agents operate with deterministic accuracy when guided by localized specifications (`structure.md` and `designs.md`).
   - Grounding agents in both the macro target (`README.md`) and micro structure/design (`.standards/`) completely prevents hallucinations, rogue styling, and arbitrary file placement.

3. **Consistent Ecosystem-Wide Design Integrity**:
   - While each package serves a unique purpose (e.g. ribbon tabs in Word/Excel/Presentation/Pdf, canvas in Studio, chat streams in SuperChat, launcher grids in Hub), all adhere to unified design principles (IDE themes, 8-pt grid, Base components, zero raw emojis, zero inline styles) documented in their local `designs.md`.

---

## 2. Package Standards Specification Matrix

| Package Name | Canonical Target | `.standards/structure.md` Focus | `.standards/designs.md` Focus |
|---|---|---|---|
| **AIAssistant** | Autonomous AI Copilot & Streaming Intelligence | Streaming chat engine, agent loop, MCP bridge | Chat viewport, streaming markdown, prompt drawer |
| **Antivirus** | Codebase Security Scanner & Threat Detection | Port 3039, scanner engine, decoupled terminal | Threat matrix, severity badges, scan console |
| **Bots** | Production Mission Control & Pipelines | Port 3013, Next.js + Express API, Telegram runner | Mission control terminal, pipeline cards, build status |
| **Cloud** | Cloud Storage & Hierarchical File Explorer | Real `.Files` storage path (Rule 62), permissions | Multi-view explorer, dropzone, breadcrumbs |
| **CLow** | `.lc` → C → LLVM Native Machine Compiler | Compiler pipeline, AST passes, native CLI | Native UI decorators, immediate-mode layout, desktop canvas |
| **CompanyWeb** | Corporate Enterprise Web Presence & Portal | Multi-tenant auth, public marketing, `/admin/*` | Enterprise landing, brand cards, responsive grid |
| **DeviceFarms** | Virtual Devices Fleet & Automated Testing | Device pool state, ADB bridges, VM runner | Device matrix, simulator frames, telemetry gauges |
| **Excel** | High-Performance Spreadsheet & Calculation Grid | Formula engine, sheet workbook models | High-density grid, formula bar, ribbon toolbar tabs (Rule 60) |
| **Forms** | Interactive Form & Survey Builder | Form AST schema, question collector, responses | Drag-and-drop builder, mobile/desktop preview |
| **HealthCheck** | System Telemetry & Monitor Studio | Port 3038, gRPC client to Lowcode, OS metrics | CPU/RAM gauges, timeline graphs, alert cards |
| **Hub** | Desktop Launcher & Next.js App Manager | Port 3020, ZIP unpacker, `./Clouds/Applications` | App launcher grid, dropzone, status badges |
| **Iconbuilder** | Vector SVG Icon Studio & Asset Generator | Vector pipeline, `<IdeIcon>` exporter (Rule 14) | SVG canvas, path toolbar, icon preview grid |
| **Lowcode** | Core Language, Runtime, WASM & HTML5 Engine | Dual-build runtime, gRPC service server, AST | IDE theme tokens, component decorator schemas |
| **Notes** | Digital Notes & Markdown Memo Organizer | Markdown persistence, notebook hierarchy, tags | 3-pane note organizer, markdown editor, tag pills |
| **Pdf** | High-Fidelity PDF Viewer & Annotation Studio | PDF page renderer, annotations cache | Canvas paper view, thumbnail sidebar, ribbon tabs (Rule 60) |
| **Presentation** | Slide Deck Authoring & Visual Slide Studio | Slide AST, slide transitions, presenter mode | Slide canvas, thumbnail reel, ribbon toolbar tabs (Rule 60) |
| **Server** | Central Backend API, Prisma ORM, Gateways | REST/gRPC endpoints, Prisma migrations, seeding | API contracts, error response envelopes, zero client UI |
| **Settings** | System Preferences & Storage Paths Config | System preferences, storage path validation | Tabbed preference panels, theme switcher, save indicators |
| **Shared** | Design System Tokens & Base Components | `@Shared/components/{name}/bases` isolation (Rule 61) | Theme variables (`#6938ef`), 8-pt grid, CSS utilities |
| **Studio** | Lowcode IDE & Visual Canvas Designer | Drag-and-drop canvas, AST tree, gRPC bridge | 4-quadrant IDE, property inspectors, zoom canvas |
| **SuperChat** | Mix Chat Aggregator from Many Apps | Multi-channel inbox, AI assistant stream, sync | Unified chat list, conversation stream, rich bubbles |
| **SystemAdmin** | Enterprise RBAC, Telemetry & Audit Logs | RBAC roles, audit logging engine, Edge auth | Admin tables, role matrix, activity timeline |
| **Tasks** | Task Tracker, Interactive Calendar & Kanban | Calendar engine, Kanban state, monthly goals | Multi-view calendar, drag-and-drop Kanban, badges |
| **Word** | Rich Text Document & Word Processing Studio | Document paper model, ruler margins, formatting | Paginated paper, ribbon tabs (Rule 60), ruler bars |

---

## 3. Pre-Update Decision Flow

```
[Agent or Developer Receives Request for Packages/{name}]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Read Packages/{name}/README.md (Rule 64)            │
│ • Confirm Canonical Target of App                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Read Packages/{name}/.standards/ (Rule 68)          │
│ • structure.md: Directory layout, aliases, boundaries       │
│ • designs.md: Theme tokens, 8-pt grid, bases, zero inline   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Implement Code Strictly Following Standards         │
│ • Comply with structure, module resolution, and design spec │
│ • Verify zero inline styles and zero raw emojis             │
│ • Check EOF newline on all touched files (Rule 29)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to delete, omit, or bypass `.standards/` in any package.
2. ❌ **FORBIDDEN** to introduce files, directories, or imports that violate `structure.md`.
3. ❌ **FORBIDDEN** to use inline styles or raw emojis in violation of `designs.md`.
4. ❌ **FORBIDDEN** to perform cross-project modifications into other package bases (Rule 61).
5. ❌ **FORBIDDEN** to import Lowcode logic directly instead of using gRPC (Rule 66).
