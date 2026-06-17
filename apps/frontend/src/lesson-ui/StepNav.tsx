import type { LessonStep } from "../lesson/types";
import type { KeyboardEvent } from "react";
import { useRef } from "react";

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
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  function activateIndex(index: number) {
    const target = steps[index];
    if (target === undefined) {
      return;
    }
    onSelectStep(target.id);
    dotRefs.current[index]?.focus();
  }

  function handleStepsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const lastIndex = steps.length - 1;
    const targetIndex = nextStepIndex(event.key, currentIndex, lastIndex);
    if (targetIndex === undefined) {
      return;
    }
    event.preventDefault();
    activateIndex(targetIndex);
  }

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
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={explorationUnlocked ? "Exploration libre" : "Parcours guidé"}
        onKeyDown={handleStepsKeyDown}
      >
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          return (
            <button
              key={step.id}
              ref={(node) => {
                dotRefs.current[index] = node;
              }}
              type="button"
              className="step-dot"
              tabIndex={isCurrent ? 0 : -1}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Étape ${String(index + 1).padStart(2, "0")}: ${step.title}`}
              onClick={() => onSelectStep(step.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
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

function nextStepIndex(key: string, currentIndex: number, lastIndex: number): number | undefined {
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return Math.min(currentIndex + 1, lastIndex);
    case "ArrowLeft":
    case "ArrowUp":
      return Math.max(currentIndex - 1, 0);
    case "Home":
      return 0;
    case "End":
      return lastIndex;
    default:
      return undefined;
  }
}
