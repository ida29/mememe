'use client';

import { useState, useEffect } from 'react';
import { useDecksStore } from '@/stores/decks';
import { useCardsStore } from '@/stores/cards';
import DeckList from '@/components/DeckList';
import CardList from '@/components/CardList';
import CardDetail from '@/components/CardDetail';
import { Card } from '@/types/card';

export default function DeckBuilderPage() {
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardDetail, setShowCardDetail] = useState(false);

  const {
    decks,
    currentDeck,
    createDeck,
    deleteDeck,
    selectDeck,
    clearCurrentDeck,
    addCardToDeck,
    removeCardFromDeck,
    updateCardQuantity,
    validateDeck,
    getTotalCards,
  } = useDecksStore();

  const {
    cards,
    filteredCards,
    filters,
    loadCards,
    setSearchTerm,
    setTypeFilter,
    setColorFilter,
  } = useCardsStore();

  useEffect(() => {
    if (cards.length === 0) {
      loadCards();
    }
  }, [cards.length, loadCards]);

  const handleCreateNewDeck = () => {
    const name = prompt('デッキ名を入力してください');
    if (name) {
      const deck = createDeck(name);
      selectDeck(deck.id);
      setMode('edit');
    }
  };

  const handleSelectDeck = (deck: typeof decks[0]) => {
    selectDeck(deck.id);
    setMode('edit');
  };

  const handleBackToList = () => {
    clearCurrentDeck();
    setMode('list');
  };

  const handleAddCard = (card: Card) => {
    if (!currentDeck) return;

    const existingCard = currentDeck.cards.find(dc => dc.card.cardNo === card.cardNo);
    if (existingCard && existingCard.quantity >= 4) {
      alert('同じカードは4枚までです');
      return;
    }

    addCardToDeck(currentDeck.id, card);
  };

  const handleRemoveCard = (cardNo: string) => {
    if (!currentDeck) return;
    removeCardFromDeck(currentDeck.id, cardNo);
  };

  const handleQuantityChange = (cardNo: string, quantity: number) => {
    if (!currentDeck) return;
    updateCardQuantity(currentDeck.id, cardNo, quantity);
  };

  if (mode === 'list') {
    return (
      <div className="min-h-screen text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">デッキビルダー</h1>
        <DeckList
          decks={decks}
          onDeckSelect={handleSelectDeck}
          onDeckDelete={deleteDeck}
          onCreateNew={handleCreateNewDeck}
        />
      </div>
    );
  }

  if (!currentDeck) {
    return null;
  }

  const validation = validateDeck(currentDeck.id);
  const totalCards = getTotalCards(currentDeck);

  return (
    <div className="min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
        >
          ← デッキ一覧に戻る
        </button>
        <h1 className="text-3xl font-bold">{currentDeck.name}</h1>
        <div className={`px-4 py-2 rounded ${validation.isValid ? 'bg-green-600' : 'bg-red-600'}`}>
          {totalCards}/50枚
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* デッキカード一覧 */}
        <div className="lg:col-span-1">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">デッキ内容</h2>

            {validation.errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-600 bg-opacity-30 rounded">
                {validation.errors.map((error, index) => (
                  <p key={index} className="text-sm">{error}</p>
                ))}
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-600 bg-opacity-30 rounded">
                {validation.warnings.map((warning, index) => (
                  <p key={index} className="text-sm">{warning}</p>
                ))}
              </div>
            )}

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {currentDeck.cards.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  カードを選択してデッキに追加してください
                </p>
              ) : (
                currentDeck.cards.map((deckCard) => (
                  <div
                    key={deckCard.card.cardNo}
                    className="flex items-center justify-between p-2 bg-black bg-opacity-30 rounded hover:bg-opacity-50"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setSelectedCard(deckCard.card);
                        setShowCardDetail(true);
                      }}
                    >
                      <p className="text-sm font-bold">{deckCard.card.name}</p>
                      <p className="text-xs text-gray-400">
                        {deckCard.card.cardNo} - {deckCard.card.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(deckCard.card.cardNo, deckCard.quantity - 1)}
                        className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded text-xs"
                        disabled={deckCard.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{deckCard.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(deckCard.card.cardNo, deckCard.quantity + 1)}
                        className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-xs"
                        disabled={deckCard.quantity >= 4}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveCard(deckCard.card.cardNo)}
                        className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded text-xs ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* カード選択エリア */}
        <div className="lg:col-span-2">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">カード選択</h2>

            {/* フィルター */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <input
                type="text"
                placeholder="カード名・番号で検索..."
                value={filters.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filters.type}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'ふれんど' | 'サポート' | 'フィールド')}
                className="px-3 py-2 rounded bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべてのタイプ</option>
                <option value="ふれんど">ふれんど</option>
                <option value="サポート">サポート</option>
                <option value="フィールド">フィールド</option>
              </select>
              <select
                value={filters.color}
                onChange={(e) => setColorFilter(e.target.value as 'all' | '赤' | '青' | '緑' | '黄' | '紫' | '無色')}
                className="px-3 py-2 rounded bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* カードリスト */}
            <div className="max-h-[700px] overflow-y-auto">
              <CardList
                cards={filteredCards}
                onCardClick={handleAddCard}
              />
            </div>
          </div>
        </div>
      </div>

      {/* カード詳細モーダル */}
      {showCardDetail && selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => {
            setShowCardDetail(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}