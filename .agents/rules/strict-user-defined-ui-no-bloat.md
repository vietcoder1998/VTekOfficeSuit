# Mandatory Rule: Strict User-Defined UI — Zero Unsolicited Bloat & No UI Drift (Rule 15)

> **ZERO TOLERANCE**:
> When developing or extending features, components, or screens:
> 1. **MANDATORY: Build ONLY what the user explicitly requests**:
>    - Only create UI components, buttons, tabs, dropdown items, dialogs, and controls that are **DIRECTLY AND EXPLICITLY DEFINED** by user instructions or specs.
> 2. **STRICTLY PROHIBITED: Speculative UI additions (Zero Bloat)**:
>    - Never "invent" unrequested auxiliary features, buttons, extra menus, sub-panels, or widgets (no unsolicited Settings, Share, Export, Filter, Refresh, Help, or More Options).
> 3. **SINGLE SOURCE OF INTERACTION (NO DUPLICATE CONTROLS)**:
>    - Never duplicate buttons or actions across Toolbar, Sidebar, and Bottom Bar. Every action must have exactly ONE clear control point.

---

## 1. 3-Step Pre-Implementation Gate

1. **User Spec Check**: Did the user explicitly ask for this element? If NO ➔ DO NOT CREATE.
2. **Anti-Duplication Scan**: Does this action already exist elsewhere in the view? If YES ➔ DO NOT DUPLICATE.
3. **Cleanup Check**: Is any element non-essential to the requested feature? If YES ➔ REMOVE IMMEDIATELY.
