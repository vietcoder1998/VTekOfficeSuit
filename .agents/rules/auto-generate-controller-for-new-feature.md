# Mandatory Rule: Controllers Architecture & Auto-Generate Controller for New Feature (Rule 34 & Section 606)

> **ZERO TOLERANCE**:
> 1. **CONTROLLER DIRECTORY ARCHITECTURE (`.lowcode/controllers/`)**:
>    - All API endpoints and routing controllers in the LowCode platform **MUST** be centrally defined inside `.lowcode/controllers/`.
>    - All Controllers must extend `BaseController` (`base-controller.ts`) and utilize standardized JSON response methods (`json`, `badRequest`, `notFound`, `serverError`, `ok`).
>    - All routes must be registered in `ControllersRouter` (`controllers-router.ts`) and exported via `.lowcode/controllers/index.ts`.
> 2. **AUTO-GENERATE CONTROLLER WHEN ADDING NEW FEATURES**:
>    - When a new feature is logged in `.features/*.md`, the system and AI Agent **MUST** automatically generate a corresponding controller extending `BaseController`.
>    - The new controller maps endpoints under the prefix `/api/{feature-slug}` with appropriate HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
> 3. **STARTUP SYNCHRONIZATION AT SERVER.TS**:
>    - When `server.ts` boots, it must scan registered controllers, print a route summary table (Controller, Method, Path, Handler Name, Description) to the console, and handle requests via `ControllersRouter`.
> 4. **GOVERNANCE CONFORMANCE**:
>    - Controllers must strictly adhere to Clean Code Zero Any (Rule 25), Switch-Case Preference (Rule 26), Rule 29 EOF, Singleton DI (Rule 31), and Namespace Interfaces (Rule 32).

---

## 1. Core Purpose & Architectural Importance

1. **Lightweight Native API Routing**:
   - Cleanly decouples Core Engines (`.lowcode/engines/`) from HTTP Request Controllers (`.lowcode/controllers/`).
   - Uses native Node.js HTTP (`http.IncomingMessage`, `http.ServerResponse`) without third-party framework overhead.

2. **Automated Feature-to-API Lifecycle**:
   - Ensures every feature logged in `.features/*.md` immediately receives an active API endpoint for testing, UI binding, and MCP integration.

3. **Transparent Startup Diagnostics**:
   - Provides instant terminal visibility into active routes when starting `server.ts`.
