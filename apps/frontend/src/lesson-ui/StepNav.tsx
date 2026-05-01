import type { LessonStep } from "../lesson/types";

type StepNavProps = {
  readonly currentStepId: string;
  readonly explorationUnlocked: boolean;
  readonly stepIndex: number;
  readonly steps: readonly LessonStep[];
  readonly totalSteps: number;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
  readonly onSelectStep: (stepId: string) => void;
};

export function StepNav({
  currentStepId,
  explorationUnlocked,
  stepIndex,
  steps,
  totalSteps,
  onNext,
  onPrevious,
  onSelectStep,
}: StepNavProps) {
  return (
    <nav className="step-nav" aria-label="Navigation de la leçon">
      <button
        type="button"
        className="button button--secondary"
        disabled={stepIndex === 0}
        onClick={onPrevious}
      >
        Précédent
      </button>

      <div
        className="step-nav__steps"
        aria-label={explorationUnlocked ? "Exploration libre" : "Parcours guidé"}
      >
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className="step-dot"
            aria-current={step.id === currentStepId ? "step" : undefined}
            aria-label={`Étape ${String(index + 1).padStart(2, "0")}: ${step.title}`}
            onClick={() => onSelectStep(step.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <span className="step-nav__counter">
        {String(stepIndex + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
      </span>

      <button
        type="button"
        className="button button--primary"
        disabled={stepIndex === totalSteps - 1}
        onClick={onNext}
      >
        Suivant
      </button>
    </nav>
  );
}
