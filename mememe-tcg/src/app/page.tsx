import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-8">
          めめめのくらげ TCG
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          「めめめのくらげ」に登場するふれんど（キャラクター）を使用した
          <br />
          1対1の対戦型トレーディングカードゲーム
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-3">コレクション</h2>
            <p className="text-gray-300 mb-4">
              全カードを閲覧し、お気に入りを見つけよう
            </p>
            <Link
              href="/collection"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              カードを見る
            </Link>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-3">デッキ構築</h2>
            <p className="text-gray-300 mb-4">
              50枚のカードで最強のデッキを作ろう
            </p>
            <Link
              href="/deck-builder"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              デッキを作る
            </Link>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-3">対戦</h2>
            <p className="text-gray-300 mb-4">
              作ったデッキで勝負を挑もう
            </p>
            <Link
              href="/game"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              対戦を始める
            </Link>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-3">ゲームルール</h3>
          <ul className="text-gray-300 text-left space-y-2">
            <li>• デッキは正確に50枚で構築</li>
            <li>• 同じカード番号のカードは4枚まで</li>
            <li>• ふれんど、サポート、フィールドの3種類のカード</li>
            <li>• 勝利条件：相手の負のエネルギーエリアに7枚カードを置く、または相手のデッキを0枚にする</li>
          </ul>
        </div>
      </div>
    </div>
  );
}