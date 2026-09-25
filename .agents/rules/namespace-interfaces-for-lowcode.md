# Mandatory Rule: Define Interfaces in Namespaces for .lowcode Files (Rule 32 & Section 587)

> **ZERO TOLERANCE**:
> When any engine, module, or definition file in `.lowcode/` defines 3 or more interfaces (`threshold >= 3`):
> 1. **MANDATORY NAMESPACE GROUPING**:
>    - Encapsulate interfaces in `export namespace Lc<FileName>Types { ... }`.
> 2. **MANDATORY ZERO-REGRESSION TYPE ALIASES**:
>    - Every interface within the namespace must be re-exported at file root level via `export type InterfaceName = Lc<FileName>Types.InterfaceName;`.
>    - Ensures 100% existing consumer code and test imports continue to operate without modification.
