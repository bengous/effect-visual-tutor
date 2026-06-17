import type { DiagramMode, LessonView } from "../lesson/types";
import type { KeyboardEvent } from "react";

export function DiagramPanel({
  view,
  onSelectStep,
}: {
  readonly view: LessonView;
  readonly onSelectStep: (stepId: string) => void;
}) {
  return (
    <section className="diagram-panel" aria-labelledby="diagram-title">
      <div className="diagram-panel__header">
        <div>
          <p className="eyebrow">Diagramme du concept</p>
          <h2 id="diagram-title">{diagramTitle(view.diagram.mode)}</h2>
        </div>
        <span
          className={`badge badge--${view.diagram.mode === "execution" ? "prepared" : "selected"}`}
        >
          {diagramModeLabel(view.diagram.mode)}
        </span>
      </div>
      <div className="diagram-stage" data-mode={view.diagram.mode}>
        {view.diagram.mode === "signature" ? <SignatureDiagram /> : null}
        {view.diagram.mode === "flow" ? (
          <FlowDiagram
            activeStepId={view.currentStep.id}
            errorBranchVisible={view.diagram.errorBranchVisible}
            onSelectStep={onSelectStep}
          />
        ) : null}
        {view.diagram.mode === "encapsulation" ? <EncapsulationDiagram /> : null}
        {view.diagram.mode === "execution" ? (
          <ExecutionDiagram
            executeActive={view.diagram.executeActive}
            preparedVisible={view.diagram.preparedVisible}
          />
        ) : null}
      </div>
    </section>
  );
}

function SignatureDiagram() {
  return (
    <svg className="lesson-diagram" viewBox="0 0 640 320" role="img" aria-label="Signature Effect">
      <rect
        className="diagram-capsule diagram-capsule--effect"
        x="34"
        y="64"
        width="572"
        height="144"
        rx="72"
      />
      <text className="diagram-label diagram-label--mono" x="320" y="50" textAnchor="middle">
        prepareRecapRun
      </text>
      <SignatureSlot x={80} label="Success" value="PreparedRecapRun" className="success" />
      <SignatureSlot x={254} label="Error" value="RecapPrepareError" className="error" />
      <SignatureSlot
        x={428}
        label="Requirements"
        value="RecapPrepareRuntime"
        className="requirements"
      />
      <path
        className="diagram-link diagram-link--selected"
        d="M 320 214 C 320 246, 320 252, 320 278"
      />
      <text className="diagram-caption" x="320" y="298" textAnchor="middle">
        Un type Effect se lit comme trois canaux, pas comme une valeur simple.
      </text>
    </svg>
  );
}

function SignatureSlot({
  x,
  label,
  value,
  className,
}: {
  readonly x: number;
  readonly label: string;
  readonly value: string;
  readonly className: "success" | "error" | "requirements";
}) {
  return (
    <g className={`signature-slot signature-slot--${className}`}>
      <rect x={x} y="98" width="132" height="72" rx="10" />
      <text className="diagram-label" x={x + 66} y="122" textAnchor="middle">
        {label}
      </text>
      <text className="diagram-label diagram-label--small" x={x + 66} y="148" textAnchor="middle">
        {value}
      </text>
    </g>
  );
}

function FlowDiagram({
  activeStepId,
  errorBranchVisible,
  onSelectStep,
}: {
  readonly activeStepId: string;
  readonly errorBranchVisible: boolean;
  readonly onSelectStep: (stepId: string) => void;
}) {
  return (
    <svg className="lesson-diagram" viewBox="0 0 640 360" role="img" aria-label="Flux Effect.gen">
      <FlowNode
        id="services"
        x={36}
        y={122}
        label="services"
        active={activeStepId === "services"}
        tone="requirements"
        onSelectStep={onSelectStep}
      />
      <FlowArrow x1={152} y1={150} x2={210} y2={150} />
      <FlowNode
        id="state"
        x={218}
        y={122}
        label="state"
        active={activeStepId === "state"}
        tone="requirements"
        onSelectStep={onSelectStep}
      />
      <FlowArrow x1={334} y1={150} x2={390} y2={150} />
      <FlowNode
        id="context"
        x={398}
        y={122}
        label="context"
        active={activeStepId === "context"}
        tone="selected"
        onSelectStep={onSelectStep}
      />

      <FlowArrow x1={514} y1={150} x2={588} y2={150} />
      <rect
        className="flow-node flow-node--success"
        x="540"
        y="220"
        width="82"
        height="48"
        rx="8"
      />
      <text className="diagram-label" x="581" y="249" textAnchor="middle">
        summary
      </text>

      <path
        className={`error-branch ${errorBranchVisible ? "error-branch--visible" : ""}`}
        d="M 318 120 C 330 70, 386 42, 456 56"
      />
      <rect
        className={`flow-node flow-node--error ${errorBranchVisible ? "flow-node--visible" : ""}`}
        x="456"
        y="34"
        width="142"
        height="48"
        rx="8"
      />
      <text
        className={`diagram-label diagram-label--error ${errorBranchVisible ? "diagram-label--visible" : ""}`}
        x="527"
        y="63"
        textAnchor="middle"
      >
        SessionError
      </text>

      <text className="diagram-caption" x="320" y="320" textAnchor="middle">
        Chaque yield* avance le flux ou le fait sortir par Error.
      </text>
    </svg>
  );
}

/* eslint-disable jsx-a11y/prefer-tag-over-role -- an SVG <g> cannot be a native
   <button>; role="button" + tabIndex is the accessible equivalent for a
   focusable diagram node (see ACCESSIBILITY.md, Keyboard). */
