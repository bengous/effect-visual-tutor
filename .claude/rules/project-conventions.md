---
paths:
  - "scripts/**/*.ts"
---

## Tooling Script Conventions

- Runtime: Bun.
- Keep imports ESM-only.
- Keep validation scripts aligned with `lefthook.yml`, Claude hooks, and Codex hooks.
- If the repo layout changes, update validation scope detection and hook file matching in the same change.
- Hook scripts should fail with actionable output and should not silently swallow validation failures.
