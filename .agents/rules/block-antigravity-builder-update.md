# Mandatory Rule: Delegate All Builds to Builder Bot — Zero Direct Push Builds (Rule 38 & Section 709)

> **ZERO TOLERANCE**:
> 1. **DEVELOPMENT OCCURS EXCLUSIVELY IN PRIMARY WORKSPACES**:
>    - Antigravity AI must operate, develop, and modify code exclusively inside primary workspaces (`LowcodeStudio`, `Office`, `CompanyWeb`, `bot`).
>    - Direct creation of separate builder clone workspaces is strictly forbidden.
> 2. **DELEGATE ALL BUILDS TO BUILDER BOT (NO BUILD AFTER PUSH)**:
>    - Pushing code from workspaces must never trigger local builds.
>    - All packaging, synchronization, and release builds are executed exclusively by Builder Bot (`BuilderBot`).
