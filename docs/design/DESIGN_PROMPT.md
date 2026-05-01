# Claude Design Prompt

Use this prompt in Claude Design. Its goal is to generate a design system, not the application.

```text
Create a design system, not an application.

Before choosing a direction, propose 3 distinct visual directions and compare them. For each direction, explain strengths and weaknesses for teaching code and abstract programming concepts. Then recommend one direction and build the design system for that recommended direction.

Product context:
We are building “effect-visual-tutor”, an interactive learning tool for developers learning abstract programming and architecture concepts through real code. The first lesson explains an Etch code function called prepareRecapRun and teaches Effect concepts progressively.

The product is not a marketing site and not a landing page. The first screen of the final app will be the learning experience itself.

Audience:
Developers and junior engineers learning to read complex code. They may not know functional programming. The design must make abstract concepts easier to understand.

Language:
The UI and pedagogical copy are in French. Source code identifiers remain in English. Technical keywords such as Effect, yield*, prepare, execute, Success, Error, and Requirements may stay in English when they are part of the concept, but they must be explained in French.

Core learning principles:
- Progressive disclosure: simple explanation first, detailed code/types later.
- Split view: code on one side, conceptual diagram on the other.
- Code remains the primary object of attention.
- Visuals should clarify state, flow, dependencies, errors, and encapsulation.
- Animations should explain relationships, not decorate.
- The app should support guided learning first, then free exploration.
- The learning experience should be accessible to juniors and people who are still learning programming architecture.

Initial lesson concepts:
- Effect.Effect<Success, Error, Requirements>
- Effect.gen as a sequential program block
- yield* as “run this step and unwrap its result”
- prepare vs execute
- private internal bundle vs public summary
- error path when invalid input is selected

Real code excerpt that the design system must be able to present:

export function prepareRecapRun(
  input: RunRecapInput,
): Effect.Effect<PreparedRecapRun, RecapPrepareError, RecapPrepareRuntime> {
  return Effect.gen(function* () {
    const services = yield* loadRecapServices();
    const state = yield* services.stateManager.load();

    if (input.noAi && input.rebuildToday) {
      return yield* new SessionError({
        kind: "detection_failed",
        message: "--rebuild-today requires AI execution",
      });
    }

    const context = yield* detectRunContext(state, {
      requestedInteractive: input.interactive,
      sinceOverride: input.since,
      rebuildToday: input.rebuildToday,
    });

    const { runId, sessionId, mode, sinceTimestamp, sinceSource, currentDay } = context;
    const bundle: RecapRunBundle = { input, state, context, services };
    const summary: RecapRunSummary = {
      runId,
      sessionId,
      mode,
      sinceTimestamp,
      sinceSource,
      currentDay,
    };

    return {
      runId,
      summary,
      execute: () => executePreparedRecapRun(bundle),
    };
  });
}

Design system deliverable:
Define a complete visual system for this product:
- visual direction;
- design principles;
- color palette with semantic roles for success, error, requirements, selected code, inactive code, private internals, public API, prepared state, and execution state;
- typography system optimized for readable code and explanations;
- spacing and layout rules for a dense learning interface;
- component patterns for code frames, highlighted code regions, concept cards, step navigation, inline explanations, checkpoints, toggles, and diagrams;
- two-level progressive disclosure pattern: simple view and detail view;
- diagram patterns for signature contracts, runtime flow, and encapsulation boundaries;
- motion language for revealing concepts, following a yield* step, showing error branching, and transitioning from simple to detailed view;
- accessibility rules, including reduced motion;
- example specimen screens showing the design system in use.

Motion spec requirement:
The design system must include a motion spec. Animations are pedagogical primitives, not ornaments.

Define principles and reusable patterns for:
1. revealing simple explanation then detail;
2. linking a highlighted code line to a diagram node;
3. showing yield* resolving a step;
4. showing an error branch appearing;
5. showing a prepared run arming execute, then execute being triggered.

Important constraints:
- Do not create the final app implementation.
- Do not focus on a polished landing page.
- Do not invent a marketing brand.
- Do not make decorative animations that distract from code comprehension.
- Do not copy CodeAesthetics or any other existing style. Treat educational code videos only as broad inspiration for clarity, abstraction, and memorability.
- Keep the system reusable for future lessons beyond Etch.
- Future implementation stack will be Vite + React + TypeScript, with possible Remotion later, so the design should be compatible with componentized scenes.

Expected output:
Produce an engineering-ready design handoff that another AI coding agent can apply. It should contain tokens, component rules, layout rules, motion rules, accessibility constraints, and specimen screens. It should not contain final application code.
```

## Follow-up refinement prompt

Use after Claude Design produces an initial result:

```text
Refine this as a reusable design system only. Remove anything that feels like a one-off app screen or marketing page. Strengthen the component rules, semantic color roles, progressive disclosure model, and motion principles. Keep specimen screens, but label them as examples, not final product screens.
```

## Engineering handoff prompt

Use after the design direction is accepted:

```text
Generate an engineering handoff for Claude Code. The handoff should describe tokens, components, layout rules, motion rules, accessibility rules, and implementation constraints. Do not include final app code. Make clear which parts are binding design principles and which parts are adaptable implementation details.
```

