---
trigger: always_on
---

# Mandatory Rule: UI Features Require Existing Engine Implementation (UI-Engine Gate Rule)

> **ZERO TOLERANCE — NO EXCEPTIONS**:
> Any feature, action, button, menu item, toggle, or UI element representing a **system capability**:
> **MANDATORY MUST have an existing implementation in `lc_engines/` or `Lowcode/` BEFORE creating UI**.
> If backend/engine logic does not exist → **STRICTLY PROHIBITED to create UI**, including placeholders, disabled buttons, or mock interfaces.

---

## 1. Definition of "Engine Gate"

A UI feature passes the Engine Gate when ALL of the following criteria are satisfied:

| Condition                       | Description                                                                             | Verification Target                                          |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| ✅ **Function / Method Exists** | Exported function, class method, or store action executes feature logic                 | `lc_engines/*.ts`, `Lowcode/engines/*.ts`, `Lowcode/lc-*.ts` |
| ✅ **Types / Schemas Defined**  | Explicit TypeScript interfaces or Zod schemas define input/output contracts             | Same file or `types/`, `Lowcode/.agents/standards/`                 |
| ✅ **Non-Stub Implementation**  | Function is not `throw new Error("TODO")`, `console.log("stub")`, or empty body         | Inspect implementation body                                  |
| ✅ **MCP Entry Registered**     | Registered in `Lowcode/.agents/standards/MCP/actions.json` with `id`, `payload`, `description` | `Lowcode/.agents/standards/MCP/actions.json`                        |

---

## 2. Pre-Implementation Workflow

```
Receive Request: "Add Feature X to UI"
         │
         ▼
[STEP 0 — ENGINE GATE CHECK]
   Search "X" across lc_engines/, Lowcode/
         │
   Implementation Found?
   ├── YES → Proceed with standard flow (MCP → Engine → UI)
   └── NO  → ⛔ STOP. Must implement engine first.
             ├─ Log: "Feature X is missing engine implementation."
             └─ Implement engine logic in lc_engines/ / Lowcode/
                → ONLY THEN create UI elements
```

---

## 3. Engine Gate Verification Scan

Before creating any UI feature, execute this verification command:

```bash
grep -rn "<feature-keyword>"   lc_engines/   Lowcode/engines/   Lowcode/lc-*.ts   --include="*.ts" | grep -v "TODO\|stub\|placeholder"
```

If output is empty, the feature lacks engine support: **DO NOT CREATE UI**.
