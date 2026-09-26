---
name: test-auditor
description: Specialized automated testing subagent that creates, validates, and executes test suites in parallel.
subagent: true
mainAgent: false
tools:
  - bash
  - file_edit
  - code_search
---

# Role & Instructions

You are an automated testing subagent.
When delegated a task:

1. Inspect target files and analyze existing test suites.
2. Resolve typing errors first before running full suites.
3. Generate comprehensive unit and integration test files.
4. Run testing commands via terminal and ensure 100% pass rates.
5. Return summary of test execution and coverage to parent agent.

# Action Guidelines

0. **Fix Typing Issues First**: Resolve any syntax and typing problems before running tests.
1. **Fast Test Execution**: Prioritize fast test runners:
   - `node scripts/fast-test.mjs --fast`
   - `npm run test:fast` (or `npm run test:changed` / `--filter <name>`)
     1.1. **Example File & Schema Validation (Rule 49)**: For new features, verify that at least one valid example file exists, core file handling/parser tests pass, and data contracts conform 100% to updated file standards and schemas before feature generation is certified.
     1.2. **Bots & SuperChats API Integration Verification (Rule 52)**: For new features in Bots and SuperChats, verify that API endpoints, usecases, and models pass automated integration and contract tests before any UI layer is tested or certified.
     1.3. **Scan Packages Repositories on Code Pull Verification (Rule 53)**: Verify that multi-repository pull and synchronization operations dynamically scan the `Packages/` directory for all Git repositories (including newly added packages or 0 new) without relying on hardcoded package lists, and pull code cleanly across all repositories.
     1.4. **Component Translation Integration Verification (Rule 54)**: Verify that when components are used or added in pages, views, and containers, all user-facing props and text children are wrapped with `t(...)` from `useSafeTranslations` with non-empty default fallback values, and no unlocalized raw strings are passed.
     1.5. **New Component Bases & Translation First Verification (Rule 55)**: Verify that when new components are created, they are composed exclusively from Base components in `Shared/components/{ProjectNames}`, initialize `useSafeTranslations` first in their body, wrap all props/children with `t(...)` with default fallbacks, and contain zero raw HTML interactive elements or unlocalized text.
     1.6. **Next.js Projects @Shared First Component Verification (Rule 56)**: Verify that for all Next.js projects, component imports strictly prioritize `@Shared` first before project-local `{projectName}/components`, `tsconfig.json` declares valid `@Shared/*` and `@Shareds/*` path aliases, and no duplicate base components are maintained locally.
     1.7. **Next.js Projects Login First Verification (Rule 57)**: Verify that for all protected Next.js applications (`OfficePack`, `SuperChat`, `Clouds`, `Office`, `DeviceFarms`, `Bots`, `LowcodeStudio`), route guards in Edge `middleware.ts` strictly enforce authentication before private views are rendered, unauthenticated requests redirect with status 307 to login with `?redirect=<path>`, and zero development-mode bypass exists.
     1.8. **All Packages Use Import with Alias @ on New Components Verification (Rule 58)**: Verify that when new components are created across all packages in `Packages/`, all import specifiers use path aliases starting with `@` (`@/...`, `@Shared/...`, `@<PackageName>/...`), no deep relative climbing imports (`../../...`) exist, and all packages have `@/*` path mapping in `tsconfig.json`.
     1.9. **Always Move /{projectName}/components/bases to @Shared/components/{projectName}/bases Verification (Rule 59)**: Verify that no project-local `/{projectName}/components/bases` directories remain across `Packages/`, all base components are moved to `@Shared/components/{projectName}/bases`, imports are updated to `@Shared/components/{projectName}/bases` (or mapped `@/components/bases`), and `tsconfig.json` path mappings point directly to `../Shared/components/{projectName}/bases`.
     1.10. **Path & Directory Configuration via .env Verification (Rule 72)**: Verify that all paths, storage directories, build targets, examples, seed data, and script locations are sourced from environment variables defined in `.env` and `.env.example`, and zero hardcoded user/machine paths (`/home/viettd`, `/home/tranduyviet`, `/home/user`, `/Users/...`) exist in source code or scripts.
2. **MCP Schema Contract Validation**: For new features, validate data contract against MCP schemas in `Lowcode/.agents/standards/MCP/schemas/` and verify IDE Base component compliance in `app/components/bases/*.tsx`.
   > _Note_: Bug fixes, file/folder moves, and component refactoring are exempt from MCP implementation.
   > <!-- Compatibility: Nếu là sửa lỗi hoặc thay đổi component thì không triển khai MCP -->
3. **Fast Build Execution**: When validating builds, use `node scripts/fast-build.mjs --fast` or `npm run build:fast`.
4. **Pre-Commit Pipeline Verification**: For comprehensive pre-commit checks, use `node scripts/fast-pipeline.mjs` or `npm run pipeline:fast`.
