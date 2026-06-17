import { describe, expect, test } from "vitest";
import {
  answerCheckpoint,
  createLessonSession,
  executePreparedRun,
  getClickableCodeLines,
  getLessonView,
  prepareRun,
  resetSimulation,
  retryCheckpoint,
  selectStep,
  setDetailLevel,
  setSimulationInput,
} from "./model";

describe("prepareRecapRun lesson model", () => {
  test("starts on the first guided concept in simple mode", () => {
    const view = getLessonView(createLessonSession());

    expect(view.currentStep.title).toBe("Lire la signature de l'effet");
    expect(view.detailLevel).toBe("simple");
    expect(view.diagram.mode).toBe("signature");
    expect(view.code.selectedLineNumbers).toEqual([3]);
  });

  test("switches to detailed explanation without changing the current concept", () => {
    const session = setDetailLevel(createLessonSession(), "detail");
    const view = getLessonView(session);

    expect(view.currentStep.id).toBe("signature");
    expect(view.detailLevel).toBe("detail");
    expect(view.currentStep.detail).toContain("Effect.Effect<PreparedRecapRun");
  });

  test("returns immediate explanatory checkpoint feedback", () => {
    const session = answerCheckpoint(createLessonSession(), "signature-main", "runs-now");
    const view = getLessonView(session);

    expect(view.checkpointFeedback?.correct).toBe(false);
    expect(view.checkpointFeedback?.message.toLowerCase()).toContain("pas encore le recap");
  });

  test("routes noAi plus rebuildToday to the typed error branch", () => {
    const withInvalidInput = setSimulationInput(createLessonSession(), {
      noAi: true,
      rebuildToday: true,
    });
    const session = prepareRun(withInvalidInput);
    const view = getLessonView(session);

    expect(view.simulation.status).toBe("error");
    expect(view.simulation.error?.kind).toBe("detection_failed");
    expect(view.simulation.canExecute).toBe(false);
    expect(view.diagram.errorBranchVisible).toBe(true);
  });

  test("successful preparation enables execute, then execution becomes visible", () => {
    const prepared = prepareRun(createLessonSession());
    const preparedView = getLessonView(prepared);

    expect(preparedView.simulation.status).toBe("prepared");
    expect(preparedView.simulation.canExecute).toBe(true);

    const executingView = getLessonView(executePreparedRun(prepared));
    expect(executingView.simulation.status).toBe("executing");
    expect(executingView.diagram.executeActive).toBe(true);
  });

  test("resetting the simulation returns it to idle while keeping the chosen input", () => {
    const prepared = prepareRun(
      setSimulationInput(createLessonSession(), { noAi: true, rebuildToday: false }),
    );
    expect(getLessonView(prepared).simulation.status).toBe("prepared");

    const reset = resetSimulation(prepared);
    const view = getLessonView(reset);

    expect(view.simulation.status).toBe("idle");
    expect(view.simulation.canExecute).toBe(false);
    expect(view.simulation.input).toEqual({ noAi: true, rebuildToday: false });
    expect(view.simulation.prepared).toBeUndefined();
    expect(view.diagram.errorBranchVisible).toBe(false);
  });

  test("resetting after the typed error clears the error from the view", () => {
    const errored = prepareRun(
      setSimulationInput(createLessonSession(), { noAi: true, rebuildToday: true }),
    );
    expect(getLessonView(errored).simulation.status).toBe("error");

    const view = getLessonView(resetSimulation(errored));

    expect(view.simulation.status).toBe("idle");
    expect(view.simulation.error).toBeUndefined();
  });

  test("exposes clickable code lines for every yield* entry point in the source", () => {
    const lines = getClickableCodeLines();

    // The author marks which source lines open a concept directly from the code.
    expect(lines).toMatchObject({
      5: "services",
      6: "state",
      9: "error-branch",
      15: "context",
    });
  });

  test("clicking the error-branch source line reveals the typed error concept", () => {
    const lines = getClickableCodeLines();
    const errorLine = Number(
      Object.keys(lines).find((line) => lines[Number(line)] === "error-branch"),
    );

    const view = getLessonView(selectStep(createLessonSession(), lines[errorLine]));

    expect(view.currentStep.id).toBe("error-branch");
    expect(view.code.selectedLineNumbers).toContain(errorLine);
    expect(view.diagram.errorBranchVisible).toBe(true);
  });

  test("flags the idle state as reset so the status region can announce it", () => {
    const afterReset = resetSimulation(prepareRun(createLessonSession()));

    expect(getLessonView(afterReset).simulation.wasReset).toBe(true);
    expect(getLessonView(createLessonSession()).simulation.wasReset).toBeFalsy();
    expect(getLessonView(setSimulationInput(afterReset, { noAi: true })).simulation.wasReset).toBe(
      false,
    );
  });

  test("retrying a checkpoint clears its recorded feedback", () => {
    const answered = answerCheckpoint(createLessonSession(), "signature-main", "runs-now");
    expect(getLessonView(answered).checkpointFeedback).toBeDefined();

    const retried = retryCheckpoint(answered, "signature-main");
    expect(getLessonView(retried).checkpointFeedback).toBeUndefined();
  });
});
