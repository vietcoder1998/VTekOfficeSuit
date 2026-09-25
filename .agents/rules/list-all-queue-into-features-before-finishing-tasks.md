# Mandatory Rule: List All Queued Tasks into .features Before Finishing Tasks (Rule 67)

<!-- Test Alias: RULE 67 / LIST ALL QUEUE INTO .FEATURES BEFORE FINISHING TASKS RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across all applications, packages, repositories, bots, background runners, and AI coding agents in the 2-TEK ecosystem:
> 1. **MANDATORY 100%: LIST ALL OF QUEUE INTO .FEATURES FIRST**:
>    - Whenever any queue, batch, multi-task prompt, or user request containing multiple tasks/items is submitted or enqueued (`conversation_queue.json`, prompt list, or input batch):
>    - Developers and AI agents **MUST** immediately scan the entire queue and list **ALL** items from the queue into `.features/{dd-mm-yyyy}.md` (prioritizing the current date, format `DD-MM-YYYY.md`, e.g. `23-09-2026.md`) as uncompleted checkbox tasks:
>      `- [ ] <type>(<scope>): <description> — Task <id>`
>      (If the item is a bug fix, mark it explicitly as `bug`: `- [ ] bug(<scope>): <description>`).
>    - The complete queue of tasks MUST be permanently logged in `.features/` BEFORE any implementation or task execution begins.
> 2. **STRICTLY PROHIBITED 100%: PREMATURE TASK EXECUTION WHILE QUEUE IS PENDING REGISTRATION**:
>    - **FORBIDDEN** to start executing, implementing code, running generators, or marking tasks as finished (`[x]`) for any individual item while remaining items in the queue have not yet been listed into `.features`.
> 3. **MANDATORY 100%: IN THE LAST QUEUE, START FINISH THE TASKS**:
>    - Only upon reaching the last queue item (i.e. once all queue items are fully recorded and validated in `.features`), start the execution phase to finish the tasks.
>    - Tasks must be processed systematically according to standard lifecycle protocols (MCP exemption if bug/component change, core engine first, UI with bases & theme, fast unit testing, Conventional Commit).
>    - When each task is completed and verified, update its checkbox in `.features` to completed: `- [x] ... (done task <id>)`.
> 4. **ALL PROJECTS CONFORMANCE**:
>    - This rule applies universally across all 2-TEK projects and packages (`Packages/*`, `bot`, `LowcodeStudio`, `Office`, `CompanyWeb`, etc.).
>    - Project-specific task queues (`Packages/{project}/.features` or root `.features`) must maintain this exact queuing discipline.

---

## 1. Core Purpose & Architectural Rationale

1. **Complete Visibility of Pending Workloads**:
   - Starting work immediately on the first item in a batch/queue without recording the entire queue results in lost context, forgotten tasks, and fragmented tracking.
   - Logging all queued items upfront guarantees full transparency, traceability, and an immutable record of incoming requests before state mutations occur.

2. **Deterministic Task Lifecycle & Accountability**:
   - Clearly distinguishing the **Queuing Phase** (list all items into `.features`) from the **Execution Phase** (start finishing tasks at the last queue item) prevents partial execution anomalies and race conditions in autonomous agent workflows.

3. **Seamless Multi-Task Execution for AI Coding Agents**:
   - Headless agents and developers can inspect `.features/{dd-mm-yyyy}.md` to see the full scope of requested work, prioritize dependencies, and execute sequentially without needing manual re-prompting.

---

## 2. Standard Queue & Execution Lifecycle Workflow

```
[User submits batch / prompt queue / conversation_queue.json]
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: List ALL Queue Items into .features                │
│ • Parse every task in the queue                             │
│ • Determine type (feat, bug, fix, chore, refactor)          │
│ • Append uncompleted checkbox task: - [ ] ... to .features  │
│ • Prioritize current date file (DD-MM-YYYY.md)              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
            [Is this the LAST queue item?]
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
            [NO]                      [YES]
             │                         │
      Continue listing          All queue items logged!
      remaining queue items     ───────────────────────
             │                         │
             └────────────┐            ▼
                          │  ┌────────────────────────────────────────────────────────┐
                          │  │ Phase 2: Start Finish the Tasks                        │
                          │  │ • Checkout task branch: task/<id>-<slug>               │
                          │  │ • Implement Engine & UI according to standards         │
                          │  │ • Automated test verification                          │
                          │  │ • Update checkbox to completed: - [x] (done task <id>) │
                          │  │ • Auto commit & push on done                           │
                          │  └────────────────────────────────────────────────────────┘
                          ▼
```

---

## 3. Comparison Matrix

| Prohibited Workflow ❌ | Mandatory Workflow ✅ (Rule 67) |
|---|---|
| Receive 3 tasks; immediately start coding Task 1 without logging Tasks 2 and 3 into `.features`. | Parse all 3 tasks in the queue; list Task 1, 2, and 3 into `.features` with `[ ]`; then start executing and finishing tasks. |
| Execute and mark Task 1 done `[x]` while Task 2 is not yet listed in `.features`. | All queue items must exist as `[ ]` in `.features` before any task begins execution or is marked `[x]`. |
| Skip logging queued items or log only the currently active task. | 100% of items in the queue must be logged into `.features/{dd-mm-yyyy}.md` before execution starts. |

---

## 4. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to execute code or make changes before all queued items are listed in `.features`.
2. ❌ **FORBIDDEN** to mark any task as done (`[x]`) before the entire queue is recorded.
3. ❌ **FORBIDDEN** to omit `[BUG]` or `bug(...)` tagging when logging bug tasks from the queue.
4. ❌ **FORBIDDEN** to bypass `.features/{dd-mm-yyyy}.md` logging for queued tasks in any project.
