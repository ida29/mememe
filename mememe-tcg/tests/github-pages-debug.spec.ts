import { test, expect } from '@playwright/test';

test.describe('GitHub Pages Debug', () => {
  test('Check card data loading on production', async ({ page }) => {
    // コンソールログを収集
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // ネットワークエラーを収集
    const networkErrors: string[] = [];
    page.on('requestfailed', request => {
      networkErrors.push(`Failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    // ページエラーを収集
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // GitHub Pagesにアクセス
    console.log('Accessing GitHub Pages...');
    await page.goto('https://ida29.github.io/mememe/collection/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 少し待機
    await page.waitForTimeout(5000);

    // ログ出力
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

    console.log('\n=== Network Errors ===');
    networkErrors.forEach(err => console.log(err));

    console.log('\n=== Page Errors ===');
    pageErrors.forEach(err => console.log(err));

    // カードの表示状況を確認
    const cardCountText = await page.textContent('text=/\\d+枚のカードが見つかりました/');
    console.log('\n=== Card Count ===');
    console.log('Card count text:', cardCountText);

    // エラーメッセージの有無を確認
    const errorElement = await page.locator('text=/エラー/').first();
    const hasError = await errorElement.isVisible().catch(() => false);
    console.log('Error displayed:', hasError);

    if (hasError) {
      const errorText = await errorElement.textContent();
      console.log('Error message:', errorText);
    }

    // カード要素の数を確認
    const cardElements = await page.locator('[class*="bg-white"][class*="bg-opacity"]').count();
    console.log('Card elements count:', cardElements);

    // ネットワークタブの内容を確認
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('mememe_cards')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // リロードして再度確認
    console.log('\n=== Reloading page ===');
    await page.reload();
    await page.waitForTimeout(3000);

    console.log('\n=== Network Responses ===');
    responses.forEach(res => console.log(JSON.stringify(res)));

    // スクリーンショット保存
    await page.screenshot({ path: 'github-pages-debug.png', fullPage: true });
    console.log('\nScreenshot saved as github-pages-debug.png');
  });
});