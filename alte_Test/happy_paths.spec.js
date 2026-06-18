import { test, expect } from '@playwright/test';
import { verifyStep } from '../tests/helpers';

test('TS_01_A - E2E Flow: Bürgeramt', async ({ page }) => {
    await page.goto('https://termine-reservieren.de/termine/homburg/');

    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await verifyStep(page, '1');

    await page.getByRole('button', { name: 'Bürgeramt' }).click();
    await verifyStep(page, '2');
    
    await page.getByRole('tab').first().click();
    //await page.getByRole('button', {name:'Erhöhen der Anzahl des Anliegens Beantragung Personalausweis'}).click()
    //await expect(page.locator('.btn-number[data-type ="minus"]')).toBeEnabled();
    await page.locator('.btn-number[data-type="plus"]').first().click();
    await expect(page.locator('.ui-accordion-content-active input[type="number"]').first()).toHaveValue('1');
    await expect(page.getByRole('button', { name: 'Weiter' })).toHaveAttribute('aria-disabled', 'false');
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(page.getByRole('heading', {name:'Hinweis'})).toBeVisible();
    
    const okButton = page.locator('#OKButton');
    await expect(okButton).toBeVisible(); // Убедились, что окно вылезло в случае модального окна
    await okButton.click();
    await verifyStep(page, '3');
    
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button',{name:''}).filter({has:page.locator('.svg-icon-path')}).first().click();
    await page.getByRole('button', {name:'Standort auswählen'}).click();
    await verifyStep(page, '4');

    await page.locator('#sugg_accordion .suggest_btn:not([disabled])').first().click();
    await expect (page.getByRole('heading', {name:'Hinweis' })).toBeVisible();

    await page.getByRole('button', {name:'Ja'}).click();
    await verifyStep(page, '5');

    await page.getByTitle('Vorname').fill('Vorname');
    await page.getByTitle('Nachname').fill('nachname');
    await page.locator('#email').fill('orname@mail.com');
    await page.locator('#emailwhlg').fill('orname@mail.com');
    await page.locator('#geburtsdatumYear').fill('2001');
    //await page.locator('input[name="agreementChecked"]').check();
    await page.getByText('Ich willige ein').click();
    await expect(page.locator('#chooseTerminButton')).toHaveAttribute('aria-disabled', 'false');

})

test('TS_01_B - E2E Flow: Fahrerlaubnis', async ({ page }) => {
    await page.goto('https://termine-reservieren.de/termine/homburg/');

    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await verifyStep(page, '1');

    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    await verifyStep(page, '2');
    
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    await expect(page.locator('.ui-accordion-content-active input[type="number"]').first()).toHaveValue('1');
    
    const weiterBtn = page.locator('#WeiterButton');
    await expect(weiterBtn).toBeEnabled();
    
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(page.getByRole('heading', {name:'Hinweis'})).toBeVisible();
    
    const okButton = page.locator('#OKButton');
    await expect(okButton).toBeVisible(); // Убедились, что окно вылезло в случае модального окна
    await okButton.click();
    await verifyStep(page, '3');
    
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button',{name:''}).filter({has:page.locator('.svg-icon-path')}).first().click();
    await page.getByRole('button', {name:'Standort auswählen'}).click();
    await verifyStep(page, '4');

    await page.locator('#sugg_accordion .suggest_btn:not([disabled])').first().click();
    await expect (page.getByRole('heading', {name:'Hinweis' })).toBeVisible();

    await page.getByRole('button', {name:'Ja'}).click();
    await verifyStep(page, '5');

    await page.getByTitle('Vorname').fill('Vorname');
    await page.getByTitle('Nachname').fill('nachname');
    await page.locator('#email').fill('orname@mail.com');
    await page.locator('#emailwhlg').fill('orname@mail.com');
    await page.locator('#geburtsdatumYear').fill('2001');
    await page.locator('#plz').fill('66322');
    await page.locator('#wohnort').fill('Ort');

    await page.getByText('Ich willige ein').click();
    await expect(page.locator('#chooseTerminButton')).toHaveAttribute('aria-disabled', 'false');

});

test('TS_14 - UI: Global Header & Overview Consistency', async ({ page }) => {});


