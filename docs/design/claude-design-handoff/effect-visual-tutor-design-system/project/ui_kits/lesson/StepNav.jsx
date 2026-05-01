/* global React, Button */

window.StepNav = function StepNav({ step, total, onPrev, onNext, label }) {
  const dots = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "var(--surface-1)", border: "1px solid var(--rule)",
      borderRadius: "var(--r-pill)", padding: "6px 8px", boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button variant="secondary" onClick={onPrev} disabled={step === 1}>← Précédent</Button>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>
          <strong style={{ color: "var(--ink)" }}>{String(step).padStart(2, "0")}</strong> / {String(total).padStart(2, "0")} &nbsp;·&nbsp; {label}
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {dots.map(d => (
          <span key={d} style={{
            width: 14, height: 4, borderRadius: 2,
            background: d < step ? "var(--ink-3)" : d === step ? "var(--ink)" : "var(--surface-3)",
          }}/>
        ))}
      </div>
      <div>
        <Button variant="primary" onClick={onNext} disabled={step === total}>Étape suivante →</Button>
      </div>
    </nav>
  );
};
