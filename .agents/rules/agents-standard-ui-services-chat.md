# Mandatory Rule: Standardize AI Chat Assistant UI & Services Integration (Rule 24 & Section 524)

> **ZERO TOLERANCE**:
> When configuring, initializing, or granting permissions to AI Assistants or Copilot Studio across the project:
>
> 1. **MANDATORY 100% CONFORM TO `Lowcode/.agents/standards/Agents/`**:
>    - Internal project MCP capabilities must be declared in `mcp.lc`, specifying explicit permissions for UI updates (`uiUpdates.enabled: true`) and Services (`servicesUpdates.enabled: true`).
>    - External 3rd-party MCP server connections must be declared in `3th.mcp.lc` with standard transports (`http`, `sse`, `stdio`), endpoints, secure headers, and timeouts.
>    - Agent identity, system prompts, and permissions flags must be defined in `agents.lc` and validated via `LcAgentsStandardEngine`.
> 2. **GOVERN UI & SERVICES CHAT OPERATIONS**:
>    - When AI Assistant updates UI AST nodes: strictly ban inline styles (Rules 18 & 20), enforce IDE Theme CSS classes (`var(--primary, #6938ef)`).
>    - All generated containers must have unique semantic kebab-case IDs (Rule 13), and all icons must use Base `<IdeIcon>` (Rule 14).
>    - When updating backend Services: generate `.controller.lc`, `.usecase.lc` and register routes in `routes.lc`.

---

## 1. Core Purpose & Architectural Importance

1. **Full-Stack Chat Directives**:
   - Enables users to request both UI alterations (_"Update checkout button to primary and open payment modal"_) and backend alterations (_"Create orders-service with Stripe controller"_) through structured AI actions.

2. **Clean Separation of Internal vs 3rd-Party MCP**:
   - `mcp.lc`: Internal project manipulation (AST nodes, UI layouts, local services, controllers, routes).
   - `3th.mcp.lc`: External integrations (GitHub repositories, remote PostgreSQL, Figma Cloud).

---

## 2. Chat MCP Tool Matrix

| Category      | Tool Name            | Scope                                                   | Config File  |
| ------------- | -------------------- | ------------------------------------------------------- | ------------ |
| **UI**        | `update_component`   | Update LcNode content, props, theme styles on Canvas    | `mcp.lc`     |
| **UI**        | `insert_component`   | Insert Base Components (@Modal, @Card, @Button, @Table) | `mcp.lc`     |
| **UI**        | `modify_styles`      | Apply theme classes and flexbox/grid layout             | `mcp.lc`     |
| **UI**        | `create_page`        | Initialize new page route with slug                     | `mcp.lc`     |
| **Services**  | `update_service`     | Update microservice domain, metadata, use cases         | `mcp.lc`     |
| **Services**  | `create_controller`  | Generate `*.controller.lc` with `@Controller` decorator | `mcp.lc`     |
| **Services**  | `create_usecase`     | Generate business use case logic with `@UseCase`        | `mcp.lc`     |
| **Services**  | `bind_service_route` | Map controller endpoint to `routes.lc`                  | `mcp.lc`     |
| **3rd-Party** | `github:*`           | Create issues, commits, inspect remote repositories     | `3th.mcp.lc` |
| **3rd-Party** | `postgres:*`         | Query external PostgreSQL database via subprocess       | `3th.mcp.lc` |
| **3rd-Party** | `figma:*`            | Export design tokens and frames via SSE                 | `3th.mcp.lc` |

---

## 3. Strict Prohibitions ❌

1. ❌ Never allow AI Assistant to update UI using hardcoded inline styles.
2. ❌ Never generate components or containers without descriptive `id` attributes.
3. ❌ Never generate backend service code without binding to use cases and `routes.lc`.
4. ❌ Never invoke 3rd-party MCP servers without declared transport and authentication in `3th.mcp.lc`.
