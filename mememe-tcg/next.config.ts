import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 静的HTMLエクスポート
  basePath: process.env.NODE_ENV === 'production' ? '/mememe/mememe-tcg' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mememe/mememe-tcg' : '',
  outputFileTracingRoot: '/Users/yida/work/mememe/mememe-tcg',
  images: {
    unoptimized: true, // GitHub Pages用に画像最適化を無効化
  },
  trailingSlash: true,  // GitHub Pages用にトレイリングスラッシュを追加
  experimental: {
    serverSourceMaps: false,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;
