import { test, expect } from '@playwright/test';
import { isUUID } from '@/app/lib/utils';

test.describe.serial('Posting', () => {
  test('new thread works', async ({ page }) => {
    // Navigate to a board and fill name and post content fields in post form
    await page.goto('/random');
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this thread');

    // Post thread
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    await expect(response.status()).toBe(201);

    await expect(page.getByTestId('post-content').first()).toContainText('[TEST]: Playwright posted this thread', { timeout: 20000 });
  });

  test('throttling works', async ({ page }) => {
    // Attempt to post another thread too quickly
    await page.goto('/random');
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright attempts to post');
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Server should have throttle window of a few seconds, so HTTP response should be 429 Too Many Requests
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    expect(response.status()).toBe(429);
  });

  test('reply to newly created thread works', async ({ page }) => {
    // Go to thread on random board that Playwright created
    await page.goto('/random');
    await page.getByTestId('boardtype-post-content').first().click({ force: true });
    await expect(page.getByTestId('post-content').nth(0)).toContainText('[TEST]: Playwright posted this thread', { timeout: 10000 })

    // Enter name and post content
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this reply');

    // Post reply
    await page.waitForTimeout(2000); // because of post throttling
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept and check HTTP response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    await expect(response.status()).toBe(201);

    // nth(0) = op
    await expect(page.getByTestId('post-content').nth(1)).toContainText('[TEST]: Playwright posted this reply', { timeout: 30000 })
  });

  test('a reply with image works', async ({ page }) => {
    // Go to thread on random board that Playwright created
    await page.goto('/random');
    await page.getByTestId('boardtype-post-content').first().click({ force: true });
    await expect(page.getByTestId('post-content').nth(0)).toContainText('[TEST]: Playwright posted this thread', { timeout: 5000 })

    // Enter name and post content and choose img
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill('[TEST]: Playwright posted this image reply');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('__tests__/assets/15.gif');

    // Post reply
    await page.waitForTimeout(5000);
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept and check HTTP response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    expect(response.status()).toBe(201);

    // This new reply is the third post in the thread, assert that it has image
    const post = page.getByTestId('post-container').nth(2);
    const image = post.getByTestId('post-image');
    await expect(image).toBeVisible();

    const src = await image.getAttribute('src');
    if (!src) throw new Error('src attribute is null');

    const filename = new URL(src).pathname.split('/').pop();
    if (!filename) throw new Error('Filename is null');

    // Assert that image filename is a UID and file format is expected
    expect(isUUID(filename.split('.')[0])).toBe(true);
    expect(filename.split('.')[1]).toEqual('gif');
  });

  test('YouTube video is embedded', async ({ page }) => {
    // Fill new thread postForm
    await page.goto('/random');
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill('https://www.youtube.com/watch?v=MnGVLnScoFo');

    // Wait for post throttle window to close and post thread
    await page.waitForTimeout(5000);
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept and check HTTP response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    expect(response.status()).toBe(201);

    // Check that post content contains URL and embed button next to it
    await expect(page.getByTestId('post-content').first()).toContainText('https://www.youtube.com/watch?v=MnGVLnScoFo [▼]', { timeout: 20000 });

    // Get button by test id
    const embedToggleBtn = page.getByTestId('embed-toggle-button').first();
    await expect(embedToggleBtn).toBeVisible();

    // Click it and assert that embed frame is visible and video is correct
    await embedToggleBtn.click({ force: true });
    const videoEmbedIframe = page.getByTestId('video-embed-iframe').first();
    await expect(videoEmbedIframe).toBeVisible();
    await expect(videoEmbedIframe).toHaveAttribute('src', /youtube\.com\/embed\/MnGVLnScoFo/);

    // Click it again and frame should not be visible anymore
    await embedToggleBtn.click({ force: true });
    await expect(videoEmbedIframe).not.toBeVisible();
  });

  test('post content text is formatted with custom modifiers', async ({ page }) => {
    // Create new thread and format text
    await page.goto('/random');
    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill(`
      >implying\n
      >r>red text\n
      >p>pink text\n
      >b>bold text\n
      >i>italic text\n
      >w,#FF8400>weird orange text
      `
    );

    await page.waitForTimeout(5000);
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept and check HTTP response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    expect(response.status()).toBe(201);

    // span elements of modified text
    const greentextSpan = page.locator('span.text-green-600', { hasText: '>implying' });
    const redSpan = page.locator('span.text-red-600', { hasText: 'red text' });
    const pinkSpan = page.locator('span.text-pink-500', { hasText: 'pink text' });
    const boldSpan = page.locator('span.font-bold', { hasText: 'bold text' });
    const italicSpan = page.locator('span.italic', { hasText: 'italic text' });
    const weirdSpan = page.locator('span[style="color: rgb(255, 132, 0);"]', {
      hasText: 'WeIrD OrAnGe tExT'
    });

    await expect(greentextSpan).toBeVisible();
    await expect(redSpan).toBeVisible();
    await expect(pinkSpan).toBeVisible();
    await expect(boldSpan).toBeVisible();
    await expect(italicSpan).toBeVisible();
    await expect(weirdSpan).toBeVisible();

  });

  test('post_num is incremented correctly', async ({ page }) => {
    // Open the last created thread and post in it
    await page.goto('/random');
    await page.getByTestId('boardtype-post-content').first().click({ force: true });
    await expect(page.getByTestId('post-content').nth(0)).toContainText(
      '>implying\nred text\npink text\nbold text\nitalic text\nWeIrD OrAnGe tExT', {
      timeout: 10000
    });

    await page.getByTestId('postform-name').fill('[Playwright]');
    await page.getByTestId('postform-textarea').fill(`my post_num should be one greater than op's`);

    // Wait for post throttle window to close and post thread
    await page.waitForTimeout(5000);
    await page.getByTestId('postform-postbutton').click({ force: true });

    // Intercept and check HTTP response
    const response = await page.waitForResponse(resp => resp.url().includes('/api/posts'));
    expect(response.status()).toBe(201);

    const opsPostNum = parseInt(await page.getByTestId('post_num').first().textContent() ?? '');
    const replyPostNum = parseInt(await page.getByTestId('post_num').nth(1).textContent() ?? '');
    expect(replyPostNum).toBe(opsPostNum + 1);
  });
});