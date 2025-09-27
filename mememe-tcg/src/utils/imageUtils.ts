/**
 * カード画像のパスを生成するユーティリティ
 */
export function getCardImagePath(cardNo: string, rarity: string): string {
  // レアリティコードはすでに'C', 'U', 'R', 'SR'形式
  const rarityCode = rarity;

  // カード番号の処理: "F-013 (P)" → "F-013-P"
  const processedCardNo = cardNo.replace(' (P)', '-P');

  // GitHub Pages用にbasePathを考慮
  const basePath = typeof window !== 'undefined' && window.location.pathname.includes('/mememe')
    ? '/mememe'
    : '';

  return `${basePath}/images/cards/${processedCardNo}_${rarityCode}.jpg`;
}

/**
 * 画像読み込みエラー時の代替画像パス
 */
export function getPlaceholderImagePath(): string {
  const basePath = typeof window !== 'undefined' && window.location.pathname.includes('/mememe')
    ? '/mememe'
    : '';

  return `${basePath}/images/placeholder-card.jpg`;
}

/**
 * 画像URLを完全なURLに変換（GitHub Pages対応）
 */
export function getAbsoluteImageUrl(imagePath: string): string {
  if (typeof window === 'undefined') {
    return imagePath;
  }

  // すでに絶対URLの場合はそのまま返す
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const { protocol, hostname } = window.location;

  // GitHub Pagesの場合
  if (hostname === 'ida29.github.io') {
    // /mememe プレフィックスがない場合は追加
    if (!imagePath.startsWith('/mememe')) {
      imagePath = '/mememe' + imagePath;
    }
    return `${protocol}//${hostname}${imagePath}`;
  }

  // 開発環境の場合
  return imagePath;
}