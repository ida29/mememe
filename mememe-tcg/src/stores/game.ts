import { create } from 'zustand';
import {
  GameState,
  GamePhase,
  PlayerID,
  GameCard,
  GameAction,
  GameActionType,
  CardLocation,
  PlayerState,
  GameLogEntry
} from '@/types/game';
import { Card } from '@/types/card';

interface GameStore {
  gameState: GameState | null;

  // Game lifecycle
  initializeGame: (player1Deck: Card[], player2Deck: Card[]) => void;
  startGame: () => void;
  endGame: (winner: PlayerID) => void;
  resetGame: () => void;

  // Phase management
  nextPhase: () => void;
  setPhase: (phase: GamePhase) => void;

  // Turn management
  endTurn: () => void;

  // Card actions
  drawCard: (playerId: PlayerID, count?: number) => void;
  playCard: (playerId: PlayerID, cardId: string) => void;
  moveCard: (cardId: string, from: CardLocation, to: CardLocation) => void;
  restCard: (cardId: string) => void;
  activeCard: (cardId: string) => void;

  // Battle actions
  attack: (attackerId: string, defenderId?: string) => void;

  // Utilities
  getPlayerState: (playerId: PlayerID) => PlayerState | null;
  getCardById: (cardId: string) => GameCard | null;
  checkWinCondition: () => PlayerID | null;
  addToLog: (action: GameAction, message: string) => void;
}

// カードをGameCardに変換
const createGameCard = (card: Card, owner: PlayerID, location: CardLocation): GameCard => {
  return {
    ...card,
    id: `${owner}_${card.cardNo}_${Date.now()}_${Math.random()}`,
    owner,
    location,
    isRest: false,
    attachedCards: [],
  };
};

