# Error Handling Rules

Referenced by code-reviewer, typescript-reviewer, python-reviewer, silent-failure-hunter.

## Core Rules
- Catch specific exceptions, never bare `catch {}`
- Propagate errors with context, never swallow silently
- Use error boundaries in React component trees
- Log with structured logger, never `console.log` in production

## Anti-Patterns to Flag

| Anti-Pattern | Severity | Fix |
|-------------|----------|-----|
| Empty catch block | CRITICAL | Log error, handle or rethrow |
| `catch(() => [])` / `catch(() => null)` | HIGH | Return error state, don't hide failure |
| Generic rethrow without context | MEDIUM | Wrap with `new Error("context", { cause })` |
| `JSON.parse` without try/catch | HIGH | Always wrap |
| `throw "message"` | MEDIUM | `throw new Error("message")` |
| Async without error handling | HIGH | Add `.catch()` or `try/catch` |
| Log-and-forget | MEDIUM | Log AND handle (retry, fallback, propagate) |
| Missing timeout on network calls | HIGH | Add timeout config |
| No rollback on partial failure | HIGH | Wrap in transaction |
