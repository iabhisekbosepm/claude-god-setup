# Claude God Setup

> Multi-agent orchestration system with 21 specialized agents, automated workflows, and cost-optimized model routing.

## Quick Start

### Option A: One-Command Install (Recommended)

```bash
npx claude-god-setup
```

That's it. All 21 agents, 15 skills, 9 hooks, and 3 pattern rules are installed globally and work in every project.

### Option B: Clone and Install

```bash
git clone https://github.com/iabhisekbosepm/claude-god-setup.git
cd claude-god-setup && ./setup.sh
```

### What Gets Installed

```
~/.claude/
├── CLAUDE.md          ← Global instructions (loaded every session)
├── settings.json      ← Global hooks configuration
├── agents/            ← 21 agents
├── skills/            ← 15 slash commands
├── rules/             ← 3 pattern files (auto-loaded)
└── hooks/             ← 9 hook scripts
```

Safe to run multiple times (idempotent). Existing `settings.json` is backed up if non-empty.

### Option C: Copy Into a Single Project

```bash
# Copy everything into your project
cp -r Claude-god-setup/ your-project/.claude-god/

# Or just copy CLAUDE.md to project root
cp Claude-god-setup/CLAUDE.md your-project/CLAUDE.md
```

Claude Code auto-reads `CLAUDE.md` from the project root on every conversation start.

### What Goes Where (Global vs Project)

| Resource | Global (`~/.claude/`) | Project (`.claude/`) |
|----------|----------------------|---------------------|
| Agents | `agents/*.md` | `.claude/agents/*.md` |
| Skills | `skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` |
| Patterns/Rules | `rules/*.md` (auto-loaded) | `patterns/*.md` (referenced) |
| Hooks | `settings.json` + `hooks/*.sh` | `.claude/settings.json` + `.claude/hooks/*.sh` |
| Instructions | `CLAUDE.md` | `CLAUDE.md` (project root) |

> **Note:** Project-level resources override globals with the same name. Both levels merge for hooks and rules.

## Project Structure

```
Claude-god-setup/
  setup.sh                  ← Global install script (run once)
  CLAUDE.md                 ← AI instructions (loaded every session)
  README.md                 ← You are here (human docs)
  agents/                   ← 21 specialized agent definitions
  patterns/                 ← Shared coding standards & rules
  skills/
    skills.md               ← Skills routing matrix
  .claude/
    settings.json           ← Hooks configuration
    hooks/                  ← 9 hook shell scripts
    skills/                 ← 15 slash command definitions
```

## Agents (21)

| Agent | Purpose | Model |
|-------|---------|-------|
| `architect` | System design, scalability, trade-offs | opus |
| `planner` | Implementation planning, phased delivery | opus |
| `code-architect` | Feature blueprints from existing patterns | sonnet |
| `code-explorer` | Deep codebase analysis, execution tracing | sonnet |
| `code-reviewer` | General code quality, React/Node patterns | sonnet |
| `typescript-reviewer` | TypeScript type safety, async, idiomatic TS/JS | sonnet |
| `python-reviewer` | PEP 8, type hints, Pythonic idioms | sonnet |
| `security-reviewer` | OWASP Top 10, secrets, auth, input validation | sonnet |
| `silent-failure-hunter` | Empty catches, swallowed errors | sonnet |
| `comment-analyzer` | Comment accuracy, staleness | sonnet |
| `build-error-resolver` | Fix type/build errors with minimal diffs | sonnet |
| `performance-optimizer` | Profiling, bundle, rendering, query optimization | sonnet |
| `code-simplifier` | Simplify without changing behavior | sonnet |
| `refactor-cleaner` | Dead code removal, duplicate consolidation | sonnet |
| `e2e-runner` | E2E tests via Playwright | sonnet |
| `doc-updater` | Codemaps, READMEs, API docs | haiku |
| `seo-specialist` | Technical SEO, meta tags, structured data | sonnet |
| `gan-planner` | Expand prompt to full product spec | opus |
| `gan-generator` | Build the app, iterate on feedback | opus |
| `eval-architect` | LLM eval pipeline: auto-detect, datasets, evaluators, CI | opus |
| `gan-evaluator` | Test live app, score, provide feedback | opus |

## Slash Commands (15)

