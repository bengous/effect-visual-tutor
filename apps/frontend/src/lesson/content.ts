import type { LessonContent } from "./types";

export const prepareRecapLesson: LessonContent = {
  title: "Préparer une exécution avec Effect.gen",
  subtitle: "Leçon 01 · Etch · prepareRecapRun",
  sourceFile: "prepareRecapRun.ts",
  codeLines: [
    { number: 1, text: "export function prepareRecapRun(" },
    { number: 2, text: "  input: RunRecapInput," },
    {
      number: 3,
      text: "): Effect.Effect<PreparedRecapRun, RecapPrepareError, RecapPrepareRuntime> {",
    },
    { number: 4, text: "  return Effect.gen(function* () {" },
    { number: 5, text: "    const services = yield* loadRecapServices();" },
    { number: 6, text: "    const state = yield* services.stateManager.load();" },
    { number: 7, text: "" },
    { number: 8, text: "    if (input.noAi && input.rebuildToday) {" },
    { number: 9, text: "      return yield* new SessionError({" },
    { number: 10, text: '        kind: "detection_failed",' },
    { number: 11, text: '        message: "--rebuild-today requires AI execution",' },
    { number: 12, text: "      });" },
    { number: 13, text: "    }" },
    { number: 14, text: "" },
    { number: 15, text: "    const context = yield* detectRunContext(state, {" },
    { number: 16, text: "      requestedInteractive: input.interactive," },
    { number: 17, text: "      sinceOverride: input.since," },
    { number: 18, text: "      rebuildToday: input.rebuildToday," },
    { number: 19, text: "    });" },
    { number: 20, text: "" },
    {
      number: 21,
      text: "    const { runId, sessionId, mode, sinceTimestamp, sinceSource, currentDay } = context;",
    },
    { number: 22, text: "    const bundle: RecapRunBundle = { input, state, context, services };" },
    { number: 23, text: "    const summary: RecapRunSummary = {" },
    { number: 24, text: "      runId," },
    { number: 25, text: "      sessionId," },
    { number: 26, text: "      mode," },
    { number: 27, text: "      sinceTimestamp," },
    { number: 28, text: "      sinceSource," },
    { number: 29, text: "      currentDay," },
    { number: 30, text: "    };" },
    { number: 31, text: "" },
    { number: 32, text: "    return {" },
    { number: 33, text: "      runId," },
    { number: 34, text: "      summary," },
    { number: 35, text: "      execute: () => executePreparedRecapRun(bundle)," },
    { number: 36, text: "    };" },
    { number: 37, text: "  });" },
    { number: 38, text: "}" },
  ],
  steps: [
    {
      id: "signature",
      eyebrow: "Effect.Effect — contrat de sortie",
      title: "Lire la signature de l'effet",
      simple:
        "La signature dit trois choses: ce que la fonction rend si elle réussit, comment elle peut échouer, et quels services elle attend du runtime.",
      detail:
        "Effect.Effect<PreparedRecapRun, RecapPrepareError, RecapPrepareRuntime> se lit comme un contrat: Success vaut PreparedRecapRun, Error vaut RecapPrepareError, Requirements vaut RecapPrepareRuntime.",
      detailCode:
        "Effect.Effect<PreparedRecapRun, RecapPrepareError, RecapPrepareRuntime>\n// Success, Error, Requirements",
      diagramMode: "signature",
      selectedLineNumbers: [3],
      conceptRoles: ["success", "error", "requirements"],
      checkpoint: {
        id: "signature-main",
        prompt: "Que promet cette signature ?",
        options: [
          {
            id: "contract",
            label: "Un contrat de réussite, erreur et dépendances.",
            correct: true,
            feedback: "Oui. Tu lis d'abord les trois canaux, avant le corps.",
          },
          {
            id: "runs-now",
            label: "La fonction lance déjà le recap complet.",
            correct: false,
            feedback:
              "Pas encore le recap complet. Elle décrit une préparation qui pourra réussir, échouer ou demander des services.",
          },
        ],
      },
    },
    {
      id: "gen-block",
      eyebrow: "Effect.gen — bloc séquentiel",
      title: "Lire Effect.gen comme une suite d'étapes",
      simple:
        "Effect.gen te permet de lire ce code presque comme du Java: ligne après ligne, chaque étape produit une valeur ou arrête le flux.",
      detail:
        "Le générateur ne rend pas le programme plus magique. Il donne une syntaxe séquentielle autour d'effets typés. Chaque yield* déroule une étape et remonte sa valeur de succès.",
      detailCode: "return Effect.gen(function* () {\n  const value = yield* someEffect;\n});",
      diagramMode: "flow",
      selectedLineNumbers: [4],
      conceptRoles: ["selected"],
      checkpoint: {
        id: "gen-main",
        prompt: "Comment lire le bloc Effect.gen ?",
        options: [
          {
            id: "sequence",
            label: "Comme une suite d'étapes qui peuvent s'arrêter.",
            correct: true,
            feedback:
              "Oui. Le style ressemble à une procédure, mais l'erreur et les dépendances restent typées.",
          },
          {
            id: "callback",
            label: "Comme un callback lancé tout de suite.",
            correct: false,
            feedback:
              "Non. Le bloc décrit un effet. Il ne tourne pas tant qu'un runtime ne l'exécute pas.",
          },
        ],
      },
    },
    {
      id: "services",
      eyebrow: "yield* — charger les services",
      title: "Charger les services dont l'effet dépend",
      simple:
        "La première étape récupère les services nécessaires. Pour un lecteur Java, pense à une dépendance injectée par le runtime.",
      detail:
        "loadRecapServices() fournit RecapPrepareRuntime. Si cette étape échoue, la suite ne reçoit jamais services. Sinon la valeur est liée à const services.",
      detailCode: "const services = yield* loadRecapServices();\n// services arrive du runtime",
      diagramMode: "flow",
      selectedLineNumbers: [5],
      conceptRoles: ["requirements"],
      codeEntryLine: 5,
      checkpoint: {
        id: "services-main",
        prompt: "Que produit ce yield* ?",
        options: [
          {
            id: "services",
            label: "La valeur services, si l'étape réussit.",
            correct: true,
            feedback: "Oui. yield* déroule l'effet et donne sa valeur de succès.",
          },
          {
            id: "promise",
            label: "Une Promise à stocker pour plus tard.",
            correct: false,
            feedback: "Non. Ici, le modèle pédagogique est une valeur typée qui sort de l'étape.",
          },
        ],
      },
    },
    {
      id: "state",
      eyebrow: "stateManager — charger l'état",
      title: "Charger l'état avant de décider",
      simple:
        "La fonction charge l'état existant avant de détecter le contexte. Elle prépare les données, elle ne produit pas encore le recap.",
      detail:
        "services.stateManager.load() dépend des services déjà obtenus. Le diagramme montre que state vient après services: l'ordre est une partie du sens.",
      detailCode: "const state = yield* services.stateManager.load();\n// dépend de services",
      diagramMode: "flow",
      selectedLineNumbers: [6],
      conceptRoles: ["requirements", "success"],
      codeEntryLine: 6,
      checkpoint: {
        id: "state-main",
        prompt: "Pourquoi services arrive avant state ?",
        options: [
          {
            id: "dependency",
            label: "Parce que stateManager vient des services.",
            correct: true,
            feedback: "Oui. L'ordre explique la dépendance runtime.",
          },
          {
            id: "style",
            label: "Seulement pour ranger le code.",
            correct: false,
            feedback: "Non. L'ordre encode une vraie dépendance.",
          },
        ],
      },
    },
    {
      id: "error-branch",
      eyebrow: "Error — second canal de sortie",
      title: "Voir la branche d'erreur noAi + rebuildToday",
      simple:
        "Cette combinaison d'input est invalide. L'effet sort par le canal Error avec SessionError, donc execute ne devient pas disponible.",
      detail:
        "return yield* new SessionError(...) quitte le bloc Effect.gen via RecapPrepareError. Le chemin heureux reste visible, mais il est bypassé par cette entrée.",
      detailCode:
        'if (input.noAi && input.rebuildToday) {\n  return yield* new SessionError({ kind: "detection_failed" });\n}',
      diagramMode: "flow",
      selectedLineNumbers: [8, 9, 10, 11, 12],
      conceptRoles: ["error"],
      codeEntryLine: 9,
      checkpoint: {
        id: "error-main",
        prompt: "Que devient execute sur ce chemin ?",
        options: [
          {
            id: "never",
            label: "Il ne devient pas disponible.",
            correct: true,
            feedback: "Oui. La préparation échoue avant le return final.",
          },
          {
            id: "still",
            label: "Il existe mais renverra une erreur plus tard.",
            correct: false,
            feedback:
              "Non. Ici, l'erreur arrive pendant prepareRecapRun, avant la closure execute.",
          },
        ],
      },
    },
    {
      id: "context",
      eyebrow: "detectRunContext — décision préparée",
      title: "Détecter le contexte de run",
      simple:
        "Le contexte transforme l'input et l'état en données concrètes: runId, sessionId, mode et période à traiter.",
      detail:
        "detectRunContext lit state et les options d'input. Le résultat nourrit à la fois le bundle privé et le summary public.",
      detailCode: "const context = yield* detectRunContext(state, { ...input });",
      diagramMode: "flow",
      selectedLineNumbers: [15, 16, 17, 18, 19],
      conceptRoles: ["selected", "success"],
      codeEntryLine: 15,
      checkpoint: {
        id: "context-main",
        prompt: "À quoi sert context ?",
        options: [
          {
            id: "bridge",
            label: "À fabriquer les données concrètes du run préparé.",
            correct: true,
            feedback: "Oui. C'est le pont entre l'input brut et l'objet préparé.",
          },
          {
            id: "execute",
            label: "À lancer executePreparedRecapRun.",
            correct: false,
            feedback:
              "Non. executePreparedRecapRun n'est capturé que plus tard dans la closure execute.",
          },
        ],
      },
    },
    {
      id: "encapsulation",
      eyebrow: "bundle vs summary — frontière d'architecture",
      title: "Séparer l'interne privé et la donnée publique",
      simple:
        "bundle garde toute la machinerie interne. summary expose seulement ce que le caller peut utiliser sans connaître les détails.",
      detail:
        "RecapRunBundle capture input, state, context et services pour execute(). RecapRunSummary garde une surface stable pour CLI ou HTTP.",
      detailCode:
        "const bundle: RecapRunBundle = { input, state, context, services };\nconst summary: RecapRunSummary = { runId, sessionId, mode, ... };",
      diagramMode: "encapsulation",
      selectedLineNumbers: [22, 23, 24, 25, 26, 27, 28, 29, 30],
      conceptRoles: ["private", "public"],
      checkpoint: {
        id: "encapsulation-main",
        prompt: "Pourquoi garder bundle privé ?",
        options: [
          {
            id: "boundary",
            label: "Pour cacher l'état et les services au caller.",
            correct: true,
            feedback: "Oui. Le caller reçoit summary et execute, pas les détails internes.",
          },
          {
            id: "performance",
            label: "Pour accélérer TypeScript.",
            correct: false,
            feedback: "Non. Le point principal est la frontière d'architecture.",
          },
        ],
      },
    },
    {
      id: "execute",
      eyebrow: "execute — closure différée",
      title: "Armer execute sans lancer le recap",
      simple:
        "La fonction renvoie une closure execute. Elle capture bundle, mais elle ne tourne que si le caller l'appelle après une préparation réussie.",
      detail:
        "execute: () => executePreparedRecapRun(bundle) montre le pattern wrapper: prepareRecapRun prépare, executeRecapStructured peut appeler prepare puis déclencher execute.",
      detailCode: "execute: () => executePreparedRecapRun(bundle)\n// closure qui capture bundle",
      diagramMode: "execution",
      selectedLineNumbers: [32, 33, 34, 35, 36],
      conceptRoles: ["prepared", "execution"],
      checkpoint: {
        id: "execute-main",
        prompt: "Quand le recap réel démarre-t-il ?",
        options: [
          {
            id: "on-execute",
            label: "Quand execute() est appelé.",
            correct: true,
            feedback: "Oui. prepareRecapRun arme la suite, mais ne l'exécute pas.",
          },
          {
            id: "on-return",
            label: "Au moment du return.",
            correct: false,
            feedback:
              "Non. Le return contient une fonction prête à courir, pas le résultat du run.",
          },
        ],
      },
    },
  ],
};
