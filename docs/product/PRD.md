# effect-visual-tutor PRD

## Problem Statement

The user wants to learn how to read complex code and architecture through an interactive, visual tutor. The immediate pain point is understanding Effect in the Etch codebase, starting with the `prepareRecapRun` function.

The user comes from a more imperative/object-oriented background and does not want an abstract functional-programming lecture. They need a guided, concrete reading experience that starts simple, progressively reveals detail, and stays anchored in real code.

The first product goal is not to build a generic course platform. The goal is to prove that an interactive visual explanation can make one real Etch function easier to understand.

## Solution

Build a Vite + React + TypeScript interactive learning POC named `effect-visual-tutor`.

The first lesson teaches `prepareRecapRun` from Etch. It uses copied, annotated code excerpts rather than reading the Etch repo live. The experience combines:

- a guided lesson flow;
- a free exploration mode after the guided path;
- a split view with code on one side and diagrams on the other;
- progressive disclosure from simple explanation to real code and exact types;
- lightweight user manipulation of the input path;
- French UI and French pedagogical copy;
- English source identifiers and component/type names.

The implementation agent must use the existing project tooling. The repo will already contain the chosen test runner, browser validation, formatting, linting, and agent hooks. Do not replace or reconfigure tooling unless explicitly asked.

The design system will come from a separate Claude Design artifact. This PRD is the product and behavior contract. The design handoff is a separate input.

## User Stories

1. As a learner, I want the first screen to be the interactive lesson, so that I do not have to pass through a landing page.
2. As a learner, I want the lesson UI in French, so that explanations match the way I am learning.
3. As a learner, I want source code identifiers to stay in English, so that the explanation maps back to the real code.
4. As a learner, I want to see the real `prepareRecapRun` excerpt, so that I can transfer the lesson back to Etch.
5. As a learner, I want a simplified view first, so that I can grasp the idea before seeing all details.
6. As a learner, I want a detailed view on demand, so that I can inspect exact types and real code when ready.
7. As a learner, I want `Effect.Effect<Success, Error, Requirements>` explained as a general programming idea, so that I do not need functional-programming vocabulary first.
8. As a learner, I want `Effect.gen` explained as a sequential program block, so that the function body becomes readable.
9. As a learner, I want `yield*` explained step by step, so that I understand what each Effect step contributes.
10. As a learner, I want to see that `prepareRecapRun` prepares work but does not execute the full recap, so that the prepare/execute split becomes concrete.
11. As a learner, I want to see the invalid `noAi + rebuildToday` path, so that typed errors are not abstract.
12. As a learner, I want to see `bundle` as private internal machinery, so that I understand encapsulation in the function.
13. As a learner, I want to see `summary` as caller-safe public data, so that I understand what CLI/HTTP callers can use.
14. As a learner, I want to see `execute: () => ...` as a closure that captures the prepared bundle, so that delayed execution becomes concrete.
15. As a learner, I want to compare `prepareRecapRun` with `executeRecapStructured`, so that I understand the wrapper pattern.
16. As a learner, I want diagrams to change based on the lesson step, so that the visual representation matches the concept being taught.
17. As a learner, I want signature steps to show Success, Error, and Requirements, so that the Effect type shape becomes memorable.
18. As a learner, I want body steps to show flow from services to state to context to summary, so that I understand runtime order.
19. As a learner, I want encapsulation steps to distinguish private internals from public API, so that architecture boundaries become visible.
20. As a learner, I want mini checkpoints, so that I can verify comprehension without a formal quiz.
21. As a learner, I want checkpoint feedback immediately, so that mistakes become explanations.
22. As a learner, I want no score or gamification in the POC, so that the focus stays on understanding.
23. As a learner, I want toggles for `noAi` and `rebuildToday`, so that I can see how inputs affect the path.
24. As a learner, I want the invalid toggle combination to reveal the error branch, so that control flow and error flow are visible.
25. As a learner, I want a `prepare` action, so that I can see the prepared state being created.
26. As a learner, I want `execute` to become available only after successful preparation, so that the lifecycle is clear.
27. As a learner, I want to click a `yield*` step, so that I can see what it unwraps and why it may stop the program.
28. As a learner, I want a simple/detailed toggle, so that I control how much complexity is visible.
29. As a learner, I want optional architecture notes, so that I can learn why Etch is organized this way without interrupting the main lesson.
30. As a learner, I want animations to explain relationships, so that motion helps comprehension rather than decoration.
31. As a learner, I want reduced-motion support, so that the experience remains usable if animations are distracting.
32. As a future author, I want lesson content modeled as structured data, so that more lessons can be added later.
33. As a future author, I want reusable concept primitives, so that a concept can be split into sub-concepts and assembled into lessons.
34. As a future author, I want the POC to remain compatible with future Remotion-style scenes, so that video generation can be explored later.
35. As an implementation agent, I want a small set of deep modules with clear interfaces, so that I do not spread lesson state across shallow components.
36. As an implementation agent, I want behavior-first tests for the lesson model, so that refactors do not break confidence.
37. As an implementation agent, I want browser validation of the learning surface, so that the visual experience is actually usable.

## Implementation Decisions

