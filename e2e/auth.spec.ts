import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page and validate empty submit', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/Sign In|Login/i);
    
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should login as tenant and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    
    await page.getByRole('button', { name: /Tenant/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/tenant/);
    await expect(page.getByText(/Tenant Dashboard/i)).toBeVisible();
  });
});
