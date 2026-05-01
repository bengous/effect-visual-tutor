# Motion Spec

> Animations are pedagogical primitives, not ornaments. Every animation in this system answers a question. If it cannot answer a question, it does not ship.

---

## Principles

1. **One job per animation.** Every entry in this catalog has a stated pedagogical question it answers.
2. **Fixed durations from tokens.** Use `--dur-instant`, `--dur-quick`, `--dur-step`, `--dur-reveal`, `--dur-flow`, `--dur-branch`. Never write a literal duration.
3. **Three easings only.** `--ease-out` (default reveal), `--ease-in-out` (state changes), `--ease-bounce` (rare; "armed" prepared state only).
4. **Motion is reversible** wherever the underlying state is. Stepping back through a lesson plays the same beats backward at the same durations.
5. **Reduced motion is never silent.** When `prefers-reduced-motion: reduce`, traversal animations become instant, but **state colour and opacity changes are preserved** — they convey meaning, not movement. See `ACCESSIBILITY.md`.
6. **No motion on hover.** Hover is colour and shadow, never transform. (Press is a 1px translate, see foundations.)

---

## Catalog

### 1. Reveal — simple → detail

> *Pedagogical question: "There is more underneath. What is the relationship between the simple thing and the detail?"*

The simple view stays in place; the detail expands **below** it without displacing it. The simple view's chevron rotates 90°; the detail container animates from `max-height: 0` to its measured height while opacity goes 0 → 1.

| Property | From | To | Duration | Easing |
|---|---|---|---|---|
| `max-height` | 0 | measured | `--dur-reveal` (480ms) | `--ease-out` |
| `opacity` | 0 | 1 | `--dur-reveal` | `--ease-out` |
| chevron `rotate` | 0deg | 90deg | `--dur-quick` (160ms) | `--ease-in-out` |

Children inside the detail container fade-and-rise (translateY 4px → 0, opacity 0 → 1), staggered by `--stagger` (60ms), capped at 6 stagger steps.

**Reverse**: same durations, reversed; chevron rotates back; children fade out without stagger (60ms total).

---

### 2. Link — code line ↔ diagram node

> *Pedagogical question: "This line of code is THIS thing in the diagram. They are the same thing seen two ways."*

Triggered by hover, focus, or step-advance. **Both** the code line and its diagram node animate in lockstep:

| Element | Property | Change | Duration | Easing |
|---|---|---|---|---|
| Code line | `background-color` | transparent → `--selected-bg` | `--dur-quick` | `--ease-in-out` |
| Code line | left edge bar | 0 → 3px wide, `--selected-line` | `--dur-quick` | `--ease-in-out` |
| Diagram node | `stroke` | current → `--selected-line` | `--dur-quick` | `--ease-in-out` |
| Diagram node | `stroke-width` | 1.5 → 2.5 | `--dur-quick` | `--ease-in-out` |
| Connector | path `stroke-dashoffset` | full length → 0 | `--dur-quick` | `--ease-out` |

The connector is a thin curved SVG path drawn from the code line's right edge to the diagram node's nearest edge. It is **only present while the link is active**. It does not pulse, does not loop.

---

### 3. Yield* — step resolves

> *Pedagogical question: "The step ran. The value flowed from the step's output back into the variable on the left of `yield*`."*

This is the single most important animation in the lesson. It plays whenever a `yield*` line advances.

**Beat 1 — armed (0–80ms).** The `yield*` keyword and the right-hand expression both pulse to `--prepared-fg` colour. (`color` transition, `--dur-instant`.)

**Beat 2 — flow (80–400ms).** A token — a small filled capsule the colour of `--success-bg` with `--success-line` border — emerges from the right-hand expression and travels along an arrow path to the variable on the left side of `=`. Path is straight if same line, S-curved if multiline. Duration `--dur-step` (320ms). Easing `--ease-out`.

**Beat 3 — bind (400–560ms).** The variable name on the left flashes to `--success-bg` background, then settles to default in 160ms. The token disappears at the moment of arrival.

**Beat 4 — settle (560ms).** The right-hand expression dims to `--inactive-fg`. The line is now "past."

