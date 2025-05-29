import { test, expect } from '@playwright/test';
import { getClient } from '@/app/lib/db';

test.describe('Site statistics', () => {
  test('show expected numbers', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('total-posts-count').first()).toContainText('Total posts: 6', { timeout: 1000 });
    await expect(page.getByTestId('unique-posters-count').first()).toContainText('Unique posters: 1', { timeout: 1000 });
    await expect(page.getByTestId('total-content-size').first()).toContainText('Total content: 0.0041', { timeout: 1000 });
  })
});

test.afterAll(async () => {
  try {
    const client = await getClient();
    await client.query(`
      DELETE FROM posts
        WHERE name = '[Playwright]'`);
    console.log('Database cleared!')
  } catch (e) {
    console.error(e);
  }
});