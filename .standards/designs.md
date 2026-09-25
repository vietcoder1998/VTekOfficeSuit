# VTek Office Suite Design Standards (Rule 68)

## 1. Design System & Theme Conformance

- **Themes**: Full support for 4 IDE themes (Light, Dark, Midnight, Sepia).
- **Primary Color**: `var(--primary, #6938ef)`.
- **Typography**: `Inter, sans-serif` font family.
- **8-pt Grid**: Margin and padding at 8px, 16px, 24px multiples (micro: 4px, 6px).
- **Zero Inline Styles (Rule 18 & 20)**: Strictly prohibited to use `style={{ ... }}` for static styling; use theme classes and CSS variables.
- **IdeIcon Mandatory (Rule 14)**: Use `<IdeIcon>` or Lucide vector icons; zero raw text emojis.
- **Semantic IDs (Rule 13)**: Every container or div must have a descriptive kebab-case `id`.
