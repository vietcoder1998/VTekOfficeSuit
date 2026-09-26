---
trigger: always_on
---

# Mandatory Rule: All New Components Created with CSS Classes — Zero Inline Styles (Rule 20)

> **ZERO TOLERANCE**:
> When creating any new component, interface (`.tsx`), button, card, input, dialog, or UI element:
> 1. **MANDATORY 100% CSS CLASS INITIALIZATION**:
>    - All styles must be defined using IDE Theme CSS classes (`styles/theme.css`, `styles/bases.css`, `styles/layout.css`), CSS variables (`var(--surface)`, `var(--primary, #6938ef)`), and Base components (`@/components/bases`).
> 2. **STRICTLY PROHIBITED: INLINE STYLES ON NEW COMPONENTS**:
>    - Never initialize new components with `style={{ ... }}` attributes for visual styling.
>    - If a new component requires custom CSS not yet present in the Design System, declare a clean class in the appropriate stylesheet instead of writing inline styles in JSX.
