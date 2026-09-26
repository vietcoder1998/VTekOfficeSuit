# Mandatory Rule: No Build After Push — Delegate Exclusively to Builder Bot (Rule 41)

> **ZERO TOLERANCE**:
> When pushing code (`git push`) or upon push completion across the 2-TEK ecosystem (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
> 1. **STRICTLY PROHIBITED 100%: NO BUILD AFTER PUSH**:
>    - After `git push` completes, **NEVER** initiate any build process (no `docker build`, no `docker compose build`, no server/web build, no Next.js production compilation, and no background build watchers spawned from git hooks).
>    - `git push` and `.husky/pre-push` **MUST ONLY** validate code cleanliness (clean working tree, fast typecheck) to safely deliver commits to remote.
> 2. **BUILDER BOT EXCLUSIVE GOVERNANCE**:
>    - All build responsibilities (packaging Docker images, compiling releases, server/web runtime compilation, container deployment, smoke tests) belong exclusively to **Builder Bot** (`BuilderBot`).
>    - Builder Bot triggers and manages builds via independent orchestration (bot command `/build`, Mission Control Builder UI, or configured webhooks), completely decoupled from developer and AI agent push workflows.

---

## 1. Responsibility Matrix

| Stage / Task | Coding AI & Developers | Git Hook (`.husky/pre-push`) | Builder Bot (`BuilderBot`) |
|---|---|---|---|
| **Working Tree Check** | Commit or stash all changes | Cancel push if tree is dirty | No interference |
| **Typecheck Gate** | Run `npm run type-check:fast` | Validate clean tree & exit 0 | No interference |
| **Push Code (`git push`)** | Push commits to remote | Confirm pass and exit 0 | No interference |
| **Docker / Server Build** | ❌ **FORBIDDEN** to trigger build | ❌ **FORBIDDEN** to spawn build | ✅ **EXCLUSIVE** orchestrator |
| **Builder Workspace Sync** | ❌ **FORBIDDEN** to sync to builder | ❌ **FORBIDDEN** to call post-push builder | ✅ **EXCLUSIVE** builder executor |
| **Build Notifications** | Do not broadcast build alerts | Do not broadcast build alerts | ✅ Sends alerts to Telegram Topics |
