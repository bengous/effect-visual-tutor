# Effect Visual Tutor — Design System

A design system for **`effect-visual-tutor`**, an interactive learning tool that teaches abstract programming concepts (Effect, `Effect.gen`, `yield*`, prepare/execute, encapsulation, error channels) through real code in French.

The first lesson is built around the `prepareRecapRun` function from the Etch codebase. The system must be reusable for future lessons.

---

## Sources

This system was built from a written brief only — **no Figma, no codebase, no existing brand**.

- Code excerpt provided in the brief (`prepareRecapRun`, ~30 lines TypeScript / Effect).
- Lesson concepts list (Effect.Effect signature, `Effect.gen`, `yield*`, prepare vs execute, private bundle vs public summary, error path).
- Audience: developers and junior engineers learning to read complex code; UI in French, source identifiers in English.
- Future stack: Vite + React + TypeScript, with possible Remotion later.

If a brand, codebase, or Figma file becomes available later, the colour and type tokens are deliberately neutral so they can absorb a host brand without breaking the pedagogical contract.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `DIRECTIONS.md` | Three visual directions explored, with the recommendation. |
| `README.md` | This file. Product context, content rules, visual foundations. |
| `MOTION.md` | The motion spec — every animation has a job, duration, and easing. |
| `ACCESSIBILITY.md` | Contrast, keyboard, reduced-motion, screen-reader rules. |
| `SKILL.md` | Agent SKILLS-compatible header so this can be downloaded and used in Claude Code. |
| `colors_and_type.css` | All tokens — colours, type, spacing, radii, shadows, motion. The single source of truth. |
| `preview/` | Per-card HTML specimens that populate the Design System tab. |
| `ui_kits/lesson/` | Reference UI kit — the lesson surface, code frames, diagrams, step navigation. |
| `assets/` | Logos, icons, illustrations. |

---

## Visual direction: Console Bauhaus (light-first)

A scholarly, calm surface — warm off-white paper, ink-black type — with **terminal-derived discipline** for code and **bauhaus-grid geometry** for diagrams. Code is the loudest object on every screen. Diagrams are built from a small set of geometric primitives that map 1:1 to Effect concepts and generalise to future lessons.

See `DIRECTIONS.md` for the full comparison.

---

## Design principles

1. **Code is the protagonist.** The code frame is the largest, sharpest, highest-contrast object on the page. Everything else is in service of it.
2. **One concept, one primitive.** Each Effect concept maps to one geometric primitive — capsule (Effect), ring (service requirement), arrow (yield*), frame (encapsulation boundary), badge (state). Lessons are composed by combining primitives, never by inventing new ones.
3. **State is colour, not chrome.** Success / error / requirements / private / public / prepared / execution each have a dedicated semantic colour role. A reader can name the state of any element by colour alone.
4. **Progressive disclosure is structural, not behavioural.** "Simple" and "Detail" are two distinct layouts the same content can be projected into — not a tooltip on a thing.
5. **Motion has a job.** Every animation in `MOTION.md` answers a pedagogical question (what just happened, what depends on what, where did the value come from). If an animation can't answer a question, it doesn't ship.
6. **French explanation is first-class.** Editorial serif (Newsreader) is reserved for the explanation copy, signalling that prose is the lesson, not the chrome around the code.
7. **Reusability over expressiveness.** Tokens > hand-tuned values. New components reuse existing primitives or they don't ship.

---

## Content fundamentals

### Tone & voice (French UI / explanation copy)

- **Tutoiement (`tu`)** by default. The tone is a senior engineer pair-programming with a junior, not a teacher in front of a class. Warm, direct, never condescending.
- **Active voice, present tense.** *"`yield*` exécute l'étape et te donne sa valeur."* Not *"L'étape sera exécutée et sa valeur sera retournée."*
- **Short sentences in the explanation panel.** One idea per sentence. The reader is also reading code in their peripheral vision; don't compete.
- **Name things before you act on them.** Introduce the concept with its name (English keyword) once, then explain in French. Example: *"`yield*` veut dire « lance cette étape et donne-moi son résultat »."*
- **No filler, no hedging.** No *« nous allons voir »*, no *« il est important de noter que »*. Get to the point.

