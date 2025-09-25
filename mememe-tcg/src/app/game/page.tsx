'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/game';
import { useDecksStore } from '@/stores/decks';
import { useCardsStore } from '@/stores/cards';
import { GameCard } from '@/types/game';
import { Card } from '@/types/card';
import Image from 'next/image';

export default function GamePage() {
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);

  const {
    gameState,
    initializeGame,
    startGame,
    nextPhase,
    endTurn,
    drawCard,
    playCard,
    restCard,
  } = useGameStore();

  const { decks, getDeckById } = useDecksStore();
  const { cards, loadCards } = useCardsStore();

  useEffect(() => {
    if (cards.length === 0) {
      loadCards();
    }
  }, [cards.length, loadCards]);

  const handleStartGame = () => {
    if (!selectedDeckId) {
      alert('デッキを選択してください');
      return;
    }

    const deck = getDeckById(selectedDeckId);
    if (!deck || deck.cards.length !== 50) {
      alert('有効なデッキを選択してください（50枚必要）');
      return;
    }

    // プレイヤー1のデッキ
    const player1Cards = deck.cards.flatMap(dc =>
      Array(dc.quantity).fill(dc.card)
    );

    // AI用の仮デッキ（同じデッキを使用）
    const player2Cards = [...player1Cards];

    initializeGame(player1Cards, player2Cards);
    startGame();
  };

  const handlePlayCard = (card: GameCard) => {
    if (!gameState || gameState.currentPlayer !== 'player1') return;
    if (gameState.phase !== 'main') {
      alert('メインフェーズでのみカードをプレイできます');
      return;
    }

    playCard('player1', card.id);
  };

  const handleCardClick = (card: GameCard) => {
    setSelectedCard(card);
  };

  const getCardImagePath = (card: Card) => {
    const rarityMap: { [key: string]: string } = {
      'コモン': 'C',
      'アンコモン': 'U',
      'レア': 'R',
      'スーパーレア': 'SR'
    };
    const rarityCode = rarityMap[card.rarity] || 'C';
    return `/images/cards/${card.cardNo}_${rarityCode}.jpg`;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: { [key: string]: string } = {
      'start': 'スタートフェーズ',
      'draw': 'ドローフェーズ',
      'energy': 'エネルギーフェーズ',
      'main': 'メインフェーズ',
      'end': 'エンドフェーズ',
    };
    return labels[phase] || phase;
  };

  if (!gameState) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">ゲーム開始</h2>

          <div className="mb-6">
            <label className="block mb-2">使用するデッキを選択:</label>
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white"
            >
              <option value="">デッキを選択...</option>
              {decks.filter(d => d.cards.reduce((sum, c) => sum + c.quantity, 0) === 50).map(deck => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
            disabled={!selectedDeckId}
          >
            ゲーム開始
          </button>

          {decks.filter(d => d.cards.reduce((sum, c) => sum + c.quantity, 0) === 50).length === 0 && (
            <p className="mt-4 text-sm text-gray-300 text-center">
              ※デッキビルダーで50枚のデッキを作成してください
            </p>
          )}
        </div>
      </div>
    );
  }

  const player1 = gameState.players.player1;
  const player2 = gameState.players.player2;
  const isPlayer1Turn = gameState.currentPlayer === 'player1';

  return (
    <div className="min-h-screen text-white p-4">
      {/* ゲーム情報バー */}
      <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-4 flex justify-between items-center">
        <div>
          <span className="font-bold">ターン {gameState.turn}</span>
          <span className="ml-4">{getPhaseLabel(gameState.phase)}</span>
        </div>
        <div>
          <span className={isPlayer1Turn ? 'text-green-400' : ''}>
            {isPlayer1Turn ? 'あなたのターン' : '相手のターン'}
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={nextPhase}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            disabled={!isPlayer1Turn}
          >
            次のフェーズ
          </button>
          <button
            onClick={endTurn}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            disabled={!isPlayer1Turn}
          >
            ターン終了
          </button>
        </div>
      </div>

      {/* ゲームボード */}
      <div className="grid grid-rows-3 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
        {/* 相手エリア */}
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">相手 (AI)</span>
            <span className="text-sm">
              手札: {player2.hand.length} | デッキ: {player2.deck.length}
            </span>
          </div>
          <div className="flex gap-2">
            {player2.field.map(card => (
              <div
                key={card.id}
                className={`relative w-20 h-28 bg-gray-700 rounded ${
                  card.isRest ? 'rotate-90' : ''
                } transition-transform`}
              >
                <Image
                  src={getCardImagePath(card)}
                  alt={card.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 共有エリア（エネルギーエリアなど） */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4">
            <h3 className="text-sm mb-2">P2 負のエネルギー</h3>
            <div className="text-2xl font-bold">
              {player2.negativeEnergyArea.length}/7
            </div>
          </div>
          <div className="bg-green-900 bg-opacity-30 rounded-lg p-4">
            <h3 className="text-sm mb-2 text-center">フィールド</h3>
            {/* フィールドカードエリア */}
          </div>
          <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4">
            <h3 className="text-sm mb-2">P1 負のエネルギー</h3>
            <div className="text-2xl font-bold">
              {player1.negativeEnergyArea.length}/7
            </div>
          </div>
        </div>

        {/* 自分エリア */}
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">あなた</span>
            <span className="text-sm">
              デッキ: {player1.deck.length} | エネルギー: {player1.energyArea.length}
            </span>
          </div>

          {/* フィールド */}
          <div className="flex gap-2 mb-4 min-h-[120px]">
            {player1.field.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`relative w-20 h-28 bg-gray-700 rounded cursor-pointer hover:ring-2 hover:ring-blue-400 ${
                  card.isRest ? 'rotate-90' : ''
                } transition-all`}
              >
                <Image
                  src={getCardImagePath(card)}
                  alt={card.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
            ))}
          </div>

          {/* 手札 */}
          <div className="flex gap-2 overflow-x-auto">
            {player1.hand.map(card => (
              <div
                key={card.id}
                onClick={() => handlePlayCard(card)}
                className="relative w-20 h-28 bg-gray-700 rounded cursor-pointer hover:ring-2 hover:ring-green-400 hover:-translate-y-2 transition-all flex-shrink-0"
              >
                <Image
                  src={getCardImagePath(card)}
                  alt={card.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ゲームログ */}
      <div className="mt-4 bg-black bg-opacity-50 rounded-lg p-4 max-h-32 overflow-y-auto">
        <h3 className="text-sm font-bold mb-2">ゲームログ</h3>
        <div className="text-xs space-y-1">
          {gameState.gameLog.slice(-5).map((log, index) => (
            <div key={index} className="text-gray-300">
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}