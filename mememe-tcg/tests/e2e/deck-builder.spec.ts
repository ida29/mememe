import { test, expect } from '@playwright/test';

test.describe('Deck Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/deck-builder');
  });

  test('should display deck list initially', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('デッキビルダー');

    // 新規作成ボタンが表示される
    const createButton = page.locator('button:has-text("新しいデッキを作成")');
    await expect(createButton).toBeVisible();
  });

  test('should create a new deck', async ({ page }) => {
    // 新しいデッキを作成ボタンをクリック
    await page.click('button:has-text("新しいデッキを作成")');

    // プロンプトダイアログに名前を入力
    page.on('dialog', dialog => dialog.accept('テストデッキ'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面に遷移することを確認
    await expect(page.locator('text=テストデッキ')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=0/50枚')).toBeVisible();
  });

  test('should show deck editor with card selection', async ({ page }) => {
    // 新しいデッキを作成
    page.on('dialog', dialog => dialog.accept('編集テストデッキ'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面の要素を確認
    await page.waitForSelector('text=編集テストデッキ', { timeout: 5000 });

    // デッキ内容エリア
    const deckContent = page.locator('h2:has-text("デッキ内容")');
    await expect(deckContent).toBeVisible();

    // カード選択エリア
    const cardSelection = page.locator('h2:has-text("カード選択")');
    await expect(cardSelection).toBeVisible();

    // フィルターコントロール
    const searchInput = page.locator('input[placeholder*="検索"]');
    await expect(searchInput).toBeVisible();
  });

  test('should add card to deck', async ({ page }) => {
    // 新しいデッキを作成
    page.on('dialog', dialog => dialog.accept('カード追加テスト'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面が表示されるまで待つ
    await page.waitForSelector('text=カード追加テスト', { timeout: 5000 });
    await page.waitForSelector('.grid > div', { timeout: 10000 });

    // カードを選択してデッキに追加
    const firstCard = page.locator('.grid > div').first();
    await firstCard.click();

    // デッキにカードが追加されたことを確認
    await expect(page.locator('text=1/50枚')).toBeVisible({ timeout: 5000 });
  });

  test('should validate deck size', async ({ page }) => {
    // 新しいデッキを作成
    page.on('dialog', dialog => dialog.accept('検証テストデッキ'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面が表示されるまで待つ
    await page.waitForSelector('text=検証テストデッキ', { timeout: 5000 });

    // デッキが50枚未満の場合、赤い背景が表示される
    const cardCounter = page.locator('div:has-text("0/50枚")');
    await expect(cardCounter).toHaveClass(/bg-red-600/);
  });

  test('should navigate back to deck list', async ({ page }) => {
    // 新しいデッキを作成
    page.on('dialog', dialog => dialog.accept('ナビゲーションテスト'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面が表示されるまで待つ
    await page.waitForSelector('text=ナビゲーションテスト', { timeout: 5000 });

    // デッキ一覧に戻るボタンをクリック
    await page.click('button:has-text("デッキ一覧に戻る")');

    // デッキリスト画面に戻ることを確認
    await expect(page.locator('h1')).toContainText('デッキビルダー');
    await expect(page.locator('button:has-text("新しいデッキを作成")')).toBeVisible();
  });

  test('should adjust card quantity in deck', async ({ page }) => {
    // 新しいデッキを作成
    page.on('dialog', dialog => dialog.accept('数量調整テスト'));
    await page.click('button:has-text("新しいデッキを作成")');

    // デッキ編集画面が表示されるまで待つ
    await page.waitForSelector('text=数量調整テスト', { timeout: 5000 });
    await page.waitForSelector('.grid > div', { timeout: 10000 });

    // カードを追加
    const firstCard = page.locator('.grid > div').first();
    await firstCard.click();
    await firstCard.click(); // 2枚目を追加

    // 数量が2になることを確認
    await expect(page.locator('text=2/50枚')).toBeVisible({ timeout: 5000 });

    // +ボタンで数量を増やす
    const plusButton = page.locator('button:has-text("+")').first();
    if (await plusButton.isVisible()) {
      await plusButton.click();
      await expect(page.locator('text=3/50枚')).toBeVisible({ timeout: 5000 });
    }
  });
});