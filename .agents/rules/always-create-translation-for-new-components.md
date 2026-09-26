# Mandatory Rule: Always Create Translation Keys & Texts for New Components (Rule 21)

> **ZERO TOLERANCE**:
> When creating any new component, page (`.tsx`), Button, Card, Label, Input, Tabs, menu item, modal dialog, or UI block:
> 1. **MANDATORY 100% TRANSLATION COVERAGE**:
>    - Every user-facing text string (label, placeholder, tooltip, title, status message) MUST have a corresponding translation key defined in the dictionary.
> 2. **USE SAFE TRANSLATION HOOK WITH FALLBACK**:
>    - Use `useSafeTranslations("components.[namespace]")` with default fallback parameters:
>      `t("keyName", "Default Fallback Text")`
>      to ensure complete test runner stability and eliminate `MISSING_MESSAGE` errors.
> 3. **STRICTLY PROHIBITED**: Hardcoding raw unlocalized string literals directly in JSX without translation keys.
