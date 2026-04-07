#!/bin/bash
# Hook: Notification — System notification on macOS
# Sends native notification when Claude needs attention

set -euo pipefail

INPUT=$(cat)
TYPE=$(echo "$INPUT" | jq -r '.type // "info"')

# macOS notification
if command -v osascript &>/dev/null; then
  case "$TYPE" in
    permission_prompt)
      osascript -e 'display notification "Claude Code needs permission" with title "Claude God Setup"' 2>/dev/null || true
      ;;
    idle_prompt)
      osascript -e 'display notification "Claude Code is waiting for input" with title "Claude God Setup"' 2>/dev/null || true
      ;;
  esac
fi

echo '{"continue": true}'
