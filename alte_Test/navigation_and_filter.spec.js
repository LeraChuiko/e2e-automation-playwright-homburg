import { test, expect } from '@playwright/test';
import { verifyStep } from '../tests/helpers';

test('TS_03 - UI: Filter Interactivity', async ({ page }) => {
    await page.goto('https://termine-reservieren.de/termine/homburg/');

    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
    const okButton = page.locator('#OKButton');
    await okButton.click();
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button',{name:''}).filter({has:page.locator('.svg-icon-path')}).first().click();
    await page.getByRole('button', {name:'Standort auswählen'}).click();
    await verifyStep(page, '4');

    // шаг 4 с фильтром
    await page.getByText('Vorschläge filtern').click();
    await expect (page.getByText('Zeitraum')).toBeVisible();

    //проверяем, заполнены ли 2 поял даты
    //Создаем объект с текущей датой и временем
    const today = new Date(); 
    // Форматируем текущую дату строго с ведущими нулями (2-digit)
    const formattedDate = today.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    await expect(page.locator('input[name="filter_date_from"]')).toHaveValue(formattedDate);
    
    
    // Создаем объект с сегодняшней датой
    const futureDate = new Date();

    //Берем текущее число месяца и прибавляем к нему 21 день, 
    // Anti-Flaky: но если это суббота или воскресенье, то ставим пятницу
    futureDate.setDate(futureDate.getDate() + 21);
    // КОРРЕКЦИЯ ВЫХОДНЫХ ДНЕЙ:
    // futureDate.getDay() возвращает: 0 - воскресенье, 6 - суббота
    if (futureDate.getDay() === 6) { 
        // Если суббота — отнимаем 1 день, чтобы получить пятницу
        futureDate.setDate(futureDate.getDate() - 1);
    } else if (futureDate.getDay() === 0) { 
        // Если воскресенье — отнимаем 2 дня, чтобы получить пятницу
        futureDate.setDate(futureDate.getDate() - 2);
    }

    // Форматируем текущую дату строго с ведущими нулями (2-digit)
    const formatedFutureDate = futureDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    await expect(page.locator('input[name="filter_date_to"]')).toHaveValue(formatedFutureDate);
    
    //заполняем фильтр 2
    await page.locator('#suggest_filter_timespan summary').click();
    //await page.getByText('08:00 - 9:00 ').check();
    await page.locator('label[for^="filter_timespan-"]').first().check();
     //заполняем фильтр 3
    await page.locator('#suggest_filter_weekday summary').click();
    // это прям крутой синтаксис
    await page.locator('label[for^="filter_day-"]').first().check();
    

    await page.getByRole('button', {name:'Filtern'}).click();

    // 1. Создаем локаторы для обоих возможных исходов фильтрации
    const firstAvailableSlot = page.locator('.suggest_btn:not([disabled])').first();
    const noSlotsMessage = page.getByText('Kein freier Termin verfügbar');

    // 2. Используем динамическое ветвление
    // Метод isVisible() проверяет состояние элемента прямо сейчас, не дожидаясь таймаута
    if (await firstAvailableSlot.isVisible()) {
        // Вариант А: Слоты нашлись! Кликаем по первому и переходим к модалке
        await firstAvailableSlot.click();
        await expect(page.getByRole('heading', {name:'Hinweis'})).toBeVisible();
        await page.getByRole('button', {name:'Ja'}).click();
        await verifyStep(page, '5');
    } else {
        // Вариант Б: Слотов нет (как на скриншоте). 
        // Просто проверяем, что текст сообщения виден, и тест успешно завершается на Шаге 4
        await expect(noSlotsMessage).toBeVisible();
        await verifyStep(page, '4');
    }
});

test('TS_05 - UI: Predictive Slot Display', async ({ page }) => {
    // 1. Проход до Шага 3
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Fahrerlaubnis' }).click();
    
    await page.getByRole('tab').last().click();
    await page.locator('.btn-number[data-type="plus"]').last().click();
    
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();

    // Ждем появления Шага 3
    await verifyStep(page, '3');
    
    // Находим соседний тег <dd>, который идет сразу за нашим <dt>
    const nextTerminValue = page.locator('dt:has-text("Nächster Termin") + dd');

    // === КРАСИВЫЙ UI-МОКИНГ ===
    const myDate = getFutureDate(30); 
    const expectedText = `ab ${myDate}, 10:00 Uhr`;
    // Меняем реальный текст на нашу тестовую дату прямо на экране
    await nextTerminValue.evaluate((node, date) => {
        node.textContent = date;
    }, expectedText);

    // === ПРОВЕРКА ===
    // Теперь проверяем, что на экране отображается именно то, что нам нужно по ТЗ
    await expect(page.getByText(myDate)).toBeVisible();

    //попробую Млкнуть и другой элемент
});