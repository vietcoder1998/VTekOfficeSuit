---
trigger: always_on
---

# Mandatory Rule: MCP Exemption for Bug Fixes, Moving Files/Folders & Components Change (Rule 2)

> **ZERO TOLERANCE**:
>
> 1. **STRICT EXEMPTION — DO NOT IMPLEMENT TO MCP (KHÔNG ĐƯỢC TRIỂN KHAI VÀO MCP)**:
>    - When receiving or executing any task categorized as a **Bug Fix (bug / fix / hotfix / sửa lỗi)**, **Move / Rename File or Folder (di chuyển / rename file, folder, directory)**, or **Component Change (components change / UI modifications / styling / props / layout)**:
>      - **MANDATORY 100% DO NOT IMPLEMENT TO MCP** (TUYỆT ĐỐI KHÔNG ĐƯỢC triển khai vào MCP).
>      - **STRICTLY PROHIBITED**: Adding new actions to `Lowcode/.agents/standards/MCP/actions.json`.
>      - **STRICTLY PROHIBITED**: Creating new JSON Schemas in `Lowcode/.agents/standards/MCP/schemas/`.
>      - **STRICTLY PROHIBITED**: Creating new Templates in `Lowcode/.agents/standards/MCP/templates/`.
>      - **STRICTLY PROHIBITED**: Creating new Sections in `Lowcode/.agents/standards/MCP/standard-specification.md`.
>      - Skip Step 1 (MCP Standard First) entirely, proceed directly to core engine / component logic, and complete the task.
> 2. **MANDATORY MCP IMPLEMENTATION FOR NEW CAPABILITIES (ELSE DO IT / BẮT BUỘC TRIỂN KHAI MCP CHO TÍNH NĂNG MỚI)**:
>    - For all other tasks: **New Feature**, **New Tool**, **New Service**, **New Action**, or **New Capability**:
>      - **MANDATORY 100%**: Register the MCP Standard First (`actions.json`, `schemas/`, `templates/`, `standard-specification.md`) before writing any UI code.

---

## 1. Core Purpose & Architectural Importance

1. **Keeping the MCP Catalog Clean & Focused (Zero Catalog Bloat)**:
   - MCP (Model Context Protocol) standardizes external capabilities and tool interactions for AI Assistants.
   - Moving files (`mv file`, `mv folder`), directory refactoring, fixing bugs, and local UI adjustments (props, styles, subcomponents) are internal maintenance and presentation-layer tasks. They are not reusable AI tools.
   - Adding MCP actions for internal maintenance clutters tool definitions, exhausts AI context windows, and slows down development.

2. **Streamlined Developer Workflow**:
   - Bug fixes, file reorganization, and component adjustments require direct, fast execution without the administrative overhead of writing schemas, actions, and specifications.

3. **Deterministic Binary Decision Matrix**:
   - `is_fix || is_move_file_or_folder || is_components_change` ➔ **SKIP MCP (0% MCP Overhead — DO NOT IMPLEMENT TO MCP)**
   - `else (new_feature, new_capability, new_tool, new_service)` ➔ **ELSE DO IT (MCP FIRST — 100% Standard Compliance)**

---

## 2. Decision Matrix

| Task Nature                                 | Examples                                             | Implement into MCP?                 | Required Action                                                     |
| ------------------------------------------- | ---------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| **Bug Fix (sửa lỗi / bug / fix)**           | Fix textarea layout break, import error, crash       | ❌ **NO (DO NOT IMPLEMENT)**        | Skip MCP. Fix directly in Engine / UI / Style. Verify with tests.   |
| **Move / Rename File (di chuyển file)**     | Move config file, rename component file              | ❌ **NO (DO NOT IMPLEMENT)**        | Skip MCP. Move file, update imports, verify dependencies.           |
| **Move / Rename Folder (di chuyển folder)** | Move `.2tek/Example` to `.example`, rename assets    | ❌ **NO (DO NOT IMPLEMENT)**        | Skip MCP. Move folder, update scanners/loaders, verify fallbacks.   |
| **Component Change (thay đổi component)**   | Update props, refactor subcomponents, convert styles | ❌ **NO (DO NOT IMPLEMENT)**        | Skip MCP. Update UI directly conforming to Design System tokens.    |
| **New Feature (tính năng mới)**             | Add LocalDB SQL cache, drag-and-drop canvas          | ✅ **YES (ELSE DO IT — MCP FIRST)** | Mandatory: Register `actions.json`, schema, template, spec section. |
| **New Tool / Service**                      | Add DB administration tool, gRPC export              | ✅ **YES (ELSE DO IT — MCP FIRST)** | Mandatory: Register `actions.json`, schema, template, spec section. |
| **New AI / IDE Capability**                 | Add IDE command, AI Copilot capability               | ✅ **YES (ELSE DO IT — MCP FIRST)** | Mandatory: Register `actions.json`, schema, template, spec section. |

---

## 3. Strict Prohibitions ❌

1. ❌ Never create MCP actions in `actions.json` for bug fixes (e.g. `fix_loop_refresh`, `fix_missing_message`).
2. ❌ Never create MCP actions in `actions.json` for file/folder moves or renames.
3. ❌ Never create MCP actions in `actions.json` for component modifications.
4. ❌ Never bypass MCP Standards for genuine new features and capabilities.
