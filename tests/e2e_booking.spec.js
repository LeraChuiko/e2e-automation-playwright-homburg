import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, validateField, runNegativeChecks, verifyUebersichtState} from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

test.describe('E2E Booking Flows', () => {

    test('TS_01_A - E2E Flow: Bürgeramt', async ({ page }) => {
        await setupPage(page);
        await verifyStep(page, '1');

        await step_1_SelectDepartment(page,'Bürgeramt' )
        await verifyStep(page, '2');

        await step2_SelectAnliegen(page);
        await checkInputValue(page,'1');
        await ensureWeiterButtonState(page, true )
        await clickWeiter(page);
        await closeHinweis(page);
        await verifyStep(page, '3');
        
        await step3_SelectLocation(page);
        await verifyStep(page, '4');

        await step4_SelectDate(page);
        await verifyStep(page, '5');

        await step_5_FillForm(page, testData.happyPath_1);
        await verifyReservierenButton(page, true);

    });

    test('TS_01_B - E2E Flow: Fahrerlaubnis', async ({ page }) => {
        await setupPage(page);
        await verifyStep(page, '1');
        
        await step_1_SelectDepartment(page,'Fahrerlaubnis' )
        await verifyStep(page, '2');
        
        await step2_SelectAnliegen(page,'last');
        await checkInputValue(page,'1','last');
        await ensureWeiterButtonState(page, true )
        await clickWeiter(page);
        await closeHinweis(page);
        await verifyStep(page, '3');

        await step3_SelectLocation(page);
        await verifyStep(page, '4');

        await step4_SelectDate(page);
        await verifyStep(page, '5');

        await step_5_FillForm(page, testData.happyPath_2);
        await verifyReservierenButton(page, true);
    });

    test('TS_04 - Navigation: Backward & Cache Stability', async ({ page }) => {
        //1. Navigate to Step 5
        await step_1_SelectDepartment(page, 'Bürgeramt');
        await step2_SelectAnliegen(page);
        await clickWeiter(page);
        await closeHinweis(page);
        await step3_SelectLocation(page);
        await step4_SelectDate(page);
        await verifyStepIndicator(page, 5);
        await verifyUebersichtData(page, 5);
        await verifyUebersichtState(page, [true, true, true, true]);

        // 2. Navigate back to Step 4
        await page.locator('#zurueck').first().click();
        await verifyStepIndicator(page, 4);
        await verifyUebersichtState(page, [true, true, true, true]);
        
        
        // 3. Navigate back to Step 3
        await page.locator('#zurueck').first().click();
        await verifyStepIndicator(page, 3);
        await verifyUebersichtState(page, [true, true, false, true]);

        // 4. Navigate back to Step 2
        await page.locator('#zurueck').first().click();
        await verifyStepIndicator(page, 2);
        await verifyUebersichtState(page, [true, false, false, false]);

        // 5. Navigate back to Step 1
        await page.locator('#zurueck').first().click();
        await verifyStepIndicator(page, 1);
    });
});