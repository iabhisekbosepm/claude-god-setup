#!/bin/bash
# Hook: SessionStart — Load God Setup environment
# Fires on: startup, resume

set -euo pipefail

INPUT=$(cat)
SESSION_SOURCE=$(echo "$INPUT" | jq -r '.source // "unknown"')

# Resolve agents directory — project-level first, then global
AGENTS_DIR=""
if [ -d "${CLAUDE_PROJECT_DIR:-}/agents" ]; then
  AGENTS_DIR="$CLAUDE_PROJECT_DIR/agents"
elif [ -d "$HOME/.claude/agents" ]; then
  AGENTS_DIR="$HOME/.claude/agents"
fi

# Persist environment variables if CLAUDE_ENV_FILE is available
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export CLAUDE_GOD_SETUP=true" >> "$CLAUDE_ENV_FILE"
  [ -n "$AGENTS_DIR" ] && echo "export GOD_SETUP_AGENTS_DIR=\"$AGENTS_DIR\"" >> "$CLAUDE_ENV_FILE"
fi

# Count available agents
AGENT_COUNT=0
if [ -n "$AGENTS_DIR" ]; then
  AGENT_COUNT=$(ls "$AGENTS_DIR/"*.md 2>/dev/null | wc -l | tr -d ' ')
fi

# Output context for Claude
cat <<EOF
{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "God Setup active. $AGENT_COUNT agents loaded. Use /review, /plan, /security-audit, /pipeline, /gan, /explore, /optimize, /cleanup, /docs, /audit, /fix-build, /quick-fix, /pr-review, /seo-audit, /eval commands."
  }
}
EOF
