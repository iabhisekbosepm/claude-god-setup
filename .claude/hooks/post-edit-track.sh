#!/bin/bash
# Hook: PostToolUse — Track edited files for review pipeline
# Appends modified file paths to a session tracking file

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""')

if [ -n "$FILE_PATH" ] && [ "$FILE_PATH" != "null" ]; then
  TRACK_FILE="/tmp/claude-god-edited-files-$$"
  echo "$FILE_PATH" >> "$TRACK_FILE" 2>/dev/null || true
fi

echo '{"continue": true}'
