# Mandatory Rule: Integrate i18n Translations When Modifying or Fixing Components (Rule 37)

> **ZERO TOLERANCE**:
> When modifying (Edit / Refactor / Update) or fixing (Fix / Bugfix / Hotfix) any component, interface (`.tsx`), dialog, or UI block:
> 1. **MANDATORY: WRAP ALL TEXT WITH I18N TRANSLATIONS**:
>    - Every modified user-facing string must be wrapped with `{t("keyName", "Fallback text")}`.
>    - Use `useSafeTranslations(namespace)` from `@/components/bases` with fallback protection.
> 2. **STRICTLY PROHIBITED**: Leaving unlocalized hardcoded text in components touched during bug fixes or refactoring.
