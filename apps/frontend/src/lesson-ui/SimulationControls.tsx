import type { LessonView, SimulationInput } from "../lesson/types";

type SimulationControlsProps = {
  readonly simulation: LessonView["simulation"];
  readonly onChangeInput: (input: Partial<SimulationInput>) => void;
  readonly onPrepare: () => void;
  readonly onExecute: () => void;
};

export function SimulationControls({
  simulation,
  onChangeInput,
  onPrepare,
  onExecute,
}: SimulationControlsProps) {
  return (
    <section className="simulation-panel" aria-labelledby="simulation-title">
      <div>
        <p className="eyebrow">Manipuler l'input</p>
        <h2 id="simulation-title">Préparer, puis exécuter</h2>
      </div>

      <div className="simulation-panel__toggles">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={simulation.input.noAi}
            onChange={(event) => onChangeInput({ noAi: event.currentTarget.checked })}
          />
          <span>noAi</span>
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={simulation.input.rebuildToday}
            onChange={(event) => onChangeInput({ rebuildToday: event.currentTarget.checked })}
          />
          <span>rebuildToday</span>
        </label>
      </div>

      <div className="simulation-panel__actions">
        <button type="button" className="button button--primary" onClick={onPrepare}>
          Préparer
        </button>
        <button
          type="button"
          className="button button--execute"
          disabled={!simulation.canExecute}
          onClick={onExecute}
        >
          Exécuter
        </button>
      </div>

      <SimulationStatus simulation={simulation} />
    </section>
  );
}

function SimulationStatus({ simulation }: { readonly simulation: LessonView["simulation"] }) {
  if (simulation.status === "error" && simulation.error !== undefined) {
    return (
      <p className="simulation-status simulation-status--error">
        Erreur typée: <code className="code-inline">{simulation.error.kind}</code>.{" "}
        <code className="code-inline">execute</code> reste indisponible.
      </p>
    );
  }

  if (simulation.status === "prepared" && simulation.prepared !== undefined) {
    return (
      <p className="simulation-status simulation-status--prepared">
        Préparation réussie: <code className="code-inline">{simulation.prepared.runId}</code>.{" "}
        <code className="code-inline">execute</code> est armé.
      </p>
    );
  }

  if (simulation.status === "executing" && simulation.prepared !== undefined) {
    return (
      <p className="simulation-status simulation-status--execution">
        exécution déclenchée pour <code className="code-inline">{simulation.prepared.runId}</code>.
      </p>
    );
  }

  return (
    <p className="simulation-status">
      Choisis une combinaison, puis lance <code className="code-inline">prepareRecapRun</code>.
    </p>
  );
}
