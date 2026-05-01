## Project

`effect-visual-tutor` is a Vite + React + TypeScript learning app for explaining code and architecture concepts through interactive visual lessons.

The first product target is the `prepareRecapRun` lesson from Etch. The implementation PRD lives in `docs/product/PRD.md`; the Claude Design prompt and output contract live in `docs/design/`.

## Product Rules

- First screen is the lesson experience, not a landing page.
- UI copy and explanations are French.
- Code identifiers, component names, file names, and types stay English.
- Use progressive disclosure: simple explanation first, exact code/types on demand.
- Code remains the primary object of attention.
- Animations must explain relationships, state changes, or flow. No decorative motion.
- The design handoff from Claude Design is binding unless the user explicitly approves a deviation.
- Do not add Remotion, a UI kit, a state manager, or a heavy animation/syntax library without explicit approval.

## Architecture Rules

- Runtime and package manager: Bun.
- Main product code lives in `apps/frontend`.
- Keep lesson content, lesson state, code presentation, diagrams, and motion primitives behind small public interfaces.
- Prefer deep modules: simple interfaces hiding richer implementation.
- Tests should verify behavior through public lesson/UI interfaces, not private component internals.
- Follow vertical TDD for product work: one behavior test, minimal implementation, then the next behavior.
- Use existing tooling and hooks. Do not replace validation infrastructure unless asked.
