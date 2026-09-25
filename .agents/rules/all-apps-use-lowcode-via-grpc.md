# Mandatory Rule: All Apps in Packages Must Use Lowcode via gRPC with Zero Direct Logic Imports — Lowcode Runs as Instance Service Under Hub with Sleep Mode by Default (Rule 66)

<!-- Test Alias: RULE 66 / ALL APPS IN PACKAGES USE LOWCODE VIA GRPC RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across the entire 2-TEK ecosystem and all applications in `Packages/`:
> 1. **MANDATORY 100%: ALL APPS IN PACKAGES MUST USE LOWCODE VIA GRPC**:
>    - Every application in `Packages/` (including `AiAssistant`, `LowcodeStudio`, `Office`, `Word`, `Excel`, `Presentation`, `Pdf`, `Forms`, `Notes`, `CompanyWeb`, `SuperChat`, `Cloud`, `DeviceFarms`, `Bots`, `Server`, etc.) that requires Lowcode capabilities, engines, document operations, AI tools, or project manipulation **MUST** communicate exclusively by calling gRPC through package-local gRPC client stubs (e.g. `@/lib/grpc` or `@/app/api/_grpc`). `@Shared` must no longer be used for gRPC calls.
> 2. **STRICTLY PROHIBITED 100%: DIRECT LOGIC IMPORTS FROM LOWCODE**:
>    - **FORBIDDEN** to import runtime logic, core engines, stores, calculators, AST compilers, or backend controllers directly from Lowcode (e.g. `import { ... } from "@Lowcode/sources/..."`, `import { ... } from "../Lowcode/..."`, or `import("@Lowcode/...")`).
>    - Only compile-time static TypeScript type declarations are permissible (`import type { ... } from "@Lowcode/types"` or `local package types`), with zero runtime JavaScript import overhead.
> 3. **MANDATORY 100%: LOWCODE RUNS AS AN INSTANCE SERVICE UNDER HUB**:
>    - Lowcode does not run as a fragmented per-app library; it runs as a centralized background instance service orchestrated directly under **2-TEK Hub** (`Packages/Hub`).
>    - Hub manages the Lowcode service lifecycle (spawning, port binding, health monitoring, and graceful shutdown).
> 4. **MANDATORY 100%: HUB STARTS LOWCODE AS AN INSTANCE ON STARTUP IN SLEEP MODE BY DEFAULT**:
>    - When Hub starts (`npm run dev`, `npm start`, desktop runner, or `instrumentation.ts`), Hub automatically initiates and starts the Lowcode instance service via programmatic call.
>    - **Default Sleep Mode**: Lowcode starts and remains by default in **sleep mode** (`mode: "sleep"` / standby state), listening on its designated HTTP port (default `3100`) and gRPC port (default `50052`) with minimal CPU and memory consumption.
> 5. **MANDATORY 100%: WAKE-ON-CALL & SEAMLESS RPC PROCESSING**:
>    - When any application or client dispatches a gRPC request to Lowcode, the instance service handles the call immediately (waking on demand or executing in sleep mode without blocking callers) and returns to standby when idle.
>    - Hub and client applications can explicitly inspect and toggle service mode using gRPC actions `service.status`, `service.wake`, and `service.sleep`.
> 6. **MANDATORY 100%: ZERO ORPHAN PROCESSES ON TASK CLOSE**:
>    - Whenever Hub is closed or the task is finished, Hub's shutdown handlers cleanly terminate the Lowcode service instance and release ports 3100 and 50052.

---

## 1. Core Architectural Rationale

1. **Elimination of Massive Redundant Bundles & Cross-Package Coupling**:
   - Importing `@Lowcode/sources/*` directly into individual apps pulls huge portions of the Lowcode engine tree into each app's Next.js webpack/turbopack bundle, causing slow build times, memory bloat, and compilation failures.
   - Decoupling apps from Lowcode source files into gRPC RPC calls ensures each app remains lightweight, self-contained, and isolated.