### Casing

- Headings and titles: **sentence case**. *"Lire la signature de l'effet"*, not *"Lire La Signature De L'Effet"*.
- Buttons: sentence case. *"Étape suivante"*, *"Voir le détail"*.
- Labels and eyebrows: **UPPERCASE** with `letter-spacing: 0.08em` only for tiny categorical metadata (`ÉTAPE 02`, `EFFET`, `REQUIREMENTS`).
- Code identifiers: never altered. `prepareRecapRun` stays as written, even mid-sentence in French copy.

### English keywords inside French copy

Technical concepts that have a stable English name in the language being taught are kept in English and rendered in `code-inline` style: `Effect`, `yield*`, `Effect.gen`, `prepare`, `execute`, `Success`, `Error`, `Requirements`. They are introduced with a French gloss the first time they appear in a lesson, then stand alone.

Example (canonical lesson copy):
> Une `Effect` décrit un programme qui peut **réussir** (`Success`), **échouer** (`Error`), ou **dépendre** de services (`Requirements`). Elle ne fait rien tant qu'on ne l'exécute pas.

### Quotation marks

French copy uses **« guillemets »** with a thin space inside, never `""`. Inline code and identifiers use no quotes — they are visually distinguished by the mono font and inline-code chip.

### Numbers

- Step numbers: zero-padded two digits (`ÉTAPE 02 / 07`), monospace.
- Counts in copy: words for one through nine (*"trois étapes"*), digits from 10.
- Line numbers in code frames: monospace, right-aligned, `--ink-4`.

### Emoji & decorative icons

**No emoji anywhere in the system.** Concept iconography is geometric (capsule, ring, arrow, frame). Affordance icons come from a single line-icon set (Lucide, see ICONOGRAPHY below). The pedagogical brief is that decoration competes with code for attention; we don't compete.

### Voice samples

| Context | Copy |
|---|---|
| Lesson title | *"Préparer une exécution avec `Effect.gen`"* |
| Step title | *"Charger les services dont l'effet dépend"* |
| Concept card eyebrow | *"`yield*` — DÉROULER UNE ÉTAPE"* |
| Inline gloss | *"`yield*` lance l'étape et te donne ce qu'elle a produit."* |
| Error explanation | *"L'entrée est invalide. L'effet bascule sur le canal d'erreur — `execute` ne sera jamais appelé."* |
| Reveal-detail prompt | *"Voir la signature complète"* |
| Step nav | *"Étape suivante"* / *"Étape précédente"* |
| Empty state | *"Choisis une étape pour commencer."* |
| Checkpoint | *"Tu sais maintenant lire `Effect.gen` comme une suite d'étapes."* |

---

## Visual foundations

### Surface & paper

- Default theme is **light**. Background is `--paper` (`#FAF8F4`), a warm off-white, not pure white. Reduces fatigue over long study sessions and lets `--surface-1` (`#FFFFFF`, the code frame) read as crisp without glare.
- **No gradients on chrome surfaces.** Gradients are reserved for one thing only: the `--exec-glow` halo around the active execution capsule.
- **No textures, no grain, no noise.** Paper is paper because of colour, not pattern.
- **No imagery in the lesson surface.** Marketing pages may have imagery later; the lesson surface is type and geometry.

### Colour

The semantic palette is the heart of the system. Each role has three values: foreground (text/stroke), background (tint fill), line (frame stroke). They're tuned to coexist on the same page without competing.

