# CLAUDE.md — God Setup

Multi-agent orchestration system. 21 agents in `agents/`, 15 slash commands in `.claude/skills/`, 9 hooks in `.claude/hooks/`.
Human docs: `README.md`. Shared rules: `patterns/`. Skills routing: `skills/skills.md`.

## Model Routing

| Tier | Model | Use For |
|------|-------|---------|
| Lite | haiku | Docs, codemaps, formatting |
| Standard | sonnet | Reviews, analysis, testing, refactoring |
| Power | opus | Architecture, planning, GAN, creative judgment |

**Default:** sonnet. Never opus for deterministic work. Never haiku for judgment calls.

## Auto-Trigger Rules

These agents activate **proactively** when conditions are met:

| Condition | Agent | Priority |
|-----------|-------|----------|
| Any code written or modified | `code-reviewer` | HIGH |
| .ts/.tsx/.js/.jsx files changed | `typescript-reviewer` | HIGH |
| .py files changed | `python-reviewer` | HIGH |
| Build fails or type errors | `build-error-resolver` | CRITICAL |
| Auth, API, DB, or payment code touched | `security-reviewer` | CRITICAL |
| New feature planned | `planner` | HIGH |
| System design decision needed | `architect` | HIGH |
| Feature completed | `e2e-runner` | MEDIUM |
| Major feature merged | `doc-updater` | LOW |
| Performance regression | `performance-optimizer` | MEDIUM |

## Coding Standards

See `patterns/coding-standards.md`, `patterns/security-rules.md`, `patterns/error-handling.md` for full rules.

**Non-negotiable:** No hardcoded secrets. Parameterized queries only. Validate all user input. Auth on every protected route.

## Quick Reference

```
/review          /plan <feature>     /pipeline <feature>   /fix-build
/quick-fix <bug> /audit              /security-audit       /explore <area>
/optimize        /cleanup            /docs                 /pr-review <num>
/gan <prompt>    /seo-audit          /eval [project]
```

**Direct:** `Read agents/<name>.md and [task description]`
**Chained:** Read agents in sequence: code-explorer → architect → planner
