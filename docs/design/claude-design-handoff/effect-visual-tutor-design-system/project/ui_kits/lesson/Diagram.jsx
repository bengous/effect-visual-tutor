/* global React */

window.Diagram = function Diagram({ step, errorRevealed, executeArmed, executing }) {
  // Three-step diagram corresponding to the lesson view.
  // Coordinates are in a 600x420 viewBox.
  return (
    <svg viewBox="0 0 600 420" style={{ display: "block", width: "100%", height: "auto", overflow: "visible", fontFamily: "var(--font-mono)" }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)"/>
        </marker>
        <marker id="arrErr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--error-line)"/>
        </marker>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--private-line)" strokeWidth="1" opacity=".4"/>
        </pattern>
      </defs>

      {/* Outer Effect capsule */}
      <rect x="20" y="40" width="560" height="120" rx="60" fill="var(--surface-1)" stroke="var(--ink-2)" strokeWidth="1.5"/>
      <text x="44" y="32" fontSize="10" fill="var(--ink-3)" style={{ letterSpacing: ".08em" }}>EFFECT.GEN — PREPARERECAPRUN</text>

      {/* Service rings (requirements) */}
      <g>
        <circle cx="80" cy="100" r="14" fill={step >= 1 ? "var(--req-bg)" : "transparent"} stroke="var(--req-line)" strokeWidth="1.5"/>
        <text x="80" y="138" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--req-fg)" fontWeight="600">services</text>

        <circle cx="140" cy="100" r="14" fill={step >= 2 ? "var(--req-bg)" : "transparent"} stroke="var(--req-line)" strokeWidth="1.5"/>
        <text x="140" y="138" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--req-fg)" fontWeight="600">state</text>

        {/* yield* arrow + active step */}
        <rect x="200" y="78" width="160" height="44" rx="8"
          fill={step === 3 ? "var(--selected-bg)" : "var(--surface-2)"}
          stroke={step === 3 ? "var(--selected-line)" : "var(--rule)"}
          strokeWidth={step === 3 ? "2" : "1"}/>
        <text x="280" y="105" textAnchor="middle" fontSize="11" fill={step === 3 ? "var(--selected-fg)" : "var(--ink-2)"} fontWeight="600">detectRunContext</text>

        <path d="M 94 100 L 124 100" stroke="var(--ink-3)" strokeWidth="1.4" fill="none" markerEnd="url(#arr)"/>
        <path d="M 154 100 L 198 100" stroke="var(--ink-3)" strokeWidth="1.4" fill="none" markerEnd="url(#arr)"/>

        {/* Return composition */}
        <rect x="400" y="78" width="160" height="44" rx="8"
          fill={executeArmed ? "var(--prepared-bg)" : "var(--surface-2)"}
          stroke={executeArmed ? "var(--prepared-line)" : "var(--rule)"}
          strokeWidth="1.5"/>
        <text x="480" y="105" textAnchor="middle" fontSize="11" fill={executeArmed ? "var(--prepared-fg)" : "var(--ink-2)"} fontWeight="600">PreparedRecapRun</text>
        <path d="M 360 100 L 398 100" stroke="var(--ink-3)" strokeWidth="1.4" fill="none" markerEnd="url(#arr)"/>
      </g>

      {/* Encapsulation — bundle (private) vs summary (public) */}
      <text x="44" y="200" fontSize="10" fill="var(--ink-3)" style={{ letterSpacing: ".08em" }}>L'OBJET RENVOYÉ — PRIVÉ VS PUBLIC</text>

      <rect x="40"  y="220" width="240" height="84" rx="10" fill="var(--private-bg)" stroke="var(--private-line)" strokeWidth="1.5"/>
      <rect x="40"  y="220" width="240" height="84" rx="10" fill="url(#hatch)"/>
      <text x="160" y="244" textAnchor="middle" fontSize="11" fill="var(--private-fg)" fontWeight="700">RecapRunBundle (privé)</text>
      <text x="160" y="266" textAnchor="middle" fontSize="10" fill="var(--private-fg)">input · state · context · services</text>
      <text x="160" y="286" textAnchor="middle" fontSize="9" fill="var(--private-fg)" fontStyle="italic">capturé par execute(), invisible au caller</text>

      <rect x="320" y="220" width="240" height="84" rx="10" fill="var(--public-bg)" stroke="var(--public-line)" strokeWidth="1.5"/>
      <text x="440" y="244" textAnchor="middle" fontSize="11" fill="var(--public-fg)" fontWeight="700">RecapRunSummary (public)</text>
      <text x="440" y="266" textAnchor="middle" fontSize="10" fill="var(--public-fg)">runId · sessionId · mode · …</text>
      <text x="440" y="286" textAnchor="middle" fontSize="9" fill="var(--public-fg)" fontStyle="italic">ce que le caller voit</text>

      {/* execute arrow */}
      <text x="44" y="340" fontSize="10" fill="var(--ink-3)" style={{ letterSpacing: ".08em" }}>EXECUTE — LATENT, PUIS DÉCLENCHÉ</text>
      <rect x="40" y="356" width="160" height="44" rx="8"
        fill={executeArmed ? "var(--prepared-bg)" : "var(--surface-2)"}
        stroke={executeArmed ? "var(--prepared-line)" : "var(--rule)"} strokeWidth="2"/>
      <text x="120" y="383" textAnchor="middle" fontSize="11" fill={executeArmed ? "var(--prepared-fg)" : "var(--ink-3)"} fontWeight="600">execute()</text>

      <path d="M 200 378 L 318 378" stroke={executing ? "var(--exec-line)" : "var(--ink-3)"}
            strokeWidth={executing ? "2" : "1.4"} fill="none" markerEnd="url(#arr)"
            strokeDasharray={executing ? "none" : "4 3"} opacity={executeArmed ? 1 : 0.4}/>

      <rect x="320" y="356" width="240" height="44" rx="8"
        fill={executing ? "var(--exec-bg)" : "var(--surface-2)"}
        stroke={executing ? "var(--exec-line)" : "var(--rule)"}
        strokeWidth="1.5"
        style={{ filter: executing ? "drop-shadow(0 0 6px var(--exec-glow))" : "none" }}/>
      <text x="440" y="383" textAnchor="middle" fontSize="11"
        fill={executing ? "var(--exec-fg)" : "var(--ink-3)"} fontWeight="700">
        {executing ? "running…" : "execution (latent)"}
      </text>

      {/* Error branch — appears when revealed */}
      {errorRevealed && (
        <g>
          <path d="M 280 100 C 280 60, 280 50, 280 30" stroke="var(--error-line)" strokeWidth="1.6"
            fill="none" markerEnd="url(#arrErr)" strokeDasharray="4 3"/>
          <rect x="380" y="10" width="180" height="36" rx="8" fill="var(--error-bg)" stroke="var(--error-line)"/>
          <text x="470" y="33" textAnchor="middle" fontSize="11" fill="var(--error-fg)" fontWeight="700">SessionError</text>
          <path d="M 280 30 L 378 28" stroke="var(--error-line)" strokeWidth="1.6" fill="none" markerEnd="url(#arrErr)" strokeDasharray="4 3"/>
        </g>
      )}
    </svg>
  );
};