| Role | When to use |
|---|---|
| **Success** (sage) | Resolved `yield*`, return-value path, success channel, *réussite*. |
| **Error** (terracotta) | `SessionError`, error channel, the `if` branch that throws. |
| **Requirements** (mustard) | Services the Effect depends on (`RecapPrepareRuntime`). |
| **Selected** (slate-blue) | The line of code the diagram is currently "about". |
| **Inactive** (taupe) | Code stepped past, or not yet relevant in the current step. |
| **Private** (plum, with hatch fill) | Internal `RecapRunBundle`, encapsulated state. Hatch pattern is the visual signal of "behind the curtain". |
| **Public** (teal) | `RecapRunSummary` — what callers see. |
| **Prepared** (warm gold) | The "armed" state — `execute: () => …` exists but hasn't fired. |
| **Execution** (saturated amber + glow) | Actively running. The only place a glow is permitted in the system. |

A dark theme is defined with the same semantic roles inverted; same component code, parity behaviour.

### Type

| Family | Role | Notes |
|---|---|---|
| **Newsreader** (serif) | Editorial prose, lesson titles, French explanation body. | Substituted from the brief's "readable explanation copy" requirement. Optical-sized; uses 6..72 axis. |
| **Geist** (sans) | UI chrome, labels, buttons, navigation, eyebrows. | Substituted for an unspecified UI sans. **Flagged for replacement** if the host app picks a different sans. |
| **JetBrains Mono** | All code, line numbers, inline-code chips. | Ligatures **disabled** — `=>` reads as two characters, not one. Pedagogically critical. |

> ⚠ **Substitution flag.** No font files were provided. Newsreader, Geist, and JetBrains Mono are all OFL-licensed and CDN-loaded from Google Fonts. To bring this offline, mirror to `/fonts/`. If the host app uses different families, `--font-prose`, `--font-ui`, `--font-mono` are the only swap points.

### Spacing & layout

- 4px base. Spacing tokens `--s-1` (2px) through `--s-13` (96px).
- The lesson surface is a **two-rail split**: code rail on the left, diagram + explanation on the right. Each rail has `--rail-min: 360px`, `--rail-pref: 560px`. Below 880px viewport, rails stack vertically, code first.
- `--gutter: 24px` between rails. `--page-pad: 32px` outside.
- Step navigation is a thin horizontal strip at the bottom — fixed-height, never grows.
- Concept cards align to the same horizontal rhythm as code lines.

### Borders, radii, shadows

- Default radius is **`--r-3` (6px)**. Code frames use `--r-4` (10px). Tiny pills like step numbers use `--r-pill`. Square corners are reserved for diagram primitives.
- Borders are **1px, `--rule`** for everything routine; `--rule-strong` only for emphasised frames. Semantic frames use the `*-line` token of their role.
- Shadows are **low and ink-tinted** (`--shadow-1` / `-2` / `-3`). Paper, not glass. Shadow-3 is for modals only.
- **No inner glow** except `--exec-glow` on the active execution capsule. That glow is the system's single moment of theatre.

### Hover, press, focus

- **Hover**: text affordances shift one ink step lighter (`--ink → --ink-2` is wrong; we go *darker*: `--ink-2 → --ink`); button backgrounds lift to `--surface-2`; no scale. Duration `--dur-instant` (80ms).
- **Press**: `transform: translateY(1px)` and shadow drops one step. Never colour change on press alone.
- **Focus**: dual-ring `--ring` (paper offset + ink ring). Always visible, never removed. Mandatory.
- **Disabled**: `opacity: 0.4`, `cursor: not-allowed`. No grey-on-grey.

### Transparency & blur

- **No backdrop-blur in the lesson surface.** Blur attracts attention; we want code to keep it.
- The only translucent surface is the active-step glow; everything else is opaque.

### Iconography

A single line-icon family — **Lucide** (`https://unpkg.com/lucide-static@latest/icons/...`). Stroke-based, 1.5px stroke, 24px artboard. No filled icons. Icon colour follows text colour (`currentColor`).

