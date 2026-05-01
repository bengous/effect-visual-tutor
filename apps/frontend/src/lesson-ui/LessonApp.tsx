import type { DetailLevel, LessonSession, LessonView } from "../lesson/types";
import { useMemo, useState } from "react";
import { prepareRecapLesson } from "../lesson/content";
import {
  answerCheckpoint,
  createLessonSession,
  executePreparedRun,
  getLessonView,
  goToNextStep,
  goToPreviousStep,
  prepareRun,
  selectStep,
  setDetailLevel,
  setSimulationInput,
} from "../lesson/model";
import { CodeFrame } from "./CodeFrame";
import { ConceptPanel } from "./ConceptPanel";
import { DiagramPanel } from "./DiagramPanel";
import { SimulationControls } from "./SimulationControls";
import { StepNav } from "./StepNav";

const yieldLineStepIds: Readonly<Record<number, string>> = {
  5: "services",
  6: "state",
  15: "context",
};

export function LessonApp() {
  const [session, setSession] = useState<LessonSession>(() => createLessonSession());
  const view = getLessonView(session);
  const lineStepIds = useMemo(() => yieldLineStepIds, []);

  function updateDetailLevel(detailLevel: DetailLevel) {
    setSession((current) => setDetailLevel(current, detailLevel));
  }

  function updateStep(stepId: string) {
    setSession((current) => selectStep(current, stepId));
  }

  function updateCheckpoint(optionId: string) {
    setSession((current) => answerCheckpoint(current, view.currentStep.checkpoint.id, optionId));
  }

  return (
    <main className="lesson-shell" aria-label="Tutoriel prepareRecapRun">
      <LessonHeader view={view} />

      <section className="lesson-grid" aria-label="Surface de leçon">
        <CodeFrame code={view.code} lineStepIds={lineStepIds} onSelectStep={updateStep} />

        <div className="right-rail">
          <DiagramPanel view={view} />
          <ConceptPanel
            view={view}
            onAnswerCheckpoint={updateCheckpoint}
            onSetDetailLevel={updateDetailLevel}
          />
          <SimulationControls
            simulation={view.simulation}
            onChangeInput={(input) => setSession((current) => setSimulationInput(current, input))}
            onPrepare={() => setSession((current) => prepareRun(current))}
            onExecute={() => setSession((current) => executePreparedRun(current))}
          />
        </div>
      </section>

      <StepNav
        currentStepId={view.currentStep.id}
        explorationUnlocked={view.explorationUnlocked}
        stepIndex={view.stepIndex}
        steps={prepareRecapLesson.steps}
        totalSteps={view.totalSteps}
        onNext={() => setSession((current) => goToNextStep(current))}
        onPrevious={() => setSession((current) => goToPreviousStep(current))}
        onSelectStep={updateStep}
      />
    </main>
  );
}

function LessonHeader({ view }: { readonly view: LessonView }) {
  return (
    <header className="lesson-header">
      <div className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 54 54" role="img">
          <rect className="brand-mark__capsule" x="2" y="16" width="50" height="22" rx="11" />
          <path className="brand-mark__arrow" d="M 8 27 L 44 27" />
          <circle className="brand-mark__dot" cx="38" cy="27" r="3.5" />
        </svg>
      </div>
      <div className="lesson-header__copy">
        <p className="eyebrow lesson-header__eyebrow">Effect Visual Tutor</p>
        <h1>{view.title}</h1>
        <p>
          {view.subtitle} · étape {String(view.stepIndex + 1).padStart(2, "0")} /{" "}
          {String(view.totalSteps).padStart(2, "0")}
        </p>
      </div>
      <div className="lesson-header__mode" aria-label="Mode de parcours">
        <span className="badge badge--selected">Guidé</span>
        {view.explorationUnlocked ? (
          <span className="badge badge--public">Exploration libre</span>
        ) : null}
      </div>
    </header>
  );
}
