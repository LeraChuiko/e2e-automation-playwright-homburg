import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, validateField, runNegativeChecks, verifyUebersichtState, getFormattedFutureDate} from '../tests/helpers.js';
import testData from '../tests/testData.json' assert { type: 'json' };

test('TS_03 - UI: Filter Interactivity', async ({ page }) => {
    
    await setupPage(page);
    await step_1_SelectDepartment(page, 'Fahrerlaubnis');
    await step2_SelectAnliegen(page, 'last');
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await verifyStep(page, '4');

    // 4 step with filter
    await page.getByText('Vorschläge filtern').click();
    await expect (page.getByText('Zeitraum')).toBeVisible();

    
    const formatedFutureDate=getFormattedFutureDate(21);
    await expect(page.locator('input[name="filter_date_to"]')).toHaveValue(formatedFutureDate);
    
    // --- Filter Application ---
    await page.locator('#suggest_filter_timespan summary').click();
    await page.locator('label[for^="filter_timespan-"]').first().check();
    await page.locator('#suggest_filter_weekday summary').click();
    await page.locator('label[for^="filter_day-"]').first().check();
    await page.getByRole('button', {name:'Filtern'}).click();
    
    // --------------------------

    // Define filter result locators
    const firstAvailableSlot = page.locator('.suggest_btn:not([disabled])').first();
    const noSlotsMessage = page.getByText('Kein freier Termin verfügbar');
    if (await firstAvailableSlot.isVisible()) {
        await firstAvailableSlot.click();
        await expect(page.getByRole('heading', {name:'Hinweis'})).toBeVisible();
        await page.getByRole('button', {name:'Ja'}).click();
        await verifyStep(page, '5');
    } else {
        await verifyStep(page, '4');
    }
});