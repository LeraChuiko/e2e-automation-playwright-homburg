import { test, expect } from '@playwright/test';
import { setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData} from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

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