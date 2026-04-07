#!/bin/bash
# Hook: PreToolUse — Block force push
# Never allow --force push without explicit user override

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Only block if this is actually a force push command
if echo "$COMMAND" | grep -qE 'git push.*(--force|-f)'; then
  echo "BLOCKED: Force push (--force / -f) is dangerous and can overwrite remote history. Use --force-with-lease if you must, or ask the user for explicit confirmation." >&2
  exit 2
fi

echo '{"continue": true}'
