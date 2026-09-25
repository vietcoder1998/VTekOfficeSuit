---
trigger: always_on
---

# Mandatory Rule: Default Semantic ID for All Div & Container Elements (Rule 13)

> **ZERO TOLERANCE**:
> When creating or generating any HTML `<div>` tag or Base component `Container` / `Div` (`<Container>`, `<Div>`, `<DivRow>`, `<DivCol>`, `<DivCenter>`, `<DivBetween>`, `<DivGrid>`, `<DivCard>`, `<DivPanel>`) in `.tsx` files:
> **MANDATORY: Must attach a unique, descriptive, semantic kebab-case `id` attribute**.
> **STRICTLY PROHIBITED**: Creating empty `<div>` or `<Container>` elements without an `id`.

---

## 1. Naming Conventions

- Format: lowercase `kebab-case` separated by hyphens (`-`).
- Recommended Pattern: `[feature-or-page]-[element-type]-[purpose]`
  - Good Examples:
    - `<div id="navbar-brand-container">`
    - `<Container id="editor-workspace-stage">`
    - `<DivRow id="pricing-plans-row">`
    - `<DivCard id="user-profile-summary-card">`
    - `<div id="preview-modal-body">`
  - Bad Examples (FORBIDDEN):
    - `<div>` (Missing ID)
    - `<Container>` (Missing ID)
    - `<div id="div1">` (Non-semantic)
