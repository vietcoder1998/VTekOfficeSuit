# Mandatory Rule: Follow and Keep Target of Project via .agents/PRODUCT_TARGET.md — Zero Target Drift (Rule 69)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TUÂN THỦ VÀ DUY TRÌ MỤC TIÊU DỰ ÁN QUA .AGENTS/PRODUCT_TARGET.MD (PROJECT_TARGET.MD) — KHÔNG ĐỔI MỤC TIÊU VÀ CÁCH LY CHỨC NĂNG (KEEP TARGET OF PROJECT RULE — ZERO TOLERANCE) -->
<!-- Test Alias: RULE 69 / KEEP TARGET OF PROJECT RULE — ZERO TOLERANCE -->
<!-- Legacy Alias: PROJECT_TARGET.md -->

> **ZERO TOLERANCE**:
> Across the entire 2-TEK ecosystem, the root workspace, all packages in `Packages/*` (`AIAssistant`, `Antivirus`, `Bots`, `Cloud`, `DeviceFarms`, `Excel`, `Forms`, `HealthCheck`, `Hub`, `Iconbuilder`, `Lowcode`, `Notes`, `OfficePack`, `Pdf`, `Presentation`, `Server`, `Settings`, `Shared`, `Studio`, `SuperChat`, `Tasks`, `Word`), and all developers and AI Coding Agents:
> 1. **MANDATORY 100%: ROOT MUST HAVE .AGENTS/PRODUCT_TARGET.MD AND ALL PACKAGES MUST HAVE PROJECT_TARGET.MD**:
>    - The root workspace **MUST** maintain `.agents/PRODUCT_TARGET.md` (with legacy alias `.agents/PROJECT_TARGET.md` / `PROJECT_TARGET.md`) defining the macro mission of the 2-TEK platform and the canonical target matrix of all packages.
>    - Every single package under `Packages/{packageName}/` **MUST** maintain a dedicated `PROJECT_TARGET.md` defining its canonical target, core scope, strict anti-goals (prohibitions), and integration contracts.
> 2. **MANDATORY 100%: ZERO TARGET DRIFT (DUY TRÌ VÀ BẢO VỆ MỤC TIÊU DỰ ÁN KHÔNG THAY ĐỔI)**:
>    - Under no circumstances may any developer or AI agent alter, dilute, blur, or cross-contaminate the canonical identity of a package.
>    - Every package must strictly remain within its defined architectural scope. Features belonging to Project B must never be implemented inside Project A.
> 3. **MANDATORY PRE-DEVELOPMENT TARGET AUDIT GATE**:
>    - Before creating, modifying, refactoring, or generating any file or component in any package or root workspace:
>      1. **Read `.agents/PRODUCT_TARGET.md`** (at root: `.agents/PRODUCT_TARGET.md` and `Packages/{packageName}/PROJECT_TARGET.md`) to confirm alignment with the canonical target.
>      2. **Read `README.md`** to verify local operational commands and routes (Rule 64).
>      3. **Read `.agents/standards/`** (`structure.md` and `designs.md`) to adhere to layout and theme rules (Rule 68).
>    - If a requested feature or change does NOT align with the package's canonical target, the request must be rerouted to the correct owner package or rejected.
> 4. **STRICT PROHIBITIONS (ZERO TOLERANCE)**:
>    - ❌ **FORBIDDEN** to create or maintain any package under `Packages/` without a dedicated `PROJECT_TARGET.md`.
>    - ❌ **FORBIDDEN** to implement features that violate the anti-goals declared in a package's `PROJECT_TARGET.md` (e.g. turning Hub into a cloud file explorer, turning Cloud into an app launcher, turning Word into a spreadsheet calculator).
>    - ❌ **FORBIDDEN** to bypass reading `.agents/PRODUCT_TARGET.md` (or package `PROJECT_TARGET.md`) before initiating code modifications.

---

## 1. Core Purpose & Architectural Rationale

1. **Elimination of Architectural Drift & Monolithic Sprawl**:
   - In a multi-package ecosystem, projects naturally drift toward monolithic bloat if boundaries are not strictly guarded.
   - Formalizing `PROJECT_TARGET.md` creates an immutable contract for every package, ensuring each tool remains focused, lightweight, and purpose-built.

2. **Autonomous AI Coding Discipline**:
   - AI agents require unambiguous ground truth to prevent speculative code generation and out-of-scope implementations.
   - `PROJECT_TARGET.md` provides AI agents with instant verification of what is allowed and what is strictly prohibited in each package.

