import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";
import { HomePage } from "./index";

describe("HomePage", () => {
  test("renders the project title", () => {
    const expectedTitle = "effect-visual-tutor";

    render(<HomePage />);
    expect(screen.getByRole("heading", { name: expectedTitle })).toBeDefined();
  });
});
