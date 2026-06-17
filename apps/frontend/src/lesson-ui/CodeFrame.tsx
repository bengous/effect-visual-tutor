import type { CodeHighlight, CodeLine, LessonView, SemanticRole } from "../lesson/types";

type CodeFrameProps = {
  readonly code: LessonView["code"];
  readonly lineStepIds: Readonly<Record<number, string>>;
  readonly onSelectStep: (stepId: string) => void;
};

const syntaxPattern = /yield\*|"[^"]*"|[A-Za-z_$][\w$]*|=>|&&|[{}()[\].,:;<>*=]|\s+|./gu;

const keywords = new Set(["const", "export", "function", "if", "new", "return"]);
const functions = new Set([
  "prepareRecapRun",
  "loadRecapServices",
  "load",
  "detectRunContext",
  "executePreparedRecapRun",
]);
const types = new Set([
  "Effect",
  "PreparedRecapRun",
  "RecapPrepareError",
  "RecapPrepareRuntime",
  "RunRecapInput",
  "SessionError",
  "RecapRunBundle",
  "RecapRunSummary",
]);

export function CodeFrame({ code, lineStepIds, onSelectStep }: CodeFrameProps) {
  return (
    <section className="code-frame" aria-label="Code source prepareRecapRun">
      <header className="code-frame__header">
        <span>{code.sourceFile}</span>
        <span>TypeScript · Effect</span>
      </header>
      <div className="code-frame__body" role="list" aria-label="Extrait annoté">
        {code.lines.map((line) => (
          <CodeRow
            key={line.number}
            active={code.selectedLineNumbers.includes(line.number)}
            line={line}
            role={roleForLine(line.number, code.highlights)}
            stepId={lineStepIds[line.number]}
            onSelectStep={onSelectStep}
          />
        ))}
      </div>
      <footer className="code-frame__footer">
        <span>{code.selectedLineNumbers.length} ligne(s) actives</span>
        <span>{code.lines.length} lignes</span>
      </footer>
    </section>
  );
}

function CodeRow({
  active,
  line,
  role,
  stepId,
  onSelectStep,
}: {
  readonly active: boolean;
  readonly line: CodeLine;
  readonly role: SemanticRole | undefined;
  readonly stepId: string | undefined;
  readonly onSelectStep: (stepId: string) => void;
}) {
  const className = [
    "code-row",
    active ? "code-row--active" : "",
    role === undefined ? "" : `code-row--${role}`,
  ]
    .filter(Boolean)
    .join(" ");
  const children = (
    <>
      <span className="code-row__number" aria-hidden="true">
        {line.number}
      </span>
      <span className="code-row__text">{renderTokens(line.text, line.number)}</span>
    </>
  );

  if (stepId !== undefined) {
    return (
      <button
        type="button"
        className={`${className} code-row--button`}
        aria-label={`Explorer la ligne ${line.number}`}
        onClick={() => onSelectStep(stepId)}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={className} role="listitem">
      {children}
    </div>
  );
}

function renderTokens(line: string, lineNumber: number) {
  const tokens = line.match(syntaxPattern) ?? [];

  let column = 0;
  return tokens.map((token) => {
    // Key on the token's column offset: stable and unique within the line, since
    // tokens never reorder (unlike an array index, which the linter rejects).
    const key = `${lineNumber}-${column}`;
    column += token.length;
    const className = tokenClassName(token);
    return (
      <span key={key} className={className}>
        {token}
      </span>
    );
  });
}

function tokenClassName(token: string): string | undefined {
  if (token.trim().length === 0) {
    return undefined;
  }
  if (token === "yield*") {
    return "code-token code-token--yield";
  }
  if (keywords.has(token)) {
    return "code-token code-token--keyword";
  }
  if (functions.has(token)) {
    return "code-token code-token--fn";
  }
  if (types.has(token)) {
    return "code-token code-token--type";
  }
  if (token.startsWith('"')) {
    return "code-token code-token--string";
  }
  if (/^[{}()[\].,:;<>*=]|&&|=>$/.test(token)) {
    return "code-token code-token--punct";
  }
  return undefined;
}

function roleForLine(
  lineNumber: number,
  highlights: readonly CodeHighlight[],
): SemanticRole | undefined {
  const priority: readonly SemanticRole[] = [
    "execution",
    "prepared",
    "error",
    "selected",
    "private",
    "public",
    "requirements",
    "success",
  ];

  return priority.find((role) =>
    highlights.some(
      (highlight) => highlight.role === role && highlight.lineNumbers.includes(lineNumber),
    ),
  );
}
