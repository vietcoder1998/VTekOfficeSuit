# Mandatory Rule: Prefer Switch-Case Over Excessive If-Else Chains (Rule 26 & Section 570)

> **ZERO TOLERANCE**:
> When constructing branching conditional logic in React components (`.tsx`), Core Engines (`.ts`), Stores, Services, API handlers, or tests (`.test.ts`):
> 1. **STRICTLY PROHIBITED 100%: Long if-else chains with 3 or more branches (`if (...) else if (...) else if (...) else ...`)** or deep if-else nesting (> 2 levels) evaluating the same variable, discriminant property, or status enum.
> 2. **MANDATORY 100%: Refactor to `switch-case` constructs** (`switch (expression) { case ...: break; default: ...; }`) or **Constant Lookup Maps (Dictionary / Record Lookup / Strategy Pattern)** when handling 3 or more choices.
> 3. **MANDATORY DEFAULT CASE**: Every `switch` statement must include a `default:` branch to safely handle unrecognized states or trigger fallbacks.
> 4. **TECHNICAL EXCEPTIONS**: Simple binary conditions (1-2 branches: `if (valid) ... else ...`), guard clauses (`if (!input) return;`), or unrelated independent conditions.

---

## 1. Refactoring Comparison

### ❌ Prohibited Approach (Excessive If-Else Chain):
```typescript
if (actionType === "CREATE") {
  handleCreateProject();
} else if (actionType === "UPDATE") {
  handleUpdateProject();
} else if (actionType === "DELETE") {
  handleDeleteProject();
} else {
  handleUnknownAction();
}
```

### ✅ Mandatory Approach (Clean Switch-Case):
```typescript
switch (actionType) {
  case "CREATE": {
    handleCreateProject();
    break;
  }
  case "UPDATE": {
    handleUpdateProject();
    break;
  }
  case "DELETE": {
    handleDeleteProject();
    break;
  }
  default: {
    handleUnknownAction();
    break;
  }
}
```

### ✅ Alternative Compliant Approach (Constant Lookup Map):
```typescript
const ACTION_HANDLERS: Record<string, () => void> = {
  CREATE: handleCreateProject,
  UPDATE: handleUpdateProject,
  DELETE: handleDeleteProject,
};

const handlerFunction = ACTION_HANDLERS[actionType] ?? handleUnknownAction;
handlerFunction();
```