2. **Single Source of Truth in a Dedicated Lowcode Service**:
   - The Lowcode engine runs as an authoritative instance service. State, AST manipulation, and backend tools execute consistently in one place without divergent in-memory states across multiple separate apps.

3. **Energy & Resource Efficiency via Default Sleep Mode**:
   - Running heavy background engines constantly consumes unnecessary memory and CPU cycles.
   - Starting in sleep mode allows Lowcode to be instantly reachable over gRPC (ports ready) while keeping background pollers, file watchers, and heavy cache builders dormant until explicitly needed.

---

## 2. Permitted vs. Prohibited Syntax Matrix

| Prohibited Syntax ❌ | Mandatory Architecture ✅ | Reason |
|---|---|---|
| `import { generateAiComponent } from "@Lowcode/sources/ai/..."` | `await grpcClientService.invokeAction("ai.assistant", payload)` | Violates Rule 66: direct logic import. Must call gRPC. |
| `import { getAdminAuditLogs } from "@Lowcode/sources/stores/..."` | `await grpcClientService.invokeAction("admin.audit-logs.list", query)` | Violates Rule 66: direct store import. Must call gRPC. |
| `import { lc_workspace_standard_engine } from "@Lowcode/sources/..."` | `await grpcClientService.invokeAction("workspace.query", params)` | Violates Rule 66: direct engine import. Must call gRPC. |
| `import { lc_office_suite_engine } from "@Lowcode/sources/office/..."` | `await grpcClientService.invokeAction("office.document.*", payload)` | Violates Rule 66: direct logic import. Must call gRPC. |
| Spawning `tsx Packages/Lowcode/server.ts` manually from child app | Hub auto-starts Lowcode instance service in sleep mode | Violates Rule 66: Hub is the sole orchestrator. |

---

## 3. Standard gRPC Client Usage Syntax

```typescript
import { grpcClientService } from "@/lib/grpc"; // or "@/app/api/_grpc"

// 1. Invoke standard Lowcode Action over gRPC
const response = await grpcClientService.invokeAction("ai.assistant", {
  message: "Generate a hero card component",
  context: { pageName: "landing" }
});

if (response.success && response.dataJson) {
  const resultData = JSON.parse(response.dataJson);
  // Process resultData...
}

// 2. Check Service Health & Sleep Mode
const status = await grpcClientService.getServiceStatus();
console.log(`Lowcode Server: ${status.status}, Mode: ${status.mode}`);

// 3. Wake or Sleep on Demand
await grpcClientService.wakeService();
await grpcClientService.sleepService();
```

---

## 4. Hub Lowcode Service Lifecycle Specification

1. **Hub Launch Phase**:
   - Hub executes `lowcodeInstanceService.startLowcodeInstance({ sleepMode: true })`.
   - Lowcode spawns with `--port 3100 --grpc-port 50052 --sleep-mode`.
   - Hub logs: `[Hub Service] Lowcode instance service started in sleep mode (HTTP: 3100, gRPC: 50052)`.

2. **Runtime & RPC Execution Phase**:
   - Incoming gRPC procedure calls arrive on port `50052`.
   - Gateway dispatcher routes call to target engine and returns payload without requiring manual process spawning.
   - Lowcode remains responsive, maintaining sleep mode or entering active state during execution.

3. **Hub Task Done & Termination Phase**:
   - When Hub shuts down (SIGINT, SIGTERM, `kill-port-3020`), Hub's process manager triggers `lowcodeInstanceService.stopLowcodeInstance()`.
   - Ports 3100 and 50052 are released cleanly.

---

## 5. Automated CI & Audit Enforcement

- Verified automatically via `node scripts/scan-lowcode-grpc.mjs --audit`.
- Any package containing direct backend imports from `@Lowcode/sources/...` will fail the audit and block commits.
