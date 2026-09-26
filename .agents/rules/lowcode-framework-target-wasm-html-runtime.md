---
trigger: always_on
---

# Lowcode Framework Target WASM & Semantic HTML5 Dual-Build Runtime Rule

<!-- Compatibility: QUY TẮC BẮT BUỘC: ĐỊNH HƯỚNG MỤC TIÊU LÕI .LOWCODE LÀ FRAMEWORK HỢP NHẤT UI, DESIGN, SERVICE VỚI MCP CONTROL — TỰ ĐỘNG BUILD SERVICES SANG WASM & CLIENT SANG HTML, HỖ TRỢ BUILD ANDROID, IOS (FRAMEWORK TARGET WASM HTML RUNTIME RULE — ZERO TOLERANCE) -->

> **ZERO TOLERANCE POLICY**:
> Across the entire `LowcodeStudio` project and `.lowcode` ecosystem:
>
> 1. **MANDATORY DEFINITION OF .LOWCODE AS A UNIFIED FRAMEWORK**:
>    `.lowcode` is not merely a tool directory; it is a **comprehensive framework** unifying three core pillars: **UI** (User Interface), **Design** (Visual & Design System), and **Service** (Domain Business Logic), centrally governed and orchestrated by **MCP Control** (Model Context Protocol) to **optimally empower AI Coding Agents**.
> 2. **MANDATORY AUTOMATIC DUAL-BUILD PIPELINE AT RUNTIME**:
>    When the system operates in runtime execution mode (`runtimeMode: true`):
>    - **Service Instances -> WASM**: All microservices, use cases, and domain logic are automatically compiled into sandboxed WebAssembly bytecode (`.wasm`) for native-speed, secure, and isolated execution.
>    - **Client UI -> Semantic HTML5**: The entire UI tree and AST are automatically compiled into clean, semantic HTML5 with CSS theme tokens and a JS bridge for direct rendering, maximizing First Contentful Paint (FCP) in web browsers.
> 3. **FULL BUILD TARGET SUPPORT FOR BROWSER, ANDROID, AND IOS**:
>    The runtime compiler must support 3 target platforms:
>    - **Browser** (default): HTML5 client + WASM services runtime.
>    - **Android**: Packaged into an APK container / Android Web runtime (Min SDK >= 26).
>    - **iOS**: Packaged into an iOS app bundle / WebKit runtime container (Deployment Target >= 15.0).
> 4. **PROJECT ARCHITECTURAL GOVERNANCE (Rule 47 / Lowcode Rule 39)**:
>    All engines, UI components, builder pipelines, and agent prompts must strictly comply.

---

## 1. Core Purpose & Architectural Significance

1. **Unified 3-Pillar Framework**:
   - **Pillar 1 — UI**: Declarative AST management (`LandingNode`), `.ui.lc` pages, hierarchical tree, IDE standard Base components (`<Button>`, `<Input>`, `<Container>`), and Responsive Layouts.
   - **Pillar 2 — Design**: Synchronized Figma tokens, 8-pt layout grid, 4 IDE Themes (Light, Dark, Midnight, Sepia) via standard CSS variables (`var(--primary, #6938ef)`, `var(--surface)`, `var(--text)`, `var(--border)`), with zero inline styles.
   - **Pillar 3 — Service**: Complete domain business logic with `.lc` syntax, `@UseCase`, `@Story`, `@Controller` decorators, repository linkage via `refer`, and `LcContext` execution state.

2. **MCP Governance Optimized for AI Coding Agents**:
   - AI Coding Agents interact with the framework through structured Model Context Protocol (MCP). Every action has validation schemas (`schemas/*.schema.json`), templates (`templates/*.template.json`), and specifications in `standard-specification.md`.
   - Empowers AI agents to understand project context deeply, generate code accurately, and automate the lifecycle from concept to runtime without errors.

3. **Dual-Build Runtime Engine: WASM for Services & HTML for Client**:
   - **WASM for Services**: Microservices compile to WebAssembly binary (`compileServiceToWasmBytecode`) loaded directly into memory pages (64KB/page), maximizing throughput and stability.
   - **HTML for Client**: Complete decoupling of UI rendering eliminates heavy framework overhead on release, producing standards-compliant W3C HTML5 that executes immediately across all modern browsers.

4. **Cross-Platform Target Delivery**:
   - `Browser`: Web applications and instant preview in Studio Editor.
   - `Android`: Mobile APK containers and Android ADB simulator (`vm-android-apk-simulator`).
   - `iOS`: Packaged iOS container bundle for Apple environments.

---

## 2. Architecture & Compilation Matrix

| Pillar / Component      | Technology & Format                          | Runtime Processing Mechanism                    | Supported Target Platforms    |
| ----------------------- | -------------------------------------------- | ----------------------------------------------- | ----------------------------- |
| **UI (User Interface)** | `.ui.lc`, AST `LandingNode`, Base Components | Compiled to semantic HTML5 + CSS bundle         | Browser, Android, iOS         |
| **Design (Visual)**     | Figma Tokens, 8-pt Grid, 4 IDE Themes        | Packaged system standard CSS variables          | Browser, Android, iOS         |
| **Service (Domain)**    | `.lc`, `@UseCase`, `@Controller`, `refer`    | Automatically compiled to WebAssembly (`.wasm`) | WASM Sandbox (Browser/Mobile) |
| **MCP Control**         | Actions, Schemas, Templates, Tooling         | Lifecycle governance and AI agent orchestration | IDE & Automated Agent Engines |

---

## 3. Prohibited Practices ❌

1. ❌ **NEVER** treat `.lowcode` as an auxiliary configuration folder; it must be treated as a comprehensive framework unifying UI, Design, and Service under MCP Control.
2. ❌ **NEVER** run runtime services without sandboxed WebAssembly (`.wasm`) bytecode compilation.
3. ❌ **NEVER** render browser client UI using raw, uncompiled non-semantic markup.
4. ❌ **NEVER** eliminate or disable Android and iOS build options in the builder/runtime engine.
5. ❌ **NEVER** introduce inline styles or raw emojis into published client HTML (Rules 14, 18, 20).

---

## 4. Compliance Checklist

- [ ] Framework direction is formally recognized in `lowcode-framework-target-wasm-html-runtime.md`.
- [ ] Rule incorporated in `standard-for-project.md`.
- [ ] Action `update_lowcode_framework_target_wasm_html_runtime` registered in `actions.json`, schema, template, and Section 726 of `standard-specification.md`.
- [ ] Core Engine `LcFrameworkRuntimeTargetEngine` implemented in `Lowcode/sources/build/`, exported at `sources/build/index.ts`, and registered in `lc_engines.frameworkRuntimeTarget`.
- [ ] Automated dual-build mechanism for WASM services and HTML client functions seamlessly.
- [ ] Full support for `browser`, `android`, and `ios` build targets verified.
