import { test, expect } from '@playwright/test';
import { setupPage, verifyStep, step_1_SelectDepartment, step2_SelectAnliegen,clickWeiter,
        closeHinweis, ensureWeiterButtonState, checkInputValue, step3_SelectLocation,
        step4_SelectDate, step_5_FillForm, verifyReservierenButton, verifyLogo, verifyKontrastBtnAn, verifyKontrastBtnAus, verifySprachBtnAn, verifySprachBtnAus, 
        verifyFooterLinksFunctional, verifyFooterLinksVisible, verifyStepIndicator,
        verifyUebersichtData, getWeiterBtn, getPlusBtn, getMinusBtn, getCounterInput,
        getSubmitButton, validateField, runNegativeChecks} from '../tests/helpers.js';
import testData from '../tests/testData.json' assert { type: 'json' };

test('TS_02 - UI: Service Counter Limits', async ({ page }) => {
    await setupPage(page);
    await step_1_SelectDepartment(page,'Fahrerlaubnis' )
    
    const weiterBtn = getWeiterBtn(page);
    await expect(weiterBtn).toBeDisabled();

    //2: 0 → 1
    await step2_SelectAnliegen(page,'last');
    await expect(weiterBtn).toBeEnabled();

    //3: 1 → 0
    const minusBtn = getMinusBtn(page); 
    await minusBtn.last().click()
    await expect(weiterBtn).toBeDisabled();

    //4: 0 → 4
    const plusBtn = getPlusBtn(page);   
    for (let i=0; i<4; i++){
        await plusBtn.last().click();
    }
    
    const input=getCounterInput(page);
    await expect (input.last()).toHaveValue('4');
    
    // незаблокированные плюсы =0 
    await expect(plusBtn).toBeDisabled();


    // заблокированные минусы =0 
    const disabledMinusButtons = minusBtn.filter({ hasNot: page.locator(':disabled') });
    await expect(disabledMinusButtons).toHaveCount(1);
    await expect(weiterBtn).toBeEnabled();

    //5: 4 → 3
    await minusBtn.last().click();
    await expect(input.last()).toHaveValue('3');
    
    // вариант 2: проверить каждую кнопку 
    const plusButtons = getPlusBtn(page);
    const buttonsCount = await plusButtons.count(); // Получит число 27

    for (let i = 0; i < buttonsCount; i++) {
        // Проверяем каждую кнопку по очереди
        await expect(plusButtons.nth(i)).toBeEnabled();
    }
    await expect(weiterBtn).toBeEnabled();
   
});

/*test('TS_08 - Security: Form Validation', async ({ page }) => {
    // 1. Доходим до Шага 5
    await setupPage(page);
    await step_1_SelectDepartment(page,'Bürgeramt' )
    await step2_SelectAnliegen(page);
    await checkInputValue(page,'1');
    await ensureWeiterButtonState(page, true )
    await clickWeiter(page);
    await closeHinweis(page);
    await step3_SelectLocation(page);
    await step4_SelectDate(page);
 

    const terminButton=getSubmitButton(page);

    for (const field of testData.invalidFields) {
        const input = page.locator(`#${field.id}`);
        await input.fill(field.val);
        await page.keyboard.press('Tab');

        await expect(input).toHaveClass(/wrongvalidate/);
        await expect(page.locator(`#${field.id} + .wrongvalidateimg`)).toBeVisible();
        await expect(page.locator(`#${field.id} + .wrongvalidateimg + .error-text`)).toHaveText(field.err);
    }

    // 3. Отдельная проверка для года (у него свой ID блока ошибки)
    const yearInput = page.locator('#geburtsdatumYear');
    await yearInput.fill('1800');
    await page.keyboard.press('Tab');
    await expect(yearInput).toHaveClass(/wrongvalidate/);
    await expect(page.locator('#geburtsdatumerror')).toHaveText(/Bitte geben Sie ein zulässiges Geburtsdatum ein/);

    // 4. Финальная проверка: кнопка заблокирована
    await expect(terminButton).toBeDisabled();
});*/

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