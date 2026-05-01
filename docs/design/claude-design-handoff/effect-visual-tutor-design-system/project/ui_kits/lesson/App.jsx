/* global React, ReactDOM, CodeFrame, Diagram, ConceptPanel, StepNav */
const { useState, useEffect } = React;

const STEPS = [
  { label: "Lire la signature",            activeLine: 3,  err: false },
  { label: "Charger les services",         activeLine: 5,  err: false },
  { label: "Charger l'état",               activeLine: 6,  err: false },
  { label: "Détecter le contexte",         activeLine: 12, err: false },
  { label: "Comprendre la branche d'erreur", activeLine: 9, err: true  },
  { label: "Composer le bundle vs summary", activeLine: 15, err: false },
  { label: "Armer execute",                 activeLine: 19, err: false, armed: true },
];

function App() {
  const [step, setStep] = useState(4);
  const [view, setView] = useState("simple");
  const [errorOverride, setErrorOverride] = useState(null);
  const [executing, setExecuting] = useState(false);

  const cur = STEPS[step - 1];
  const errorRevealed = errorOverride !== null ? errorOverride : !!cur.err;
  const executeArmed = !!cur.armed || step === STEPS.length;

  useEffect(() => { setErrorOverride(null); setExecuting(false); }, [step]);

  return (
    <div data-screen-label={`0${step} ${cur.label}`} style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      padding: "var(--page-pad)", gap: "var(--gutter)", maxWidth: 1440, margin: "0 auto",
    }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg viewBox="0 0 54 54" width="40" height="40">
            <rect x="2" y="16" width="50" height="22" rx="11" fill="var(--public-bg)" stroke="var(--public-line)" strokeWidth="1.5"/>
            <path d="M 8 27 L 46 27" stroke="var(--code-yield)" strokeWidth="2.5" fill="none" markerEnd="url(#mk)"/>
            <defs><marker id="mk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--code-yield)"/></marker></defs>
            <circle cx="38" cy="27" r="3.5" fill="var(--success-bg)" stroke="var(--success-line)" strokeWidth="1.5"/>
          </svg>
          <div>
            <div className="h3" style={{ margin: 0 }}>Préparer une exécution avec <code style={{ fontFamily: "var(--font-mono)", fontSize: ".88em" }}>Effect.gen</code></div>
            <div className="caption">Leçon 01 · Etch · <code className="code-inline" style={{ fontSize: 11 }}>prepareRecapRun</code></div>
          </div>
        </div>
        <div className="eyebrow">EFFECT VISUAL TUTOR</div>
      </header>

      {/* Split view */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--gutter)", flex: 1, alignItems: "start" }}>
        <div>
          <CodeFrame
            activeLine={cur.activeLine}
            errorRevealed={errorRevealed}
            executeArmed={executeArmed}
            stepLabel={`Étape ${String(step).padStart(2, "0")} / ${String(STEPS.length).padStart(2, "0")}`}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "var(--surface-1)", border: "1px solid var(--rule)", borderRadius: "var(--r-4)", padding: 14, boxShadow: "var(--shadow-1)" }}>
            <Diagram step={step} errorRevealed={errorRevealed} executeArmed={executeArmed} executing={executing}/>
          </div>
          <div style={{ background: "var(--surface-1)", border: "1px solid var(--rule)", borderRadius: "var(--r-4)", padding: "20px 22px", boxShadow: "var(--shadow-1)" }}>
            <ConceptPanel
              view={view} onView={setView}
              errorRevealed={errorRevealed}
              onToggleError={() => setErrorOverride(!errorRevealed)}
              executeArmed={executeArmed}
              executing={executing}
              onExecute={() => { setExecuting(true); setTimeout(() => setExecuting(false), 2400); }}
            />
          </div>
        </div>
      </div>

      <StepNav
        step={step} total={STEPS.length}
        label={cur.label}
        onPrev={() => setStep(s => Math.max(1, s - 1))}
        onNext={() => setStep(s => Math.min(STEPS.length, s + 1))}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
