import { test, expect } from '@playwright/test';

test.describe('Card Collection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('カードコレクション');
  });

  test('should have filter controls', async ({ page }) => {
    // 検索ボックス
    const searchInput = page.locator('input[placeholder*="検索"]');
    await expect(searchInput).toBeVisible();

    // タイプフィルター
    const typeSelect = page.locator('select').first();
    await expect(typeSelect).toBeVisible();

    // カラーフィルター
    const colorSelect = page.locator('select').nth(1);
    await expect(colorSelect).toBeVisible();
  });

  test('should display card grid', async ({ page }) => {
    // カードグリッドが表示されるまで待機
    await page.waitForSelector('.grid', { timeout: 10000 });

    // カードが少なくとも1つ表示されることを確認
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(126, { timeout: 10000 });
  });

  test('should filter cards by type', async ({ page }) => {
    // タイプフィルターで「ふれんど」を選択
    await page.selectOption('select:has-text("すべてのタイプ")', 'ふれんど');

    // フィルター適用を待つ
    await page.waitForTimeout(500);

    // カードが存在することを確認
    const cards = page.locator('.grid > div');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(126);
  });

  test('should filter cards by search term', async ({ page }) => {
    // 検索ボックスに入力
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill('001');

    // フィルター適用を待つ
    await page.waitForTimeout(500);

    // フィルタリングされたカードを確認
    const cards = page.locator('.grid > div');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(126);
  });

  test('should show card detail modal when card is clicked', async ({ page }) => {
    // カードグリッドが表示されるまで待機
    await page.waitForSelector('.grid > div', { timeout: 10000 });

    // 最初のカードをクリック
    await page.locator('.grid > div').first().click();

    // モーダルが表示されることを確認
    const modal = page.locator('[role="dialog"], .fixed.inset-0');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // カード詳細が表示されることを確認
    await expect(page.locator('img[alt*="カード画像"]')).toBeVisible();
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    // カードグリッドが表示されるまで待機
    await page.waitForSelector('.grid > div', { timeout: 10000 });

    // 最初のカードをクリック
    await page.locator('.grid > div').first().click();

    // モーダルが表示されるまで待つ
    const modal = page.locator('[role="dialog"], .fixed.inset-0');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 閉じるボタンをクリック
    await page.click('button:has-text("×"), button:has-text("閉じる")');

    // モーダルが消えることを確認
    await expect(modal).not.toBeVisible();
  });
});