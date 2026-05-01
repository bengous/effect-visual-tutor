import { describe, expect, test } from "vitest";
import {
  answerCheckpoint,
  createLessonSession,
  executePreparedRun,
  getLessonView,
  prepareRun,
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
});
