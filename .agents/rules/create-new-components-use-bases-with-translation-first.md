# Mandatory Rule: When Creating New Components, Use Bases with Translation First from Shared/components/{ProjectNames} (Rule 55)

<!-- Compatibility: QUY TẮC BẮT BUỘC: KHI TẠO COMPONENT MỚI, SỬ DỤNG BASES KÈM THEO TRANSLATION TRƯỚC TIÊN TỪ Shared/components/{ProjectNames} (CREATE NEW COMPONENTS USE BASES WITH TRANSLATION FIRST RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 55. **[MANDATORY RULE: WHEN CREATING NEW COMPONENTS, USE BASES WITH TRANSLATION FIRST FROM Shared/components/{ProjectNames} (RULE 55)]** -->

> **ZERO TOLERANCE**:
> When creating, generating, scaffolding, or authoring any new component, interface (`.tsx`), modal, card, panel, dialog, form, button, list, layout, or UI element across all 2-TEK projects (`Office`, `LowcodeStudio`, `Bots`, `CompanyWeb`, `SuperChat`, `SystemAdmin`, `Cloud`, `DeviceFarms`, `Lowcode`, `Server`):
> 1. **MANDATORY 100% COMPOSE FROM BASE COMPONENTS IN `Shared/components/{ProjectNames}`**:
>    - All new components MUST be constructed exclusively from standardized Base primitives defined in `Packages/Shared/components/{projectName}/bases` (or `Shared/components/{projectName}/bases`).
>    - Primary canonical imports:
>      `import { Button, Input, DivCard, IdeIcon, Container, Modal, Dialog, Tabs, Badge, Select, Tooltip, useSafeTranslations } from "@Shared/components/{projectName}/bases";`
>      or `@Shareds/components/{projectName}/bases` / `/Shareds/components/{projectName}` or project-mapped `@/components/bases`.
>    - **STRICTLY PROHIBITED 100%**:
>      - Using bare unstyled HTML interactive elements (`<button>`, `<input>`, `<select>`, `<textarea>`).
>      - Declaring divergent, unshared local base components outside `Packages/Shared/components/{projectName}/bases`.
>      - Using bare `<div>` without semantic kebab-case `id` or Base container (`<DivCard>`, `<DivRow>`, `<DivCol>`, `<Container>`).
>      - Using raw emojis or crude text icons in UI (Rule 14 — mandatory `<IdeIcon>`).
>      - Using inline styles `style={{ ... }}` for visual styling (Rule 18 & 20).
> 2. **MANDATORY 100% USE TRANSLATION FIRST (`useSafeTranslations` FIRST)**:
>    - Inside the component body, the translation hook MUST be invoked FIRST before any JSX, sub-renders, or event handlers:
>      ```tsx
>      export const ProjectNewCard: React.FC<ProjectNewCardProps> = (props) => {
>        // MANDATORY: Use translation hook FIRST
>        const t = useSafeTranslations("components.projectNewCard");
>        ...
>      ```
>    - The hook `useSafeTranslations` MUST be imported from `@Shared/components/{projectName}/bases` (or project-mapped `@/components/bases`).
>    - **STRICTLY PROHIBITED 100%**: Creating any component without translation initialization or placing translation lookups secondary/scattered after unlocalized JSX.
> 3. **MANDATORY TRANSLATION WRAPPING FOR ALL PROPS & TEXT CHILDREN WITH SAFE FALLBACKS**:
>    - Every user-facing text string rendered by or passed into base components (`label`, `title`, `placeholder`, `description`, `aria-label`, `alt`, `tooltip`, `header`, `confirmText`, `cancelText`, `emptyText`, `helperText`) MUST be wrapped with `{t("keyName", "Safe Default Fallback Text")}`.
>    - All textual children (e.g. `<Button id="submit-btn">{t("action.save", "Lưu thay đổi")}</Button>`) MUST be wrapped in `{t("keyName", "Fallback Text")}`.
>    - **MANDATORY DUAL-PARAMETER**: Every call to `t(...)` MUST include the second argument default fallback string:
>      `t("keyName", "Văn bản mặc định an toàn")`
>      to guarantee that unit test runners (Vitest, Playwright, Jest) and SSR hydration never crash with `MISSING_MESSAGE`.
>    - **ZERO TOLERANCE FOR HARDCODED STRINGS**: Hardcoded unlocalized raw string literals in JSX are 100% strictly prohibited.
> 4. **MANDATORY DICTIONARY SYNCHRONIZATION**:
>    - Every newly created translation key must be registered under its namespace in `messages/vi.ts` (and `lib/i18n-translations.ts`).
> 5. **AI AGENT & CODE GENERATOR ENFORCEMENT**:
>    - All AI coding agents (`coder`, `designer`, `leader`, `test-editor`, `devloper`) and AST generators MUST follow this exact sequence when generating components:
>      1) Target base primitives in `Packages/Shared/components/{projectNames}/bases`.
>      2) Import bases and `useSafeTranslations` from `@Shared/components/{projectName}/bases`.
>      3) Call `const t = useSafeTranslations("components.[componentName]");` at the top of the component.
>      4) Compose using Base components with translated props and children.
>      5) Update dictionary in `messages/vi.ts`.

