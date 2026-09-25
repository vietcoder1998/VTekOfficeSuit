# Mandatory Rule: Singleton Pattern with Dependency Injection for .lowcode (Rule 31 & Section 583)

> **ZERO TOLERANCE**:
> Every engine, registry, store, compiler, and bridge inside `.lowcode/` (`.lowcode/engines/`, `lc_engines/`, `.lowcode/*.ts`) must implement the canonical Singleton pattern with Constructor Dependency Injection:
> 1. **Private Constructor**: Prevents arbitrary instantiation.
> 2. **Canonical Export**: Snake_case singleton export (e.g. `export const lc_compiler_engine = LcCompilerEngine.getInstance();`).
> 3. **Injectable Dependencies**: Supports partial dependency injection with automatic fallbacks for tests.
> 4. **Testing Hooks**: Reset methods ensuring clean test state.
