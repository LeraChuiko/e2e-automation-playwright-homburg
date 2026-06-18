import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, validateField, runNegativeChecks, verifyUebersichtState,
        getFormattedFutureDate } from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

test.describe('Security & Validation', () => {

    test('TS_07 - Security: Deep Linking Protection', async ({ page }) => {
        await page.goto('https://termine-reservieren.de/termine/homburg/suggest?suggest&mdt=0&cnc-229=4');
        await expect(page.getByText('Fehlermeldung: Kein gültiger Standort gefunden.')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Schritt 4' })).toBeHidden();
    });
    
    test('Проход по шагам 1-4 и валидация всех полей', async ({ page }) => {

        await setupPage(page);
        await step_1_SelectDepartment(page, 'Fahrerlaubnis');
        await step2_SelectAnliegen(page, 'last');
        await clickWeiter(page);
        await closeHinweis(page);
        await step3_SelectLocation(page);
        await step4_SelectDate(page);

        // --- Vorname Validation ---
        for (const item of testData.positiveTests.vorname) {
            await test.step(`Positive Vorname: ${item.val}`, async () => {
                await validateField(page, '#vorname', item.val, null,0);
            });
        }
        for (const item of testData.negativeTests.vorname) {
            await test.step(`Negative Vorname: ${item.val}`, async () => {
                await validateField(page, '#vorname', item.val, testData.errorMessages.vorname,0);
            });
        }
         
        // ---  Nachname Validation ---
        for (const item of testData.positiveTests.nachname) {
            await test.step(`Positive Nachname: ${item.val}`, async () => {
                await validateField(page, '#nachname', item.val, null,1);
            });
        }
        for (const item of testData.negativeTests.nachname) {
            await test.step(`Negative Nachname: ${item.val}`, async () => {
                await validateField(page, '#nachname', item.val, testData.errorMessages.nachname,1);
            });
        }

        // ---  E-mail Validation ---
        for (const item of testData.negativeTests.email) {
            await test.step(`Negative Email: ${item.val}`, async () => {
                await validateField(page, '#email', item.val, testData.errorMessages.email,2);
            });
        }

        // ---  E-Mail - Wiederholung  Validation ---
        for (const item of testData.negativeTests.emailwhlg) {
            await test.step(`Negative Email-Wiederholung: ${item.val}`, async () => {
                await validateField(page, '#emailwhlg', item.val, testData.errorMessages.emailwhlg,3);
            });
        }

        // ---  Jahr Validation ---
        for (const item of testData.positiveTests.year) {
            await test.step(`Positive year: ${item.val}`, async () => {
                await validateField(page, '#geburtsdatumYear', item.val, null,5);
            });
        }
        for (const item of testData.negativeTests.year) {
            await test.step(`Negative year: ${item.val}`, async () => {
                await validateField(page, '#geburtsdatumYear', item.val, testData.errorMessages.year,5);
            });
        }

        // ---  PLZ Validation ---
        for (const item of testData.positiveTests.plz) {
            await test.step(`Positive PLZ: ${item.val}`, async () => {
                await validateField(page, '#plz', item.val, null,8);
            });
        }
        for (const item of testData.negativeTests.plz) {
            await test.step(`Negative PLZ: ${item.val}`, async () => {
                await validateField(page, '#plz', item.val, testData.errorMessages.plz,8);
            });
        }

        // ---  Wohnort Validation ---
        for (const item of testData.positiveTests.wohnort) {
            await test.step(`Positive wohnort: ${item.val}`, async () => {
                await validateField(page, '#wohnort', item.val, null,9);
            });
        }
        for (const item of testData.negativeTests.wohnort) {
            await test.step(`Negative wohnort: ${item.val}`, async () => {
                await validateField(page, '#wohnort', item.val, testData.errorMessages.wohnort,9);
            });
        }

        // ---  Should show error when emails do not match ---
        
        await page.fill('#email', 'test@test.de');
        await page.fill('#emailwhlg', 'wrong@test.de');
        await page.press('#emailwhlg', 'Tab'); 
  
        const errorMsg = page.locator('.error-text').nth(3);
        await expect(errorMsg).toHaveText('Die Mailadressen stimmen nicht überein.');    
    });

});

