import { test, expect } from '@playwright/test';
import { verifyStep} from '../tests/helpers';

test('TS_07 - Security: Deep Linking Protection', async ({ page }) => {
    // 1. Пробуем прорваться по прямой ссылке
    await page.goto('https://termine-reservieren.de/termine/homburg/suggest?suggest&mdt=0&cnc-229=4');

    // 2. Проверяем, что на экране высветилась ошибка безопасности/сессии
    await expect(page.getByText('Fehlermeldung: Kein gültiger Standort gefunden.')).toBeVisible();
    
    // 3. Убеждаемся, что форма ввода данных или выбор времени НЕ загрузились
    await expect(page.getByRole('heading', { name: 'Schritt 4' })).toBeHidden();
});

test('TS_13 - System: API 500 Error Handling', async ({ page }) => {
    
    // 1. Устанавливаем «ловушку» на сетевой запрос календаря
    // Мы перехватываем именно тот файл/запрос, который отвечает за загрузку данных на Шаг 4
    await page.route('**/calendar.js', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal Server Error' })
        });
    });

    // 2. Проходим первые шаги
    await page.goto('https://termine-reservieren.de/termine/homburg/');
    await page.getByRole('button', { name: 'Akzeptieren' }).click();
    await page.getByRole('button', { name: 'Bürgeramt' }).click();
    
    await page.getByRole('tab').first().click();
    await page.locator('.btn-number[data-type="plus"]').first().click();
    
    // 3. Переходим к календарю
    await page.getByRole('button', { name: 'Weiter' }).click();
    
    // Нажимаем OK в окне Hinweis, что провоцирует запрос к «сломанному» серверу
    await page.locator('#OKButton').click(); 

    // 4. Ждем реакцию сайта
    // По правилам теста, Шаг 4 НЕ должен загрузиться
    const step4Heading = page.getByRole('heading', { name: 'Schritt 4' });
    
    // Даем время на выполнение запроса и проверку
    await expect(step4Heading).not.toBeVisible();
});