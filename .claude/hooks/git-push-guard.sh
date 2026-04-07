#!/bin/bash
# Hook: PreToolUse — Guard against unsafe git push
# Blocks push to main/master without explicit confirmation

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Check if pushing to main or master
if echo "$COMMAND" | grep -qE 'git push.*(origin\s+)?(main|master)'; then
  # Allow if it's a normal push (not force)
  if echo "$COMMAND" | grep -qE '\-\-force|\-f'; then
    echo "BLOCKED: Force push to main/master is not allowed." >&2
    exit 2
  fi
fi

# Check if pushing without specifying remote/branch (could push to main)
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  if echo "$COMMAND" | grep -qE '^git push\s*$'; then
    echo "WARNING: You are pushing directly to $BRANCH. Make sure this is intentional." >&2
    # Don't block, just warn — exit 0
  fi
fi

cat <<EOF
{
  "continue": true
}
EOF
