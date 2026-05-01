---
name: effect-visual-tutor-design
description: Use this skill to generate well-branded interfaces and assets for `effect-visual-tutor`, an interactive tool that teaches abstract programming concepts (Effect, `Effect.gen`, `yield*`, prepare/execute, encapsulation, error channels) through real code in French. Use for production work or throwaway prototypes/mocks. Contains the full design system: tokens, colors, type, motion spec, accessibility rules, diagram primitives, and a UI-kit specimen of the lesson surface.
user-invocable: true
---

Read the README.md file within this skill, then explore the other available files. Key entry points:

- `README.md` — product context, content fundamentals, visual foundations.
- `DIRECTIONS.md` — three visual directions explored, recommendation, justification.
- `colors_and_type.css` — the single token source: colours, type, spacing, radii, shadows, motion durations and easings. Reference variables, never literal values.
- `MOTION.md` — the five pedagogical animations, fully specified (durations, easings, beats).
- `ACCESSIBILITY.md` — contrast, keyboard, screen-reader, reduced-motion contracts.
- `preview/` — small specimen cards for every token group and component.
- `ui_kits/lesson/` — reference React/JSX recreation of the lesson surface (CodeFrame, Diagram, ConceptPanel, StepNav).

Core rules to honour when designing for this brand:
1. **Code is the protagonist** — the code frame is the largest, sharpest object on screen.
2. **One concept, one primitive** — capsule (Effect), ring (service requirement), arrow (yield*), frame (encapsulation, hatched if private), badge (state). Compose primitives; never invent new ones.
3. **State is colour, not chrome** — use semantic roles (`--success-*`, `--error-*`, `--req-*`, `--selected-*`, `--private-*`, `--public-*`, `--prepared-*`, `--exec-*`).
4. **Motion has a job** — every animation maps to a pedagogical question. See MOTION.md.
5. **French copy is `tutoiement`, active voice, present tense.** English keywords (`yield*`, `Effect`, `Success`, `Error`, `Requirements`) stay in `code-inline` chips.
6. **No emoji, no gradients (except `--exec-glow`), no decorative SVG icons.** Lucide for affordances; primitives for concepts.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy `colors_and_type.css` and any needed assets out and create static HTML files for the user to view.
If working on production code (Vite + React + TypeScript stack), read the rules here, lift the tokens into your token file, and reuse the primitive components from `ui_kits/lesson/`.

If the user invokes this skill without other guidance, ask them what they want to build, ask focused questions about the lesson concept, the audience, the level of motion, and act as an expert designer who outputs HTML artifacts or production-ready React code.
