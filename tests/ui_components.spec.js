import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, getWeiterBtn, getPlusBtn, getMinusBtn, getCounterInput,
        getSubmitButton, validateField, runNegativeChecks, getFormattedFutureDate} from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

test.describe('UI Components & Consistency', () => {
    test('TS_02 - UI: Service Counter Limits', async ({ page }) => {
        await setupPage(page);
        await step_1_SelectDepartment(page,'Fahrerlaubnis' )
        
        const weiterBtn = getWeiterBtn(page);
        await expect(weiterBtn).toBeDisabled();

        //0 → 1
        await step2_SelectAnliegen(page,'last');
        await expect(weiterBtn).toBeEnabled();

        //1 → 0
        const minusBtn = getMinusBtn(page); 
        await minusBtn.last().click()
        await expect(weiterBtn).toBeDisabled();

        //0 → 4
        const plusBtn = getPlusBtn(page);   
        for (let i=0; i<4; i++){
            await plusBtn.last().click();
        }
        
        const input=getCounterInput(page);
        await expect (input.last()).toHaveValue('4');
        
        // Enabled plus buttons count = 0 
        await expect(plusBtn).toBeDisabled();


        // Disabled minus buttons count = 0 
        const disabledMinusButtons = minusBtn.filter({ hasNot: page.locator(':disabled') });
        await expect(disabledMinusButtons).toHaveCount(1);
        await expect(weiterBtn).toBeEnabled();

        //4 → 3
        await minusBtn.last().click();
        await expect(input.last()).toHaveValue('3');
        
        //Check every button state 
        const plusButtons = getPlusBtn(page);
        await expect(plusButtons).toBeEnabled();

        //a second option for studying
        const buttonsCount = await plusButtons.count();
        for (let i = 0; i < buttonsCount; i++) {
            await expect(plusButtons.nth(i)).toBeEnabled();
        }
        await expect(weiterBtn).toBeEnabled();

        await expect(plusButtons).toBeEnabled();
    });

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

    test('TS_14 - UI: Global Header & Overview Consistency', async ({ page }) => {
        await setupPage(page);
        await verifyLogo(page);
        await verifyKontrastBtnAn(page);
        await verifyKontrastBtnAus(page);
        await verifySprachBtnAn(page);
        await verifySprachBtnAus(page);
        await verifyFooterLinksFunctional (page);

        
        await step_1_SelectDepartment(page,'Bürgeramt');
        await verifyLogo(page);
        await verifyKontrastBtnAn(page);
        await verifySprachBtnAus(page);
        await verifyFooterLinksVisible(page)

    });

    test('TS_15 - UI: Dynamic Übersicht & Step Indicator', async ({ page }) => {
        await setupPage(page);
        await verifyStepIndicator(page,1);

        await step_1_SelectDepartment(page,'Bürgeramt');
        await verifyStepIndicator(page,2);
        await verifyUebersichtData (page,2)

        await step2_SelectAnliegen(page);
        await clickWeiter(page);
        await closeHinweis(page);
        await verifyStepIndicator(page,3);
        await verifyUebersichtData (page,3)

        await step3_SelectLocation(page);
        await verifyStepIndicator(page,4);
        await verifyUebersichtData (page,4)

        await step4_SelectDate(page);
        await verifyStep(page, 5);
        await verifyStepIndicator(page,5);


    });
});