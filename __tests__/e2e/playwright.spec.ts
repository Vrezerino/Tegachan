import { test, expect } from '@playwright/test';
import { links } from '@/app/lib/utils';

import { neon } from '@neondatabase/serverless';
import { PGDB_URL, AWS_NAME, AWS_URL } from '@/app/lib/env';

const sql = neon(PGDB_URL);

// Logs that reveal enough for debug but not too much
console.log('Database URL is for', PGDB_URL.includes('-cool-') ? 'dev' : 'not dev');
console.log('AWS_NAME is for', AWS_NAME.includes('dev') ? 'dev' : AWS_NAME.includes('test') ? 'test' : 'prod or URL undefined');
console.log('AWS_URL is for', AWS_URL.includes('dev') ? 'dev' : AWS_URL.includes('test') ? 'test' : 'prod or URL undefined');
console.log('CI:', process.env.CI);
console.log('NODE_ENV:', process.env.NODE_ENV);

test.describe('Navigation', () => {
  test('to different boards works', async ({ page }) => {
    await page.goto('/');

    for (let i = 1; i < links.length; i++) {
      await page.getByTestId(`${links[i].name}-nav-button`).click();
      await expect(page.getByRole('heading', { name: `✵ ${links[i].name} ✵` })).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe.serial('Posting', () => {
  test('new thread works', async ({ page }) => {
    await page.goto('/dashboard/random');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this thread');
    await page.getByTestId('postform-postbutton').click();
    await expect(page.getByTestId('boardtype-post-content').first()).toContainText('[TEST]: Playwright posted this thread', { timeout: 20000 });
  });

  test('throttling works', async ({ page }) => {
    await page.goto('/dashboard/random');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright attempts to post');
    await page.getByTestId('postform-postbutton').click();

    // Intercept response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    await expect(response.status()).toBe(429);
  });

  test('reply to newly created thread works', async ({ page }) => {
    await page.goto('/dashboard/random');
    await page.getByTestId('boardtype-post-content').first().click();
    await expect(page.getByTestId('post-content').nth(0)).toContainText('[TEST]: Playwright posted this thread', { timeout: 10000 })

    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this reply');
    await page.waitForTimeout(2000); // because of post throttling
    await page.getByTestId('postform-postbutton').click();

    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    await expect(response.status()).toBe(201);

    // nth(0) = op
    await expect(page.getByTestId('post-content').nth(1)).toContainText('[TEST]: Playwright posted this reply', { timeout: 30000 })
  });

  test('a reply with image works', async ({ page }) => {
    await page.goto('/dashboard/random');
    await page.getByTestId('boardtype-post-content').first().click();
    await expect(page.getByTestId('post-content').nth(0)).toContainText('[TEST]: Playwright posted this thread', { timeout: 5000 })

    // Write reply and choose img
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this image reply');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('__tests__/assets/15.gif');

    await page.waitForTimeout(5000);
    await page.getByTestId('postform-postbutton').click();


    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    await expect(response.status()).toBe(201);

    const post = page.getByTestId('post-container').nth(2);
    const image = post.getByTestId('post-image');

    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    await expect(src).toContain('15.gif');
  });

  test.afterAll(async () => {
    try {
      await sql`
      DELETE FROM posts
        WHERE content LIKE '[TEST]: Playwright%'`;
      console.log('Database cleared!')
    } catch (e) {
      console.error(e);
    }
  });
});