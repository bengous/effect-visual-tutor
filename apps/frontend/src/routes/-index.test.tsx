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
});
