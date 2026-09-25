---
trigger: always_on
---

# Mandatory Rule: Automatically Create Git Commit and Push Code on Done Task Across All Repositories (Auto Commit & Push on Done Task Rule — Zero Tolerance)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TỰ ĐỘNG TẠO COMMIT VÀ PUSH CODE KHI HOÀN THÀNH TASK (DONE TASK AUTO COMMIT & PUSH RULE — ZERO TOLERANCE) -->

> **ZERO TOLERANCE**:
> When any task, feature, bug fix, refactor, UI improvement, or configuration change is completed or marked "done" across any 2-TEK project (`bot`, `LowcodeStudio`, `Office`, `CompanyWeb`, `.laws`, etc.):
> 1. **MANDATORY 100% AUTOMATIC COMMIT ON TASK DONE**:
>    - Never declare a task completed while leaving uncommitted changes or untracked files in the working directory.
>    - Inspect repository status (`git status --porcelain`). If the working tree is dirty, stage modified files (`git add .` or target task files) and create a Conventional Commit immediately.
> 2. **MANDATORY 100% AUTOMATIC PUSH TO REMOTE REPOSITORY ON TASK DONE**:
>    - Immediately after creating the commit (or verifying all commits are clean), push the branch to the remote origin (`git push origin <branch>`).
>    - Ensure the remote repository is fully updated so that team members, automated CI, and production deployment services receive the completed task without delay.
> 3. **MANDATORY 100% ZERO AD-HOC BUILD AFTER PUSH**:
>    - Pushing code upon task done **DOES NOT TRIGGER LOCAL BUILDS**. Packaging, Docker image generation, and deployments remain exclusively delegated to **Builder Bot** (`BuilderBot`) under Rules 37 & 41.
> 4. **MANDATORY 100% KILL PORT 3020 (PORT OF APP) ON CLOSE TASK / DONE TASK**:
>    - Whenever any task is closed, completed, or marked done across the workspace, developers, background runners, and AI agents **MUST** ensure port 3020 (the default PORT of app: 2-TEK Hub) is forcefully killed and released (`fuser -k -9 3020/tcp 2>/dev/null || true` or `node scripts/kill-port-3020.mjs`), preventing orphaned Next.js dev server instances from locking port 3020.

---

## 1. Core Purpose & Architectural Rationale

1. **Elimination of Abandoned & Stale Local Code**:
   - Marking a task "done" in task trackers, logs, or chat while leaving code uncommitted or unpushed leaves work vulnerable to accidental data loss, branch divergence, and out-of-sync environments.
   - Immediate automatic commit and push guarantees that every completed task is permanently recorded, versioned, and backed up in GitHub.

2. **Autonomous Agent Discipline (Zero Human Bottleneck)**:
   - When AI coding agents (`devloper`, `git-specialist`, `leader`, `test-auditor`) finish implementing and verifying a task, they must automatically stage, commit, and push without waiting for manual human prompts or commands.
   - Background runners and dispatchers (such as `pushProjectOnTaskDone` and `triggerPushProjectOnTaskDone` in `bot`) provide service-level automation to guarantee compliance.

3. **Continuous Integration & Clean Pipeline Flow**:
   - Automated test verification runs on commit via `.husky/pre-commit` (Rule 36/39).
   - TypeScript type-check executes as the single gatekeeper on push via `.husky/pre-push` (Rule 28).
   - Once pushed, Builder Bot can be dispatched safely to assemble release containers.

---

## 2. Standard Task Done Execution Sequence

Whenever a task reaches completion, execute the following 4-step sequence:

```bash
# Step 1: Check working directory status
git status --porcelain

# Step 2: If dirty, stage and commit with Conventional Commit format
git add .
git commit -m "feat(<scope>): <description> (done task <id>)"

# Step 3: Fetch latest parent updates to prevent divergence
git pull --rebase origin <branch>

# Step 4: Push to remote repository (runs pre-push typecheck)
git push origin <branch>

# Step 5: Kill port 3020 (PORT of app) on close task
node scripts/kill-port-3020.mjs
```

### Commit Message Formatting
Conventional commit messages must clearly describe the outcome and reference the completed task:
- `feat(editor): implement table cell formatting toolbar (done task 1042)`
- `fix(scanner): resolve git fetch conflict detection error (done task 1043)`
- `refactor(lowcode): extract base component styles into theme tokens (done task 1044)`
- `test(rules): add eof and sync tests for rule 48 (done task 1045)`

---

## 3. Task Branch Lifecycle Integration (Rule 23 Alignment)

When working on isolated task branches (`task/<task-id>-<slug>`):
1. **Commit Task Changes**: Create conventional commit(s) on the task branch.
2. **Checkout Parent Branch**: Switch back to `tasks` (or `main`): `git checkout <parent-branch>`.
3. **Pull Remote Updates**: Synchronize with `git pull origin <parent-branch>`.
4. **Merge Task Branch**: Merge changes cleanly: `git merge <task-branch>`.
5. **Fast Regression Test**: Run fast unit test suites.
6. **Push Merged Code**: Push parent branch to remote: `git push origin <parent-branch>`.
7. **Clean Up Branch**: Delete local task branch: `git branch -d <task-branch>`.

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to mark a task as completed or done while leaving uncommitted files (`git status` dirty).
2. ❌ **FORBIDDEN** to complete a task locally without pushing the commits to the remote repository.
3. ❌ **FORBIDDEN** to force-push (`git push --force` or `-f`) to shared parent branches (`main`, `tasks`).
4. ❌ **FORBIDDEN** to trigger local Docker builds after pushing code; all build operations are delegated to Builder Bot.
5. ❌ **FORBIDDEN** to bypass pre-push type-checking unless emergency bypass flag `SKIP_TYPECHECK=1` is explicitly justified.
