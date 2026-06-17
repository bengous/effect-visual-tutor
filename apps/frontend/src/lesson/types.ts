export type DetailLevel = "simple" | "detail";

export type DiagramMode = "signature" | "flow" | "encapsulation" | "execution";

export type SemanticRole =
  | "selected"
  | "success"
  | "error"
  | "requirements"
  | "private"
  | "public"
  | "prepared"
  | "execution"
  | "inactive";

export type CodeLine = {
  readonly number: number;
  readonly text: string;
};

export type CheckpointOption = {
  readonly id: string;
  readonly label: string;
  readonly correct: boolean;
  readonly feedback: string;
};

export type Checkpoint = {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly CheckpointOption[];
};

export type LessonStep = {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly simple: string;
  readonly detail: string;
  readonly detailCode?: string;
  readonly diagramMode: DiagramMode;
  readonly selectedLineNumbers: readonly number[];
  readonly conceptRoles: readonly SemanticRole[];
  readonly checkpoint: Checkpoint;
  // Source line that opens this concept when the learner clicks it in the code.
  readonly codeEntryLine?: number;
};

export type LessonContent = {
  readonly title: string;
  readonly subtitle: string;
  readonly sourceFile: string;
  readonly codeLines: readonly CodeLine[];
  readonly steps: readonly LessonStep[];
};

export type SimulationInput = {
  readonly noAi: boolean;
  readonly rebuildToday: boolean;
};

export type PreparedRun = {
  readonly runId: string;
  readonly summary: {
    readonly sessionId: string;
    readonly mode: "standard" | "no-ai" | "rebuild-today";
    readonly sinceSource: "state" | "today";
  };
};

export type RecapPrepareError = {
  readonly kind: "detection_failed";
  readonly message: string;
};

export type SimulationState =
  | {
      readonly status: "idle";
      readonly input: SimulationInput;
      // True when this idle state was reached by an explicit reset (not the
      // initial state or an input change), so the status region can announce it.
      readonly wasReset?: boolean;
    }
  | {
      readonly status: "error";
      readonly input: SimulationInput;
      readonly error: RecapPrepareError;
    }
  | {
      readonly status: "prepared";
      readonly input: SimulationInput;
      readonly prepared: PreparedRun;
    }
  | {
      readonly status: "executing";
      readonly input: SimulationInput;
      readonly prepared: PreparedRun;
    };

export type CheckpointFeedback = {
  readonly checkpointId: string;
  readonly optionId: string;
  readonly correct: boolean;
  readonly message: string;
};

export type LessonSession = {
  readonly currentStepId: string;
  readonly detailLevel: DetailLevel;
  readonly reachedStepIds: readonly string[];
  readonly checkpointFeedbackById: Readonly<Record<string, CheckpointFeedback>>;
  readonly simulation: SimulationState;
};

export type CodeHighlight = {
  readonly lineNumbers: readonly number[];
  readonly role: SemanticRole;
  readonly label: string;
};

export type LessonView = {
  readonly title: string;
  readonly subtitle: string;
  readonly currentStep: LessonStep;
  readonly detailLevel: DetailLevel;
  readonly explorationUnlocked: boolean;
  readonly stepIndex: number;
  readonly totalSteps: number;
  readonly code: {
    readonly sourceFile: string;
    readonly lines: readonly CodeLine[];
    readonly selectedLineNumbers: readonly number[];
    readonly highlights: readonly CodeHighlight[];
  };
  readonly diagram: {
    readonly mode: DiagramMode;
    readonly errorBranchVisible: boolean;
    readonly preparedVisible: boolean;
    readonly executeActive: boolean;
  };
  readonly simulation: {
    readonly status: SimulationState["status"];
    readonly input: SimulationInput;
    readonly canExecute: boolean;
    readonly wasReset: boolean;
    readonly error?: RecapPrepareError;
    readonly prepared?: PreparedRun;
  };
  readonly checkpointFeedback?: CheckpointFeedback;
};
