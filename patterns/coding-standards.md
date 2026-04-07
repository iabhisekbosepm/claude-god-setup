# Coding Standards

Single source of truth for all agents. Referenced by reviewer agents.

## File Rules
- 200-400 lines typical, 800 max
- One responsibility per file
- Name files by what they contain

## Function Rules
- < 50 lines per function
- < 5 parameters (use object/struct for more)
- < 4 levels of nesting (use early returns)
- Explicit return types on public functions

## Naming
- `camelCase` — variables, functions, methods
- `PascalCase` — types, interfaces, classes, components
- `UPPER_SNAKE` — constants, environment variables
- `kebab-case` — file names, CSS classes, URLs

## Immutability
- Spread operators over mutation (`{ ...obj, key: val }`)
- `map`/`filter`/`reduce` over `for` loops with push
- `const` by default, `let` only when reassignment needed
- Never `var`

## Testing
- New features: require E2E tests for critical paths
- Bug fixes: require regression test
- Refactors: existing tests must pass, no new tests required
