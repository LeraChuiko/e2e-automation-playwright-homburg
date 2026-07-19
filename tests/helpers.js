import { expect } from "@playwright/test";
import { count } from "node:console";

export const getWeiterBtn = (page) => page.locator("#WeiterButton");
export const getPlusBtn = (page) =>
  page.locator('.ui-accordion-content-active .btn-number[data-type="plus"]');
export const getMinusBtn = (page) =>
  page.locator('.ui-accordion-content-active .btn-number[data-type="minus"]');
export const getCounterInput = (page) =>
  page.locator('.ui-accordion-content-active input[type="number"]');
export const getSubmitButton = (page) => page.locator("#chooseTerminButton");

const LOCATORS = {
  banner: "#banner",
  kontrastBtn: ".set_contrast_btn",
  spracheBtn: "#easyLanguage",
  langSelectBtn: 'button[aria-label="Sprache wählen"]',
};

// export async function setupPage(page) {
//   await page.goto("https://termine-reservieren.de/termine/homburg/");
//   await page.getByRole("button", { name: "Akzeptieren" }).click();
// }

export async function setupPage(page) {
  await page.goto("https://termine-reservieren.de/termine/homburg/", {
    waitUntil: "domcontentloaded",
    timeout: 15000 
  });
  await page.getByRole("button", { name: "Akzeptieren" }).click();
}

export async function step_1_SelectDepartment(page, serviceName) {
  await page.getByRole("button", { name: serviceName }).click();
}

/**
 * @param {'first' | 'last'} position //element's position
 */
export async function step2_SelectAnliegen(page, position = "first") {
  const tabs = page.getByRole("tab");
  const plusButtons = page.locator('.btn-number[data-type="plus"]');

  const targetTab = position === "first" ? tabs.first() : tabs.last();
  const targetPlus =
    position === "first" ? plusButtons.first() : plusButtons.last();

  await targetTab.click();
  await targetPlus.click();
}

export async function closeHinweis(page) {
  await expect(page.getByRole("heading", { name: "Hinweis" })).toBeVisible();
  await page.locator("#OKButton").click();
}

export async function ensureWeiterButtonState(page, isEnabled = true) {
  const weiterBtn = page.locator("#WeiterButton");

  if (isEnabled) {
    await expect(weiterBtn).toBeEnabled();
  } else {
    await expect(weiterBtn).toBeDisabled();
  }
}

/**
 * @param {'first' | 'last'} position
 */
export async function checkInputValue(page, inputValue, position = "first") {
  const inputLocator = getCounterInput(page);
  const targetElement =
    position === "first" ? inputLocator.first() : inputLocator.last();
  await expect(targetElement).toHaveValue(inputValue);
}

export async function step3_SelectLocation(page) {
  await page.getByRole("button", { name: "Karte anzeigen" }).click();
  await expect(page.locator(".leaflet-container")).toBeVisible({
    timeout: 15000,
  });
  await page
    .getByRole("button", { name: "" })
    .filter({ has: page.locator(".svg-icon-path") })
    .first()
    .click();
  await page.getByRole("button", { name: "Standort auswählen" }).click();
}

export async function step4_SelectDate(page) {
  const firstAvailableSlot = page
    .locator(".suggest_btn:not([disabled])")
    .first();
  const noSlotsMessage = page.getByText("Kein freier Termin verfügbar");
  await firstAvailableSlot.waitFor({ state: "visible" });

  if (await firstAvailableSlot.count()) {
    await firstAvailableSlot.click();
    await expect(page.getByRole("heading", { name: "Hinweis" })).toBeVisible();
    await page.getByRole("button", { name: "Ja" }).click();
  } else if (await noSlotsMessage.isVisible()) {
    console.log("Kein freier Termin verfügbar");
    test.skip(true, "Skipped");
  }
}

export async function step_5_FillForm(page, data) {
  const terminButton = getSubmitButton(page);
  await page.getByTitle("Vorname").fill(data.vorname);
  await page.getByTitle("Nachname").fill(data.nachname);
  await page.locator("#email").fill(data.email);
  await page.locator("#emailwhlg").fill(data.email);
  await page.locator("#geburtsdatumYear").fill(data.year);

  if (data.plz) {
    await page.locator("#plz").fill(data.plz);
    await page.locator("#wohnort").fill(data.wohnort);
  }

  await page.getByText("Ich willige ein").click();
}

export async function verifyStep(page, stepNumber) {
  const heading = `Schritt ${stepNumber}`;

  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
}

export async function clickWeiter(page) {
  await page.getByRole("button", { name: "Weiter" }).click();
}

export async function runNegativeChecks(page) {
  await test.step("Validate all fields from JSON", async () => {
    for (const field of testData.invalidFields) {
      await validateField(page, field);
    }
  });

  await test.step("Security Check: XSS Injection", async () => {
    const vornameInput = page.locator("#vorname");
    await vornameInput.fill('<script>alert("xss")</script>');
    await page.keyboard.press("Tab");
    await expect(vornameInput).toHaveClass(/wrongvalidate/);
  });

  await test.step("Verify Submit button is disabled", async () => {
    await expect(getSubmitButton(page)).toBeDisabled();
  });
}

