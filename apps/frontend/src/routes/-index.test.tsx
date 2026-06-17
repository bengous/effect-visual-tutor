import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";
import { HomePage } from "./index";

describe("HomePage", () => {
  test("renders the lesson experience as the first screen", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /Préparer une exécution avec Effect.gen/i }),
    ).toBeVisible();
    expect(screen.getByText("prepareRecapRun.ts")).toBeVisible();
    expect(screen.getByText("Diagramme du concept")).toBeVisible();
    expect(screen.queryByText("TanStack Router workspace")).not.toBeInTheDocument();
  });

  test("reveals detailed code and type explanation on demand", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Détail" }));

    expect(screen.getByText(/se lit comme un contrat/)).toBeVisible();
    expect(screen.getByText(/Success, Error, Requirements/)).toBeVisible();
  });

  test("shows the invalid input path and disables execute", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByLabelText("noAi"));
    fireEvent.click(screen.getByLabelText("rebuildToday"));
    fireEvent.click(screen.getByRole("button", { name: "Préparer" }));

    expect(screen.getByText(/Erreur typée/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Exécuter" })).toBeDisabled();
  });

  test("enables execute after a successful prepare action", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Préparer" }));
    expect(screen.getByRole("button", { name: "Exécuter" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Exécuter" }));
    expect(screen.getByText(/exécution déclenchée/)).toBeVisible();
  });

  test("announces simulation state changes through a polite status live region", () => {
    render(<HomePage />);

    const status = screen.getByRole("status", { name: "Statut de la simulation" });
    expect(status).toHaveTextContent(/Choisis une combinaison/);

    fireEvent.click(screen.getByRole("button", { name: "Préparer" }));
    expect(status).toHaveTextContent(/Préparation réussie/);

    fireEvent.click(screen.getByRole("button", { name: "Exécuter" }));
    expect(status).toHaveTextContent(/exécution déclenchée/);
  });

  test("navigates lesson steps with the arrow keys and Home/End from the step dots", () => {
    render(<HomePage />);

    const conceptHeading = () =>
      screen.getByRole("heading", {
        level: 2,
        name: /^Lire|^Charger|^Voir|^Détecter|^Séparer|^Armer/,
      });
    expect(conceptHeading()).toHaveAccessibleName("Lire la signature de l'effet");

    const firstDot = screen.getByRole("button", { name: /^Étape 01:/ });
    firstDot.focus();

    fireEvent.keyDown(firstDot, { key: "ArrowRight" });
    expect(conceptHeading()).toHaveAccessibleName("Lire Effect.gen comme une suite d'étapes");
    expect(screen.getByRole("button", { name: /^Étape 02:/ })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("button", { name: /^Étape 02:/ }), { key: "End" });
    expect(conceptHeading()).toHaveAccessibleName("Armer execute sans lancer le recap");

    fireEvent.keyDown(screen.getByRole("button", { name: /^Étape 08:/ }), { key: "Home" });
    expect(conceptHeading()).toHaveAccessibleName("Lire la signature de l'effet");
    expect(screen.getByRole("button", { name: /^Étape 01:/ })).toHaveFocus();
  });

  test("opens the typed error concept by clicking its yield* line in the code", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Explorer la ligne 9" }));

    expect(
      screen.getByRole("heading", { level: 2, name: /branche d'erreur noAi \+ rebuildToday/ }),
    ).toBeVisible();
  });
});
