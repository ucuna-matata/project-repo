import { test, expect } from '@playwright/test';

// This E2E test uses the dev server + MSW in the browser (dev:mock mode).
// It assumes the app is running at BASE_URL (default http://localhost:5173)

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('happy path', () => {
  test('login -> create cv -> generate -> export', async ({ page }) => {
    await page.goto(BASE_URL);
    // Click Dashboard CTA (assumes nav links exist)
    await page.click('text=CV Master');
    // Click create CV
    await page.click('text=Create CV');
    // Fill a title
    await page.fill('input[name="title"]', 'Test CV');
    // Click Generate with AI
    await page.click('text=Generate with AI');
    // Wait for generated notice
    await page.waitForSelector('text=AI draft', { timeout: 5000 });
    // Save CV
    await page.click('text=Save');
    // Export
    await page.click('text=Export');
    // Should get a signed url; the mock returns success; check for link
    await expect(page.locator('text=Download PDF')).toBeVisible();
  });
});

