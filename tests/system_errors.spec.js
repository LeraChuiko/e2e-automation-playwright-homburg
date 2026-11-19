import { test, expect } from '@playwright/test';
import {
  setupPage,
  step_1_SelectDepartment,
  step2_SelectAnliegen,
  clickWeiter,
  closeHinweis,
  step3_SelectLocation,
} from './helpers.js';

test.describe('System Resilience & Error Handling', () => {
  test('TS_06 - Filter: No Available Slots Handling', async ({ page }) => {
    test.fixme(true, 'Blocked: Slot availability depends on live test data');
  });

  test.fail('TS_13 - System: API 500 Error Handling', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Bürgeramt');
    await step2_SelectAnliegen(page);
    await clickWeiter(page);
    await closeHinweis(page);

    await page.route('**/*', async (route) => {
      if (route.request().method() === 'POST' && route.request().url().includes('homburg')) {
        await route.fulfill({
          status: 500,
          contentType: 'text/html',
          body: '',
        });
      } else {
        await route.continue();
      }
    });

    await step3_SelectLocation(page);

    const step4Heading = page.getByRole('heading', { name: 'Schritt 4' });
    await expect(step4Heading).not.toBeVisible();

    const calendarTable = page.locator('#sugg_accordion');
    await expect(calendarTable).not.toBeVisible();

    const errorText = page.getByText(/Fehler/i);
    await expect(errorText).toBeVisible({ timeout: 5000 });
  });
});
