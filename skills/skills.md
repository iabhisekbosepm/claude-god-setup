# Skills Registry

## Skills Matrix

| # | Skill | Agent(s) | Model |
|---|-------|----------|-------|
| 1 | Architecture Design | architect, code-architect | opus, sonnet |
| 2 | Implementation Planning | planner | opus |
| 3 | Code Review (General) | code-reviewer | sonnet |
| 4 | TypeScript Review | typescript-reviewer | sonnet |
| 5 | Python Review | python-reviewer | sonnet |
| 6 | Security Audit | security-reviewer | sonnet |
| 7 | Performance Optimization | performance-optimizer | sonnet |
| 8 | Build Error Resolution | build-error-resolver | sonnet |
| 9 | E2E Testing | e2e-runner | sonnet |
| 10 | Codebase Exploration | code-explorer | sonnet |
| 11 | Code Simplification | code-simplifier | sonnet |
| 12 | Refactoring & Cleanup | refactor-cleaner | sonnet |
| 13 | Comment Analysis | comment-analyzer | sonnet |
| 14 | Silent Failure Hunting | silent-failure-hunter | sonnet |
| 15 | Documentation & Codemaps | doc-updater | haiku |
| 16 | SEO Audit | seo-specialist | sonnet |
| 17 | GAN Planning | gan-planner | opus |
| 18 | GAN Generation | gan-generator | opus |
| 19 | GAN Evaluation | gan-evaluator | opus |
| 20 | Eval Architecture | eval-architect | opus |

## Agent Routing

| Task | Agent | Model |
|------|-------|-------|
| Design a new system | architect | opus |
| Plan feature implementation | planner | opus |
| Design from existing patterns | code-architect | sonnet |
| Understand existing code | code-explorer | sonnet |
| Review code (general) | code-reviewer | sonnet |
| Review TypeScript/JavaScript | typescript-reviewer | sonnet |
| Review Python | python-reviewer | sonnet |
| Find security vulnerabilities | security-reviewer | sonnet |
| Optimize performance | performance-optimizer | sonnet |
| Fix build/type errors | build-error-resolver | sonnet |
| Write/run E2E tests | e2e-runner | sonnet |
| Simplify complex code | code-simplifier | sonnet |
| Remove dead code | refactor-cleaner | sonnet |
| Audit comments | comment-analyzer | sonnet |
| Find silent failures | silent-failure-hunter | sonnet |
| Update docs/codemaps | doc-updater | haiku |
| SEO audit | seo-specialist | sonnet |
| GAN: spec from prompt | gan-planner | opus |
| GAN: build app | gan-generator | opus |
| GAN: test and score | gan-evaluator | opus |
| Design LLM evaluation pipeline | eval-architect | opus |

## Cost Optimization

| Tier | Model | Use For |
|------|-------|---------|
| Low | haiku | Docs, codemaps, simple updates |
| Balanced | sonnet | Reviews, analysis, testing, optimization |
| High | opus | Architecture, planning, GAN, creative judgment |

Default: sonnet. Opus only for deep reasoning/creative tasks. Haiku for deterministic work.

## Shared Patterns

Cross-cutting rules referenced by multiple agents:
- `patterns/coding-standards.md` — file/function/naming rules
- `patterns/security-rules.md` — OWASP, secrets, input validation
- `patterns/error-handling.md` — catch patterns, propagation, anti-patterns
