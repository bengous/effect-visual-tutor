import { describe, expect, test } from "vitest";
import {
  answerCheckpoint,
  createLessonSession,
  executePreparedRun,
  getClickableCodeLines,
  getLessonView,
  prepareRun,
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
});
