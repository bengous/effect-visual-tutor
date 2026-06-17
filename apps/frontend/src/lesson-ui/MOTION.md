# Per-component motion decisions

Implementation companion to the binding design handoff
`docs/design/.../project/MOTION.md` (the catalog) and its `ACCESSIBILITY.md`
("Reduced motion is honoured … 2. Per-component decisions, documented in
`MOTION.md`"). The catalog states the pedagogical intent; this file records what
each implemented component actually animates, which catalog entry it maps to,
and **which beats survive `prefers-reduced-motion: reduce`**.

Reduced motion is honoured at two levels:

1. **Global** — `colors_and_type.css` collapses every `animation`/`transition`
   duration to ~0ms. This alone makes all traversals instant while keeping the
   final colour/opacity state (which carries meaning).
2. **Per-component** — explicit overrides in `styles.css` under
   `@media (prefers-reduced-motion: reduce)` for beats the global rule cannot
   express (a path that must land at full length, a glow that must not linger).

The promise: a reduced-motion learner sees the **same states in the same order**,
only without the bridging movement. No information is lost.

| Component                     | Animated surface                                                                                            | Catalog entry                    | Kept under reduced motion                                                  | Dropped under reduced motion                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `ConceptPanel`                | `.detail-reveal` (`max-height`/`opacity`/`padding`/`border-width`, `--dur-reveal`/`--ease-out`)             | #1 Reveal                        | final open state: opacity 1, padding, border, content height               | the expand traversal (instant)                                   |
| `CodeFrame`                   | `.code-row` (`background-color`/`border-color`/`opacity`, `--dur-quick`/`--ease-in-out`)                    | #2 Link (code side)              | selected/role tint + 3px left bar + inactive opacity                       | the tint fade-in (instant)                                       |
| `DiagramPanel` → `FlowNode`   | `.flow-node` (`fill`/`stroke`/`stroke-width`/`opacity`, `--dur-quick`); hover/focus stroke cue              | #2 Link (diagram side)           | selected stroke colour + `stroke-width` bump (also the keyboard focus cue) | the stroke transition (instant)                                  |
| `DiagramPanel` → error branch | `.error-branch` (`opacity` + `stroke-dashoffset`, `--dur-branch`/`--ease-out`), `.flow-node--error` opacity | #4 Error branch                  | error capsule + arrow shown at full length, error tint                     | the dash-draw traversal — overridden to `stroke-dashoffset: 0`   |
| `DiagramPanel` → execution    | `.execute-chip`, `.execute-arrow`, `.running-node` (`fill`/`stroke`/`filter`, `--dur-step`/`--ease-bounce`) | #5 Prepared → execute            | prepared/active fill + stroke state                                        | the glow `filter` (`drop-shadow`) — overridden to `filter: none` |
| `SimulationControls`          | `.button` press (`transform: translateY(1px)`, `--dur-instant`); `.simulation-status` colour states         | foundations press + state colour | status colour state (prepared/exec/error/reset text)                       | the 1px press translate (instant)                                |
| `StepNav`                     | `.step-dot` selection (`aria-current` colour swap, no transition)                                           | — (instant by design)            | the selected colour state                                                  | nothing to drop                                                  |

## Intentional deviations from the catalog

These are implemented differently from the catalog and are **not** regressions —
record them here so a future agent doesn't "fix" them back:

- **No looping pulses.** Catalog #5 specifies a 1.5s idle gold-ring pulse on the
  prepared state and a 2s pulse on the running capsule. We render the prepared
  and running states as **static** glows (`drop-shadow`), no looping animation.
  This keeps the surface calm and sidesteps a reduced-motion-only ambient loop.
- **Disclosure is a segmented control, not a chevron.** Catalog #1 describes a
  rotating chevron; `ConceptPanel` uses a `Simple`/`Détail` segmented toggle.
  The reveal of `.detail-reveal` still follows #1; only the trigger differs.
- **No token-traversal animation (#3 Yield\*).** The `yield*` flow token that
  travels along a path is not implemented; the code side conveys the same state
  through line highlights. If added later, use the Web Animations API per the
  catalog and keep the keyword colour pulse under reduced motion.

## Adding motion later

Any new animation must: use a duration **token** (never a literal ms), answer a
stated pedagogical question, and declare its reduced-motion behaviour in the
table above. State-conveying colour/opacity changes are kept; traversal, pulse,
and bounce are dropped.
