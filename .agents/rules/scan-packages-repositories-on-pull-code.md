# Mandatory Rule: Dynamic Scanning of Packages Repositories on Code Pull (Rule 53 & Section 653)

<!-- Compatibility: QUY TẮC BẮT BUỘC: KHI PULL CODE CÁC PACKAGES, PHẢI SCAN CÁC REPOSITORIES TRONG PACKAGES (CÓ THỂ CÓ REPOSITORY MỚI HOẶC 0) VÀ PULL ĐẦY ĐỦ (SCAN PACKAGES REPOSITORIES ON PULL CODE RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: 53. **[MANDATORY RULE: SCAN REPOSITORIES IN PACKAGES DYNAMICALLY WHEN PULLING CODE (RULE 53)]** -->

> **ZERO TOLERANCE**:
> When pulling code, synchronizing repositories, or verifying workspace freshness across all 2-TEK projects:
> 1. **MANDATORY 100% DYNAMIC DISCOVERY OF PACKAGES REPOSITORIES**:
>    - Never assume or hardcode a static, fixed list of package names when pulling code.
>    - AI Agents and developers **MUST dynamically scan the `Packages/` directory** for all subdirectories containing a Git repository (`.git` directory or submodule file).
>    - The workspace structure is extensible and dynamic: new repositories may be introduced at any time (e.g., `Packages/Cloud`, `Packages/DeviceFarms`), or zero new packages may exist. Every Git repository residing in `Packages/` must be discovered in real time.
> 2. **MANDATORY 100% COMPREHENSIVE PULL ACROSS ALL DISCOVERED REPOSITORIES**:
>    - When pulling code for packages, iterate through **every discovered repository** in `Packages/*` as well as the root workspace repository.
>    - Execute code pull (`git pull` or `git pull --rebase origin <branch>`, or canonical command `npm run fetch:pull` / `node scripts/fetch-all.mjs --pull`).
>    - Ensure all existing and newly created packages receive the latest commits from remote upstream (`origin/<branch>`), eliminating out-of-sync dependencies, divergent code, or stale imports.
> 3. **SAFE SYNCHRONIZATION ON DIRTY WORKING TREE (RULE 27 ALIGNMENT)**:
>    - Prior to pulling in any repository, inspect its working tree status (`git status --porcelain`).
>    - If a repository contains uncommitted local modifications, avoid blind destructive pulls. Cleanly commit/stash first, or notify without corrupting local work.
> 4. **CANONICAL TOOLING INTEGRATION**:
>    - Workspace synchronization tools (such as `scripts/fetch-all.ts`, `scripts/fetch-all.mjs`, `npm run fetch:pull`) MUST dynamically readdir `Packages/` and append all discovered `.git` packages to the target catalog before executing fetch or pull.

---

## 1. Core Purpose & Architectural Importance

1. **Elimination of "Orphaned" & Divergent Sub-Repositories**:
   - The 2-TEK workspace contains multiple independent Git repositories nested inside `Packages/` (`Packages/Bots`, `Packages/CompanyWeb`, `Packages/Lowcode`, `Packages/LowcodeStudio`, `Packages/Office`, `Packages/Server`, `Packages/Shared`, `Packages/SuperChat`, `Packages/SystemAdmin`, `Packages/Cloud`, `Packages/DeviceFarms`, etc.).
   - Relying on a fixed package list means newly added repositories are omitted from synchronization routines, remaining stale or causing runtime import failures.

2. **Autonomous Agent Reliability & Fresh Source Grounding**:
   - Under Rule 0 of `auto-commit-code.md` (Git Sync), agents must pull latest code from GitHub prior to editing files.
   - Dynamic scanning guarantees that whether a package was added minutes ago or months ago, the agent pulls fresh upstream commits across all active repositories in the workspace.

3. **Multi-Repository Consistency (Zero Merge Surprises)**:
   - Synchronizing all packages collectively prevents schema drift between backend (`Packages/Server`), shared UI (`Packages/Shared`), and consumer apps (`Packages/LowcodeStudio`, `Packages/Office`, `Packages/Cloud`).

---

## 2. Dynamic Discovery & Pull Workflow

```
[Trigger: Pull Code / Sync Workspace]
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Scan Workspace Root (.)                             │
│ • Inspect git status & pull latest changes on active branch │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Dynamically Scan Packages/ Directory                │
│ • ReaddirSync('Packages/')                                  │
│ • Check each entry for .git (directory or file)             │
│ • Support dynamic entries: can have new repos or 0 new      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Iterate & Pull Each Discovered Repository           │
│ • Check working tree: if clean, git pull / git pull --ff    │
│ • If dirty, report or safely preserve uncommitted changes   │
│ • Log synchronization status for all repos                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Standard Commands & Implementation

### Running Dynamic Workspace Pull
```bash
# Canonical fast multi-repository pull runner
npm run fetch:pull
# Or direct runner invocation
node scripts/fetch-all.mjs --pull

# Status check across all dynamic repositories
npm run fetch:status
# Or direct runner invocation
node scripts/fetch-all.mjs --status
```

### Dynamic Scanning Reference Implementation (Node.js)
```typescript
import * as fileSystem from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const packagesDirectoryPath: string = path.resolve(process.cwd(), "Packages");
if (fileSystem.existsSync(packagesDirectoryPath)) {
  const packageEntries: string[] = fileSystem.readdirSync(packagesDirectoryPath);
  for (const entryName of packageEntries) {
    const fullPackagePath: string = path.join(packagesDirectoryPath, entryName);
    const gitPath: string = path.join(fullPackagePath, ".git");
    if (fileSystem.existsSync(gitPath)) {
      console.log(\`Pulling repository in Packages/\${entryName}...\`);
      execSync("git pull", { cwd: fullPackagePath, stdio: "inherit" });
    }
  }
}
```

---

## 4. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to use a hardcoded list of package names when synchronizing or pulling workspace repositories.
2. ❌ **FORBIDDEN** to pull code only in the root workspace while ignoring repositories inside `Packages/`.
3. ❌ **FORBIDDEN** to omit newly created or discovered repositories (e.g. `Packages/Cloud`, `Packages/DeviceFarms`) from the pull sequence.
4. ❌ **FORBIDDEN** to execute destructive force pulls that discard uncommitted local modifications without safety checks.
