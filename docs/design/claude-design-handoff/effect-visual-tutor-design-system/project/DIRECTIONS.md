# Visual Directions — Effect Visual Tutor

Three distinct directions for a tool that teaches abstract programming concepts through real code. Each is evaluated for **clarity** (does it make abstract structure visible?), **calm** (can a junior look at it for an hour without fatigue?), and **scale** (does it generalize beyond Etch / Effect to future lessons?).

---

## Direction A — Studio Notebook
> A scholar's quiet workbench. Warm paper-white background, ink-black serif headings for prose, a single accent ink for highlights. Code is the primary object — set in a high-contrast mono on near-white. Diagrams are drawn like margin notes: thin lines, hand-anchored labels, no fills.

**Inspiration vocabulary**: Edward Tufte, technical books, lab notebooks, hand-annotated source.

**Pedagogical strengths**
- Treats prose as *equal* in dignity to code — important when the lesson is half-French-explanation, half-English-code.
- Calm enough to read for hours; almost zero chrome.
- Diagrams as marginalia feel native to "code is the primary object."
- Serif headings give a sense of "you are reading a careful explanation," not "you are using an app."

**Weaknesses**
- Risk of feeling academic / dry for juniors who associate learning with energy and momentum.
- Hand-annotated style can be harder to systematize — easy to drift into decorative SVG.
- Subtle palette gives little room for *strong* semantic states (success/error need to land hard).

---

## Direction B — Console Bauhaus
> A dark, terminal-derived palette but with editorial typography and grid discipline. Background is a deep neutral (near-black), code lives in clearly-bounded "frames" with chunky monospace, and concept diagrams use bold geometric shapes — squares, arrows, rings — in a small set of saturated colors with semantic meaning.

**Inspiration vocabulary**: terminal IDEs, swiss-grid programming books, modernist signage, Bret Victor's interactive essays.

**Pedagogical strengths**
- Dark surface lets semantic colors *pop* — error/success/requirements read as states, not decoration.
- Frames + grid make encapsulation (private bundle vs public summary) literally visible: the box is the abstraction.
- Geometric diagram primitives (capsule = effect, ring = service, arrow = yield*) generalize to ANY future lesson.
- Familiar to developers — feels like the tools they already use.

**Weaknesses**
- Dark UIs are tiring for some readers; need a light variant.
- "Looks like an IDE" can prime users to *use* it instead of *read* it.
- Risk of falling into generic dev-tool aesthetics if not held with discipline.

---

## Direction C — Concept Map
> Bright, illustrated, dense with diagrams. Each Effect concept gets its own visual character — Effect is a pill, services are nested ovals, errors are a forked path. Heavy use of color and arrow choreography to show flow. Code is in a smaller secondary panel; the diagram is the primary surface.

**Inspiration vocabulary**: explorables, NYT graphics, Distill.pub, math-textbook figures.

**Pedagogical strengths**
- Maximally legible for visual learners; the metaphor *is* the explanation.
- Animation has a clear job: choreograph the diagram.
- Memorable — students will picture the diagram before the code.

**Weaknesses**
- **Inverts the brief.** The brief is explicit: "Code remains the primary object of attention." This direction makes the diagram primary.
- Per-concept illustration doesn't scale to future lessons without re-illustration work.
- Risk of cute-illustration drift; hard to keep "animations are pedagogical primitives, not ornaments."

---

## Recommendation: **Direction B — Console Bauhaus**

It is the only direction that satisfies all three of the brief's hard constraints simultaneously:

1. **Code is primary** — frames around code are the loudest objects on screen.
2. **Visuals clarify state, flow, dependencies, errors, encapsulation** — geometric diagram primitives map 1:1 to those five jobs.
3. **Reusable for future lessons** — the primitives (capsule, ring, arrow, frame, badge) are concept-agnostic. Effect today, anything else tomorrow.

It also gives the cleanest answer to the motion spec: animations move *primitives* along the *grid*, never illustrate. A yield* resolution is an arrow filling, not a character animation.

We will build a **light surface as default** (less fatiguing for long study, and the brief implies long-form learning), with the dark variant as a parity theme — same tokens, different surface. Semantic colors are tuned to read on both.

Building now.
