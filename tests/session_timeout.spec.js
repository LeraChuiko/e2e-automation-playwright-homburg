import { test, expect } from "@playwright/test";
import {
  setupPage,
  verifyStep,
  step_1_SelectDepartment,
  step2_SelectAnliegen,
  clickWeiter,
  closeHinweis,
  ensureWeiterButtonState,
  checkInputValue,
  step3_SelectLocation,
  step4_SelectDate,
  step_5_FillForm,
  verifyReservierenButton,
  verifyLogo,
  verifyKontrastBtnAn,
  verifyKontrastBtnAus,
  verifySprachBtnAn,
  verifySprachBtnAus,
  verifyFooterLinksFunctional,
  verifyFooterLinksVisible,
  verifyStepIndicator,
  verifyUebersichtData,
  validateField,
  runNegativeChecks,
  verifyUebersichtState,
  getFormattedFutureDate,
} from "./helpers.js";
import testData from "./testData.json" assert { type: "json" };

test.describe("Session & Timeout Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install();
  });

  test("TS_09 - Session: Warning & Extension", async ({ page }) => {
    await page.clock.install();

    await setupPage(page);
    await step_1_SelectDepartment(page, "Bürgeramt");
    await step2_SelectAnliegen(page);
    await checkInputValue(page, "1");
    await ensureWeiterButtonState(page, true);
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);
    await verifyStep(page, 5);
    const firstNameInput = page
      .locator('input[name="vorname"], #vorname, input[type="text"]')
      .first();
    await firstNameInput.fill("Anna");
    await page.clock.fastForward(1380000);
    const bottomTimer = page.locator(
      "text=Ihre Sitzung läuft aus in 1 Minuten",
    );
    await expect(bottomTimer).toBeVisible();
    const closeWarningButton = page
      .getByRole("dialog", { name: "Infofenster: Warnung" })
      .getByRole("button", { name: "Schliessen", exact: true });

    await expect(closeWarningButton).toBeVisible();
    await closeWarningButton.click();
    await expect(closeWarningButton).toBeHidden();
    await page.clock.fastForward(60000);
    await expect(bottomTimer).toBeHidden();

    const renewedTimer = page.locator(
      "text=Ihre Sitzung läuft aus in 24 Minuten",
    );
    await expect(renewedTimer).toBeVisible();
    await expect(firstNameInput).toHaveValue("Anna");
  });

  test("TS_10 - Session: Timeout Expiration", async ({ page }) => {
    await page.clock.install();

    await setupPage(page);
    await step_1_SelectDepartment(page, "Bürgeramt");
    await step2_SelectAnliegen(page);
    await checkInputValue(page, "1");
    await ensureWeiterButtonState(page, true);
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);
    await verifyStep(page, 5);
    const firstNameInput = page
      .locator('input[name="vorname"], #vorname, input[type="text"]')
      .first();
    await firstNameInput.fill("Anna");
    await page.clock.fastForward(1380000);
    const bottomTimer = page.locator(
      "text=Ihre Sitzung läuft aus in 1 Minuten",
    );
    await expect(bottomTimer).toBeVisible();
    await page.clock.fastForward(61500);
    await expect(page).toHaveURL(
      "https://termine-reservieren.de/termine/homburg/?rs",
    );
    await verifyStep(page, 1);

    const stepOneButton = page.getByRole("button", { name: "Fahrerlaubnis" });
    await expect(stepOneButton).toBeVisible();
  });
});
