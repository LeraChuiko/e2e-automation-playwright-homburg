import { test, expect } from '@playwright/test';
import { setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, getWeiterBtn, getPlusBtn, getMinusBtn, getCounterInput,
        getSubmitButton, validateField, runNegativeChecks} from '../tests/helpers.js';
import testData from '../tests/testData.json' assert { type: 'json' };

test.describe('TS_08 - Bürgeramt - Security & Form Validation', () => {

    test.beforeEach(async ({ page }) => {
            await setupPage(page);
            await step_1_SelectDepartment(page, 'Bürgeramt');
            await step2_SelectAnliegen(page);
            await clickWeiter(page);
            await closeHinweis(page);
            await step3_SelectLocation(page);
            await step4_SelectDate(page);
        });
   
    test('Happy Path Bürgeramt: Basic user', async ({ page }) => {
        const data = testData.happyPath_1;
        await page.fill('#vorname', data.vorname);
        await page.fill('#nachname', data.nachname);
        await page.fill('#email', data.email);
        await page.fill('#emailwhlg', data.email); // Добавили
        await page.fill('#geburtsdatumYear', data.year);
        await page.getByText('Ich willige ein').click();
            
        await expect(getSubmitButton(page)).toBeEnabled();
        });

    test('Bürgeramt: Validation Check', async ({ page }) => {
        
        for (const field of testData.invalidFields) {
        // Передаем оба аргумента:
        await validateField(page, field); 
    }
        });
    });

test.describe('TS_08 - Fahrerlaubnis - Security & Form Validation', () => {
    
    test.beforeEach(async ({ page }) => {
        await setupPage(page);
        await step_1_SelectDepartment(page,'Fahrerlaubnis' )
        await step2_SelectAnliegen(page,'last');
        await checkInputValue(page,'1','last');
        await ensureWeiterButtonState(page, true )
        await clickWeiter(page);
        await closeHinweis(page);
        await step3_SelectLocation(page);
        await step4_SelectDate(page);
    });

    
    test('Happy Path Fahrerlaubnis: Full user (with Address)', async ({ page }) => {
        const data = testData.happyPath_2;
        await page.fill('#vorname', data.vorname);
        await page.fill('#nachname', data.nachname);
        await page.fill('#email', data.email);
        await page.fill('#emailwhlg', data.email); // Добавили
        await page.fill('#geburtsdatumYear', data.year);
        await page.fill('#plz', data.plz);
        await page.fill('#wohnort', data.wohnort);
        await page.getByText('Ich willige ein').click();
        
        await expect(getSubmitButton(page)).toBeEnabled();
    });
    test('Fahrerlaubnis: Validation Check', async ({ page }) => {
        for (const field of testData.invalidFields) {
        // Передаем оба аргумента:
        await validateField(page, field); 
    }
    });
});


