import { Card } from './card';

export type GamePhase =
  | 'start'      // スタートフェーズ
  | 'draw'       // ドローフェーズ
  | 'energy'     // エネルギーフェーズ
  | 'main'       // メインフェーズ
  | 'end';       // エンドフェーズ

export type PlayerID = 'player1' | 'player2';

export interface GameCard extends Card {
  id: string;           // ゲーム内での一意のID
  owner: PlayerID;      // カードの所有者
  location: CardLocation;
  isRest: boolean;      // レスト状態かどうか
  attachedCards: GameCard[];  // 付属カード（エネルギーなど）
  modifiedPower?: number;      // 修正後のパワー
}

export type CardLocation =
  | 'deck'
  | 'hand'
  | 'field'
  | 'energyArea'
  | 'negativeEnergyArea'
  | 'trash';

export interface PlayerState {
  id: PlayerID;
  name: string;
  deck: GameCard[];
  hand: GameCard[];
  field: GameCard[];              // フィールド上のカード
  energyArea: GameCard[];          // エネルギーエリア
  negativeEnergyArea: GameCard[];  // 負のエネルギーエリア
  trash: GameCard[];               // トラッシュ
  life: number;                    // ライフポイント（使用する場合）
}

export interface GameState {
  id: string;
  phase: GamePhase;
  turn: number;
  currentPlayer: PlayerID;
  players: {
    player1: PlayerState;
    player2: PlayerState;
  };
  winner: PlayerID | null;
  isGameOver: boolean;
  lastAction: GameAction | null;
  gameLog: GameLogEntry[];
}

export interface GameAction {
  type: GameActionType;
  playerId: PlayerID;
  cardId?: string;
  targetId?: string;
  sourceLocation?: CardLocation;
  targetLocation?: CardLocation;
  metadata?: Record<string, unknown>;
}

export type GameActionType =
  | 'START_GAME'
  | 'DRAW_CARD'
  | 'PLAY_CARD'
  | 'ATTACK'
  | 'ACTIVATE_ABILITY'
  | 'REST_CARD'
  | 'ACTIVE_CARD'
  | 'MOVE_CARD'
  | 'END_TURN'
  | 'SURRENDER';

export interface GameLogEntry {
  timestamp: Date;
  action: GameAction;
  message: string;
  phase: GamePhase;
  turn: number;
}

export interface BattleResult {
  attacker: GameCard;
  defender: GameCard | null;
  damage: number;
  defeated: boolean;
  additionalEffects?: string[];
}

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
}