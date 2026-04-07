# Security Rules

Non-negotiable rules for all agents. Referenced by security-reviewer, code-reviewer, typescript-reviewer, python-reviewer.

## Hard Rules
- No hardcoded secrets — use environment variables
- Parameterized queries only — never string concatenation for SQL
- Validate all user input at system boundaries
- Sanitize before rendering user content
- Auth check on every protected route

## OWASP Top 10 Quick Check
1. **Injection** — Queries parameterized? Input sanitized?
2. **Broken Auth** — Passwords hashed (bcrypt/argon2)? JWT validated?
3. **Sensitive Data** — HTTPS? Secrets in env vars? PII encrypted?
4. **XXE** — XML parsers secure? External entities disabled?
5. **Broken Access** — Auth on every route? CORS configured?
6. **Misconfiguration** — No default creds? Debug off in prod?
7. **XSS** — Output escaped? CSP set?
8. **Insecure Deserialization** — User input deserialized safely?
9. **Known Vulnerabilities** — Dependencies up to date?
10. **Insufficient Logging** — Security events logged?

## Critical Patterns to Flag

| Pattern | Fix |
|---------|-----|
| Hardcoded secrets | `process.env` / env vars |
| Shell command with user input | `execFile` with allowlist |
| String-concatenated SQL | Parameterized queries |
| `innerHTML = userInput` | `textContent` or DOMPurify |
| `fetch(userProvidedUrl)` | Whitelist domains |
| Plaintext password comparison | `bcrypt.compare()` |
| No auth on route | Add auth middleware |
| No rate limiting | Add rate limiter |
