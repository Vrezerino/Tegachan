import { test, expect } from '@playwright/test';
import { links } from '@/app/lib/utils';

test.describe('Navigation', () => {
  // Traverse through an array of links included in the side navigation
  test('to different boards works', async ({ page }) => {
    await page.goto('/');

    for (let i = 1; i < links.length; i++) {
      await page.getByTestId(`${links[i].name}-nav-button`).click({ force: true });
      await expect(page.getByRole('heading', { name: `✵ ${links[i].name.toUpperCase()} ✵` })).toBeVisible({ timeout: 10000 });
    }
  });
});