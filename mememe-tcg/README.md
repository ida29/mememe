# めめめのくらげ TCG

「めめめのくらげ」に登場するキャラクターを使用した1対1の対戦型トレーディングカードゲームです。

## 🎮 デモ

[GitHub Pagesでプレイ](https://ida29.github.io/mememe/mememe-tcg)

## ✨ 機能

- 📚 **カードコレクション**: 126枚のカードを閲覧
- 🎴 **デッキビルダー**: 50枚のカードでデッキ構築
- ⚔️ **対戦機能**: ターン制バトルシステム
- 💾 **データ永続化**: ローカルストレージにデッキ保存

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **ゲームエンジン**: Phaser 3
- **テスト**: Jest, React Testing Library
- **デプロイ**: GitHub Pages

## 📦 セットアップ

### 必要環境
- Node.js 18.0.0以上
- npm 9.0.0以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/mememe-tcg.git
cd mememe-tcg

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## 📝 コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run test       # テスト実行
npm run lint       # ESLint実行
npm run deploy     # GitHub Pagesへデプロイ
```

## 🎯 ゲームルール

### デッキ構築
- デッキは正確に50枚で構築
- 同じカード番号のカードは4枚まで
- ふれんど、サポート、フィールドの3種類のカード

### 勝利条件
- 相手の負のエネルギーエリアに7枚カードを置く
- 相手のデッキが0枚になる

### ゲームフェーズ
1. **スタートフェーズ** - レスト状態のカードをアクティブに
2. **ドローフェーズ** - デッキから1枚ドロー
3. **エネルギーフェーズ** - デッキトップをエネルギーエリアに
4. **メインフェーズ** - カードプレイ、アタック
5. **エンドフェーズ** - 手札制限処理

## 🏗️ プロジェクト構造

```
mememe-tcg/
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # Reactコンポーネント
│   ├── stores/        # Zustandストア
│   ├── types/         # TypeScript型定義
│   └── game/          # ゲームロジック
├── public/
│   ├── data/          # カードデータJSON
│   └── images/cards/  # カード画像
└── tests/             # テストファイル
```

## 🤝 貢献

プルリクエストを歓迎します！大きな変更を行う場合は、まずissueを開いて変更内容について議論してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

## 🙏 謝辞

- カードイラスト: めめめのくらげ公式
- ゲームシステム参考: 各種TCG