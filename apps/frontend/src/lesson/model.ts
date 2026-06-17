import type {
  CheckpointFeedback,
  CodeHighlight,
  DetailLevel,
  LessonContent,
  LessonSession,
  LessonStep,
  LessonView,
  PreparedRun,
  SemanticRole,
  SimulationInput,
  SimulationState,
} from "./types";
import { prepareRecapLesson } from "./content";

const initialInput: SimulationInput = {
  noAi: false,
  rebuildToday: false,
};

export function createLessonSession(lesson: LessonContent = prepareRecapLesson): LessonSession {
  const firstStep = getStepAt(lesson, 0);

  return {
    currentStepId: firstStep.id,
    detailLevel: "simple",
    reachedStepIds: [firstStep.id],
    checkpointFeedbackById: {},
    simulation: {
      status: "idle",
      input: initialInput,
    },
  };
}

export function getLessonView(
  session: LessonSession,
  lesson: LessonContent = prepareRecapLesson,
): LessonView {
  const currentStep = getCurrentStep(lesson, session);
  const stepIndex = lesson.steps.findIndex((step) => step.id === currentStep.id);
  const feedback = session.checkpointFeedbackById[currentStep.checkpoint.id];
  const simulationView = getSimulationView(session.simulation);

  return {
    title: lesson.title,
    subtitle: lesson.subtitle,
    currentStep,
    detailLevel: session.detailLevel,
    explorationUnlocked: session.reachedStepIds.length === lesson.steps.length,
    stepIndex,
    totalSteps: lesson.steps.length,
    code: {
      sourceFile: lesson.sourceFile,
      lines: lesson.codeLines,
      selectedLineNumbers: currentStep.selectedLineNumbers,
      highlights: buildCodeHighlights(currentStep, session.simulation),
    },
    diagram: {
      mode: currentStep.diagramMode,
      errorBranchVisible: shouldShowErrorBranch(currentStep, session.simulation),
      preparedVisible:
        currentStep.id === "execute" ||
        session.simulation.status === "prepared" ||
        session.simulation.status === "executing",
      executeActive: session.simulation.status === "executing",
    },
    simulation: simulationView,
    ...(feedback === undefined ? {} : { checkpointFeedback: feedback }),
  };
}

export function getClickableCodeLines(
  lesson: LessonContent = prepareRecapLesson,
): Readonly<Record<number, string>> {
  const entries: Record<number, string> = {};

  for (const step of lesson.steps) {
    if (step.codeEntryLine !== undefined) {
      entries[step.codeEntryLine] = step.id;
    }
  }

  return entries;
}

export function setDetailLevel(session: LessonSession, detailLevel: DetailLevel): LessonSession {
  return {
    ...session,
    detailLevel,
  };
}

export function selectStep(
  session: LessonSession,
  stepId: string,
  lesson: LessonContent = prepareRecapLesson,
): LessonSession {
  getStepById(lesson, stepId);

  return {
    ...session,
    currentStepId: stepId,
    reachedStepIds: appendUnique(session.reachedStepIds, stepId),
  };
}

export function goToNextStep(
  session: LessonSession,
  lesson: LessonContent = prepareRecapLesson,
): LessonSession {
  const currentIndex = lesson.steps.findIndex((step) => step.id === session.currentStepId);
  const nextStep = lesson.steps[Math.min(currentIndex + 1, lesson.steps.length - 1)];

  if (nextStep === undefined) {
    return session;
  }
  return selectStep(session, nextStep.id, lesson);
}

export function goToPreviousStep(
  session: LessonSession,
  lesson: LessonContent = prepareRecapLesson,
): LessonSession {
  const currentIndex = lesson.steps.findIndex((step) => step.id === session.currentStepId);
  const previousStep = lesson.steps[Math.max(currentIndex - 1, 0)];

  if (previousStep === undefined) {
    return session;
  }
  return selectStep(session, previousStep.id, lesson);
}

export function answerCheckpoint(
  session: LessonSession,
  checkpointId: string,
  optionId: string,
  lesson: LessonContent = prepareRecapLesson,
): LessonSession {
  const checkpoint = lesson.steps
    .map((step) => step.checkpoint)
    .find((candidate) => candidate.id === checkpointId);

  if (checkpoint === undefined) {
    throw new Error(`Unknown checkpoint: ${checkpointId}`);
  }

  const option = checkpoint.options.find((candidate) => candidate.id === optionId);
  if (option === undefined) {
    throw new Error(`Unknown checkpoint option: ${optionId}`);
  }

  const feedback: CheckpointFeedback = {
    checkpointId,
    optionId,
    correct: option.correct,
    message: option.feedback,
  };

  return {
    ...session,
    checkpointFeedbackById: {
      ...session.checkpointFeedbackById,
      [checkpointId]: feedback,
    },
  };
}

export function setSimulationInput(
  session: LessonSession,
  input: Partial<SimulationInput>,
): LessonSession {
  const nextInput = {
    ...session.simulation.input,
    ...input,
  };

  return {
    ...session,
    simulation: {
      status: "idle",
      input: nextInput,
    },
  };
}

