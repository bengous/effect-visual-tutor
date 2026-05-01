/* global React */
const { useState } = React;

window.Badge = function Badge({ role = "selected", children, shape = "dot" }) {
  const tones = {
    success: "var(--success-bg)",
    error: "var(--error-bg)",
    req: "var(--req-bg)",
    selected: "var(--selected-bg)",
    private: "var(--private-bg)",
    public: "var(--public-bg)",
    prepared: "var(--prepared-bg)",
    exec: "var(--exec-bg)",
  };
  const inks = {
    success: "var(--success-fg)", error: "var(--error-fg)", req: "var(--req-fg)",
    selected: "var(--selected-fg)", private: "var(--private-fg)", public: "var(--public-fg)",
    prepared: "var(--prepared-fg)", exec: "var(--exec-fg)",
  };
  const lines = {
    success: "var(--success-line)", error: "var(--error-line)", req: "var(--req-line)",
    selected: "var(--selected-line)", private: "var(--private-line)", public: "var(--public-line)",
    prepared: "var(--prepared-line)", exec: "var(--exec-line)",
  };
  const isPrivate = role === "private";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
      letterSpacing: ".04em", textTransform: "uppercase",
      background: tones[role], color: inks[role],
      backgroundImage: isPrivate ? "var(--private-hatch)" : undefined,
      border: `1px solid ${lines[role]}`,
      boxShadow: role === "exec" ? "0 0 0 3px var(--exec-glow)" : "none",
    }}>
      {shape === "ring"
        ? <span style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid currentColor" }}/>
        : shape === "dot"
        ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}/>
        : null}
      {children}
    </span>
  );
};

window.Button = function Button({ variant = "secondary", children, onClick, disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: "var(--r-3)",
    fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
    border: "1px solid var(--rule)", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--dur-instant) var(--ease-in-out)",
  };
  const variants = {
    primary: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
    secondary: { background: "var(--surface-1)", color: "var(--ink)" },
    ghost: { background: "transparent", borderColor: "transparent", color: "var(--ink-2)" },
    exec: {
      background: "var(--exec-bg)", color: "var(--exec-fg)",
      borderColor: "var(--exec-line)", boxShadow: "0 0 0 3px var(--exec-glow)",
    },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
};

window.Toggle = function Toggle({ value, onChange, options }) {
  return (
    <div style={{
      display: "inline-flex", background: "var(--surface-2)",
      border: "1px solid var(--rule)", borderRadius: "var(--r-3)", padding: 2,
    }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          style={{
            background: value === opt.value ? "var(--surface-1)" : "transparent",
            color: value === opt.value ? "var(--ink)" : "var(--ink-2)",
            boxShadow: value === opt.value ? "var(--shadow-1)" : "none",
            border: "none", padding: "5px 12px", fontFamily: "var(--font-ui)",
            fontSize: 12, borderRadius: "var(--r-2)", cursor: "pointer",
            transition: "all var(--dur-quick) var(--ease-in-out)",
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
};
