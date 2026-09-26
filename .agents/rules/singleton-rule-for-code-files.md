# Mandatory Rule: Singleton Design Pattern with Dependency Injection for Code Files (Rule 39)

> **ZERO TOLERANCE**:
> When creating, updating, or maintaining code files containing business logic, state management, system coordination, or external integrations (Services, Engines, Managers, Handlers, Controllers, Storage Adapters, Client Bridges) across all projects:
> 1. **MANDATORY 100%: SINGLETON DESIGN PATTERN**:
>    - Constructor must be declared `private` (or `protected` when inherited) to prevent unconstrained instantiation via `new ClassName()`.
>    - Must declare static instance storage: `private static singletonInstance: ClassName | null = null;`.
>    - Must expose static global accessor: `public static getInstance(dependencies?: Partial<DependenciesInterface>): ClassName`.
>    - Must export standard canonical constant: `export const <name>Service = ClassName.getInstance();` (or snake_case `lc_<name>_engine = ClassName.getInstance();`).
>    - Must provide unit test hooks: `public static resetInstance(): void` and `public static setInstanceForTesting(instance: ClassName | null): void`.
> 2. **MANDATORY 100%: CONSTRUCTOR DEPENDENCY INJECTION (DI)**:
>    - All external dependencies (DB clients, APIs, filesystem, loggers) must be declared in an explicit `Dependencies` interface (Rule 25 Zero Any).
>    - Constructor and `getInstance()` parameters must be optional (`dependencies?: Partial<DependenciesInterface>`), defaulting to canonical singletons.
>    - Strictly forbidden to hardcode dependency instantiation inside the class without DI injection options for testing.

---

## 1. Canonical TypeScript Implementation Pattern

```typescript
export interface MyServiceDependencies {
  apiClient: { fetch: (url: string) => Promise<unknown> };
  logger: { log: (message: string) => void; error: (message: string) => void };
}

export class MyService {
  private static singletonInstance: MyService | null = null;
  private readonly apiClient: MyServiceDependencies['apiClient'];
  private readonly logger: MyServiceDependencies['logger'];

  private constructor(dependencies?: Partial<MyServiceDependencies>) {
    this.apiClient = dependencies?.apiClient ?? { fetch: globalThis.fetch };
    this.logger = dependencies?.logger ?? console;
  }

  public static getInstance(dependencies?: Partial<MyServiceDependencies>): MyService {
    if (!MyService.singletonInstance) {
      MyService.singletonInstance = new MyService(dependencies);
    }
    return MyService.singletonInstance;
  }

  public static resetInstance(): void {
    MyService.singletonInstance = null;
  }

  public static setInstanceForTesting(instance: MyService | null): void {
    MyService.singletonInstance = instance;
  }
}

export const myService = MyService.getInstance();
```