---

## 1. Core Purpose & Architectural Rationale

1. **Seamless Component Creation Lifecycle (Design System + Multilingual Foundation)**:
   - Components created from day one with Base primitives from `Shared/components/{ProjectNames}` guarantee consistent design tokens (`#6938ef`, `Inter`, 8-pt grid), accessibility, and semantic container IDs.
   - Calling `useSafeTranslations` first ensures zero technical debt from hardcoded strings and eliminates future refactoring sweeps.

2. **Zero Missing Message Runtime & Test Stability**:
   - The dual-parameter pattern `t("key", "Default Fallback")` ensures headless test runners (Vitest, Playwright), CI pipelines, and unpopulated locales render smoothly without throwing fatal `MISSING_MESSAGE` exceptions.

3. **Strict Prevention of Local Divergence**:
   - Forcing new components to consume Base primitives from `Packages/Shared/components/{projectNames}/bases` ensures the monorepo does not splinter into isolated, inconsistent UI forks.

---

## 2. Standard Implementation Template for New Components

```tsx
import React from "react";
import {
  useSafeTranslations,
  Button,
  Input,
  DivCard,
  DivRow,
  IdeIcon,
  Badge,
} from "@Shared/components/LowcodeStudio/bases";

export interface DashboardMetricCardProps {
  cardId: string;
  metricValue: string | number;
  statusType?: "success" | "warning" | "error";
  onRefreshClick?: () => void;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  cardId,
  metricValue,
  statusType = "success",
  onRefreshClick,
}) => {
  // 1. MANDATORY: Initialize translation hook FIRST before any JSX or logic
  const t = useSafeTranslations("components.dashboardMetricCard");

  return (
    <DivCard id={`metric-card-${cardId}`} className="theme-surface">
      <DivRow id={`metric-header-row-${cardId}`} className="div-between">
        <span id={`metric-title-${cardId}`} className="theme-text-muted">
          {t("metricCardTitle", "Tổng Quan Hoạt Động")}
        </span>
        <Badge id={`metric-badge-${cardId}`} variant={statusType}>
          {t(`status.${statusType}`, "Hoạt động bình thường")}
        </Badge>
      </DivRow>

      <div id={`metric-value-container-${cardId}`} className="metric-value-display">
        <span id={`metric-value-number-${cardId}`} className="theme-text font-bold">
          {metricValue}
        </span>
      </div>

      <DivRow id={`metric-footer-row-${cardId}`} className="div-row gap-2">
        <Button
          id={`metric-refresh-btn-${cardId}`}
          variant="secondary"
          size="sm"
          onClick={onRefreshClick}
          title={t("refreshTooltip", "Làm mới số liệu tức thì")}
        >
          <IdeIcon name="RefreshCw" size="sm" />
          <span>{t("actionRefresh", "Làm mới")}</span>
        </Button>
      </DivRow>
    </DivCard>
  );
};
```

---

## 3. Comparison Matrix: Prohibited vs. Mandatory

| Prohibited Approach ❌ | Mandatory Architecture ✅ |
|---|---|
| `<button onClick={...}>Lưu</button>` | `<Button id="save-btn" onClick={...}>{t("actionSave", "Lưu")}</Button>` |
| `<input placeholder="Tìm kiếm..." />` | `<Input id="search-input" placeholder={t("searchPlaceholder", "Tìm kiếm...")} />` |
| `<div>Anonymous content</div>` | `<DivCard id="item-card">...` with semantic id and theme classes |
| `const handleClick = () => {}; const t = useSafeTranslations();` | Call `const t = useSafeTranslations(...)` at the very first line of component |
| `<span>🔥 Hot Deal</span>` | `<IdeIcon name="Flame" size="sm" /> <span>{t("hotDeal", "Ưu đãi nổi bật")}</span>` |
| `import { Button } from "./local-button";` | `import { Button } from "@Shared/components/{projectName}/bases";` |
| `t("keyOnly")` without fallback | `t("keyOnly", "Default Safe Fallback Text")` |

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to create any new component without importing Base components from `@Shared/components/{projectName}/bases`.
2. ❌ **FORBIDDEN** to create any new component without initializing `useSafeTranslations` as the first statement in the component body.
3. ❌ **FORBIDDEN** to include unlocalized hardcoded text strings in JSX markup, component props, or text children.
4. ❌ **FORBIDDEN** to call `t("key")` without the mandatory second argument default fallback string.
5. ❌ **FORBIDDEN** to render raw interactive HTML elements (`<button>`, `<input>`, `<select>`, `<textarea>`) instead of Base components.
6. ❌ **FORBIDDEN** to use inline styles (`style={{ ... }}`) or raw text emojis in new components (Rule 14, 18, 20).
