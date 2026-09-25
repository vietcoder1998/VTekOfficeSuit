# Mandatory Rule: Always Use Translation When Consuming or Adding New Components (Rule 54)

<!-- Compatibility: QUY TẮC BẮT BUỘC: KHI SỬ DỤNG HOẶC THÊM COMPONENT MỚI, LUÔN LUÔN SỬ DỤNG KÈM TRANSLATION (USE TRANSLATION WITH NEW COMPONENTS RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 54. **[MANDATORY RULE: WHEN USING A NEW COMPONENT, ALWAYS ADD WITH TRANSLATION (RULE 54)]** -->

> **ZERO TOLERANCE**:
> When using, consuming, instantiating, adding, or rendering any component in pages (`app/**/*.tsx`), layouts, containers, widgets, modals, forms, or parent views across all 2-TEK projects:
> 1. **MANDATORY 100% TRANSLATION HOOK INTEGRATION**:
>    - Every component usage site MUST initialize and use the safe translation hook:
>      `const t = useSafeTranslations("components.[namespace]");`
>      imported from `@Shared/components/{projectName}/bases` (or `@/components/bases` / `@Shareds/components/{projectName}/bases`).
> 2. **MANDATORY TRANSLATION WRAPPING FOR ALL PROPS & TEXT CHILDREN**:
>    - All user-facing string props passed to any component (`label`, `title`, `placeholder`, `description`, `aria-label`, `alt`, `tooltip`, `header`, `confirmText`, `cancelText`, `emptyText`, `helperText`) MUST be wrapped with `{t("keyName", "Default Fallback Text")}`.
>    - All textual children passed into components (e.g. `<Button id="submit-btn">{t("action.save", "Lưu thay đổi")}</Button>`, `<Badge id="status-badge">{t("status.active", "Hoạt động")}</Badge>`, `<Tab title={t("tab.general", "Cài đặt chung")}>`) MUST be wrapped with `{t("keyName", "Fallback Text")}`.
> 3. **STRICT PROHIBITION OF RAW UNLOCALIZED STRINGS**:
>    - **STRICTLY PROHIBITED 100%**: Passing hardcoded string literals directly to component props or text children when consuming components (e.g. `<Button label="Save" />`, `<Input placeholder="Search..." />`, or `<Card title="Settings">Submit</Card>`).
> 4. **MANDATORY SAFE DEFAULT FALLBACK (ZERO MISSING_MESSAGE ERRORS)**:
>    - Every call to `t(...)` MUST include the second argument as a fallback text string:
>      `t("keyName", "Văn bản mặc định an toàn")`
>    - Guarantees that unit test runners (Vitest, Playwright, Jest), SSR hydration, and headless test suites never fail with `MISSING_MESSAGE` or `[next-intl] No intl context found`.
> 5. **DICTIONARY SYNCHRONIZATION IN `messages/vi.ts`**:
>    - Any new translation keys introduced when adding components must be registered under their respective namespace in `messages/vi.ts` (or `lib/i18n-translations.ts`).

---

## 1. Core Purpose & Architectural Rationale

1. **Completing the UI Component i18n Lifecycle Triad**:
   - **Creation (Rule 21)**: The internal implementation of a new component must define translation keys and use `useSafeTranslations`.
   - **Consumption / Usage (Rule 54)**: When **using** any component inside pages, views, or layouts, the caller must pass translated props and text.
   - **Maintenance / Bugfix (Rule 37)**: When **modifying or fixing** existing components, all touched text must be wrapped in translations.

2. **Universal Multilingual Readiness**:
   - Wrapping text at the point of usage ensures the application can seamlessly switch between languages (Vietnamese, English, Japanese, etc.) without requiring future refactoring sweeps.

3. **Defensive Test Runner Stability**:
   - The dual-parameter pattern `t(key, fallback)` ensures that components rendered in isolated tests or headless runners display meaningful labels without crashing or needing full intl mock trees.

---

## 2. Comparison Matrix: Prohibited vs. Mandatory

| Prohibited Raw Usage ❌ | Mandatory Translated Usage ✅ |
|---|---|
| `<Button id="save-btn">Lưu thay đổi</Button>` | `<Button id="save-btn">{t("actionSave", "Lưu thay đổi")}</Button>` |
| `<Input id="name-input" placeholder="Nhập tên..." />` | `<Input id="name-input" placeholder={t("namePlaceholder", "Nhập tên...")} />` |
| `<Card id="user-card" title="Thông tin người dùng" />` | `<Card id="user-card" title={t("userInfoTitle", "Thông tin người dùng")} />` |
| `<Badge id="status-badge">Đang chạy</Badge>` | `<Badge id="status-badge">{t("statusRunning", "Đang chạy")}</Badge>` |
| `<Tab id="tab-cfg" title="Cấu hình hệ thống" />` | `<Tab id="tab-cfg" title={t("sysConfigTab", "Cấu hình hệ thống")} />` |
| `<Dialog id="dlg" confirmText="Xóa" cancelText="Hủy" />` | `<Dialog id="dlg" confirmText={t("confirmDelete", "Xóa")} cancelText={t("cancel", "Hủy")} />` |

---

## 3. Standard Usage Example

```tsx
import React from "react";
import { useSafeTranslations, Button, Input, DivCard } from "@Shared/components/LowcodeStudio/bases";

export const UserProfileView: React.FC = () => {
  // 1. Initialize safe translation hook with appropriate namespace
  const t = useSafeTranslations("components.editor");

  return (
    <DivCard id="user-profile-card">
      <h3 id="user-profile-title">{t("profileTitle", "Hồ Sơ Người Dùng")}</h3>
      <Input
        id="username-field"
        label={t("usernameLabel", "Tên đăng nhập")}
        placeholder={t("usernamePlaceholder", "Nhập tên đăng nhập của bạn...")}
        title={t("usernameTooltip", "Định danh duy nhất trong hệ thống")}
      />
      <Button id="save-profile-btn" variant="primary">
        <span>{t("actionSaveProfile", "Lưu Thay Đổi")}</span>
      </Button>
    </DivCard>
  );
};
```

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to consume or render any component with raw unlocalized string literals in props (`label="Text"`, `placeholder="Text"`, `title="Text"`).
2. ❌ **FORBIDDEN** to pass unlocalized raw string literals as component children (`<Button>Click Me</Button>`).
3. ❌ **FORBIDDEN** to call `t("key")` without providing the default fallback text parameter (`t("key", "Default Text")`).
4. ❌ **FORBIDDEN** to import `useTranslations` directly from external libraries without using the project safe hook `useSafeTranslations`.
5. ❌ **FORBIDDEN** to add new translation keys without ensuring their registration in `messages/vi.ts`.
