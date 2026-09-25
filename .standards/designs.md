# Package Design System & Visual Guidelines: VTek Office Suite

<!-- Standard Specification: Packages/VTekOfficeSuit/.standards/designs.md -->
<!-- Rule Conformance: Rule 13, 14, 18, 20, 21, 60, 68 -->

## 1. Visual Design Philosophy & IDE Themes
- Conforms 100% to the 4 system IDE themes: **Light**, **Dark**, **Midnight**, and **Sepia**.
- Theme switching is driven exclusively by CSS variables:
  - `var(--surface)`: Main background surface
  - `var(--surface-muted)`: Secondary container / panel surface
  - `var(--border)`: Subtle border divider (`#e2e8f0` in light, `#334155` in dark)
  - `var(--text)`: High-contrast primary typography
  - `var(--text-muted)`: Secondary caption typography (`#64748b`)
  - `var(--primary, #6938ef)`: 2-TEK primary brand purple accent

## 2. 8-Point Layout Grid System
- `snapToGrid: 8`: All margins, paddings, and component bounds align to 8px multiples:
  - Micro-spacing: `4px`, `6px`
  - Standard spacing: `8px`, `16px`, `24px`, `32px`
- Layout containers must compose Base components (`<DivRow>`, `<DivCol>`, `<DivCenter>`, `<DivBetween>`, `<DivGrid>`) or utility classes from `styles/layout.css`.

## 3. Typography & High-Density Standards
- Primary font: `Inter, sans-serif`
- Standard density font sizing: `11px - 13px` for toolbars, menus, and data grids
- Section headers: `14px - 18px` with semi-bold weight (`font-weight: 600`)

## 4. Zero Inline Styles Policy (Rule 18 & Rule 20)
- **STRICTLY PROHIBITED**: Using inline styles (`style={{ ... }}`) for static colors, backgrounds, borders, or layout geometry.
- All styles must be defined via Theme CSS classes (`theme-surface`, `theme-border`, `bg-primary`, `div-row`, `div-col`) in `styles/theme.css` and `styles/bases.css`.

## 5. Iconography Standard: 100% @Shared Icons (Rule 14 & Rule 56)
- **MANDATORY 100% USE OF @Shared ICONS**:
  - All icons across VTek Office Suite MUST be sourced directly from the centralized `@Shared` icons ecosystem:
    - Base component: `<IdeIcon>` from `@Shared/components/VTekOfficeSuit/bases` or mapped `@/components/bases`
    - Universal base icons: `<IdeIcon>` from `@Shared/components/bases`
    - Icon types & contracts: `@Shared/types/icons` (`IdeIconProps`, `LucideIcon`, `IdeIconSize`, `IdeIconVariant`, `IconProps`)
  - Usage syntax:
    ```tsx
    import { IdeIcon } from "@/components/bases"; // or @Shared/components/VTekOfficeSuit/bases

    <IdeIcon name="Settings" size="sm" />
    <IdeIcon name="BarChart3" size="md" color="var(--primary, #6938ef)" />
    ```
- **STANDARDIZED SIZING SCALE (8-pt Grid Compliant)**:
  - `xs`: 12px, `sm`: 14px, `md`: 16px, `lg`: 20px, `xl`: 24px
- **STRICTLY PROHIBITED: RAW EMOJIS (ZERO TOLERANCE — RULE 14)**:
  - Prohibited to use raw text emojis in any user interface element.

## 6. Default Semantic IDs (Rule 13)
- Every container element (`<div>`, `<Container>`, `<DivPanel>`, `<Card>`) must declare a unique, descriptive kebab-case `id` attribute:
  `id="vtek-[feature]-[element]"`

## 7. Multilingual Support & Localization (Rule 21 & Rule 54/55)
- All user-facing strings must use `useSafeTranslations("components.VTekOfficeSuit")` with default fallback.
