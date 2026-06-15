import { test, expect } from '@playwright/test';

test('TS_02 - UI: Service Counter Limits', async ({ page }) => {
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();

    const weiterBtn = page.locator('#WeiterButton');
    //await expect(weiterBtn).toHaveClass(/disabledButton/);
    await expect(weiterBtn).toBeDisabled();

    //2: 0 → 1
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click()
    await expect(weiterBtn).toBeEnabled();

    //3: 1 → 0
    await page.locator('.btn-number[data-type="minus"]').last().click()
    await expect(weiterBtn).toBeDisabled();
;

    //4: 0 → 4
   
    for (let i=0; i<4; i++){
        await page.locator('.btn-number[data-type="plus"]').last().click();}
    
    await expect(page.locator('.ui-accordion-content-active input[type="number"]').last()).toHaveValue('4');
    
    // незаблокированные плюсы =0
    const activePlusButtons = page.locator('.btn-number[data-type="plus"]:not([disabled])');
    await expect(activePlusButtons).toHaveCount(0);

    // заблокированные минусы =0
    const disabledMinusButtons = page.locator('.btn-number[data-type="minus"]:not([disabled])');
    await expect(disabledMinusButtons).toHaveCount(1);
    await expect(weiterBtn).toBeEnabled();

    //5: 4 → 3
    await page.locator('.btn-number[data-type="minus"]').last().click();
    await expect(page.locator('.ui-accordion-content-active input[type="number"]').last()).toHaveValue('3');
    
    // вариант 2: проверить каждую кнопку 
    const plusButtons = page.locator('.ui-accordion-content-active .btn-number[data-type="plus"]');
    const buttonsCount = await plusButtons.count(); // Получит число 27

    for (let i = 0; i < buttonsCount; i++) {
    // Проверяем каждую кнопку по очереди
    await expect(plusButtons.nth(i)).toBeEnabled();
    }
    await expect(weiterBtn).toBeEnabled();

    
});

test('TS_08 - Security: Form Validation', async ({ page }) => {
    // 1. Доходим до Шага 5
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Bürgeramt' }).click();
    await page.getByRole('tab').first().click();
    await page.locator('.btn-number[data-type="plus"]').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button', { name: '' }).filter({ has: page.locator('.svg-icon-path') }).first().click();
    await page.getByRole('button', { name: 'Standort auswählen' }).click();
    await page.locator('#sugg_accordion .suggest_btn:not([disabled])').first().click();
    await page.getByRole('button', { name: 'Ja' }).click();

    const submitButton = page.locator('#chooseTerminButton');

    // Список полей для проверки
    const fieldsToTest = [
        { id: 'vorname', val: '123', err: 'Bitte geben Sie einen zulässigen Vornamen ein.' },
        { id: 'nachname', val: '123', err: 'Bitte geben Sie einen zulässigen Nachnamen ein.' },
        { id: 'email', val: 'bad-email', err: 'Bitte geben Sie eine zulässige Mailadresse ein.' },
        { id: 'emailwhlg', val: 'different-email', err: 'Bitte geben Sie eine zulässige Mailadresse ein.' }
    ];

    // 2. Проходим по списку обычных полей
    for (const field of fieldsToTest) {
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
    await expect(submitButton).toBeDisabled();
});

test('TS_09 - Session: Warning & Extension', async ({ page }) => {
    // 1. Включаем виртуальное время
    await page.clock.install();

    // Проход до Шага 5
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();

    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button', { name: '' }).filter({ has: page.locator('.svg-icon-path') }).first().click();
    await page.getByRole('button', { name: 'Standort auswählen' }).click();
    
    const firstAvailableSlot = page.locator('.suggest_btn:not([disabled])').first();
    await firstAvailableSlot.click();
    await page.getByRole('button', { name: 'Ja' }).click();

    // Мы на Шаге 5
    await expect(page.getByRole('heading', { name: 'Schritt 5' })).toBeVisible();
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
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();

    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button', { name: '' }).filter({ has: page.locator('.svg-icon-path') }).first().click();
    await page.getByRole('button', { name: 'Standort auswählen' }).click();
    
    const firstAvailableSlot = page.locator('.suggest_btn:not([disabled])').first();
    await firstAvailableSlot.click();
    await page.getByRole('button', { name: 'Ja' }).click();

    // Мы на Шаге 5. Заполняем имя
    await expect(page.getByRole('heading', { name: 'Schritt 5' })).toBeVisible();
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
    await expect(page.getByRole('heading', { name: 'Schritt 1' })).toBeVisible();

    // 3. Проверяем наличие кнопок выбора на Шаге 1, что доказывает полную блокировку формы Шага 5
    const stepOneButton = page.getByRole('button', { name: 'Fahrerlaubnis' });
    await expect(stepOneButton).toBeVisible();
});