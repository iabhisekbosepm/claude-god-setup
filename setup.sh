#!/bin/bash
# setup.sh — Install Claude God Setup globally
# Makes all agents, skills, hooks, patterns, and routing available in every project.
#
# Usage: ./setup.sh
# Safe to run multiple times (idempotent).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "=== Claude God Setup — Global Install ==="
echo ""

# ── 1. Agents ──────────────────────────────────────────────
echo "[1/6] Installing agents..."
mkdir -p "$CLAUDE_DIR/agents"
cp "$SCRIPT_DIR/agents/"*.md "$CLAUDE_DIR/agents/"
AGENT_COUNT=$(ls "$SCRIPT_DIR/agents/"*.md | wc -l | tr -d ' ')
echo "  ✓ $AGENT_COUNT agents → ~/.claude/agents/"

# ── 2. Skills ──────────────────────────────────────────────
echo "[2/6] Installing skills..."
mkdir -p "$CLAUDE_DIR/skills"
cp -r "$SCRIPT_DIR/.claude/skills/"* "$CLAUDE_DIR/skills/"
SKILL_COUNT=$(ls -d "$SCRIPT_DIR/.claude/skills/"*/ | wc -l | tr -d ' ')
echo "  ✓ $SKILL_COUNT skills → ~/.claude/skills/"

# ── 3. Patterns → Rules ───────────────────────────────────
# ~/.claude/rules/*.md auto-loads into every project session.
echo "[3/6] Installing patterns as global rules..."
mkdir -p "$CLAUDE_DIR/rules"
cp "$SCRIPT_DIR/patterns/"*.md "$CLAUDE_DIR/rules/"
PATTERN_COUNT=$(ls "$SCRIPT_DIR/patterns/"*.md | wc -l | tr -d ' ')
echo "  ✓ $PATTERN_COUNT patterns → ~/.claude/rules/"

# ── 4. Hooks ──────────────────────────────────────────────
echo "[4/6] Installing hooks..."
mkdir -p "$CLAUDE_DIR/hooks"
cp "$SCRIPT_DIR/.claude/hooks/"*.sh "$CLAUDE_DIR/hooks/"
chmod +x "$CLAUDE_DIR/hooks/"*.sh
HOOK_COUNT=$(ls "$SCRIPT_DIR/.claude/hooks/"*.sh | wc -l | tr -d ' ')
echo "  ✓ $HOOK_COUNT hooks → ~/.claude/hooks/"

# ── 5. Global settings.json (hooks config) ────────────────
echo "[5/6] Configuring global hooks in settings.json..."

# Back up existing settings if non-empty
if [ -f "$CLAUDE_DIR/settings.json" ] && [ -s "$CLAUDE_DIR/settings.json" ]; then
  EXISTING=$(cat "$CLAUDE_DIR/settings.json")
  if [ "$EXISTING" != "{}" ]; then
    cp "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/settings.json.backup"
    echo "  ⚠ Existing settings backed up to ~/.claude/settings.json.backup"
  fi
fi

HOOKS_DIR="\$HOME/.claude/hooks"

cat > "$CLAUDE_DIR/settings.json" << 'SETTINGS_EOF'
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/env-setup.sh",
            "timeout": 30,
            "statusMessage": "Loading God Setup..."
          }
        ]
      }
    ],

    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "if": "Bash(git push *)",
            "type": "command",
            "command": "$HOME/.claude/hooks/git-push-guard.sh",
            "timeout": 10,
            "statusMessage": "Push safety check..."
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "if": "Bash(git commit *)",
            "type": "command",
            "command": "$HOME/.claude/hooks/pre-commit-check.sh",
            "timeout": 15,
            "statusMessage": "Pre-commit check..."
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "if": "Bash(rm -rf *)",
            "type": "command",
            "command": "$HOME/.claude/hooks/destructive-guard.sh",
            "timeout": 5,
            "statusMessage": "Destructive cmd check..."
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "if": "Bash(git reset --hard *)",
            "type": "command",
            "command": "$HOME/.claude/hooks/destructive-guard.sh",
            "timeout": 5,
            "statusMessage": "Destructive git check..."
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "if": "Bash(git push --force *)",
            "type": "command",
            "command": "$HOME/.claude/hooks/force-push-guard.sh",
            "timeout": 5,
            "statusMessage": "Force push block..."
          }
        ]
      }
    ],

    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/post-edit-track.sh",
            "timeout": 5,
            "statusMessage": "Tracking changes..."
          }
        ]
      }
    ],

    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/stop-checklist.sh",
            "timeout": 10,
            "statusMessage": "Completion checklist..."
          }
        ]
      }
    ],

    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/notify.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
SETTINGS_EOF

echo "  ✓ Global hooks configured in ~/.claude/settings.json"

# ── 6. Global CLAUDE.md ───────────────────────────────────
echo "[6/6] Creating global CLAUDE.md..."

cat > "$CLAUDE_DIR/CLAUDE.md" << 'CLAUDE_EOF'
# Claude God Setup (Global)

Multi-agent orchestration system. 21 agents, 15 skills, 9 hooks — available in every project.

## Model Routing

| Tier | Model | Use For |
|------|-------|---------|
| Lite | haiku | Docs, codemaps, formatting |
| Standard | sonnet | Reviews, analysis, testing, refactoring |
| Power | opus | Architecture, planning, GAN, eval, creative judgment |

**Default:** sonnet. Never opus for deterministic work. Never haiku for judgment calls.

## Auto-Trigger Rules

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

## Quick Reference

```
/review          /plan <feature>     /pipeline <feature>   /fix-build
/quick-fix <bug> /audit              /security-audit       /explore <area>
/optimize        /cleanup            /docs                 /pr-review <num>
/gan <prompt>    /seo-audit          /eval [project]
```

**Direct:** `Read agents/<name>.md and [task description]`

## Non-Negotiable Rules

- No hardcoded secrets — use environment variables
- Parameterized queries only — never string concatenation for SQL
- Validate all user input at system boundaries
- Auth check on every protected route
CLAUDE_EOF

echo "  ✓ Global CLAUDE.md created"

# ── Summary ────────────────────────────────────────────────
echo ""
echo "=== Installation Complete ==="
echo ""
echo "  ~/.claude/"
echo "  ├── CLAUDE.md          ← Global instructions (loaded every session)"
echo "  ├── settings.json      ← Global hooks configuration"
echo "  ├── agents/            ← $AGENT_COUNT agents"
echo "  ├── skills/            ← $SKILL_COUNT skills"
echo "  ├── rules/             ← $PATTERN_COUNT patterns (auto-loaded)"
echo "  └── hooks/             ← $HOOK_COUNT hook scripts"
echo ""
echo "All agents, skills, hooks, and rules are now available in every project."
echo "Run 'claude' in any directory to start using them."