- The first implemented lesson is `prepareRecapRun`.
- The app must not fetch or parse the Etch repo at runtime.
- The lesson uses copied, annotated excerpts of Etch code.
- The first screen must be the tutorial experience, not marketing copy.
- The UI and lesson copy are French.
- Code identifiers, component names, file names, and TypeScript types remain English.
- Technical keywords from the source code may remain English when necessary, but explanations must be French.
- The product uses progressive disclosure as a core learning principle.
- A lesson is composed from reusable concept units.
- A difficult concept may be split into sub-concepts, then assembled into a larger lesson.
- The POC supports two explanation levels: simple and detail.
- The main layout is split view: code plus diagram.
- The diagram mode changes by lesson step.
- Signature-oriented steps use a contract diagram: Success, Error, Requirements.
- Function-body steps use a flow diagram: services, state, context, summary, execute.
- Encapsulation steps use a private/internal versus public/caller-safe diagram.
- Guided mode is the primary initial experience.
- Free exploration is available after or alongside guided progression.
- Mini checkpoints are non-blocking and explain answers immediately.
- Structured quiz mode is out of scope and may be a future TODO.
- Manipulation is limited but real: toggles for `noAi` and `rebuildToday`, a `prepare` action, an `execute` action, and clickable `yield*` steps.
- The POC does not run Effect in the browser. It simulates the pedagogical state machine needed for the lesson.
- The design system generated by Claude Design is binding for visual principles, semantic color roles, component rules, and motion rules.
- Any substantial deviation from the validated design system must be explicitly requested from the user with a clear reason and expected impact.
- Minor responsive or accessibility adjustments are allowed if they preserve the design intent.
- Do not add Remotion in the POC.
- Do not add a UI kit, state manager, heavy animation library, or heavy syntax highlighter without explicit approval.
- Prefer native React state and CSS for the initial POC unless a dependency clearly reduces complexity or improves pedagogical quality.

## Deep Module Guidance

Before implementation, produce a short plan and wait for approval.

The plan must identify the deep modules to build, their public interfaces, and the first TDD tracer bullet. Optimize for:

- locality and colocation;
- leverage through small stable interfaces;
- clear seams;
- reduced future-agent navigation entropy.

Recommended module responsibilities:

- Lesson model: owns lesson structure, concepts, steps, simple/detail levels, checkpoints, and interaction state transitions.
- Lesson content: owns copied Etch excerpts, annotations, concept metadata, and French copy.
- Guided flow: owns current step, navigation, completion, and transition into exploration.
- Simulation model: owns `noAi`, `rebuildToday`, prepared state, error branch, and execute availability.
- Code presentation: owns visible code excerpt, highlights, annotations, and simple/detail switching.
- Diagram presentation: owns concept diagrams derived from lesson state.
- Motion primitives: owns reusable reveal, branch, resolve, and prepare/execute animations.

These are suggested responsibilities, not mandatory file names.

## Testing Decisions

Use existing project tooling and validation scripts. The repo will already contain the test runner and browser validation setup.

Implementation must follow vertical TDD:

1. Write one behavior test.
2. Implement the minimum needed to pass.
3. Refactor only when green.
4. Repeat with the next behavior.

Do not write all tests first and all implementation second.

Prioritize tests in this order:

1. Pure lesson model behavior.
2. Component/user behavior around the lesson flow.
3. Browser validation of layout, interaction, and visual usability.

Behavior to test:

- guided lesson starts on the first concept;
- simple/detail mode changes visible explanation depth;
- checkpoint answers show immediate explanatory feedback;
- `noAi + rebuildToday` produces the error path;
- successful preparation creates a prepared state;
- `execute` is unavailable before preparation and available after successful preparation;
- selected lesson steps highlight the correct code region;
- diagram mode matches the current step type;
- free exploration can revisit concepts after guided progression;
- reduced-motion mode disables or simplifies motion without hiding content.

Browser validation should confirm:

- the lesson is visible on first load;
- no landing page appears before the lesson;
- code and diagram are both visible in the split view;
- core controls are usable;
- text does not overlap or overflow obvious containers;
- the invalid input path is visible when selected;
- reduced motion behavior is present.

Tests should verify observable behavior and public lesson interfaces, not private component internals.

Quality feedback may arrive automatically from agent hooks during implementation. Treat hook feedback as project truth, fix reported issues in scope, and do not silence validations.

## Out of Scope

- No live Etch source reading.
- No generic lesson authoring UI.
- No Remotion integration.
- No video export.
- No backend.
- No multi-codebase plugin system.
- No full Effect runtime execution in the browser.
- No formal quiz or scoring system.
- No landing page.
- No app-wide course catalog unless needed for the first lesson.
- No large dependency additions without explicit approval.

## Further Notes

The product should feel like an augmented code-reading tutor, not a documentation site and not a dashboard.

The code remains the main object of attention. Visuals and animations exist to clarify state, flow, dependencies, error paths, encapsulation, and delayed execution.

The initial audience is the user learning Etch, but the pattern should remain reusable outside Etch if the POC succeeds.

The implementation agent will receive this PRD plus a Claude Design handoff. The Claude Design prompt is maintained as a separate artifact.

