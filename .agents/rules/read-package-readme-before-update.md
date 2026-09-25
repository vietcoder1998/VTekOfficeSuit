# Mandatory Rule: Read Target Package README Before Any Update (Rule 64 & Section 864)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TRƯỚC KHI CẬP NHẬT BẤT KỲ FILE NÀO TRONG PACKAGE PHẢI ĐỌC FILE README.MD CỦA PACKAGE ĐÓ ĐỂ XÁC ĐỊNH ĐÚNG MỤC TIÊU CỦA APP (READ PACKAGE README BEFORE UPDATE RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 64. **[MANDATORY RULE: READ TARGET PACKAGE README.MD BEFORE ANY UPDATE (RULE 64)]** -->

> **ZERO TOLERANCE**:
> When creating, modifying, updating, refactoring, or generating any file, component, route, engine, or configuration across any package in `Packages/`:
> 1. **MANDATORY 100%: READ TARGET PACKAGE README.MD FIRST**:
>    - Before updating or writing code in `Packages/{packageName}`, AI Agents (`devloper`, `leader`, `Designer`, `test-auditor`, `git-specialist`) and developers **MUST read `Packages/{packageName}/README.md` first**.
>    - The agent must thoroughly inspect:
>      - The **Canonical Target of App** (Mục tiêu cốt lõi của ứng dụng).
>      - The core responsibilities, key features, and designated default port/routes.
>      - The **Strict Domain Boundaries & Prohibitions** (Zero Tolerance).
> 2. **MANDATORY 100% ZERO TARGET DRIFT (MAKE PROJECT TARGET NOT CHANGE)**:
>    - Every single code change, component, API endpoint, or service MUST strictly serve and conform to the Canonical Target defined in that package's `README.md`.
>    - Examples of Immutable Targets:
>      - **`Packages/Hub`**: **Drop & drag build Next.js to launcher apps** (Kéo thả bản build Next.js để cài đặt và khởi chạy ứng dụng độc lập).
>      - **`Packages/Office`**: **Read - edit xlsx, docs, pptx** (Đọc và chỉnh sửa tài liệu văn phòng: Word, Excel, Slide).
>      - **`Packages/SuperChat`**: **Mix chat from many apps** (Hợp nhất tin nhắn và trò chuyện từ nhiều ứng dụng và dịch vụ).
>      - **`Packages/LowcodeStudio`**: **Lowcode IDE & Visual Canvas Editor** (Môi trường kéo thả giao diện trực quan và biên soạn AST JSON).
>      - **`Packages/Lowcode`**: **Lowcode programming language, runtime, WASM & HTML5 dual-build engine**.
>      - **`Packages/Bots`**: **Production mission control, automated pipelines, and agent orchestration** (port 3012).
>      - **`Packages/CompanyWeb`**: **Official corporate web presence and customer portal of 2-TEK**.
>      - **`Packages/SystemAdmin`**: **Administrative operations, user management, and ecosystem telemetry**.
>      - **`Packages/DeviceFarms`**: **Virtual devices fleet, mobile emulators, and automated testing farm**.
>      - **`Packages/Settings`**: **Centralized system preferences, storage paths, and environment configuration**.
>      - **`Packages/AiAssistant`**: **Autonomous AI copilot platform and conversational intelligence studio**.
>      - **`Packages/Iconbuilder`**: **Vector SVG icon studio and design asset generator**.
>      - **`Packages/Cloud`**: **Cloud storage manager, file explorer, and asset synchronization**.
>      - **`Packages/Server`**: **Backend API services, database ORM, and communication gateways**.
>      - **`Packages/Shared`**: **Universal design system, theme tokens, and project-isolated base components**.
> 3. **STRICT PROHIBITIONS (ZERO TOLERANCE)**:
>    - ❌ **STRICTLY FORBIDDEN** to edit, refactor, or add files to any package without reading its `README.md` first.
>    - ❌ **STRICTLY FORBIDDEN** to contaminate a package with capabilities belonging to another package (e.g. adding document editing to Hub, adding AST compilers to Office, adding corporate landing pages to LowcodeStudio).
>    - ❌ **STRICTLY FORBIDDEN** to alter, dilute, or diverge from the defined Canonical Target of App.
> 4. **AGENT GOVERNANCE GATE**:
>    - Enforced by the Master Project Leader Agent (`leader.md`) and Devloper Agent (`coder.md`).
>    - If a user prompt requests features outside a package's defined target, the agent must preserve target immutability and route the implementation to the designated package.

---

## 1. Core Purpose & Architectural Importance

1. **Elimination of Architectural Scope Drift**:
   - In a multi-package monorepo ecosystem with 15 distinct applications and packages, autonomous AI agents can easily introduce out-of-scope features if they fail to consult the package's canonical purpose.
   - Reading `README.md` beforehand grounds the agent in the package's design intentions, preventing identity confusion.

2. **Domain Boundary Enforcement**:
   - Each package represents a specialized micro-frontend, desktop runtime, or backend service.
   - Clear boundaries guarantee maintainability, clean dependency graphs, and independent release cycles.

3. **Autonomous Pair-Programming Clarity**:
   - When developers collaborate with AI assistants, the `README.md` acts as the single source of truth for the package's target, routes, ports, and architectural guidelines.

---

## 2. Pre-Update Decision Flow

```
[Agent or Developer Receives Request for Package X]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Read Packages/{packageName}/README.md              │
│ • Inspect Canonical Target of App                           │
│ • Inspect Key Responsibilities & Prohibitions               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
             Does request match target?
                ┌────────┴────────┐
                ▼                 ▼
              [YES]              [NO]
                │                 │
                ▼                 ▼
         Proceed with task    ⛔ HALT / REROUTE
        (conform to target)   (to correct package)
```

---

## 3. Compliance Checklist

- [ ] `Packages/{packageName}/README.md` read before editing files in that package.
- [ ] Changes align 100% with the Canonical Target of App.
- [ ] Zero cross-contamination with other package domains.
- [ ] EOF check (Rule 29: exact 1 trailing newline) verified on updated files.