When viewing on the diagram side, the corresponding service ring fills from empty to filled in beat 2, in time with the token traversal.

**Reduced motion**: beats collapse to instant colour changes — keyword pulses (kept), token does not animate (skipped), variable settles (kept).

---

### 4. Error branch — appears

> *Pedagogical question: "There is a second exit. The happy path is no longer the only way out."*

Triggered when stepping into a branch that throws (the `if (input.noAi && input.rebuildToday)` block).

**Beat 1 (0–200ms).** The `if` condition's code background fades to `--error-bg`; its left bar appears in `--error-line`. The condition reads as live.

**Beat 2 (200–600ms).** A new arrow grows from the `if` block's diagram node toward an error-channel exit. It draws via `stroke-dashoffset` from full → 0 over 400ms with `--ease-out`. The error exit (a terracotta capsule labelled `Error`) fades in at opacity 0 → 1 in the final 200ms.

**Beat 3 (600–800ms).** The original happy-path arrow desaturates and dims to 40% opacity. It is still visible — students need to see what was bypassed — but it is clearly secondary.

The error branch never fully replaces the happy path visually. The lesson's job is to show that **both exits exist**.

**Reduced motion**: arrow appears instantly at full length; opacity changes preserved.

---

### 5. Prepared → execute

> *Pedagogical question: "The function returned a value that contains code waiting to run. Calling `execute()` is the moment that latent code fires."*

This is a two-act animation, separated by a deliberate pause.

**Act 1 — armed (on return statement reveal).**
The returned object (`{ runId, summary, execute }`) appears in the diagram as a frame. The `execute` field has a small **gold ring** around it that grows from 0 → 4px in `--dur-step` (320ms) with `--ease-bounce`. This is the *only* place the bounce easing appears. The ring then idles — a 1.5s slow `box-shadow` pulse between `--prepared-line` and `--exec-line`, opacity 0.4 ↔ 0.8. The pulse continues until execute is invoked. (Reduced motion: the ring appears static; no pulse.)

**Pause — student reads.**
There is no automatic transition. The student must explicitly trigger execution (button or step advance). This is intentional: the lesson teaches that prepared ≠ running, and a delay between them reinforces it.

**Act 2 — execute fires (on student trigger).**
- The ring around `execute` snaps from prepared-gold to `--exec-line` and grows to a 12px halo (`--exec-glow`) over `--dur-quick` (160ms). One pulse.
- An arrow extends from `execute` outward to a new "running" capsule that draws in over `--dur-flow` (720ms). The capsule pulses gently (`box-shadow` opacity 0.4 ↔ 0.8, 2s) for as long as execution is conceptually running.
- The summary fields stay calm — they don't animate. The lesson teaches that summary is a *static* description; only execute is *active*.

**Reduced motion**: act 1 ring appears static; act 2 capsule appears at final position; halo is solid not pulsing.

---

## Stagger & sequencing

When multiple elements enter together (e.g. a list of services loading), use `--stagger` (60ms) increments, capped at 6 elements. Beyond six, all later elements share the 6th delay slot — never let a stagger exceed 360ms total or the user perceives it as latency.

When animations chain (e.g. reveal-detail then link), the next animation begins **at the end** of the previous one — no overlap. Overlapping animations confuse causality, which is the entire pedagogical point.

---

## What is NOT in this system

- No bouncing buttons, no jiggle, no celebratory confetti.
- No skeleton shimmer; loading states use a static "Chargement…" caption.
- No parallax, no scroll-driven animation in the lesson surface.
- No looping ambient animation except the prepared-state ring pulse and the executing-capsule pulse — both of which encode meaningful state ("waiting" and "running").
- No autoplay. Step transitions are always student-triggered.

---

## Implementation notes (for the coding agent)

- Prefer CSS `transition` for state changes (link, reveal, error tinting).
- Use Web Animations API or Framer Motion for the token traversal in animation 3 — needs a path-following motion which is awkward in pure CSS.
- For Remotion later: every animation in this catalog has a known duration in ms, so they map directly to frame ranges (e.g. `--dur-step` 320ms = ~10 frames at 30fps).
- Honour `prefers-reduced-motion` at the *component* level, not globally — components decide which beats are essential and which are decorative.