| Command | What It Does |
|---------|-------------|
| `/review` | Full code review pipeline |
| `/plan <feature>` | Create implementation plan |
| `/pipeline <feature>` | Full dev pipeline: explore to docs |
| `/fix-build` | Fix build/type errors |
| `/quick-fix <bug>` | Diagnose, fix, verify a bug |
| `/audit` | Run ALL quality gates |
| `/security-audit` | OWASP Top 10 + secrets scan |
| `/explore <area>` | Deep-dive codebase area |
| `/optimize <target>` | Profile and fix performance |
| `/cleanup` | Remove dead code, simplify |
| `/docs` | Update documentation |
| `/pr-review <number>` | Review GitHub PR |
| `/gan <prompt>` | GAN harness from prompt |
| `/seo-audit` | Technical SEO audit |
| `/eval [project]` | Generate Langfuse evaluation pipeline |

## Hooks (9)

| Hook | Event | Effect |
|------|-------|--------|
| `force-push-guard` | PreToolUse | BLOCKS `git push --force` |
| `destructive-guard` | PreToolUse | BLOCKS `rm -rf /`, `git reset --hard` |
| `git-push-guard` | PreToolUse | WARNS on push to main/master |
| `pre-commit-check` | PreToolUse | WARNS about secrets, console.log, TODOs |
| `env-setup` | SessionStart | Loads environment, lists commands |
| `post-edit-track` | PostToolUse | Tracks edited files for review |
| `stop-checklist` | Stop | Reminds about pending reviews |
| `notify` | Notification | macOS notification when input needed |
| `prompt-context` | UserPromptSubmit | Extension point |

## Automated Workflows

### Build a Feature
`code-explorer` → `architect` → `planner` → build → `build-error-resolver` → `code-reviewer` → `typescript/python-reviewer` → `security-reviewer` → `silent-failure-hunter` → `performance-optimizer` → `e2e-runner` → `doc-updater`

### Fix a Bug
`code-explorer` → fix → `build-error-resolver` → `code-reviewer` → `security-reviewer` → `e2e-runner`

### Code Review (PR)
`code-reviewer` → `typescript/python-reviewer` → `security-reviewer` → `silent-failure-hunter` → `comment-analyzer` → `performance-optimizer`

### Refactoring Sprint
`code-explorer` → `refactor-cleaner` → `code-simplifier` → `build-error-resolver` → `code-reviewer` → `e2e-runner` → `doc-updater`

### GAN Harness
`gan-planner` → `gan-generator` → `gan-evaluator` → (iterate until 7.0/10) → `code-reviewer` → `security-reviewer` → `doc-updater`

### SEO Audit
`seo-specialist` → `performance-optimizer` → fix → `seo-specialist` (verify)

### Eval Pipeline
`code-explorer` (detect app type) → `eval-architect` (generate evals/) → verify → optionally `setup_langfuse.py`

## Model Routing

| Tier | Model | Use For |
|------|-------|---------|
| Lite | haiku | Docs, codemaps, formatting |
| Standard | sonnet | Reviews, analysis, testing, refactoring |
| Power | opus | Architecture, planning, GAN, creative judgment |

## Extending This Setup

### Add a New Agent

1. Create `agents/your-agent.md` with frontmatter:
   ```yaml
   ---
   name: your-agent
   description: "What it does"
   tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
   model: sonnet
   ---
   ```
2. Write agent instructions in the body
3. Add to Skills Matrix in `skills/skills.md`

### Add a New Slash Command

1. Create `.claude/skills/your-command/SKILL.md`:
   ```yaml
   ---
   name: your-command
   description: "When to use this"
   argument-hint: "[argument]"
   allowed-tools: Read Write Edit Bash Grep Glob
   model: sonnet
   ---
   ```
2. Use `$ARGUMENTS` for user input
3. Reference `agents/*.md` for methodology

### Add a New Hook

1. Create `.claude/hooks/your-hook.sh` (`chmod +x`)
2. Read JSON from stdin, write JSON to stdout
3. Exit 0 = continue, exit 2 = block
4. Register in `.claude/settings.json`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Slash command not found | Verify `.claude/skills/<name>/SKILL.md` exists |
| Hook not firing | Run `/hooks`, check matcher pattern |
| Hook blocking unexpectedly | Check exit code (2 = block) |
| Agent not triggering | Reference agent file directly |
| Wrong model | Check agent/skill frontmatter `model` field |
| GAN stuck in loop | Check if score is improving, adjust spec |
| Build agent over-changing | Tell it: "minimal diffs only" |
