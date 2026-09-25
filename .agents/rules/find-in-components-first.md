# Mandatory Rule: Search Existing Components First Before Creating New Files (Rule 19)

> **ZERO TOLERANCE**:
> Before creating any new component, page block, dialog, or UI widget across the project:
> **MANDATORY 100%: Search `/components/` first** (`components/bases/`, `components/editor/`, `components/lowcode/`, `components/dashboard/`).

---

## 1. Similarity Threshold Decision Matrix

| Similarity | Action | Mandatory Requirement |
|---|---|---|
| **≥ 90%** | **REUSE** | 100% reuse existing component. STRICTLY FORBIDDEN to create a new file. |
| **70% – 89%** | **EXTEND** | Extend props or variants of existing component. Do NOT create duplicate files. |
| **< 70%** | **ALLOW NEW** | Create new component in appropriate modular directory. |

---

## 2. Scan Command

```bash
find app/ components/ -name "*.tsx" | xargs grep -rn "<ComponentName"
```
