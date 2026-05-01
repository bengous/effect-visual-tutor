import type { DetailLevel, LessonView } from "../lesson/types";

type ConceptPanelProps = {
  readonly view: LessonView;
  readonly onAnswerCheckpoint: (optionId: string) => void;
  readonly onSetDetailLevel: (detailLevel: DetailLevel) => void;
};

export function ConceptPanel({ view, onAnswerCheckpoint, onSetDetailLevel }: ConceptPanelProps) {
  const step = view.currentStep;

  return (
    <section className="concept-panel" aria-labelledby="concept-title">
      <div className="concept-panel__topline">
        <p className="eyebrow">{step.eyebrow}</p>
        <SegmentedDisclosure value={view.detailLevel} onChange={onSetDetailLevel} />
      </div>

      <h2 id="concept-title">{step.title}</h2>
      <p className="body-prose">{step.simple}</p>

      <div
        className={`detail-reveal ${view.detailLevel === "detail" ? "detail-reveal--open" : ""}`}
      >
        <p>{step.detail}</p>
        {step.detailCode === undefined ? null : (
          <pre className="detail-code">
            <code>{step.detailCode}</code>
          </pre>
        )}
      </div>

      <div className="concept-panel__roles" aria-label="Rôles du concept">
        {step.conceptRoles.map((role) => (
          <span key={role} className={`badge badge--${role}`}>
            {roleLabel(role)}
          </span>
        ))}
      </div>

      <div className="checkpoint" aria-live="polite">
        <p className="eyebrow">Checkpoint</p>
        <p>{step.checkpoint.prompt}</p>
        <div className="checkpoint__options">
          {step.checkpoint.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="button button--secondary"
              onClick={() => onAnswerCheckpoint(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {view.checkpointFeedback === undefined ? null : (
          <p
            className={`checkpoint__feedback ${
              view.checkpointFeedback.correct
                ? "checkpoint__feedback--correct"
                : "checkpoint__feedback--wrong"
            }`}
          >
            {view.checkpointFeedback.message}
          </p>
        )}
      </div>
    </section>
  );
}

function SegmentedDisclosure({
  value,
  onChange,
}: {
  readonly value: DetailLevel;
  readonly onChange: (value: DetailLevel) => void;
}) {
  return (
    <div className="segmented" role="group" aria-label="Niveau d'explication">
      <button
        type="button"
        aria-pressed={value === "simple"}
        className="segmented__item"
        onClick={() => onChange("simple")}
      >
        Simple
      </button>
      <button
        type="button"
        aria-pressed={value === "detail"}
        className="segmented__item"
        onClick={() => onChange("detail")}
      >
        Détail
      </button>
    </div>
  );
}

function roleLabel(role: string): string {
  switch (role) {
    case "requirements":
      return "Requirements";
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "private":
      return "Privé";
    case "public":
      return "Public";
    case "prepared":
      return "Préparé";
    case "execution":
      return "Execution";
    case "selected":
      return "Sélection";
    default:
      return role;
  }
}
