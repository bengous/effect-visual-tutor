# UI kit — Lesson surface

The reference recreation of the lesson surface for `effect-visual-tutor`. Demonstrates every component in the system composed into a real lesson view.

## Files
- `index.html` — the live demo. Loads React + JSX components and renders the lesson around the `prepareRecapRun` excerpt.
- `App.jsx` — top-level layout (header, split rails, step nav).
- `CodeFrame.jsx` — code container with header, gutter, body, footer.
- `CodeBody.jsx` — syntax-highlighted code with semantic-row overlays.
- `Diagram.jsx` — SVG canvas + primitive components (Capsule, Ring, Arrow, Frame).
- `ConceptPanel.jsx` — eyebrow + title + simple/detail body with disclosure.
- `StepNav.jsx` — bottom navigation strip.
- `Badge.jsx`, `Button.jsx`, `Toggle.jsx` — small primitives.

## Notes
- Components are intentionally simple — visual recreation, not production code.
- All values come from `colors_and_type.css`. No literal colors, no literal durations.
- The lesson content is the canonical Step 03 of the first lesson: detecting the run context, with the error branch revealed.
