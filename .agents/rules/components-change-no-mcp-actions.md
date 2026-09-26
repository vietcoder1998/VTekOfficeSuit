---
trigger: always_on
---

# Mandatory Rule: Components Change Strictly Exempt from MCP Actions (DO NOT ADD TO MCP ACTIONS)

> **ZERO TOLERANCE**:
> When handling any task regarding **Components Change / Thay Đổi Component (UI Component Modification / Refactor UI / Update Props / Styling / Sub-components / Layout)**:
>
> 1. **STRICTLY PROHIBITED 100%: TUYỆT ĐỐI KHÔNG ĐƯỢC THÊM VÀO MCP ACTIONS (DO NOT ADD TO MCP ACTIONS)**:
>    - **FORBIDDEN** to add new actions to `Lowcode/.agents/standards/MCP/actions.json`.
>    - **FORBIDDEN** to create new JSON Schemas in `Lowcode/.agents/standards/MCP/schemas/`.
>    - **FORBIDDEN** to create new Templates in `Lowcode/.agents/standards/MCP/templates/`.
>    - **FORBIDDEN** to write new Sections in `Lowcode/.agents/standards/MCP/standard-specification.md`.
> 2. **SKIP MCP STEP AND EXECUTE DIRECTLY IN UI / ENGINE**:
>    - The UI component layer (`components/**/*.tsx`, `app/**/*.tsx`) is purely a **display-only / pure presentation layer**.
>    - MCP actions standardize functional backend services and runtime tools callable by AI agents. Local UI modifications have no tool call semantics.
>    - Adding MCP actions for component changes pollutes the action catalog and bloats AI context.

---

## 1. Core Purpose & Architectural Importance

1. **Clean & Focused MCP Catalog (Zero Bloat)**:
   - Tool calling is reserved for computational logic, storage operations, and external integrations.
   - UI component changes are visual DOM structures, not headless tools.

2. **Engine-First Principle (Rule 9)**:
   - Business logic resides in `Lowcode/` or `lc_engines/`.
   - UI components merely render state and dispatch user events. Modifying presentation generates zero new system capabilities.

---

## 2. Component Change Exemption Matrix

| Component Change Nature                      | Typical Example                                          | Add to MCP Actions?           | Mandatory Action                                   |
| -------------------------------------------- | -------------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| **Update Props / Variants**                  | Add `selectedItemId`, `disabled`, size variants          | ❌ **FORBIDDEN (DO NOT ADD)** | Update interface and JSX directly.                 |
| **Subcomponent Decomposition (Rule 16)**     | Split >500 line file into header, body, footer           | ❌ **FORBIDDEN (DO NOT ADD)** | Decompose files in modular folder with `index.ts`. |
| **Style to Theme Conversion (Rule 18 & 20)** | Replace `style={{ ... }}` with CSS theme classes         | ❌ **FORBIDDEN (DO NOT ADD)** | Update className and theme stylesheet tokens.      |
| **HTML to Base Components (Rule 14)**        | Replace `<input>` with `<Input>`, emoji with `<IdeIcon>` | ❌ **FORBIDDEN (DO NOT ADD)** | Reuse `@/components/bases`. No MCP actions.        |
| **Add / Edit Translations (Rule 21 & 37)**   | Add translation keys `t(...)` for labels                 | ❌ **FORBIDDEN (DO NOT ADD)** | Add dictionary keys in messages.                   |
| **Layout Adjustments**                       | Refine padding, margin, flex gap, 8-pt grid              | ❌ **FORBIDDEN (DO NOT ADD)** | Use utility classes in `styles/layout.css`.        |
| **Add Semantic ID (Rule 13)**                | Add kebab-case `id="..."` attributes to containers       | ❌ **FORBIDDEN (DO NOT ADD)** | Apply semantic ID directly in JSX.                 |
| **Component Bug Fix**                        | Fix textarea layout overflow, alignment                  | ❌ **FORBIDDEN (DO NOT ADD)** | Fix component and verify with unit tests.          |

---

## 3. Strict Prohibitions ❌

1. ❌ Never register actions like `update_ribbon_component_inputs` or `change_header_style` in `actions.json`.
2. ❌ Never create JSON schemas for individual UI components.
3. ❌ Never delay UI improvements to write MCP specifications when the task is solely a component change.
