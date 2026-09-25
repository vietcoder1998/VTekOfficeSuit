"use client";
/**
 * components/bases/terminal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical Single Terminal Base Component (`<IdeTerminal>`)
 * Re-exports from modular sub-components in `./terminal/`
 *
 * Conforms to:
 * - RULE[always-use-ide-icon.md]: Uses <IdeIcon> from @/components/bases (no raw emoji).
 * - RULE[default-id-for-div-container.md]: Descriptive semantic kebab-case ID on all containers/divs.
 * - RULE[standard-for-project.md]: Theme variables, #6938ef, font JetBrains Mono / Inter, 8-pt grid.
 * - RULE[break-long-files-into-multi-components]: Sub-components modularized into ./terminal/
 * - Section 178 in .lowcode/.standards/MCP/standard-specification.md
 * ─────────────────────────────────────────────────────────────────────────────
 */

export * from "./terminal/index";
export { default } from "./terminal/index";
