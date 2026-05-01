---
paths:
  - "apps/frontend/src/**/*.{ts,tsx}"
---

## Frontend Conventions

- Runtime: Bun.
- React component and type names stay English; user-facing lesson copy stays French.
- Build the actual learning surface as the first screen.
- Keep product behavior in testable lesson/domain modules before wiring it into React views.
- Progressive disclosure is required: simple view first, detail view on demand.
- Split-view code plus diagram is the default learning layout.
- Keep motion reusable and meaningful: reveal, code-to-diagram link, `yield*` resolve, error branch, prepared-to-execute.
- Preserve reduced-motion behavior for any animation.
- Do not add a large UI, animation, state, or syntax-highlight dependency without explicit user approval.