export function prepareRun(session: LessonSession): LessonSession {
  const { input } = session.simulation;

  if (input.noAi && input.rebuildToday) {
    return {
      ...session,
      currentStepId: "error-branch",
      reachedStepIds: appendUnique(session.reachedStepIds, "error-branch"),
      simulation: {
        status: "error",
        input,
        error: {
          kind: "detection_failed",
          message: "--rebuild-today requires AI execution",
        },
      },
    };
  }

  const prepared = buildPreparedRun(input);
  return {
    ...session,
    currentStepId: "execute",
    reachedStepIds: appendUnique(session.reachedStepIds, "execute"),
    simulation: {
      status: "prepared",
      input,
      prepared,
    },
  };
}

export function resetSimulation(session: LessonSession): LessonSession {
  if (session.simulation.status === "idle") {
    return session;
  }

  return {
    ...session,
    simulation: {
      status: "idle",
      input: session.simulation.input,
    },
  };
}

export function executePreparedRun(session: LessonSession): LessonSession {
  if (session.simulation.status !== "prepared") {
    return session;
  }

  return {
    ...session,
    simulation: {
      status: "executing",
      input: session.simulation.input,
      prepared: session.simulation.prepared,
    },
  };
}

function getCurrentStep(lesson: LessonContent, session: LessonSession): LessonStep {
  return getStepById(lesson, session.currentStepId);
}

function getStepById(lesson: LessonContent, stepId: string): LessonStep {
  const step = lesson.steps.find((candidate) => candidate.id === stepId);
  if (step === undefined) {
    throw new Error(`Unknown lesson step: ${stepId}`);
  }
  return step;
}

function getStepAt(lesson: LessonContent, index: number): LessonStep {
  const step = lesson.steps[index];
  if (step === undefined) {
    throw new Error(`Lesson has no step at index ${index}`);
  }
  return step;
}

function appendUnique(values: readonly string[], value: string): readonly string[] {
  return values.includes(value) ? values : [...values, value];
}

function buildPreparedRun(input: SimulationInput): PreparedRun {
  const mode = input.noAi ? "no-ai" : input.rebuildToday ? "rebuild-today" : "standard";

  return {
    runId: input.rebuildToday ? "run_today" : "run_since_state",
    summary: {
      sessionId: "session_current",
      mode,
      sinceSource: input.rebuildToday ? "today" : "state",
    },
  };
}

function getSimulationView(state: SimulationState): LessonView["simulation"] {
  const base = {
    status: state.status,
    input: state.input,
    canExecute: state.status === "prepared",
  };

  if (state.status === "error") {
    return {
      ...base,
      error: state.error,
    };
  }

  if (state.status === "prepared" || state.status === "executing") {
    return {
      ...base,
      prepared: state.prepared,
    };
  }

  return base;
}

function shouldShowErrorBranch(step: LessonStep, state: SimulationState): boolean {
  return step.id === "error-branch" || state.status === "error";
}

function buildCodeHighlights(step: LessonStep, state: SimulationState): readonly CodeHighlight[] {
  const highlights: CodeHighlight[] = [
    {
      lineNumbers: step.selectedLineNumbers,
      role: "selected",
      label: "ligne active",
    },
  ];

  for (const role of step.conceptRoles) {
    highlights.push(highlightForRole(role));
  }

  if (state.status === "error") {
    highlights.push({
      lineNumbers: [8, 9, 10, 11, 12],
      role: "error",
      label: "branche d'erreur",
    });
  }

  if (state.status === "prepared" || state.status === "executing") {
    highlights.push({
      lineNumbers: [35],
      role: state.status === "executing" ? "execution" : "prepared",
      label: "execute armé",
    });
  }

  return mergeHighlights(highlights);
}

function highlightForRole(role: SemanticRole): CodeHighlight {
  switch (role) {
    case "requirements":
      return { lineNumbers: [5, 6], role, label: "requirements" };
    case "success":
      return { lineNumbers: [15, 21, 23, 24, 25, 26, 27, 28, 29, 30], role, label: "success" };
    case "error":
      return { lineNumbers: [8, 9, 10, 11, 12], role, label: "error" };
    case "private":
      return { lineNumbers: [22, 35], role, label: "privé" };
    case "public":
      return { lineNumbers: [23, 24, 25, 26, 27, 28, 29, 30, 33, 34], role, label: "public" };
    case "prepared":
      return { lineNumbers: [32, 33, 34, 35, 36], role, label: "préparé" };
    case "execution":
      return { lineNumbers: [35], role, label: "execution" };
    case "selected":
    case "inactive":
      return { lineNumbers: [], role, label: role };
  }
}

function mergeHighlights(highlights: readonly CodeHighlight[]): readonly CodeHighlight[] {
  return highlights.filter((highlight) => highlight.lineNumbers.length > 0);
}

export type {
  CheckpointFeedback,
  DetailLevel,
  LessonContent,
  LessonSession,
  LessonView,
  SimulationInput,
};