Icons are reserved for **affordances** (chevron, play, pause, copy, search, X, check). Concepts are *never* drawn as icons — concepts are diagram primitives. So there is no "Effect icon"; an Effect is a capsule.

`assets/lucide/` mirrors the icons we actually use, so the system can ship offline. SVGs are referenced by `<svg><use href="..."/></svg>`.

> ⚠ **Substitution flag.** Lucide is a placeholder until a host icon set is selected. The contract (line, 1.5px, 24px) is what matters; swap files at `assets/lucide/`.

---

## Components — quick map

| Pattern | Lives in | Notes |
|---|---|---|
| `CodeFrame` | `ui_kits/lesson/CodeFrame.jsx` | The container for code. Header (filename + lang), gutter (line numbers), body (highlighted code), footer (status). |
| `CodeHighlight` | `ui_kits/lesson/CodeHighlight.jsx` | Semantic overlay on a code range — selected, success, error, requirements, private, public. |
| `ConceptCard` | `ui_kits/lesson/ConceptCard.jsx` | Eyebrow + title + simple/detail body. Two-level disclosure. |
| `StepNav` | `ui_kits/lesson/StepNav.jsx` | Bottom strip — step counter, prev/next, jump menu. |
| `Diagram` | `ui_kits/lesson/Diagram.jsx` | SVG container of geometric primitives (capsule, ring, arrow, frame). |
| `Capsule` | primitive | Represents an Effect — pill shape, three slots (Success / Error / Requirements). |
| `Ring` | primitive | A service requirement — open ring, can be filled when supplied. |
| `Arrow` | primitive | A `yield*` step — animatable from 0% to 100%. |
| `Frame` | primitive | An encapsulation boundary — solid line for public, hatched for private. |
| `Badge` | primitive | A state label — colour-coded by role. |
| `InlineGloss` | `ui_kits/lesson/InlineGloss.jsx` | A French explanation tied to a code identifier. |
| `Checkpoint` | `ui_kits/lesson/Checkpoint.jsx` | "You now understand X" — terminal beat of a lesson. |
| `Toggle` (simple/detail) | `ui_kits/lesson/Toggle.jsx` | The disclosure control. Two-state segmented. |

Full detail in `ui_kits/lesson/README.md`.

---

### Shape vs label — fitting text to primitives

A primitive's **shape encodes meaning**; never deform a shape to fit text. If a name doesn't fit, label outside.

| Primitive | Shape | Width | Text rule |
|---|---|---|---|
| **Ring** (service requirement) | Ø 28px fixed | fixed | label *below* in `--font-mono` 10px, `--req-fg` |
| **Capsule** (Effect) | pill | fluid | label inside, h-padding ≥ 12px |
| **Frame** (encapsulation) | rounded rect | fluid | inside, `code-sm`, allow 2 lines |
| **Step rect** (a yield* step) | rounded rect | fluid | inside, `code-sm` 13px, 1 line preferred |
| **Badge** (state) | pill | fits | uppercase, 1 word, ≤12 chars |

If a wider ring or smaller badge font is tempting, you've picked the wrong primitive.

## Theming & extension

To extend this system to a future lesson:

1. Compose existing primitives. A new concept gets a primitive *combination*, not a new colour.
2. If a new state genuinely cannot be expressed by an existing semantic role, add a new role *triplet* (`*-fg`, `*-bg`, `*-line`) — never a single colour.
3. Motion stays in `MOTION.md`'s catalog. New animations get added to the catalog with a job description before they're used.
4. Type families do not change.

To reskin for a host brand:

- Swap `--font-prose`, `--font-ui`, `--font-mono`.
- Swap `--ink`, `--paper`, surfaces 1–3.
- Leave semantic colour roles alone. They are calibrated for code comprehension, not brand expression.

---

## Status

This is a tokens + rules + specimen package — **not application code**. It is meant to be applied by a coding agent or human implementer using Vite + React + TypeScript. Specimen JSX files in `ui_kits/lesson/` are illustrative and intentionally simple.