// デッキをシャッフル
const shuffleDeck = (deck: GameCard[]): GameCard[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,

  initializeGame: (player1Deck, player2Deck) => {
    const player1Cards = player1Deck.map(card =>
      createGameCard(card, 'player1', 'deck')
    );
    const player2Cards = player2Deck.map(card =>
      createGameCard(card, 'player2', 'deck')
    );

    const gameState: GameState = {
      id: `game_${Date.now()}`,
      phase: 'start',
      turn: 1,
      currentPlayer: 'player1',
      players: {
        player1: {
          id: 'player1',
          name: 'プレイヤー1',
          deck: shuffleDeck(player1Cards),
          hand: [],
          field: [],
          energyArea: [],
          negativeEnergyArea: [],
          trash: [],
          life: 0,
        },
        player2: {
          id: 'player2',
          name: 'プレイヤー2',
          deck: shuffleDeck(player2Cards),
          hand: [],
          field: [],
          energyArea: [],
          negativeEnergyArea: [],
          trash: [],
          life: 0,
        },
      },
      winner: null,
      isGameOver: false,
      lastAction: null,
      gameLog: [],
    };

    set({ gameState });

    // 初期手札を引く
    get().drawCard('player1', 7);
    get().drawCard('player2', 7);
  },

  startGame: () => {
    set(state => {
      if (!state.gameState) return state;

      return {
        gameState: {
          ...state.gameState,
          phase: 'draw',
        },
      };
    });

    get().addToLog(
      { type: 'START_GAME', playerId: 'player1' },
      'ゲーム開始！'
    );
  },

  endGame: (winner) => {
    set(state => {
      if (!state.gameState) return state;

      return {
        gameState: {
          ...state.gameState,
          winner,
          isGameOver: true,
        },
      };
    });

    get().addToLog(
      { type: 'SURRENDER', playerId: winner },
      `${winner === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}の勝利！`
    );
  },

  resetGame: () => {
    set({ gameState: null });
  },

  nextPhase: () => {
    const state = get().gameState;
    if (!state || state.isGameOver) return;

    const phaseOrder: GamePhase[] = ['start', 'draw', 'energy', 'main', 'end'];
    const currentIndex = phaseOrder.indexOf(state.phase);
    const nextIndex = (currentIndex + 1) % phaseOrder.length;

    if (nextIndex === 0) {
      // 次のターンへ
      get().endTurn();
    } else {
      get().setPhase(phaseOrder[nextIndex]);
    }
  },

  setPhase: (phase) => {
    set(state => {
      if (!state.gameState) return state;

      return {
        gameState: {
          ...state.gameState,
          phase,
        },
      };
    });

    // フェーズごとの自動処理
    const state = get().gameState;
    if (!state) return;

    switch (phase) {
      case 'start':
        // レスト状態のカードをアクティブに
        const player = state.players[state.currentPlayer];
        const updatedField = player.field.map(card => ({ ...card, isRest: false }));
        set({
          gameState: {
            ...state,
            players: {
              ...state.players,
              [state.currentPlayer]: {
                ...player,
                field: updatedField,
              },
            },
          },
        });
        break;
      case 'draw':
        // カードを1枚ドロー
        if (state.turn > 1) {
          get().drawCard(state.currentPlayer, 1);
        }
        break;
      case 'energy':
        // デッキトップをエネルギーエリアに（プレイヤーの選択が必要）
        break;
    }
  },

  endTurn: () => {
    set(state => {
      if (!state.gameState) return state;

      const nextPlayer = state.gameState.currentPlayer === 'player1' ? 'player2' : 'player1';

      return {
        gameState: {
          ...state.gameState,
          turn: state.gameState.turn + 1,
          currentPlayer: nextPlayer,
          phase: 'start',
        },
      };
    });

    const state = get().gameState;
    if (state) {
      get().addToLog(
        { type: 'END_TURN', playerId: state.currentPlayer },
        `ターン${state.turn}開始 - ${state.currentPlayer === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}のターン`
      );
    }
  },

  drawCard: (playerId, count = 1) => {
    set(state => {
      if (!state.gameState) return state;

      const player = state.gameState.players[playerId];
      const drawnCards = player.deck.slice(0, count);
      const newDeck = player.deck.slice(count);
      const newHand = [...player.hand, ...drawnCards.map(card => ({
        ...card,
        location: 'hand' as CardLocation,
      }))];

      return {
        gameState: {
          ...state.gameState,
          players: {
            ...state.gameState.players,
            [playerId]: {
              ...player,
              deck: newDeck,
              hand: newHand,
            },
          },
        },
      };
    });

    get().addToLog(
      { type: 'DRAW_CARD', playerId },
      `${playerId === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}が${count}枚ドロー`
    );

    // デッキ切れチェック
    const winner = get().checkWinCondition();
    if (winner) {
      get().endGame(winner);
    }
  },

  playCard: (playerId, cardId) => {
    set(state => {
      if (!state.gameState) return state;

      const player = state.gameState.players[playerId];
      const card = player.hand.find(c => c.id === cardId);
      if (!card) return state;

      const newHand = player.hand.filter(c => c.id !== cardId);
      const newField = [...player.field, { ...card, location: 'field' as CardLocation }];

      return {
        gameState: {
          ...state.gameState,
          players: {
            ...state.gameState.players,
            [playerId]: {
              ...player,
              hand: newHand,
              field: newField,
            },
          },
        },
      };
    });

    const card = get().getCardById(cardId);
    if (card) {
      get().addToLog(
        { type: 'PLAY_CARD', playerId, cardId },
        `${playerId === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}が「${card.name}」をプレイ`
      );
    }
  },

  moveCard: (cardId, from, to) => {
    // 実装省略（カードの移動ロジック）
  },

  restCard: (cardId) => {
    set(state => {
      if (!state.gameState) return state;

      const updateCard = (cards: GameCard[]) =>
        cards.map(card =>
          card.id === cardId ? { ...card, isRest: true } : card
        );

      return {
        gameState: {
          ...state.gameState,
          players: {
            player1: {
              ...state.gameState.players.player1,
              field: updateCard(state.gameState.players.player1.field),
            },
            player2: {
              ...state.gameState.players.player2,
              field: updateCard(state.gameState.players.player2.field),
            },
          },
        },
      };
    });
  },

  activeCard: (cardId) => {
    set(state => {
      if (!state.gameState) return state;

      const updateCard = (cards: GameCard[]) =>
        cards.map(card =>
          card.id === cardId ? { ...card, isRest: false } : card
        );

      return {
        gameState: {
          ...state.gameState,
          players: {
            player1: {
              ...state.gameState.players.player1,
              field: updateCard(state.gameState.players.player1.field),
            },
            player2: {
              ...state.gameState.players.player2,
              field: updateCard(state.gameState.players.player2.field),
            },
          },
        },
      };
    });
  },

  attack: (attackerId, defenderId) => {
    // 実装省略（バトルロジック）
  },

  getPlayerState: (playerId) => {
    const state = get().gameState;
    return state ? state.players[playerId] : null;
  },

  getCardById: (cardId) => {
    const state = get().gameState;
    if (!state) return null;

    for (const player of Object.values(state.players)) {
      const allCards = [
        ...player.deck,
        ...player.hand,
        ...player.field,
        ...player.energyArea,
        ...player.negativeEnergyArea,
        ...player.trash,
      ];

      const card = allCards.find(c => c.id === cardId);
      if (card) return card;
    }

    return null;
  },

  checkWinCondition: () => {
    const state = get().gameState;
    if (!state) return null;

    // 勝利条件1: 相手の負のエネルギーエリアに7枚
    if (state.players.player1.negativeEnergyArea.length >= 7) {
      return 'player2';
    }
    if (state.players.player2.negativeEnergyArea.length >= 7) {
      return 'player1';
    }

    // 勝利条件2: 相手のデッキが0枚
    if (state.players.player1.deck.length === 0) {
      return 'player2';
    }
    if (state.players.player2.deck.length === 0) {
      return 'player1';
    }

    return null;
  },

  addToLog: (action, message) => {
    set(state => {
      if (!state.gameState) return state;

      const logEntry: GameLogEntry = {
        timestamp: new Date(),
        action,
        message,
        phase: state.gameState.phase,
        turn: state.gameState.turn,
      };

      return {
        gameState: {
          ...state.gameState,
          lastAction: action,
          gameLog: [...state.gameState.gameLog, logEntry],
        },
      };
    });
  },
}));