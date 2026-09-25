---
trigger: always_on
---

# Mandatory Rule: Block Cross-Project Updates to Shared/components Bases (Rule 61)

<!-- Compatibility / Test Alias: Rule 51 / BLOCK UPDATE SHARED/COMPONENTS BASE BETWEEN PROJECTS RULE -->

> **ZERO TOLERANCE** (Rule 61 / Rule 51 Compatibility Alias):
> 1. **STRICT PROJECT ISOLATION OF BASE COMPONENTS (CÁCH LY TUYỆT ĐỐI BASE COMPONENTS THEO DỰ ÁN)**:
>    - All base components in `Shared/components/{projectName}/bases` belong **EXCLUSIVELY** to `{projectName}`:
>      - `Shared/components/CompanyWeb/bases` ➔ Exclusively for **CompanyWeb**
>      - `Shared/components/bot/bases` ➔ Exclusively for **bot**
>      - `Shared/components/LowcodeStudio/bases` ➔ Exclusively for **LowcodeStudio**
>      - `Shared/components/Office/bases` ➔ Exclusively for **Office**
> 2. **ZERO CROSS-PROJECT MODIFICATIONS (CHẶN TUYỆT ĐỐI SỬA ĐỔI CHÉO GIỮA CÁC DỰ ÁN)**:
>    - When developing, refactoring, or running automated AI tasks within a specific project context (e.g. `CompanyWeb`), developers and AI agents are **STRICTLY PROHIBITED** from updating, renaming, moving, adding, or deleting any files inside `Shared/components/{otherProject}/bases` (e.g. `Office`, `bot`, `LowcodeStudio`).
>    - Edits originating from Project X may only modify `Shared/components/{projectX}/bases`.
> 3. **PROTECTION OF UNIVERSAL SHARED BASES (BẢO VỆ BASE CHUNG TOÀN HỆ SINH THÁI)**:
>    - Canonical universal components in `Shared/components/bases/` (e.g. `Button`, `Badge`, `Card`, `Input`, `SuperChatTabBar`, `ThemeSwitcher`) serve the entire 2-TEK ecosystem.
>    - Individual projects are strictly blocked from unilaterally modifying universal shared bases to satisfy project-specific requirements without shared governance and regression testing.
> 4. **ZERO CROSS-PROJECT BASE IMPORTS (CHẶN IMPORT CHÉO BASE GIỮA CÁC PROJECT)**:
>    - Components in `Shared/components/{projectA}/bases` must **NEVER** import directly from `Shared/components/{projectB}/bases`.
>    - Each project must rely solely on its own isolated base components or universal bases exported from `@Shared/components`.
> 5. **AUTOMATED CI & PRE-COMMIT ENFORCEMENT (KIỂM TRA TỰ ĐỘNG)**:
>    - Enforced automatically via `scripts/check-components-isolation.mjs` and git commit/push guards. Any violation will immediately abort the operation with non-zero exit code.

---

## 1. Architectural Boundaries

| Directory | Owner Project | Permitted Modifiers | Prohibited Modifiers |
|---|---|---|---|
| `Shared/components/CompanyWeb/bases/**` | **CompanyWeb** | CompanyWeb developers / AI agents | bot, LowcodeStudio, Office, LowcodeServer |
| `Shared/components/bot/bases/**` | **bot** | bot developers / AI agents | CompanyWeb, LowcodeStudio, Office, LowcodeServer |
| `Shared/components/LowcodeStudio/bases/**` | **LowcodeStudio** | LowcodeStudio developers / AI agents | CompanyWeb, bot, Office, LowcodeServer |
| `Shared/components/Office/bases/**` | **Office** | Office developers / AI agents | CompanyWeb, bot, LowcodeStudio, LowcodeServer |
| `Shared/components/bases/**` | **Shared Global** | Shared Governance / Ecosystem Core | Unilateral single-project ad-hoc edits |

---

## 2. Decision & Governance Matrix

```
[Developer or AI modifies files in Shared/components/]
                       │
                       ▼
         Is the change inside a project folder?
             (Shared/components/{project}/bases)
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
        [YES]                      [NO - inside Shared/components/bases]
          │                         │
Does current project match          Is this an approved ecosystem-wide
target folder {project}?            shared update with full regression?
   ┌──────┴──────┐                          ┌──────┴──────┐
   ▼             ▼                          ▼             ▼
 [YES]         [NO]                       [YES]         [NO]
   │             │                          │             │
   ▼             ▼                          ▼             ▼
✅ ALLOW       ❌ BLOCK                   ✅ ALLOW       ❌ BLOCK
(Targeted)   (Violation Rule 51)         (Global Core) (Unilateral Drift)
```

---

## 3. Strict Prohibitions ❌

1. ❌ **Never** modify `Shared/components/{projectB}/bases` while working in `projectA`.
2. ❌ **Never** write cross-imports such as `import { ... } from '@Shared/components/Office/bases'` inside `CompanyWeb`.
3. ❌ **Never** alter shared core components in `Shared/components/bases` to bypass project-specific styling or logic.
4. ❌ **Never** bypass automated isolation checks (`npm run check:isolation`).
