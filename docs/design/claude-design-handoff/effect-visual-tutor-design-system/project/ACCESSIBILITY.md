# Accessibility

The lesson surface is for learning. Anything that excludes a learner — low contrast, no keyboard path, motion that triggers vestibular discomfort, screen-reader silence — is a failure of the design, not a stretch goal.

---

## Contrast (WCAG)

All foreground/background pairs in `colors_and_type.css` have been chosen to meet at minimum **WCAG AA for normal text** (4.5:1) and **AAA for body prose** where possible. Code is body-sized text.

| Pair | Ratio (light) | Ratio (dark) | Status |
|---|---|---|---|
| `--ink` on `--paper` | 14.6:1 | 13.1:1 | AAA |
| `--ink-2` on `--paper` | 8.9:1 | 8.4:1 | AAA |
| `--ink-3` on `--paper` | 4.6:1 | 4.7:1 | AA — metadata only, never body |
| `--success-fg` on `--success-bg` | 5.1:1 | 5.6:1 | AA |
| `--error-fg` on `--error-bg` | 5.4:1 | 5.2:1 | AA |
| `--req-fg` on `--req-bg` | 4.8:1 | 4.9:1 | AA |
| `--selected-fg` on `--selected-bg` | 6.2:1 | 5.0:1 | AA |
| `--private-fg` on `--private-bg` | 5.7:1 | 4.9:1 | AA |
| `--public-fg` on `--public-bg` | 5.0:1 | 4.7:1 | AA |
| `--prepared-fg` on `--prepared-bg` | 5.5:1 | 5.3:1 | AA |
| `--exec-fg` on `--exec-bg` | 11.8:1 | 9.6:1 | AAA |

`--ink-3` and `--ink-4` are explicitly **non-body** colours — used for line numbers, metadata, disabled text only.

---

## Colour is never the only signal

Every semantic state has a redundant non-colour cue:

| State | Colour | Redundant cue |
|---|---|---|
| Success | sage | `✓` mark in badge, label `RÉUSSITE` |
| Error | terracotta | label `ERREUR`, hatched edge on the error capsule |
| Requirements | mustard | open-ring shape (vs filled), label `REQUIREMENTS` |
| Selected | slate-blue | 3px left bar on code line |
| Inactive | taupe | 60% opacity in addition to colour shift |
| Private | plum | **diagonal hatch fill** (the most distinctive non-colour signal in the system) |
| Public | teal | solid fill, label `API PUBLIQUE` |
| Prepared | gold | ring outline (no fill) |
| Execution | amber | glow + pulse motion |

A user with full colour-blindness can still read every state from shape and label.

---

## Keyboard

- Every interactive element is reachable in DOM order.
- `:focus-visible` always shows the dual-ring `--ring`. Focus styles are mandatory; never `outline: none` without an immediate replacement.
- Step navigation: `←` / `→` move between steps; `Home` / `End` jump to first / last step.
- Disclosure (simple/detail): `Space` or `Enter` toggles. The disclosed region is in the same tab order as its trigger.
- Diagram nodes are focusable. Focusing a node activates the same code↔diagram link as hovering does (animation 2 in `MOTION.md`). `Esc` releases the link.
- Code frames are themselves focusable (`tabindex="0"`) and announce filename + language to screen readers.

---

## Screen readers

- Code frames use `<pre><code>` and are wrapped in a `<figure>` with a French `<figcaption>` describing what the code does. The caption is the explanation a screen-reader user gets in lieu of the diagram.
- Each `yield*` step has an `aria-label` that reads as a complete French sentence: *"Étape 2 sur 7 : charger l'état depuis le state manager."* The screen-reader user hears the lesson narrative without seeing the animation.
- Diagram primitives have `role="img"` and `aria-label` describing their role in French (*"Capsule représentant l'effet preparéRecapRun"*).
- State changes (yield* resolves, error branch appears, execute fires) are announced via an `aria-live="polite"` region. Messages are short and complete sentences in French.
- Decorative SVG (the connector path in animation 2) has `aria-hidden="true"`.

---

## Reduced motion

Honoured at two levels:

1. **Globally** via the CSS rule in `colors_and_type.css`: animation and transition durations collapse to ~0ms.
2. **Per-component** decisions, documented in `MOTION.md`. Each animation specifies which beats are kept (state-conveying colour and opacity changes) and which are dropped (traversal, pulse, bounce).

The pedagogical promise: **a learner with `prefers-reduced-motion` sees the same states in the same order, only without the bridging animation.** They never lose information.

---

## Text & language

- `<html lang="fr">` is the default for the lesson surface.
- Code blocks are wrapped in `<code lang="en">` (or `<pre lang="en">`) so French screen-reader voices switch to English pronunciation for identifiers. Mixed-language pronunciation is one of the most fatiguing screen-reader experiences and this fixes it.
- Inline code chips inside French copy use `<code lang="en">` for the same reason.
- `dir="ltr"` is explicit. Future lesson translations into RTL languages would require a separate audit; this system is LTR-only as designed.

---

## Resizing & zoom

- The system reflows down to 360px wide (the rail minimum). Below 880px the two rails stack vertically; code first.
- Zoom up to 200% must not clip content. Code frames horizontal-scroll when needed; never wrap inside the code body itself (wrapping changes meaning).
- All sizes use `rem`/`em` where possible; the only `px` values are for stroke widths, line bars, and exact pixel-grid alignments.

---

## Touch targets

- Minimum 44×44px hit area on all interactive elements (mobile and tablet).
- Step prev/next buttons exceed 44px on tablet; the visual icon is smaller but the click region extends to the strip's full height.

---

## Forms / inputs

This system has no form inputs in the lesson surface itself — the lesson is read, not filled in. If future lessons add inputs (e.g. a "predict the output" exercise), they must:

- Have visible labels (no placeholder-only).
- Show errors in `--error-fg` text **and** an `aria-describedby` link to the error message.
- Never use colour alone to signal validation state.
