---
trigger: always_on
---

# Mandatory Rule: Always Allow Execution of Git, Python, Node, and NPM Commands (Section 510)

> **ZERO TOLERANCE**:
> When interacting with the shell environment, terminal, subprocesses, automation scripts, or when configuring execution permissions for AI Agents and browsers across all projects:
> **MANDATORY 100% MUST ALWAYS ALLOW (EFFECT: "ALLOW") safe commands within the categories: `git *`, `git`, `python *`, `python`, `python3 *`, `python3`, `pip *`, `pip`, `pip3 *`, `pip3`, `pytest *`, `pytest`, `npm *`, `npm`, `node *`, `node`**.
> **STRICTLY PROHIBITED 100%**: Blocking, denying, prompting manual interactive confirmation questions, or causing timeouts for these fundamental software development commands.
> <!-- Legacy Title / Test Alias: 22. **[QUY TẮC BẮT BUỘC: CHO PHÉP THỰC THI LỆNH GIT, PYTHON, NODE, NPM (ALLOW GIT & PYTHON COMMANDS RULE — ZERO TOLERANCE)]** -->

---

## 1. Core Purpose & Architectural Importance

1. **Ensuring Smooth AI Copilot & Automated Agent Workflows**:
   - Everyday software development tasks constantly require:
     - Version control management with Git (`git status`, `git pull`, `git diff`, `git log`, `git add`, `git commit`, `git push`).
     - Running test suites, automation scripts, AST analyzers, and data processing with Python (`python script.py`, `python3 -m unittest`, `pytest`).
     - Managing package dependencies (`pip install`, `pip3 install`).
     - Packaging, testing, and running Next.js/Web applications (`npm run dev`, `npm test`, `node scripts/fast-test.mjs`).
   - Blocking or repeatedly asking for confirmation halts headless agents, times out automated CI/CD pipelines, and severely degrades developer productivity.

2. **Standardizing Agent Configuration Manifests**:
   - All agent manifests in `.github/agents/*.json` must explicitly declare in `permissions.rules`:
     ```json
     {
       "capability": "shell",
       "match": ["npm *", "git *", "git", "node *", "node", "python *", "python", "python3 *", "python3", "pip *", "pip3 *", "pytest *"],
       "effect": "allow"
     }
     ```

3. **Integration with .lowcode Engine & MCP Standard**:
   - Governed automatically by core engine `LcAllowCommandsEngine` (`.lowcode/engines/lc-allow-commands-engine.ts`), registered in `lc_engines.allowCommands`.
   - Formally specified via MCP Action `allow_git_python_shell_commands` under Section 510 in `standard-specification.md`.
   - Synchronized across terminal standard engines with corresponding built-in commands and outputs.

---

## 2. Allowed Command Matrix

| Command / Pattern | Purpose | Allowed Status |
|---|---|---|
| `git *`, `git` | Git operations: commit, push, pull, status, diff, log, branch | ✅ **MANDATORY ALLOW** |
| `python *`, `python` | Execute Python scripts, modules, runtime checks | ✅ **MANDATORY ALLOW** |
| `python3 *`, `python3` | Execute Python 3 toolchains, venv, runtime | ✅ **MANDATORY ALLOW** |
| `pip *`, `pip3 *` | Install Python packages and dependencies for testing | ✅ **MANDATORY ALLOW** |
| `pytest *`, `pytest` | Execute automated Python test runner | ✅ **MANDATORY ALLOW** |
| `npm *`, `npm` | Run Node.js scripts: test, build, lint, type-check | ✅ **MANDATORY ALLOW** |
| `node *`, `node` | Execute helper and runner scripts in `scripts/*.mjs` | ✅ **MANDATORY ALLOW** |

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to remove `git` or `python` from the `permissions.rules` list in agent configurations.
2. ❌ **FORBIDDEN** to configure `effect: "deny"` or `effect: "ask"` for `git *`, `python *`, `npm *`, `node *`.
3. ❌ **FORBIDDEN** to introduce engines or guards that prevent users or AI agents from executing safe Git commands in the workspace.
4. ❌ **FORBIDDEN** to simulate failure or throw exceptions when the IDE terminal receives valid `git` or `python` commands.

---

## 4. Agent Manifest Specification (.github)

All agents must declare explicit permissions matching these patterns to maintain uninterrupted headless execution.
