// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  
  // Вот этот блок use: {} — самое важное!
  use: {
    trace: 'on-first-retry',
    video: 'on',      // Прямое включение видео
    screenshot: 'on', // Прямое включение скриншотов
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
