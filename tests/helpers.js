import { expect } from '@playwright/test';
import { count } from 'node:console';

export async function setupPage(page) {
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();

}

export async function step_1_SelectDepartment(page, serviceName) {
    await page.getByRole('button', { name: serviceName }).click();
}


/**
 * @param {'first' | 'last'} position - куда кликать, начало или конец списка
 */
export async function step2_SelectAnliegen(page, position = 'first') { 
    // Находим все вкладки и все кнопки плюс
    const tabs = page.getByRole('tab');
    const plusButtons = page.locator('.btn-number[data-type="plus"]');

    // Выбираем нужный элемент в зависимости от позиции
    const targetTab = position === 'first' ? tabs.first() : tabs.last();
    const targetPlus = position === 'first' ? plusButtons.first() : plusButtons.last();

    await targetTab.click();
    await targetPlus.click();
}




export async function closeHinweis(page){
    await expect(page.getByRole('heading', {name:'Hinweis'})).toBeVisible();
    await page.locator('#OKButton').click();
}

export async function ensureWeiterButtonState(page, isEnabled = true) {
    const weiterBtn = page.locator('#WeiterButton');
    
    if (isEnabled) {
        await expect(weiterBtn).toBeEnabled();
    } else {
        await expect(weiterBtn).toBeDisabled();
    }
}


/**
 * @param {'first' | 'last'} position - куда кликать, начало или конец списка
 */
export async function checkInputValue(page, inputValue, position = 'first') {
    const inputLocator = page.locator('.ui-accordion-content-active input[type="number"]');
    
    // Выбираем элемент в зависимости от переданного параметра
    const targetElement = position === 'first' ? inputLocator.first() : inputLocator.last();
    await expect(targetElement).toHaveValue(inputValue);
}

export async function step3_SelectLocation(page) { 
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button',{name:''}).filter({has:page.locator('.svg-icon-path')}).first().click();
    await page.getByRole('button', {name:'Standort auswählen'}).click();
}

export async function step4_SelectDate(page) {
    const firstAvailableSlot = page.locator('.suggest_btn:not([disabled])').first();
    const noSlotsMessage = page.getByText('Kein freier Termin verfügbar');

    if (await firstAvailableSlot.count()) {
        await firstAvailableSlot.click();
        await expect(page.getByRole('heading', { name: 'Hinweis' })).toBeVisible();
        await page.getByRole('button', { name: 'Ja' }).click();
    }
    
   else if (await noSlotsMessage.isVisible()) {
       console.log('Kein freier Termin verfügbar');
       test.skip(true, 'Skipped');
   }
}

export async function step_5_FillForm(page, data) {
    await page.getByTitle('Vorname').fill(data.vorname);
    await page.getByTitle('Nachname').fill(data.nachname);
    await page.locator('#email').fill(data.email);
    await page.locator('#emailwhlg').fill(data.email);
    await page.locator('#geburtsdatumYear').fill(data.year);

    // Если данные есть — заполняем. Если "" (пустая строка) — игнорируем.
    if (data.plz) {
        await page.locator('#plz').fill(data.plz);
        await page.locator('#wohnort').fill(data.wohnort);
    }

    await page.getByText('Ich willige ein').click();
    await expect(page.locator('#chooseTerminButton')).toHaveAttribute('aria-disabled', 'false');
}


//Проверяем, что перешли на верный шаг
export async function verifyStep(page, stepNumber) {
    const heading = `Schritt ${stepNumber}`;
    // Ищем заголовок, содержащий текст "Schritt X"
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
}

export async function clickWeiter(page) {
    await page.getByRole('button', { name: 'Weiter' }).click();
}

/**
 * Проверяет состояние кнопки выбора термина
 * @param {boolean} shouldBeEnabled - ожидаемое состояние: true (активна), false (заблокирована)
 */
export async function verifyReservierenButton(page, shouldBeEnabled) {
    const terminButton = page.locator('#chooseTerminButton');
    if (shouldBeEnabled) {
        await expect(terminButton).toBeEnabled();
    } else {
        await expect(terminButton).toBeDisabled();
    }
}

/////// здесь это для учёбы и для крупных проектов

const LOCATORS = {
    banner: '#banner',
    kontrastBtn: '.set_contrast_btn',
    spracheBtn: '#easyLanguage',
    langSelectBtn: 'button[aria-label="Sprache wählen"]' 
};

