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
