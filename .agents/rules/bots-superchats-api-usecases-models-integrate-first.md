# Mandatory Rule: Bots & SuperChats New Features — Generate API with Usecases, Models, and Integrate First (Rule 52 & Section 652)

<!-- Compatibility: QUY TẮC BẮT BUỘC: VỚI BOTS VÀ SUPERCHATS, KHI TẠO FEATURE MỚI CHỈ GENERATE API CÙNG USECASES, MODELS VÀ INTEGRATE TRƯỚC (BOTS & SUPERCHATS API-FIRST RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 52. **[MANDATORY RULE: BOTS & SUPERCHATS — GENERATE API WITH USECASES, MODELS AND INTEGRATE FIRST FOR NEW FEATURES (RULE 52)]** -->

> **ZERO TOLERANCE**:
> When creating, planning, or implementing any new feature across `Bots` (`Packages/Bots`, `bot`) and `SuperChats` (`Packages/SuperChat`, `super-chat`):
> 1. **MANDATORY 100% API & BACKEND-FIRST (MODELS, USECASES, INTEGRATION FIRST)**:
>    - For any new feature request in `Bots` and `SuperChats`, developers and AI Agents **MUST ONLY generate and integrate the backend foundation first**:
>      - **Phase 1 — Models & Data Contracts**: Explicitly define Domain Models, Data Transfer Objects (DTOs), Entities, request/response interfaces, and validation schemas (`types/`, `dtos/`, `entities/`, `interfaces/`). Zero `any` types (Rule 25), explicit variable type annotations before `=` (Rule 44).
>      - **Phase 2 — Usecases & Core Business Services**: Encapsulate all business logic, AI interactions, workflows, database/storage operations, and orchestration in dedicated Use Cases or Service classes (`lib/`, `services/`, `.features/`, `app/_/services/`). Follow Singleton + Dependency Injection (Rule 39).
>      - **Phase 3 — API Endpoints & Route Handlers**: Implement standard API routes or controllers (`app/api/{feature-slug}/route.ts` or controllers) handling HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), HTTP status codes, input validation, and structured JSON responses.
>      - **Phase 4 — Integration & Automated Tests**: Connect all layers end-to-end and implement automated integration and unit tests (`tests/`, `test/`) verifying payload contracts, business rules, and error handling before touching any user interface.
> 2. **STRICT PROHIBITION: ZERO PREMATURE OR UNBOUND UI GENERATION**:
>    - **TUYỆT ĐỐI KHÔNG** generate front-end UI components (`.tsx`), pages, views, interactive forms, tabs, or modal dialogs before the API, usecases, models, and integration tests are 100% completed and passing.
>    - Generating mock UI, speculative UI, or UI bound to non-existent API routes is strictly prohibited.
> 3. **PHASED FEATURE GATING (API/BACKEND FIRST, UI CONSUMPTION SECOND)**:
>    - The primary initial deliverable for new features in Bots and SuperChats is strictly the working, tested API layer with integrated usecases and models.
>    - Only after backend integration tests exit with code 0 and endpoints are verified may client UI components be constructed to consume the live API (strictly adhering to Rule 14 IdeIcon, Rule 18/20 No Inline Styles, Rule 13 Default ID, Rule 50 Shared Bases, and Rule 51 LazyLoad & Skeleton Loading).

---

## 1. Core Purpose & Architectural Importance

1. **High-Concurrency, Service-Driven Ecosystems**:
   - `Bots` manages autonomous task dispatching, Docker builds, background workers, AI sensor streams, and remote server controllers.
   - `SuperChats` orchestrates multi-channel conversations, AI LLM streaming (OpenRouter, Gemini), Webhooks, Realtime WebSockets, and IAM permissions.
   - Prematurely generating UI before stabilizing the API and domain models leads to broken states, fragile mock data, and cascading refactoring once real backend contracts evolve.

2. **Clean Separation of Concerns (Clean Architecture)**:
   - **Domain / Models Layer**: Unchanging business rules and strict TypeScript type contracts.
   - **Use Case / Service Layer**: Application orchestrations, external service adapters, and algorithmic logic.
   - **API / Interface Adapter Layer**: Route handlers converting incoming HTTP requests to usecase calls and returning consistent JSON payloads.
   - **Presentation Layer (UI)**: Pure view binding and event dispatching that simply consumes verified APIs.

