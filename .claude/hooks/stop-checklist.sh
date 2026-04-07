#!/bin/bash
# Hook: Stop — Completion checklist verification
# Reminds Claude to verify work before finishing (non-blocking)

set -euo pipefail

INPUT=$(cat)

# Prevent infinite loop — if stop hook is already active, exit immediately
STOP_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [ "$STOP_ACTIVE" = "true" ]; then
  echo '{"continue": true}'
  exit 0
fi

# Check if any files were edited this session
TRACK_FILE="/tmp/claude-god-edited-files-$$"
if [ -f "$TRACK_FILE" ]; then
  EDITED_COUNT=$(sort -u "$TRACK_FILE" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$EDITED_COUNT" -gt 0 ]; then
    # Get file extensions to determine what reviewers should have run
    HAS_TS=$(grep -cE '\.(ts|tsx|js|jsx)$' "$TRACK_FILE" 2>/dev/null || echo "0")
    HAS_PY=$(grep -cE '\.py$' "$TRACK_FILE" 2>/dev/null || echo "0")

    REMINDERS=""
    if [ "$HAS_TS" -gt 0 ]; then
      REMINDERS="${REMINDERS}- TypeScript files changed: consider /review if not already done\n"
    fi
    if [ "$HAS_PY" -gt 0 ]; then
      REMINDERS="${REMINDERS}- Python files changed: consider /review if not already done\n"
    fi

    if [ -n "$REMINDERS" ]; then
      cat <<EOF
{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "additionalContext": "Session edited $EDITED_COUNT file(s). Post-session reminders:\n${REMINDERS}"
  }
}
EOF
      # Clean up tracking file
      rm -f "$TRACK_FILE" 2>/dev/null || true
      exit 0
    fi
  fi
  rm -f "$TRACK_FILE" 2>/dev/null || true
fi

echo '{"continue": true}'
