import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads with the expected heading
    await expect(page.getByRole('heading', { name: /vite \+ react/i })).toBeVisible();
  });

  test('should interact with the counter button', async ({ page }) => {
    await page.goto('/');
    
    // Find the button
    const button = page.getByRole('button', { name: /count is 0/i });
    await expect(button).toBeVisible();
    
    // Click the button
    await button.click();
    
    // Verify the count increased
    await expect(page.getByRole('button', { name: /count is 1/i })).toBeVisible();
  });
});
