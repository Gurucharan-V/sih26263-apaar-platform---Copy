import { test, expect } from '@playwright/test';

test.describe('End-to-End APAAR Upload & Validation Pipeline', () => {
  test('College nodal user can login, upload CSV, and review error diagnostics', async ({ page }) => {
    // 1. Visit Portal & Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'nodal@vit.ac.in');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Dashboard loads
    await expect(page).toHaveURL(/.*college/);
    await expect(page.locator('text=College Ingestion Portal')).toBeVisible();

    // 3. Navigate to Bulk Upload
    await page.click('text=Bulk Ingestion');
    await expect(page.locator('text=Bulk Ingestion Engine')).toBeVisible();

    // 4. Ingest File & Verify Error Report
    await page.click('text=Start Ingestion');
    await expect(page).toHaveURL(/.*errors/);
    await expect(page.locator('text=Ingestion Audit Report')).toBeVisible();
    await expect(page.locator('text=Failed Row Diagnostics')).toBeVisible();
  });
});
