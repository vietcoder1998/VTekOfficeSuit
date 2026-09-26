---
trigger: always_on
---

# Mandatory Rule: Always Use IdeIcon for All Components — Zero Raw Emojis (Rule 14)

> **ZERO TOLERANCE**:
> When creating or upgrading any component, page (`.tsx`), Button, Card, Label, Tabs, menu item, modal dialog, inspector subpanel, or UI block across all projects:
> **MANDATORY 100%: MUST use Base component `<IdeIcon>` from `@/components/bases` (or standard Lucide vector SVG icons)**.
> **STRICTLY PROHIBITED**: Using raw text emojis (e.g. `📊`, `📈`, `✨`, `⚙️`, `➡️`, `🔔`, `🚫`, `🔒`, `⚡`, `🔍`, `📦`, `📱`, `🌐`) as visual UI icons.

---

## 1. Core Purpose & Architectural Importance

1. **Visual Excellence & High DPI Crispness**:
   - Vector SVG icons render razor-sharp across all resolutions (Retina, 2K, 4K) and maintain identical appearance across macOS, Windows, Linux, iOS, and Android.
   - Icons automatically inherit theme colors via `currentColor` or CSS variables (`var(--primary, #6938ef)`).

2. **Accessibility & Test Selectors**:
   - `<IdeIcon>` automatically assigns unique `id` attributes, supports `aria-label`, and provides reliable test selectors for Vitest and Playwright.

---

## 2. Standard Usage Syntax

```tsx
import { IdeIcon } from "@/components/bases";

// 1. Standard PascalCase name from Lucide icon set
<IdeIcon name="Settings" size="sm" />
<IdeIcon name="BarChart3" size="md" color="var(--primary, #6938ef)" />

// 2. Preset sizes
<IdeIcon name="Bell" size="xs" /> // 12px
<IdeIcon name="Bell" size="sm" /> // 14px (default)
<IdeIcon name="Bell" size="md" /> // 16px
<IdeIcon name="Bell" size="lg" /> // 20px
<IdeIcon name="Bell" size="xl" /> // 24px
```
