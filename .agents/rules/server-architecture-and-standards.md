# Mandatory Rule: Server Architecture, API Routing & Backend Standards (Rule 33)

> **ZERO TOLERANCE**:
> Backend services across `web` and `server` must follow strict modular architecture:
> 1. **Dedicated Feature Folders**: Modules grouped cleanly under domain subdirectories (`core/`, `stores/`, `controllers/`, `services/`).
> 2. **Clean Barrel Exports**: Every domain folder exposes clean interfaces through `index.ts`.
> 3. **Native HTTP Handling**: Use lightweight native handlers with explicit status codes and JSON formatting (`BaseController`).
> 4. **Singleton Pattern**: All backend services must implement Rule 39 Singleton DI.
