#!/bin/bash
# Hook: UserPromptSubmit — Inject agent routing hints
# Detects keywords in user prompt and suggests relevant agents

set -euo pipefail

INPUT=$(cat)

# Just pass through — the CLAUDE.md auto-trigger rules handle routing
# This hook exists as an extension point for future prompt preprocessing

cat <<EOF
{
  "continue": true
}
EOF
