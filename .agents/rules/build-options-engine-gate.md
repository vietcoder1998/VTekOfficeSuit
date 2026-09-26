# Mandatory Rule: Build Menu Only Displays Options Supported by Engine (Build Options Engine Gate)

> **ZERO TOLERANCE**:
> Every target, platform, service type, subtarget, or option in the Build Menu (UI Build or Services Build) **MUST have an active implementation** in compilers or lowcode engines (`lib/compilers/`, `Lowcode/`, `lc_engines/`).
> **STRICTLY PROHIBITED**: Rendering build options whose backend compiler/engine is not implemented — even as clickable options with tooltips or placeholders.

---

## 1. Single Source of Truth

Every build target or option rendered in the UI **MUST** reference an active engine implementation:

### UI Build (Platform Targets)

| Platform         | SubType                                     | Engine Implementation                                                         |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| `mobile`         | `android-apk`, `java-xml`, `kotlin-compose` | `lib/compilers/mobile/android-java.compiler.ts`, `kotlin-compose.compiler.ts` |
| `mobile` / `app` | `capacitor`                                 | `lib/compilers/web/nextjs-app.compiler.ts` (`compileCapacitorAppProject`)     |
| `web`            | `nextjs`                                    | `lib/compilers/web/nextjs-app.compiler.ts`                                    |
| `web`            | `html`                                      | `lib/compilers/web/html.compiler.ts`                                          |
| `desktop`        | `linux-deb`, `ubuntu-deb`                   | `lib/compilers/desktop/ubuntu-deb.compiler.ts`                                |
| `desktop`        | `linux-gtk`                                 | `lib/compilers/desktop/linux-gtk.compiler.ts`                                 |
| `desktop`        | `windows-xaml`                              | `lib/compilers/desktop/windows-xaml.compiler.ts`                              |
| `nodejs`         | any                                         | `lib/compilers/server/nodejs-compiler.ts`                                     |
| `csharp`         | any                                         | `lib/compilers/server/csharp-compiler.ts`                                     |
| `binary`         | any                                         | `lib/compilers/server/binary-compiler.ts`                                     |

### Services Build (Service Types)

| Service ID                  | Has Engine? | Engine Implementation File                                          |
| --------------------------- | ----------- | ------------------------------------------------------------------- |
| `rest-api` / `node-express` | ✅ YES      | `Lowcode/lc-services-host-build-engine.ts` → `compileNodeJsProject` |
| `graphql`                   | ❌ NO       | No compiler engine — do NOT render in active build menu             |
| `grpc`                      | ❌ NO       | No compiler engine — do NOT render in active build menu             |
| `docker`                    | ❌ NO       | Handled via Builder Bot, not ad-hoc compiler menu                   |

---

## 2. Implementation: `supportedByEngine` Flag

Every target item must define the boolean property:

```typescript
supportedByEngine: boolean;
```

### Rendering Rules:

- `supportedByEngine: true` → Render as active, selectable build option.
- `supportedByEngine: false` → **DO NOT RENDER**, or render as completely disabled with a `[Soon]` badge and **NO onClick handler**.
