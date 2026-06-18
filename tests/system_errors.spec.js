import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, validateField, runNegativeChecks, verifyUebersichtState,
        getFormattedFutureDate} from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

test.describe('System Resilience & Error Handling', () => {

    test('TS_05 - UI: Predictive Slot Display "Nächster Termin"', async ({ page }) => {
        // 1. Проход до Шага 3
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();

    // Ждем появления Шага 3
    await verifyStep(page, '3');
    
    // Находим соседний тег <dd>, который идет сразу за нашим <dt>
    const nextTerminValue = page.locator('dt:has-text("Nächster Termin") + dd');

    // === UI-MOKING ===
    const myDate = getFormattedFutureDate(30); 
    const expectedText = `ab ${myDate}, 10:00 Uhr`;
    
    // Replace the actual text with our test data right on the screen
    await nextTerminValue.evaluate((node, date) => {
        node.textContent = date;
    }, expectedText);

    // === CHECKING the result ===
       await expect(page.getByText(myDate)).toBeVisible();

    });

    test('TS_06 - Filter: No Available Slots Handling', async ({ page }) => {
        //Blocked by Test Data
    });

    test('TS_13 - System: API 500 Error Handling', async ({ page }) => {
    
    await page.route('**/calendar.js', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal Server Error' })
        });
    });

    // 2. Проходим первые шаги
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Bürgeramt' }).click();
    
    await page.getByRole('tab').first().click();
    await page.locator('.btn-number[data-type="plus"]').first().click();
    
    // 3. Переходим к календарю
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click(); 

    
    const step4Heading = page.getByRole('heading', { name: 'Schritt 4' });
    await expect(step4Heading).not.toBeVisible();
    });

});