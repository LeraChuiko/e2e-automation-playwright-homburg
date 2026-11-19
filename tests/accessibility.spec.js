import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  setupPage,
  step_1_SelectDepartment,
  step2_SelectAnliegen,
  clickWeiter,
  closeHinweis,
  step3_SelectLocation,
  step4_SelectDate,
} from './helpers.js';

const verifyAccessibility = async (page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
};

test.describe('Accessibility Audits (WCAG 2.1 / BITV 2.0)', () => {
  test.fail('TS_19_1 - Accessibility: Step 1 (Department Selection)', async ({ page }) => {
    await setupPage(page);
    await verifyAccessibility(page);
  });

  test.fail('TS_19_2 - Accessibility: Step 2 (Service Selection)', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await verifyAccessibility(page);
  });

  test.fail('TS_19_3 - Accessibility: Hinweis Modal', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await step2_SelectAnliegen(page);
    await clickWeiter(page);
    await verifyAccessibility(page);
  });

  test.fail('TS_19_4 - Accessibility: Step 3 (Location Selection)', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await step2_SelectAnliegen(page);
    await clickWeiter(page);
    await closeHinweis(page);
    await verifyAccessibility(page);
  });

  test.fail('TS_19_5 - Accessibility: Step 4 (Date & Time Calendar)', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await step2_SelectAnliegen(page);
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await verifyAccessibility(page);
  });

  test('TS_19_6 - Accessibility: Step 5 (Personal Data Form)', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await step2_SelectAnliegen(page);
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);
    await verifyAccessibility(page);
  });
});
