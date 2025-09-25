'use client';

import { Deck } from '@/types/card';

interface DeckListProps {
  decks: Deck[];
  onDeckSelect?: (deck: Deck) => void;
  onDeckDelete?: (deckId: string) => void;
  onCreateNew?: () => void;
}

export default function DeckList({
  decks,
  onDeckSelect,
  onDeckDelete,
  onCreateNew
}: DeckListProps) {
  const calculateDeckStats = (deck: Deck) => {
    const totalCards = deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
    const types = deck.cards.reduce((acc, dc) => {
      acc[dc.card.type] = (acc[dc.card.type] || 0) + dc.quantity;
      return acc;
    }, {} as Record<string, number>);

    return { totalCards, types };
  };

  return (
    <div className="space-y-4">
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="w-full p-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-2xl">+</span>
          新しいデッキを作成
        </button>
      )}

      {decks.length === 0 ? (
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 text-center text-white">
          <p className="text-xl mb-2">デッキがありません</p>
          <p className="text-gray-300">新しいデッキを作成してください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const stats = calculateDeckStats(deck);
            const isValid = stats.totalCards === 50;

            return (
              <div
                key={deck.id}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => onDeckSelect?.(deck)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{deck.name}</h3>
                  {deck.description && (
                    <p className="text-gray-300 text-sm mb-3">{deck.description}</p>
                  )}

                  <div className="space-y-1 mb-3">
                    <p className={`text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                      カード枚数: {stats.totalCards}/50
                    </p>
                    <div className="text-xs text-gray-400">
                      {Object.entries(stats.types).map(([type, count]) => (
                        <span key={type} className="mr-3">
                          {type}: {count}枚
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    更新: {new Date(deck.updatedAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeckSelect?.(deck);
                    }}
                    className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    編集
                  </button>
                  {onDeckDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`「${deck.name}」を削除しますか？`)) {
                          onDeckDelete(deck.id);
                        }
                      }}
                      className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}