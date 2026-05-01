/* global React, Badge, Button, Toggle */
const { useState: useStateCP } = React;

window.ConceptPanel = function ConceptPanel({ view, onView, errorRevealed, onToggleError, executeArmed, executing, onExecute }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="eyebrow"><span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0, background: "var(--surface-2)", padding: "1px 6px", borderRadius: "var(--r-2)", color: "var(--ink)", marginRight: 8 }}>yield*</span>DÉROULER UNE ÉTAPE</div>
        <Toggle value={view} onChange={onView} options={[{ value: "simple", label: "Simple" }, { value: "detail", label: "Détail" }]}/>
      </div>

      <h2 className="h2" style={{ margin: 0 }}>Lance l'étape, puis te donne ce qu'elle a produit.</h2>

      <p className="body-prose" style={{ margin: 0 }}>
        Sur la ligne sélectionnée, <code className="code-inline">yield*</code> attend que <code className="code-inline">detectRunContext</code> se termine,
        puis <strong>remonte sa valeur de succès</strong> dans la variable <code className="code-inline">context</code>. L'effet ne fait rien tant qu'on ne l'exécute pas — il se contente d'enchaîner les étapes.
      </p>

      {view === "detail" && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--rule)", borderRadius: "var(--r-3)", padding: "12px 14px" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Signature</div>
          <div className="code" style={{ fontSize: "var(--t-code-sm)", lineHeight: 1.7 }}>
            <span style={{ color: "var(--code-yield)", fontWeight: 700 }}>yield*</span> <span style={{ color: "var(--ink-2)" }}>e</span>: <span style={{ color: "var(--code-type)" }}>Effect</span>&lt;<span style={{ color: "var(--success-fg)" }}>A</span>, <span style={{ color: "var(--error-fg)" }}>E</span>, <span style={{ color: "var(--req-fg)" }}>R</span>&gt;<br/>
            → <span style={{ color: "var(--success-fg)" }}>A</span> <span style={{ color: "var(--ink-3)" }}>// le succès remonte</span><br/>
            → <span style={{ color: "var(--error-fg)" }}>throw E</span> <span style={{ color: "var(--ink-3)" }}>// l'erreur quitte le bloc</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Badge role="req" shape="ring">Requirements</Badge>
        <Badge role="success">Success</Badge>
        <Badge role="error">Error</Badge>
      </div>

      <div style={{ height: 1, background: "var(--rule)" }}/>

      <div className="eyebrow">CHECKPOINT — INTRODUIRE LA BRANCHE D'ERREUR</div>
      <p className="body-prose" style={{ margin: 0 }}>
        Si <code className="code-inline">input.noAi</code> est combiné avec <code className="code-inline">--rebuild-today</code>, l'effet bascule sur le <strong>canal d'erreur</strong> — <code className="code-inline">execute()</code> ne sera jamais appelé.
      </p>
      <div>
        <Button variant={errorRevealed ? "secondary" : "primary"} onClick={onToggleError}>
          {errorRevealed ? "Masquer la branche d'erreur" : "Révéler la branche d'erreur"}
        </Button>
      </div>

      <div style={{ height: 1, background: "var(--rule)" }}/>

      <div className="eyebrow">PREPARED → EXECUTE</div>
      <p className="body-prose" style={{ margin: 0 }}>
        L'objet renvoyé est <strong>armé</strong> : <code className="code-inline">execute</code> contient le code prêt à courir, mais rien ne tourne tant que tu ne l'appelles pas.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button variant="exec" onClick={onExecute} disabled={!executeArmed || executing}>
          {executing ? "▶ exécution…" : "▶ Exécuter"}
        </Button>
        {executing && <Badge role="exec">en cours</Badge>}
        {!executing && executeArmed && <Badge role="prepared" shape="ring">armé</Badge>}
      </div>
    </div>
  );
};
