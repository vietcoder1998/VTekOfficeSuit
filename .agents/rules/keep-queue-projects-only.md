# Mandatory Rule: Bot Task Dispatch & Queues Restricted to Legitimate Projects Only (keep-queue-projects-only)

> **ZERO TOLERANCE**:
> Across `@bot`, Mission Control, ScannerBot, and WorkerBot:
> 1. **MANDATORY: RESTRICT QUEUES TO LEGITIMATE 2-TEK PROJECTS ONLY**:
>    - Task queues (`conversation_queue.json`, `Record<string, ProjectQueueItem[]>`) **MUST ONLY** contain keys corresponding to legitimate 2-TEK projects (`LowcodeStudio` / `studio`, `SuperChat` / `super-chat`, `Office` / `office`, `bot`).
>    - Every project with an active queue MUST be a valid repository containing a `.git` folder in the workspace root or a registered submodule.
>    - **STRICTLY PROHIBITED**: Creating queues for sub-scopes (e.g. `documents`, `editor`, `i18n`, `components`) or arbitrary strings (`test-pipeline`, random IDs). All tasks must route to their parent project.
> 2. **AUTO-PRUNING & REJECTION OF NON-PROJECT TASKS**:
>    - Any enqueue request targeting an invalid or non-existent project must be rejected immediately (`reject task`).
>    - Queue I/O functions (`getConversationQueues`, `saveConversationQueues`) automatically sanitize and purge non-project keys.

---

## 1. Canonical Project Registry

| Normalized Project Name | Path in Workspace | Git Repository Required | Primary Scope |
|---|---|---|---|
| **`LowcodeStudio`** (`studio`) | `${PROJECTS_PATH}/LowcodeStudio` | Yes (`.git`) | Visual Lowcode Studio & AST Engine |
| **`SuperChat`** (`super-chat`) | `${PROJECTS_PATH}/SuperChat` | Yes (`.git`) | Multi-app unified messaging & chat |
| **`Office`** (`office`) | `${PROJECTS_PATH}/Office` | Yes (`.git`) | Rich document editing suite |
| **`bot`** (`bot`) | `${PROJECTS_PATH}/bot` | Yes (`.git`) | Production mission control & task governor |