export async function verifyLogo(page) {
    const banner = page.locator(LOCATORS.banner);
    await expect(banner).toBeVisible();
    await expect(banner).toHaveCSS('background-image', /url/);

}

export async function verifyKontrastBtnAn(page) {
    const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
    await expect(kontrastBtn).toBeVisible();
    await expect(kontrastBtn).toHaveAttribute('aria-label', 'Kontrast an');
}

export async function verifyKontrastBtnAus(page) {
    const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
    await kontrastBtn.click();
    await expect(kontrastBtn).toHaveAttribute('aria-label', 'Kontrast aus');
}
export async function verifySprachBtnAn(page) {
    const spracheBtn = page.locator(LOCATORS.spracheBtn);
    const kontrastBtn = page.locator(LOCATORS.kontrastBtn);
    await expect(spracheBtn).toBeVisible();
    await expect(spracheBtn).toHaveAttribute('aria-label', 'Einfache Sprache an');
    await kontrastBtn.click();
}
export async function verifySprachBtnAus(page) {
    const spracheBtn = page.locator(LOCATORS.spracheBtn);
    const langSelectBtn = page.locator(LOCATORS.langSelectBtn);
    await spracheBtn.click();
    await expect(spracheBtn).toHaveAttribute('aria-label', 'Einfache Sprache aus');
    await expect(langSelectBtn).toBeVisible();
    await spracheBtn.click();
}

export async function verifyFooterLinksFunctional(page) {
    const footerLinks = [
{ id: '#footer_link_help', modalId: '#modal_help' },
{ id: '#footer_link_imprint', modalId: '#modal_imprint' },
{ id: '#footer_link_privacy', modalId: '#modal_privacy' },
{ id: '#footer_link_accessibility', modalId: '#modal_accessibility' },
{ id: '#footer_link_licenses', modalId: '#modal_licenses' },
];

for (const entry of footerLinks) {
        await page.locator(entry.id).click();
        await expect(page.locator('#footer_dialog')).toHaveClass(/in/);
        await expect(page.locator(entry.modalId)).toBeVisible();
        await page.locator('#close_btn').click();
        await expect(page.locator('#footer_dialog')).not.toHaveClass(/in/);
}
}

export async function verifyFooterLinksVisible(page) {
    const footerLinks = [
'#footer_link_help','#footer_link_imprint', '#footer_link_privacy', 
'#footer_link_accessibility','#footer_link_licenses'];

for (const entry of footerLinks) {
                await expect(page.locator(entry)).toBeVisible();
        }
}


/**
 * @param {number} activeStepIndex - индекс шага (начиная с 1)
 */
export async function verifyStepIndicator(page, activeStepIndex) {
    const steps = page.locator('ul.nav-tabs li[role="presentation"]');
    const count = await steps.count();
    
    for (let i = 0; i < count; i++) {
        const step = steps.nth(i);

        if (i === activeStepIndex - 1) {
            await expect(step).toHaveClass(/active/);
        } else if (i < activeStepIndex - 1) {
            await expect(step).toHaveClass(/done/);
        } else {
            await expect(step).toHaveClass(/disabled/);
        }
   
}
}


/**
 * Проверяет, что все поля Übersicht до текущего шага заполнены.
  * @param {number} currentStep - номер текущего шага, на котором мы находимся
 */
export async function verifyUebersichtData(page, stepNumber) {
    const rows = page.locator('dl.grid dt'); // Заголовки (слева)
    
    // Карта соответствия шагов и строк в Übersicht (индексы с 0)
    // Шаг 2 заполняет строку 0 (Funktionseinheit)
    // Шаг 3 заполняет строку 1 (Anliegen)
    // Шаг 4 заполняет строку 2 (Standort)
    // Шаг 5 заполняет строку 3 (Termin)
    
    // Определяем, до какой строки мы должны проверить заполненность
    const rowsToCheck = stepNumber - 1; 

    for (let i = 0; i < rowsToCheck; i++) {
        // Берем dd (правую колонку), которая идет сразу после i-го dt
        const dd = rows.nth(i).locator('+ dd');
        
        // Проверяем, что значение заполнено
        await expect(dd).not.toContainText('noch nicht gesetzt');
    }
}
/**
 * Пока просто предложили, я добавила. 
 * Позже разбеоусь.
 * Генерирует дату в формате DD.MM.YYYY
 * daysToAdd: сколько дней прибавить к текущей дате
 */
function getFutureDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