function FlowNode({
  active,
  id,
  label,
  tone,
  x,
  y,
  onSelectStep,
}: {
  readonly active: boolean;
  readonly id: string;
  readonly label: string;
  readonly tone: "requirements" | "selected";
  readonly x: number;
  readonly y: number;
  readonly onSelectStep: (stepId: string) => void;
}) {
  // Focusing a node activates the same code↔diagram link as the code side; Esc
  // releases it. See ACCESSIBILITY.md (Keyboard) and MOTION.md (animation 2).
  function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectStep(id);
    } else if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  }

  return (
    <g
      className={`flow-group flow-group--${tone} ${active ? "flow-group--active" : ""}`}
      data-node={id}
      role="button"
      tabIndex={0}
      aria-label={`Concept ${label}`}
      aria-current={active ? "step" : undefined}
      onClick={() => onSelectStep(id)}
      onKeyDown={handleKeyDown}
    >
      <rect className="flow-node" x={x} y={y} width="116" height="56" rx="10" />
      <text className="diagram-label" x={x + 58} y={y + 34} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
/* eslint-enable jsx-a11y/prefer-tag-over-role */

function FlowArrow({
  x1,
  x2,
  y1,
  y2,
}: {
  readonly x1: number;
  readonly x2: number;
  readonly y1: number;
  readonly y2: number;
}) {
  return <path className="flow-arrow" d={`M ${x1} ${y1} L ${x2} ${y2}`} />;
}

function EncapsulationDiagram() {
  return (
    <svg
      className="lesson-diagram"
      viewBox="0 0 640 340"
      role="img"
      aria-label="Bundle privé et summary public"
    >
      <defs>
        <pattern
          id="privateHatch"
          patternUnits="userSpaceOnUse"
          width="7"
          height="7"
          patternTransform="rotate(-45)"
        >
          <line x1="0" y1="0" x2="0" y2="7" className="private-hatch-line" />
        </pattern>
      </defs>
      <rect
        className="encap-frame encap-frame--private"
        x="50"
        y="76"
        width="236"
        height="154"
        rx="10"
      />
      <rect className="encap-hatch" x="50" y="76" width="236" height="154" rx="10" />
      <text className="diagram-label diagram-label--private" x="168" y="112" textAnchor="middle">
        RecapRunBundle
      </text>
      <text className="diagram-label diagram-label--small" x="168" y="146" textAnchor="middle">
        input · state · context
      </text>
      <text className="diagram-label diagram-label--small" x="168" y="172" textAnchor="middle">
        services
      </text>
      <text className="diagram-caption" x="168" y="258" textAnchor="middle">
        privé, capturé par execute()
      </text>

      <rect
        className="encap-frame encap-frame--public"
        x="354"
        y="76"
        width="236"
        height="154"
        rx="10"
      />
      <text className="diagram-label diagram-label--public" x="472" y="112" textAnchor="middle">
        RecapRunSummary
      </text>
      <text className="diagram-label diagram-label--small" x="472" y="146" textAnchor="middle">
        runId · sessionId · mode
      </text>
      <text className="diagram-label diagram-label--small" x="472" y="172" textAnchor="middle">
        sinceSource · currentDay
      </text>
      <text className="diagram-caption" x="472" y="258" textAnchor="middle">
        public, stable pour le caller
      </text>
    </svg>
  );
}

function ExecutionDiagram({
  executeActive,
  preparedVisible,
}: {
  readonly executeActive: boolean;
  readonly preparedVisible: boolean;
}) {
  return (
    <svg
      className="lesson-diagram"
      viewBox="0 0 640 340"
      role="img"
      aria-label="Préparation puis execution"
    >
      <rect className="return-frame" x="52" y="74" width="228" height="170" rx="12" />
      <text className="diagram-label" x="166" y="108" textAnchor="middle">
        PreparedRecapRun
      </text>
      <rect className="summary-chip" x="86" y="132" width="160" height="40" rx="8" />
      <text className="diagram-label diagram-label--small" x="166" y="157" textAnchor="middle">
        summary statique
      </text>
      <rect
        className={`execute-chip ${preparedVisible ? "execute-chip--prepared" : ""} ${
          executeActive ? "execute-chip--active" : ""
        }`}
        x="86"
        y="188"
        width="160"
        height="40"
        rx="8"
      />
      <text className="diagram-label diagram-label--small" x="166" y="213" textAnchor="middle">
        execute()
      </text>

      <path
        className={`execute-arrow ${executeActive ? "execute-arrow--active" : ""}`}
        d="M 282 208 L 404 208"
      />
      <rect
        className={`running-node ${executeActive ? "running-node--active" : ""}`}
        x="408"
        y="178"
        width="178"
        height="60"
        rx="12"
      />
      <text className="diagram-label" x="497" y="213" textAnchor="middle">
        {executeActive ? "running" : "latent"}
      </text>
      <text className="diagram-caption" x="320" y="294" textAnchor="middle">
        La préparation rend une fonction. Le run réel commence au clic sur execute().
      </text>
    </svg>
  );
}

const DIAGRAM_TITLES: Record<DiagramMode, string> = {
  signature: "Signature Effect",
  flow: "Flux yield*",
  encapsulation: "Privé vs public",
  execution: "Prepare puis execute",
};

function diagramTitle(mode: DiagramMode): string {
  return DIAGRAM_TITLES[mode];
}

const DIAGRAM_MODE_LABELS: Record<DiagramMode, string> = {
  signature: "Signature",
  flow: "Flow",
  encapsulation: "Boundary",
  execution: "Execution",
};

function diagramModeLabel(mode: DiagramMode): string {
  return DIAGRAM_MODE_LABELS[mode];
}
