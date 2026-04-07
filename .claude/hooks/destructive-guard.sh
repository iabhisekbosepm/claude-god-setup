#!/bin/bash
# Hook: PreToolUse — Block destructive commands
# Blocks rm -rf and git reset --hard without review

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Block rm -rf on critical paths
if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(/|~|\$HOME|\.\.)'; then
  echo "BLOCKED: Destructive rm -rf on critical path. This could delete important data." >&2
  exit 2
fi

# Block git reset --hard (warn, don't block if it's on a specific commit)
if echo "$COMMAND" | grep -qE 'git reset --hard'; then
  echo "BLOCKED: git reset --hard discards uncommitted changes. Use git stash first if you want to preserve changes." >&2
  exit 2
fi

echo '{"continue": true}'