3. **Immediate Automation & Headless Verification**:
   - Generating API, models, and use cases first allows automated CI pipelines, Vitest/Node test runners, and AI Copilots to immediately verify feature behavior headless without requiring a web browser or manual clicks.

---

## 2. Directory Architecture & Layer Conventions

### 2.1. Packages/Bots (`bot`) Architecture

| Layer | Target Location | Responsibilities & Patterns |
|---|---|---|
| **Models & Contracts** | `Packages/Bots/types/`, `Packages/Bots/app/api/...` | Domain interfaces, request payloads, response DTOs, Zod/type guards. Rule 25 (no `any`), Rule 44 (`: Type =`). |
| **Usecases & Services** | `Packages/Bots/lib/`, `Packages/Bots/.features/` | Core logic, bot orchestrators, Docker managers, sensor collectors. Rule 39 (Singleton + DI). |
| **API Route Handlers** | `Packages/Bots/app/api/{feature-slug}/route.ts` | Next.js App Router API endpoints (`GET`, `POST`, `PUT`, `DELETE`). Return `NextResponse.json(...)`. |
| **Integration Tests** | `Packages/Bots/tests/` | Automated tests verifying route responses, status codes, and edge cases. Rule 36 fast testing. |

### 2.2. Packages/SuperChat (`super-chat`) Architecture

| Layer | Target Location | Responsibilities & Patterns |
|---|---|---|
| **Models & Entities** | `Packages/SuperChat/app/_/entities/`, `interfaces/`, `dtos/` | State entities, DTOs (`ResponsePayload<T>`), data contracts. Zero untyped fields. |
| **Usecases & Services** | `Packages/SuperChat/app/_/services/` | Business workflows, AI streaming, webhook processors, socket events. Rule 39 (Singleton + DI). |
| **API Route Handlers** | `Packages/SuperChat/app/api/super-chat/{feature}/route.ts` or `app/api/{feature}/route.ts` | Route handlers exposing REST endpoints for chat, webhooks, settings, and agent workflows. |
| **Integration Tests** | `Packages/SuperChat/test/` | Jest/Node tests verifying usecases, service integration, and route execution contracts. |

---

## 3. Step-by-Step Mandatory Workflow for New Features

```
[New Feature Requested for Bots or SuperChats]
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Define Models & Contracts                           │
│ • Create types, interfaces, entities, DTOs in types/        │
│ • Strictly typed (Rule 25 Clean Code, Rule 44 ': Type =')   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Implement Use Cases & Domain Services               │
│ • Write service / usecase classes in lib/ or services/      │
│ • Apply Singleton + Dependency Injection (Rule 39)          │
│ • Handle business logic, storage, external API integration  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Implement API Route Handlers                        │
│ • Create app/api/{feature-slug}/route.ts                    │
│ • Validate inputs, execute usecases, return standard JSON   │
│ • Handle errors gracefully with proper HTTP status codes    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: End-to-End Integration & Automated Tests            │
│ • Implement test cases in tests/ or test/                   │
│ • Verify API responses, payload formats, and edge cases     │
│ • Ensure all tests pass with exit code 0                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: (Optional / Gated) UI Layer Composition             │
│ • ONLY permitted after Steps 1-4 pass verification          │
│ • Compose exclusively with Base components (@Shareds bases) │
│ • Lazy Loading & Skeleton placeholders (Rule 51)            │
│ • Zero inline styles (Rule 18/20), semantic IDs (Rule 13)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to generate UI components, pages, forms, or views for new features in Bots or SuperChats before the API, usecases, and models are fully integrated and tested.
2. ❌ **FORBIDDEN** to create stubbed, non-functional mock UI that does not bind to working backend routes.
3. ❌ **FORBIDDEN** to use `any` types (`: any`, `as any`) in models, request payloads, or usecase responses (Rule 25).
4. ❌ **FORBIDDEN** to omit automated integration/unit tests for newly generated API routes and usecases.
5. ❌ **FORBIDDEN** to embed domain business logic or database queries directly inside UI components (`.tsx`).

---

## 5. Compliance Checklist

- [ ] Domain models, entities, and request/response DTOs defined with strict TypeScript typing.
- [ ] Use cases and services implemented with Singleton DI and business validation.
- [ ] Next.js API route handlers implemented under `app/api/` returning standardized JSON.
- [ ] Automated integration/unit tests in `tests/` or `test/` passing with exit code 0.
- [ ] No UI code written or generated prior to backend API verification.
- [ ] All files verified for Rule 29 EOF (exact 1 trailing newline `\n`).
