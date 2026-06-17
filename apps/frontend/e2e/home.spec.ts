import { expect, test } from "@playwright/test";

test("loads the prepareRecapRun lesson directly", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Préparer une exécution avec Effect.gen/ }),
  ).toBeVisible();
  await expect(page.getByText("prepareRecapRun.ts")).toBeVisible();
  await expect(page.getByText("Diagramme du concept")).toBeVisible();
  await expect(page.getByText("TanStack Router workspace")).toHaveCount(0);
});

test("shows invalid input branch and prepares successful execution", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("checkbox", { name: "noAi" }).check();
  await page.getByRole("checkbox", { name: "rebuildToday" }).check();
  await page.getByRole("button", { name: "Préparer" }).click();

  await expect(page.getByText(/Erreur typée/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Exécuter" })).toBeDisabled();

  await page.getByRole("checkbox", { name: "rebuildToday" }).uncheck();
  await page.getByRole("button", { name: "Préparer" }).click();
  await expect(page.getByRole("button", { name: "Exécuter" })).toBeEnabled();
});

test("shows the focus ring on active controls during keyboard navigation", async ({ page }) => {
  await page.goto("/");

  // The active disclosure segment carries its own box-shadow (--shadow-1),
  // which must not swallow the mandatory keyboard focus ring. :focus-visible
  // only engages for real keyboard focus, so drive it from the keyboard.
  const activeSegment = page.getByRole("button", { name: "Simple" });
  await expect(activeSegment).toHaveAttribute("aria-pressed", "true");

  // Tab through the header controls until the active segment holds focus.
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  for (
    let i = 0;
    i < 40 && !(await activeSegment.evaluate((el) => el === document.activeElement));
    i++
  ) {
    await page.keyboard.press("Tab");
  }
  await expect(activeSegment).toBeFocused();

  // The dual-ring from the design system renders as two 2px / 4px spread layers.
  // Poll past the box-shadow transition to read the settled ring value.
  await expect
    .poll(() => activeSegment.evaluate((element) => getComputedStyle(element).boxShadow))
    .toContain("0px 0px 0px 2px");
  const focusedShadow = await activeSegment.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  expect(focusedShadow).toContain("0px 0px 0px 4px");
});

test("keeps detail content available with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("button", { name: "Détail" }).click();

  await expect(page.getByText(/se lit comme un contrat/)).toBeVisible();
  const transitionDuration = await page
    .locator(".detail-reveal")
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(["0.01ms", "1e-05s"]).toContain(transitionDuration);
});
