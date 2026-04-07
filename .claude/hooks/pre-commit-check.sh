#!/bin/bash
# Hook: PreToolUse — Pre-commit safety checks
# Warns about common issues before committing

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
WARNINGS=""

# Check for staged .env files
if git diff --cached --name-only 2>/dev/null | grep -qE '\.env$|\.env\.local$|\.env\.production$'; then
  WARNINGS="${WARNINGS}WARNING: .env file is staged for commit. This may contain secrets.\n"
fi

# Check for staged credential files
if git diff --cached --name-only 2>/dev/null | grep -qiE 'credentials|secret|key\.json|\.pem$|\.key$'; then
  WARNINGS="${WARNINGS}WARNING: Potential credential file staged for commit.\n"
fi

# Check for console.log in staged files
CONSOLE_COUNT=$(git diff --cached --unified=0 2>/dev/null | grep -c '^\+.*console\.log' || true)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
  WARNINGS="${WARNINGS}NOTE: $CONSOLE_COUNT console.log statement(s) found in staged changes.\n"
fi

# Check for TODO/FIXME in staged changes
TODO_COUNT=$(git diff --cached --unified=0 2>/dev/null | grep -c '^\+.*\(TODO\|FIXME\|HACK\|XXX\)' || true)
if [ "$TODO_COUNT" -gt 0 ]; then
  WARNINGS="${WARNINGS}NOTE: $TODO_COUNT TODO/FIXME/HACK comment(s) in staged changes.\n"
fi

if [ -n "$WARNINGS" ]; then
  cat <<EOF
{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "Pre-commit warnings:\n${WARNINGS}Review these before committing."
  }
}
EOF
else
  echo '{"continue": true}'
fi
