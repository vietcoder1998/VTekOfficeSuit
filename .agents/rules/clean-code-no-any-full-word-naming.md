# Mandatory Rule: Clean Code — Ban 'any' Type & Mandate Full Descriptive Naming (Rule 25 & Section 569)

> **ZERO TOLERANCE**:
> When writing TypeScript source code, React components (`.tsx`), Core Engines (`.ts`), Stores, Services, API handlers, or tests (`.test.ts`) across all projects:
> 1. **STRICTLY PROHIBITED 100%: Using the `any` type (`: any`, `as any`, `<any>`, `any[]`, `Record<string, any>`)**.
>    - All types must be declared explicitly (interfaces, types, unions, generics).
>    - When dynamic payload shapes are unknown, developers must use `unknown` accompanied by type guards (`typeof`, `instanceof`, custom type predicates) or generic constraints.
> 2. **STRICTLY PROHIBITED 100%: Short 1-2 character abbreviations or fast-text identifiers** (e.g. `d`, `n`, `i`, `e`, `p`, `u`, `r`, `s`, `k`, `v`, `t`, `m`, `c`, `b`, `a`, `o`, `idx`, `el`, `val`, `res`, `req`, `fn`, `cb`, `obj`, `arr`, `str`, `num`).
> 3. **MANDATORY 100%: Use full descriptive names** accurately capturing the entity's domain meaning (e.g. `dataRecord`, `totalCount`, `iterationIndex`, `eventPayload`, `projectItem`, `userProfile`, `serviceDefinition`, `httpRequest`, `executionResult`).
> 4. **TECHNICAL EXCEPTIONS**:
>    - Mathematical or 2D/3D Canvas coordinates: `x`, `y`, `z` (`{ x: number; y: number }`).
>    - Standard TypeScript Generic type parameter letters: `<T>`, `<TData>`, `<TResult>`.

---

## 1. Full Word Mapping Reference Matrix

| Prohibited Short Form ❌ | Typical Context | Mandatory Full Descriptive Name ✅ |
|---|---|---|
| `d` | Data / Document / Date | `dataRecord`, `documentItem`, `dayTimestamp`, `durationMilliseconds` |
| `n` | Count / DOM Node | `totalCount`, `numericalAmount`, `nodeElement`, `itemCount` |
| `i` / `j` | Loop index | `iterationIndex`, `itemIndex`, `rowIndex`, `columnIndex` |
| `e` | Error / Event | `eventPayload`, `errorException`, `caughtError`, `changeEvent` |
| `p` | Project / Page / Parameter | `projectItem`, `pageDefinition`, `parameterConfig`, `propertyKey` |
| `u` | User / UI / URL | `userProfile`, `uiComponent`, `urlAddress`, `unitTest` |
| `r` | Record / Route / Result | `recordItem`, `routeDefinition`, `responseResult`, `ruleConfig` |
| `s` | Service / String / State | `serviceDefinition`, `stringContent`, `stateSnapshot`, `styleClass` |
| `k` / `v` | Map or Object Key / Value | `mapKey`, `propertyKey`, `propertyValue`, `attributeValue` |
| `idx` | Index | `itemIndex`, `activeIndex`, `targetIndex` |
| `el` | Element / Node | `elementNode`, `domElement`, `containerElement` |
| `val` | Value | `propertyValue`, `inputValue`, `numericValue` |
| `res` | Result / HTTP Response | `executionResult`, `httpResponse`, `operationResult` |
| `req` | Request / Input | `httpRequest`, `requestPayload`, `serviceRequest` |
| `cb` / `fn` | Callback / Function | `callbackHandler`, `actionFunction`, `predicateFn` |
| `obj` / `arr` | Object / Array | `targetObject`, `collectionArray`, `itemsList` |
| `str` / `num` | String / Number | `stringContent`, `numericalValue`, `formattedString` |

---

## 2. Zero Any Replacement Guide

| Prohibited Syntax ❌ | Problem | Mandatory Compliant Replacement ✅ |
|---|---|---|
| `const data: any = ...` | Breaks type safety | `const data: ProjectStructureDefinition = ...` or `unknown` with guards |
| `as any` | Blind type assertion | Specific interface or type narrowing: `if (isRecord(data)) ...` |
| `(item: any) => ...` | Untyped callback parameter | `(projectItem: ProjectStructureDefinition) => ...` |
| `Record<string, any>` | Unstructured dictionary | `Record<string, unknown>` or typed interfaces with defined keys |
