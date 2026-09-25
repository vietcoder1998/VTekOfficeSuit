---
trigger: always_on
---

# Mandatory Rule: Core Engine First Before Building UI (Engine-First Principle — Rule 9)

> **ZERO TOLERANCE**:
> When implementing or upgrading any Feature, Service, Action, or Capability in the system:
> **MANDATORY 100%: Finalize all domain logic, data transformations, schema validation, and core services in `.lowcode/` (or `lc_engines` / `lib/`) FIRST**.
> Strictly forbidden to build UI components (`.tsx`) while core engine logic remains incomplete or untested.

---

## 1. Core Principles: Core Engine First — UI Last

1. **.lowcode Engine First**:
   - All business logic, state machines, computations, network calls, and schema validations MUST be implemented inside `.lowcode/` (e.g. `.lowcode/engines/`, `.lowcode/lc-*.ts`) or `lc_engines/`.
   - The engine must provide comprehensive interfaces, type guards, public methods, and standalone Unit Tests proving it executes independently of the UI.

2. **UI as Pure Presentation Layer (Display Only / Pure Presentation)**:
   - The UI layer (`app/**/*.tsx`, `components/**/*.tsx`, Modals, Dialogs, Tabs) serves exclusively to:
     - Render data provided by core engines and central stores.
     - Capture user events (click, drag, input) and delegate (dispatch/invoke) them to engine methods.
     - Provide visual feedback (loading spinners, disabled states, toasts).
   - **FORBIDDEN** to embed complex domain logic or state mutations directly in `.tsx` components.

---

## 2. Standard 4-Step Feature Creation Process

```
[Step 1: MCP Standard First]
       ↓ (Register tools, schemas, templates in .lowcode/.standards/MCP/)
[Step 2: Core Engine First]
       ↓ (Finalize logic, state, schemas, and unit tests in .lowcode/)
[Step 3: UI Layer Composition (.standards & Theme)]
       ↓ (Compose Base components app/components/bases/*.tsx, #6938ef, Inter, 8-pt grid)
[Step 4: No Duplicate UI & Automated Tests]
         (Review similarity thresholds, run vitest & fast-typecheck)
```

### Process Details:
- **Step 1 — MCP Standard First (Exempt for bug fixes, file/folder moves, and component changes)**:
  *MCP EXEMPTION*: If the task is a bug fix (sửa lỗi), file/folder move (di chuyển file/folder), or component change, **TUYỆT ĐỐI KHÔNG triển khai vào MCP** (skip Step 1), proceed straight to Step 2. MCP registration is required strictly for brand-new capabilities.
- **Step 2 — Core Engine First**: Build and test services in `.lowcode/` or `lc_engines/` with unit tests.
- **Step 3 — UI Composition**: Build `.tsx` components with Base components (`app/components/bases/*.tsx`) using theme tokens (`#6938ef`, font `Inter`, 8-pt grid).
- **Step 4 — No Duplicate UI & Verification**: Ensure zero UI duplication, run fast tests and verify exit code 0.

---

## 3. Strict Prohibitions ❌

1. ❌ Never write `.tsx` UI code before engine logic in `.lowcode/` is implemented and verified.
2. ❌ Never embed computation, file parsing, or AST transformation logic inside UI components.
3. ❌ Never store critical application state in transient local component state (`useState`) instead of central stores/engines.
