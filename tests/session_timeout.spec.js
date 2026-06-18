import { test, expect } from '@playwright/test';
import {setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, 
        verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, validateField, runNegativeChecks, verifyUebersichtState,
        getFormattedFutureDate} from './helpers.js';
import testData from './testData.json' assert { type: 'json' };

test.describe('Session & Timeout Management', () => {

    test.beforeEach(async ({ page }) => {
        // Устанавливаем "виртуальные часы" для каждого теста
        await page.clock.install();
    });

    test('TS_09 - Session: Warning & Extension', async ({ page }) => {
        // 1. Включаем виртуальное время
    await page.clock.install();

    await setupPage(page);
    await step_1_SelectDepartment(page,'Bürgeramt' )
    await step2_SelectAnliegen(page);
    await checkInputValue(page,'1');
    await ensureWeiterButtonState(page, true )
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);

    // Мы на Шаге 5
    await verifyStep(page,5) 
    const firstNameInput = page.locator('input[name="vorname"], #vorname, input[type="text"]').first();
    await firstNameInput.fill('Anna');

    // === ПЕРЕМОТКА НА 23 МИНУТЫ ===
    // Доходим до состояния, когда осталась 1 минута
    await page.clock.fastForward(1380000);

    // Проверяем нижний таймер (должно быть строго 1)
    const bottomTimer = page.locator('text=Ihre Sitzung läuft aus in 1 Minuten');
    await expect(bottomTimer).toBeVisible();

    // Локатор зеленой кнопки Schliessen
    const closeWarningButton = page
        .getByRole('dialog', { name: 'Infofenster: Warnung' })
        .getByRole('button', { name: 'Schliessen', exact: true });
        
    await expect(closeWarningButton).toBeVisible();

    // === КЛИКАЕМ И ПРОДЛЕВАЕМ ===
    await closeWarningButton.click();
    await expect(closeWarningButton).toBeHidden();

    // === ЖДЕМ ОБНОВЛЕНИЯ ТАЙМЕРА ===
    // Проматываем еще 1 минуту вперед, чтобы дать сайту переключить счетчик сессии
    await page.clock.fastForward(60000);

    // Проверяем, что текст "1 Minuten" исчез, а вместо него появились заветные "24 Minuten"!
    await expect(bottomTimer).toBeHidden();
    
    const renewedTimer = page.locator('text=Ihre Sitzung läuft aus in 24 Minuten');
    await expect(renewedTimer).toBeVisible();

    // Данные в форме в порядке
    await expect(firstNameInput).toHaveValue('Anna');    
    });

    test('TS_10 - Session: Timeout Expiration', async ({ page }) => {
      // 1. Включаем виртуальное время
    await page.clock.install();

    // Проход до Шага 5
    await setupPage(page);
    await step_1_SelectDepartment(page,'Bürgeramt' )
    await step2_SelectAnliegen(page);
    await checkInputValue(page,'1');
    await ensureWeiterButtonState(page, true )
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);

    // Мы на Шаге 5. Заполняем имя
    await verifyStep(page,5);
    const firstNameInput = page.locator('input[name="vorname"], #vorname, input[type="text"]').first();
    await firstNameInput.fill('Anna');

    // === ПЕРЕМОТКА НА 23 МИНУТЫ ===
    // Доходим до состояния, когда осталась 1 минута
    await page.clock.fastForward(1380000);

    // Проверяем, что появилось нижнее предупреждение (осталась 1 минута)
    const bottomTimer = page.locator('text=Ihre Sitzung läuft aus in 1 Minuten');
    await expect(bottomTimer).toBeVisible();

    // === ДАЕМ МИНУТЕ ЗАКОНЧИТЬСЯ ===
    // Проматываем еще 61.5 секунду, чтобы сессия полностью обнулилась
    await page.clock.fastForward(61500);

    // === ФИНАЛЬНЫЕ ПРОВЕРКИ РЕДИРЕКТА ===
    // 1. Проверяем, что URL сбросился на главную с параметром ресета ?rs
    await expect(page).toHaveURL('https://termine-reservieren.de/termine/homburg/?rs');

    // 2. Проверяем, что перед нами снова Шаг 1 (заголовок выбора ведомства)
    await verifyStep(page,1) 
    
    // 3. Проверяем наличие кнопок выбора на Шаге 1, что доказывает полную блокировку формы Шага 5
    const stepOneButton = page.getByRole('button', { name: 'Fahrerlaubnis' });
    await expect(stepOneButton).toBeVisible();
});
    });

