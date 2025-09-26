'use client';

import { useEffect, useState } from 'react';
import { useCardsStore } from '@/stores/cards';
import LazyCardList from '@/components/LazyCardList';
import CardDetail from '@/components/CardDetail';
import { Card } from '@/types/card';

export default function CollectionPage() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const {
    cards,
    filteredCards,
    filters,
    isLoading,
    error,
    loadCards,
    setSearchTerm,
    setTypeFilter,
    setColorFilter,
  } = useCardsStore();

  useEffect(() => {
    console.log('Collection page useEffect - cards.length:', cards.length, 'isLoading:', isLoading);
    if (cards.length === 0 && !isLoading) {
      console.log('Loading cards from collection page');
      loadCards();
    }
  }, [cards.length, isLoading, loadCards]);

  // コンポーネントマウント時に強制的にロード
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cards.length === 0 && !isLoading) {
        console.log('Force loading cards after mount');
        loadCards();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cards.length, isLoading, loadCards]);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">カードを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-red-500">エラー: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">カードコレクション</h1>

      <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="カード名・番号で検索..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.type}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'ふれんど' | 'サポート' | 'フィールド')}
            className="px-4 py-2 rounded bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべてのタイプ</option>
            <option value="ふれんど">ふれんど</option>
            <option value="サポート">サポート</option>
            <option value="フィールド">フィールド</option>
          </select>
          <select
            value={filters.color}
            onChange={(e) => setColorFilter(e.target.value as 'all' | '赤' | '青' | '緑' | '黄' | '紫' | '無色')}
            className="px-4 py-2 rounded bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべての色</option>
            <option value="赤">赤</option>
            <option value="青">青</option>
            <option value="緑">緑</option>
            <option value="黄">黄</option>
            <option value="紫">紫</option>
            <option value="無色">無色</option>
          </select>
        </div>
        <div className="mt-4 text-gray-300 text-sm">
          {filteredCards.length}枚のカードが見つかりました
        </div>
      </div>

      <LazyCardList
        cards={filteredCards}
        onCardClick={handleCardClick}
        initialLoadCount={24}
        loadMoreCount={12}
      />

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}