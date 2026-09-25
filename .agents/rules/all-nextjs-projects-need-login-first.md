# Mandatory Rule: Login First for All Protected Next.js Applications and Routes (Rule 57)

<!-- Compatibility: QUY TẮC BẮT BUỘC: SETUP TẤT CẢ CÁC PROJECT NEXT.JS PHẢI LOGIN TRƯỚC (LOGIN FIRST FOR NEXT.JS PROJECTS RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 57. **[MANDATORY RULE: SETUP ALL NEXT.JS PROJECTS THAT NEED TO BE LOGIN FIRST (RULE 57)]** -->

> **ZERO TOLERANCE**:
> Across all Next.js applications and services in the 2-TEK ecosystem (`SystemAdmin`, `SuperChat`, `CompanyWeb`, `Clouds`, `Office`, `DeviceFarms`, `Bots`, `LowcodeStudio`):
> 1. **MANDATORY 100% LOGIN FIRST ENFORCEMENT ON PROTECTED APPLICATIONS & ROUTES**:
>    - All applications and route groups categorized as private portals, administration suites, or user workspaces **MUST** enforce authentication before granting access to dashboard views, data records, or workspace features.
>    - When an unauthenticated client (missing valid session cookies, JWT token, or authorization headers) attempts to access any protected route, the request **MUST NEVER** render private views or return unauthenticated HTTP 200 responses.
>    - The system **MUST** immediately redirect the client to the canonical authentication/login route (e.g. `/${locale}/login`, `/${locale}/auth`, or `/login`), encoding the original requested destination in a `?redirect=<path>` query parameter.
> 2. **STRICT PROHIBITION OF DEVELOPMENT MODE AUTHENTICATION BYPASS**:
>    - Strictly prohibited to bypass route guards using loose environment checks (such as `if (!isDevMode && !token)`).
>    - Authentication guards must execute deterministically across all environments (development, staging, production, and automated testing with mock tokens).
> 3. **STANDARDIZED TOKEN RESOLUTION & EDGE MIDDLEWARE GUARDS**:
>    - All Next.js projects must implement route guards at the Next.js Edge Middleware layer (`middleware.ts`) using standardized token extraction:
>      - Cookies: `access_token`, `super_chat_token`, `auth_token`, `vtek_session`, `session_id`.
>      - Headers: `Authorization: Bearer <token>`, `X-API-Key`, `X-VTEK-Key`.
>    - Projects may consume the standardized helper `enforceEdgeLoginFirst` from `@Shared/components/auth/edge-auth-guard` to maintain zero divergence.
> 4. **EXEMPTIONS (EXPLICIT PUBLIC PATHS ONLY)**:
>    - Public marketing website pages (`/`, `/[locale]/products`, `/news`, `/contact`, `/about`, `/careers`, `/terms`, `/privacy` in `CompanyWeb`).
>    - Authentication endpoints and views (`/login`, `/register`, `/auth`, `/callback`, `/forget-password`, `/reset-password`, `/validate-account`).
>    - System health check endpoints (`/api/health-check`, `/api/health`).
>    - Static assets and build bundles (`/_next/*`, `/assets/*`, `/static/*`, `favicon.ico`, `robots.txt`, `sitemap.xml`).
> 5. **POST-LOGIN REDIRECTION FLOW**:
>    - When an authenticated user visits an authentication page (`/login`, `/register`), the application must automatically redirect them to their original requested path (`?redirect=...`) or default clean workspace root (`/${locale}`).

---

## 1. Core Purpose & Architectural Rationale

1. **Information Security & Zero Unauthorized Data Exposure**:
   - Internal administration panels (`SystemAdmin`), private conversations (`SuperChat`), cloud documents (`Office`, `Clouds`), and automation consoles (`Bots`, `DeviceFarms`) store sensitive tenant, user, and infrastructure data.
   - Enforcing "Login First" at the Edge middleware level ensures unauthorized requests are halted before downstream Server Components, database connections, or client JS bundles are initialized.

2. **Unified User Authentication Experience**:
   - Standardizing the `?redirect=<destination>` parameter across all Next.js projects ensures seamless post-login restoration of user context regardless of which application they access.

3. **Prevention of Test Divergence**:
   - Requiring explicit mock tokens in unit and integration test runners prevents false-positive test passes where unauthenticated requests simulate logged-in states.

---

## 2. Next.js Applications Governance Matrix

| Application | Port | Project Nature | Auth Guard Status | Login Destination |
|---|---|---|---|---|
| **SystemAdmin** | 3014 | System Admin Portal | ✅ **MANDATORY LOGIN FIRST** | `/${locale}/login` |
| **SuperChat** | 3016 | Real-time Chat Client | ✅ **MANDATORY LOGIN FIRST** | `/${locale}/auth` |
| **Clouds** | 3018 | Cloud Storage & Files | ✅ **MANDATORY LOGIN FIRST** | `/login` |
| **Office** | 3015 | Office Platform (Docs/Sheets) | ✅ **MANDATORY LOGIN FIRST** | `/login` |
| **DeviceFarms** | 3019 | Device & VM Studio | ✅ **MANDATORY LOGIN FIRST** | `/login` |
| **Bots** | 3012 | Bot Automation Dashboard | ✅ **MANDATORY LOGIN FIRST** | `/login` |
| **LowcodeStudio** | 3011 | LowCode Studio IDE | ✅ **MANDATORY LOGIN FIRST** (for editor routes) | `/login` |
| **CompanyWeb** | 3017 | Marketing Portal + Admin | 🟡 **HYBRID**: Public site public, `/admin/*` & `/super-chat/*` login first | `/admin/${locale}/login` |

---

## 3. Standard Edge Middleware Implementation Template

```ts
import { NextRequest, NextResponse } from "next/server";
import { enforceEdgeLoginFirst } from "@Shared/components/auth/edge-auth-guard";

export function middleware(request: NextRequest): NextResponse {
  const loginFirstResponse: NextResponse | null = enforceEdgeLoginFirst(request, {
    publicPaths: [
      "/login",
      "/register",
      "/api/health",
      "/api/health-check",
    ],
    cookieNames: ["access_token", "auth_token", "vtek_session"],
    loginPath: "/login",
    redirectQueryParam: "redirect",
  });

  if (loginFirstResponse) {
    return loginFirstResponse;
  }

  return NextResponse.next();
}

export const config: { matcher: string[] } = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
```

---

## 4. AI Subagent Enforcement Directives

1. **`coder` & `leader`**:
   - When creating or refactoring Next.js applications, always verify `middleware.ts` enforces Login First on protected routes.
   - Never allow route guards to be skipped without explicit mock tokens.
2. **`designer`**:
   - Ensure login and auth pages/modals provide accessible login methods (default account or Google account) conforming to Base components.
3. **`test-editor`**:
   - Write test cases verifying unauthenticated requests redirect to login first with status 307.