3. **Seamless Ecosystem Integration**:
   - High cohesion and loose coupling are preserved because each package excels at its single responsibility while relying on standard protocols (gRPC for Lowcode, local storage paths, and Hub launcher) for cross-package collaboration.

---

## 2. Package Target & Boundary Matrix

| Package | Canonical Target | Strict Anti-Goals (Prohibitions) |
|---|---|---|
| **Hub** | Desktop app launcher & process manager — runs apps from folders | NEVER store general user files or run document editing. |
| **Cloud** | Cloud storage manager & hierarchical file explorer | NEVER run app launcher logic or process management. |
| **Lowcode** | DSL compiler (`.lc`), AST runtime, WASM/HTML5 engine | NEVER import direct runtime logic into apps; use gRPC only. |
| **Studio** | Lowcode IDE & visual canvas editor | NEVER author Office documents or run background bot daemons. |
| **Word** | Read - edit and format rich text documents (Word / Docs) | NEVER turn into a spreadsheet, slide editor, or app launcher. |
| **Excel** | Read - edit and calculate spreadsheet grids (Excel / Sheets) | NEVER author word documents or embed server database ORMs. |
| **Presentation** | Read - edit and design visual slide decks (Slides) | NEVER turn into a spreadsheet or code canvas editor. |
| **Pdf** | Read, view, annotate, and convert PDF documents | NEVER turn into an original document drafting suite. |
| **Forms** | Design, collect, and analyze dynamic forms & surveys | NEVER turn into a general code canvas or real-time chat app. |
| **Notes** | Author, organize, and manage digital notes and memos | NEVER turn into a heavy word processor or project tracker. |
| **SuperChat** | Mix chat from many apps | NEVER turn into a document editor; API-first architecture. |
| **AIAssistant** | Autonomous AI copilot & conversational studio | NEVER turn into a marketing portal or spreadsheet editor. |
| **Bots** | Production mission control, pipelines & agent orchestration | NEVER turn into an interactive canvas or office editor. |
| **OfficePack** | Unified Office Suite engines, Word, Excel, Presentation, PDF, Forms, Notes, AI Chat, and backend Server Gateway | NEVER turn into a general IDE code editor or standalone marketing portal. |
| **DeviceFarms** | Virtual devices fleet, emulators & testing farm | NEVER turn into an office document suite or messaging client. |
| **HealthCheck** | System health diagnostics & telemetry auditing | NEVER embed direct Node.js `fs` into browser components. |
| **Antivirus** | Security scanning, virus detection & threat isolation | NEVER turn into a file explorer or desktop app launcher. |
| **Iconbuilder** | Vector SVG icon studio & asset generator | NEVER produce raw emoji icons; output must be valid SVG. |
| **Settings** | Centralized preferences & storage path configuration | NEVER allow deletion or uninstalling from the system. |
| **Server** | Backend API services, database ORM & gateways | NEVER embed React or browser-only UI components. |
| **Shared** | Universal design system, tokens & isolated bases | NEVER allow cross-project modifications between base folders. |
| **Tasks** | Follow tasks, calendar planner, Kanban & monthly goals | NEVER turn into an office document editor or chat client. |

---

## 3. Decision & Governance Workflow

```
[Developer or AI Agent receives task for Package X]
                         │
                         ▼
        [Step 1: Read PROJECT_TARGET.md]
  Inspect Canonical Target & Anti-Goals for Package X
                         │
                         ▼
             Does the requested task
          match the Canonical Target?
              ┌──────────┴──────────┐
              ▼                     ▼
            [YES]                  [NO]
              │                     │
              ▼                     ▼
    [Step 2: Read README]       ❌ REJECT OR REROUTE
    & Packages/X/.agents/standards/     Redirect task to the
              │                  designated owner package
              ▼
    [Step 3: Implement]
    Strictly within scope
```

---

## 4. Compliance Checklist

- [ ] `.agents/PRODUCT_TARGET.md` (or `PROJECT_TARGET.md`) exists at workspace root.
- [ ] `PROJECT_TARGET.md` exists inside each of the 24 packages in `Packages/`.
- [ ] Every `PROJECT_TARGET.md` clearly states Canonical Target, Scope, and Anti-Goals.
- [ ] Pre-commit validation scripts (`node scripts/check-project-target.mjs`) verify 100% presence and integrity.
- [ ] All code modifications strictly preserve package target immutability.
