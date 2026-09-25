# Mandatory Rule: Project Target Immutability & Leader Governance (Rule 46 & Rule 64)

> **ZERO TOLERANCE**:
> When creating, developing, extending, or refactoring code across the 2-TEK ecosystem:
> **MANDATORY 100%: MAKE PROJECT TARGET NOT CHANGE (DUY TRÌ VÀ BẢO VỆ MỤC TIÊU DỰ ÁN KHÔNG THAY ĐỔI)**:
> Under no circumstances may any agent or developer alter, blend, or cross-contaminate the canonical identities of packages in `Packages/`.
> Before updating any file in any package, developers and AI Agents **MUST read `Packages/{packageName}/README.md`** first (Rule 64).

---

## 1. The 15 Immutable Package Targets

1. **Hub (`Packages/Hub`)**:
   - Canonical Target: **Launch Next.js apps from builder when drop drag zip file to Hubs, and File -> save to Clouds with paths in Clouds env is ./Clouds/Applications** (Khởi chạy ứng dụng Next.js từ builder khi kéo thả tệp zip vào Hub để cài đặt launcher apps, và tệp được lưu vào Clouds với đường dẫn trong Clouds env là ./Clouds/Applications).
   - Scope: Desktop application launcher, process manager, port allocator, builder Next.js standalone runner, Clouds applications persistence (`./Clouds/Applications`), desktop packaging (`.deb`, `.exe`).
   - Prohibitions: NEVER turn Hub into a document editor, visual canvas IDE, or database backend.

2. **Office (`Packages/Office`)**:
   - Canonical Target: **Read - edit xlsx, docs, pptx** (Đọc và chỉnh sửa tài liệu văn phòng: Word, Excel, Slide).
   - Scope: Word document editor (`.docx`), spreadsheet grid calculations (`.xlsx`), presentation slides (`.pptx`), ribbon toolbars, OPC ZIP file architecture.
   - Prohibitions: NEVER turn Office into a generic website, visual Lowcode IDE canvas, production bot, or app launcher.

3. **SuperChat (`Packages/SuperChat`)**:
   - Canonical Target: **Mix chat from many apps** (Hợp nhất tin nhắn và trò chuyện từ nhiều ứng dụng và dịch vụ).
   - Scope: Multi-channel messaging inbox, AI chat integration, real-time websockets, Hub account session sync.
   - Prohibitions: NEVER turn SuperChat into a document editor, lowcode canvas, or app launcher.

4. **LowcodeStudio (`Packages/LowcodeStudio`)**:
   - Canonical Target: **Lowcode IDE & Visual Canvas Editor**
   - Scope: Visual canvas editor, drag-and-drop component tree, inspector panels, AST JSON schema manipulation, 4 IDE themes.
   - Prohibitions: NEVER turn LowcodeStudio into an office suite editor, end-user business app, or production bot daemon.

5. **Lowcode (`Packages/Lowcode`)**:
   - Canonical Target: **Lowcode programming language, runtime, WASM & HTML5 dual-build engine**
   - Scope: Core Lowcode programming language (`.lc`), decorators (`@Page`, `@UseCase`), WASM bytecode compilation for services, semantic HTML5 generation for UI, MCP tool actions.
   - Prohibitions: NEVER treat `.lowcode` as casual UI code or office-specific file logic.

6. **Bots (`Packages/Bots`)**:
   - Canonical Target: **Production mission control, automated pipelines, and agent orchestration**
   - Scope: Production Mission Control Bot (port 3012), Telegram long polling, Antigravity AI agent orchestration, Docker build gating, release verification.
   - Prohibitions: NEVER turn Bot into a document editor, client web portal, or visual canvas designer.

7. **CompanyWeb (`Packages/CompanyWeb`)**:
   - Canonical Target: **Official corporate web presence and customer portal of 2-TEK**
   - Scope: Enterprise corporate public website, marketing landing pages, customer dashboards, product showcases, multilingual portal.
   - Prohibitions: NEVER contaminate CompanyWeb with lowcode AST compilation engines or bot task runners.

8. **SystemAdmin (`Packages/SystemAdmin`)**:
   - Canonical Target: **Administrative operations, user management, and ecosystem telemetry**
   - Scope: Enterprise RBAC permissions, user management, live server metrics, service telemetry, audit logs, mandatory login first (Rule 57).
   - Prohibitions: NEVER turn SystemAdmin into an office document editor or canvas designer.

9. **DeviceFarms (`Packages/DeviceFarms`)**:
   - Canonical Target: **Virtual devices fleet, mobile emulators, and automated testing farm**
   - Scope: Android simulators, iOS simulators, Linux/Windows VMs, remote screen streaming, automated browser test runner pools.
   - Prohibitions: NEVER turn DeviceFarms into an office document suite or messaging client.

10. **Settings (`Packages/Settings`)**:
    - Canonical Target: **Centralized system preferences, storage paths, and environment configuration**
    - Scope: Global app preferences, theme configuration, storage paths (`APPS_STORAGE_PATH`, `FILES_STORAGE_PATH`), protected undeletable system package.
    - Prohibitions: NEVER turn Settings into an app launcher or public marketing website.

11. **AiAssistant (`Packages/AiAssistant`)**:
    - Canonical Target: **Autonomous AI copilot platform and conversational intelligence studio**
    - Scope: Standalone AI conversational workspace, Model Context Protocol (MCP) bridge, multi-agent collaboration, streaming LLM execution.
    - Prohibitions: NEVER turn AiAssistant into a generic corporate website or document spreadsheet.

12. **Iconbuilder (`Packages/Iconbuilder`)**:
    - Canonical Target: **Vector SVG icon studio & asset generator**
    - Scope: Visual SVG canvas editor, bezier path manipulation, Lucide icon styling, theme token adaptation, Base `<IdeIcon>` asset export.
    - Prohibitions: NEVER use raw emoji icons (Rule 14); output must strictly produce IDE-compliant SVG vectors.

13. **Cloud (`Packages/Cloud`)**:
    - Canonical Target: **Cloud storage manager, file explorer, and asset synchronization**
    - Scope: Multi-level folder tree, drag-and-drop file control, local & S3 storage integration, centralized persistence via `FILES_STORAGE_PATH`.
    - Prohibitions: NEVER turn Cloud into a code editor or visual IDE canvas.

14. **Server (`Packages/Server`)**:
    - Canonical Target: **Backend API services, database ORM, and communication gateways**
    - Scope: RESTful & gRPC service endpoints, Prisma ORM schemas, database migrations, structured seeding, authentication gateways.
    - Prohibitions: NEVER embed front-end UI components or browser-only logic in Server.

15. **Shared (`Packages/Shared`)**:
    - Canonical Target: **Universal design system, theme tokens, and project-isolated base components**
    - Scope: Project-isolated base components (`Packages/Shared/components/{projectName}/bases`), universal theme CSS variables, layout utilities, i18n dictionaries.
    - Prohibitions: NEVER allow cross-project modifications between project base directories (Rule 61).

---

## 2. Role of the Leader Agent (`leader.md`)

The Leader Agent acts as Master Project Leader & Chief Architect, enforcing **Zero Target Drift** and supervising all specialized subagents (`devloper`, `Designer`, `git-specialist`, `test-auditor`) by verifying that each package's `README.md` is consulted before any code modification.
