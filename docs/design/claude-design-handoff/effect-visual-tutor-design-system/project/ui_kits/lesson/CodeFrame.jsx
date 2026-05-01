/* global React */

// Token-driven syntax highlighter for the lesson code excerpt.
// We hand-tokenize for pixel control instead of using Prism etc.
window.CodeBody = function CodeBody({ activeLine, errorRevealed, executeArmed }) {
  // Each entry: { n: lineNo, role: 'sel'|'err'|'req'|'priv'|'pub'|'inactive'|null, content: <jsx> }
  const K = (s) => <span style={{ color: "var(--code-keyword)" }}>{s}</span>;
  const T = (s) => <span style={{ color: "var(--code-type)" }}>{s}</span>;
  const F = (s) => <span style={{ color: "var(--code-fn)" }}>{s}</span>;
  const Y = (s) => <span style={{ color: "var(--code-yield)", fontWeight: 700 }}>{s}</span>;
  const S = (s) => <span style={{ color: "var(--code-string)" }}>{s}</span>;
  const C = (s) => <span style={{ color: "var(--code-comment)", fontStyle: "italic" }}>{s}</span>;
  const P = (s) => <span style={{ color: "var(--code-punct)" }}>{s}</span>;

  const lines = [
    { n: 1,  content: <>{K("export")} {K("function")} {F("prepareRecapRun")}{P("(")}</> },
    { n: 2,  content: <>  input{P(":")} {T("RunRecapInput")}{P(",")}</> },
    { n: 3,  content: <>{P(")")}{P(":")} {T("Effect")}{P(".")}{T("Effect")}{P("<")}{T("PreparedRecapRun")}{P(",")} {T("RecapPrepareError")}{P(",")} {T("RecapPrepareRuntime")}{P(">")} {P("{")}</> },
    { n: 4,  content: <>  {K("return")} Effect{P(".")}{F("gen")}{P("(")}{K("function")}{P("*")}{P("()")} {P("{")}</> },
    { n: 5,  role: "req", content: <>    {K("const")} services {P("=")} {Y("yield*")} {F("loadRecapServices")}{P("()")}{P(";")}</> },
    { n: 6,  role: "req", content: <>    {K("const")} state    {P("=")} {Y("yield*")} services{P(".")}stateManager{P(".")}{F("load")}{P("()")}{P(";")}</> },
    { n: 7,  content: <></> },
    { n: 8,  role: errorRevealed ? "err" : "inactive", content: <>    {K("if")} {P("(")}input{P(".")}noAi {P("&&")} input{P(".")}rebuildToday{P(")")} {P("{")}</> },
    { n: 9,  role: errorRevealed ? "err" : "inactive", content: <>      {K("return")} {Y("yield*")} {K("new")} {T("SessionError")}{P("({")} kind{P(":")} {S("\"detection_failed\"")} {P("})")}{P(";")}</> },
    { n: 10, role: errorRevealed ? "err" : "inactive", content: <>    {P("}")}</> },
    { n: 11, content: <></> },
    { n: 12, role: "sel", content: <>    {K("const")} context {P("=")} {Y("yield*")} {F("detectRunContext")}{P("(")}state{P(",")} {P("{")} … {P("})")}{P(";")}</> },
    { n: 13, content: <></> },
    { n: 14, role: "priv", content: <>    {K("const")} bundle{P(":")} {T("RecapRunBundle")} {P("=")} {P("{")} input{P(",")} state{P(",")} context{P(",")} services {P("};")}</> },
    { n: 15, role: "pub",  content: <>    {K("const")} summary{P(":")} {T("RecapRunSummary")} {P("=")} {P("{")} runId{P(",")} sessionId{P(",")} mode{P(",")} … {P("};")}</> },
    { n: 16, content: <></> },
    { n: 17, content: <>    {K("return")} {P("{")}</> },
    { n: 18, role: "pub", content: <>      runId{P(",")} summary{P(",")}</> },
    { n: 19, role: executeArmed ? "prep" : null, content: <>      execute{P(":")} {P("()")} {P("=>")} {F("executePreparedRecapRun")}{P("(bundle)")}{P(",")}</> },
    { n: 20, content: <>    {P("};")}</> },
    { n: 21, content: <>  {P("})")}{P(";")}</> },
    { n: 22, content: <>{P("}")}</> },
  ];

  const roleStyle = {
    sel:      { background: "var(--selected-bg)", borderLeft: "3px solid var(--selected-line)" },
    err:      { background: "var(--error-bg)",    borderLeft: "3px solid var(--error-line)" },
    req:      { background: "var(--req-bg)",      borderLeft: "3px solid var(--req-line)" },
    priv:     { background: "var(--private-bg)",  borderLeft: "3px solid var(--private-line)", backgroundImage: "var(--private-hatch)" },
    pub:      { background: "var(--public-bg)",   borderLeft: "3px solid var(--public-line)" },
    prep:     { background: "var(--prepared-bg)", borderLeft: "3px solid var(--prepared-line)" },
    inactive: { opacity: 0.4 },
  };

  return (
    <pre style={{
      margin: 0, padding: "12px 0",
      fontFamily: "var(--font-mono)", fontSize: "var(--t-code)", lineHeight: "var(--lh-code)",
      color: "var(--code-fg)", fontFeatureSettings: "\"liga\" 0, \"calt\" 0",
    }}>
      {lines.map(l => {
        const style = l.role ? roleStyle[l.role] : null;
        return (
          <div key={l.n} style={{
            display: "block", paddingLeft: 13, paddingRight: 16, marginLeft: -16, marginRight: -16,
            borderLeft: "3px solid transparent",
            transition: "background var(--dur-quick) var(--ease-in-out)",
            ...style,
          }}>
            <span style={{
              display: "inline-block", width: 28, paddingRight: 14,
              textAlign: "right", color: l.n === activeLine ? "var(--code-line-num-active)" : "var(--code-line-num)",
              userSelect: "none",
            }}>{l.n}</span>
            {l.content}
          </div>
        );
      })}
    </pre>
  );
};

window.CodeFrame = function CodeFrame({ activeLine, errorRevealed, executeArmed, stepLabel }) {
  return (
    <div style={{
      background: "var(--code-bg)", border: "1px solid var(--rule)",
      borderRadius: "var(--r-4)", boxShadow: "var(--shadow-1)", overflow: "hidden",
    }}>
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 14px", borderBottom: "1px solid var(--rule)", background: "var(--surface-2)",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>prepareRecapRun.ts</span>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>TypeScript · Effect</span>
      </header>
      <div style={{ padding: "0 16px" }}>
        <CodeBody activeLine={activeLine} errorRevealed={errorRevealed} executeArmed={executeArmed}/>
      </div>
      <footer style={{
        padding: "6px 14px", borderTop: "1px solid var(--rule)",
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)",
        display: "flex", justifyContent: "space-between",
      }}>
        <span>{stepLabel}</span>
        <span>22 lignes</span>
      </footer>
    </div>
  );
};
