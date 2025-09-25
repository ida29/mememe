import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main title', async ({ page }) => {
    await page.goto('/');

    // タイトルが表示されることを確認
    await expect(page.locator('h1')).toContainText('めめめのくらげ TCG');
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // ナビゲーションリンクの存在を確認
    const collectionLink = page.locator('a:has-text("カードを見る")');
    const deckBuilderLink = page.locator('a:has-text("デッキを作る")');
    const gameLink = page.locator('a:has-text("対戦を始める")');

    await expect(collectionLink).toBeVisible();
    await expect(deckBuilderLink).toBeVisible();
    await expect(gameLink).toBeVisible();
  });

  test('should navigate to collection page', async ({ page }) => {
    await page.goto('/');

    // カードコレクションリンクをクリック
    await page.click('a:has-text("カードを見る")');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/.*\/collection/);

    // コレクションページのタイトルを確認
    await expect(page.locator('h1')).toContainText('カードコレクション');
  });

  test('should navigate to deck builder page', async ({ page }) => {
    await page.goto('/');

    // デッキビルダーリンクをクリック
    await page.click('a:has-text("デッキを作る")');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/.*\/deck-builder/);

    // デッキビルダーページのタイトルを確認
    await expect(page.locator('h1')).toContainText('デッキビルダー');
  });

  test('should navigate to game page', async ({ page }) => {
    await page.goto('/');

    // ゲーム開始リンクをクリック
    await page.click('a:has-text("対戦を始める")');

    // URLが変更されることを確認
    await expect(page).toHaveURL(/.*\/game/);

    // ゲームページのタイトルを確認
    await expect(page.locator('h1')).toContainText('ゲーム');
  });
});