/**
 * @param {boolean} shouldBeEnabled - true (active), false (desabled)
 */
export async function verifyReservierenButton(page, shouldBeEnabled) {
  const terminButton = getSubmitButton(page);
  if (shouldBeEnabled) {
    await expect(terminButton).toBeEnabled();
  } else {
    await expect(terminButton).toBeDisabled();
  }
}

export async function verifyLogo(page) {
  const banner = page.locator(LOCATORS.banner);
  await expect(banner).toBeVisible();
  await expect(banner).toHaveCSS("background-image", /url/);
}

export async function verifyKontrastBtnAn(page) {
  const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
  await expect(kontrastBtn).toBeVisible();
  await expect(kontrastBtn).toHaveAttribute("aria-label", "Kontrast an");
}

export async function verifyKontrastBtnAus(page) {
  const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
  await kontrastBtn.click();
  await expect(kontrastBtn).toHaveAttribute("aria-label", "Kontrast aus");
}
export async function verifySprachBtnAn(page) {
  const spracheBtn = page.locator(LOCATORS.spracheBtn);
  const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
  await expect(spracheBtn).toBeVisible();
  await expect(spracheBtn).toHaveAttribute("aria-label", "Einfache Sprache an");
  await kontrastBtn.click();
}
export async function verifySprachBtnAus(page) {
  const spracheBtn = page.locator(LOCATORS.spracheBtn);
  const langSelectBtn = page.locator(LOCATORS.langSelectBtn);
  await spracheBtn.click();
  await expect(spracheBtn).toHaveAttribute(
    "aria-label",
    "Einfache Sprache aus",
  );
  await expect(langSelectBtn).toBeVisible();
  await spracheBtn.click();
}

export async function verifyFooterLinksFunctional(page) {
  const footerLinks = [
    { id: "#footer_link_help", modalId: "#modal_help" },
    { id: "#footer_link_imprint", modalId: "#modal_imprint" },
    { id: "#footer_link_privacy", modalId: "#modal_privacy" },
    { id: "#footer_link_accessibility", modalId: "#modal_accessibility" },
    { id: "#footer_link_licenses", modalId: "#modal_licenses" },
  ];

  for (const entry of footerLinks) {
    await page.locator(entry.id).click();
    await expect(page.locator("#footer_dialog")).toHaveClass(/in/);
    await expect(page.locator(entry.modalId)).toBeVisible();
    await page.locator("#close_btn").click();
    await expect(page.locator("#footer_dialog")).not.toHaveClass(/in/);
  }
}

export async function verifyFooterLinksVisible(page) {
  const footerLinks = [
    "#footer_link_help",
    "#footer_link_imprint",
    "#footer_link_privacy",
    "#footer_link_accessibility",
    "#footer_link_licenses",
  ];

  for (const entry of footerLinks) {
    await expect(page.locator(entry)).toBeVisible();
  }
}

/**
 * @param {number} activeStepIndex
 */
export async function verifyStepIndicator(page, activeStepIndex) {
  const steps = page.locator('ul.nav-tabs li[role="presentation"]');
  const count = await steps.count();

  for (let i = 0; i < count; i++) {
    const step = steps.nth(i);

    if (i === activeStepIndex - 1) {
      await expect(step).toHaveClass(/active/);
    } else if (i < activeStepIndex - 1) {
      await expect(step).toHaveClass(/done/);
    } else {
      await expect(step).toHaveClass(/disabled/);
    }
  }
}

/**
 * @param {number} currentStep
 */
export async function verifyUebersichtData(page, stepNumber) {
  const rows = page.locator("dl.grid dt");

  const rowsToCheck = stepNumber - 1;

  for (let i = 0; i < rowsToCheck; i++) {
    const dd = rows.nth(i).locator("+ dd");

    await expect(dd).not.toContainText("noch nicht gesetzt");
  }
}

/**
 * @param {page} page
 * @param {Array<boolean>} expectedStates
 */
export async function verifyUebersichtState(page, expectedStates) {
  const rows = page.locator("dl.grid dt");

  for (let i = 0; i < expectedStates.length; i++) {
    const dd = rows.nth(i).locator("+ dd");

    if (expectedStates[i] === true) {
      await expect(dd).not.toContainText("noch nicht gesetzt");
    } else {
      await expect(dd).toContainText("noch nicht gesetzt");
    }
  }
}

export function getFormattedFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  // Saturday(6) Sunday (0) — shift to friday
  if (date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  } else if (date.getDay() === 0) {
    date.setDate(date.getDate() - 2);
  }

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function validateField(
  page,
  fieldId,
  value,
  expectedError,
  errorIndex,
) {
  const input = page.locator(fieldId);
  const errorMsg = page.locator(".error-text").nth(errorIndex);

  await input.fill(value);
  await input.press("Tab");
  await expect(errorMsg).toHaveText(expectedError ?? "");
}
