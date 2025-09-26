export interface RawCardData {
  number: string;
  name: string;
  type: string;
  color: string;
  attribute?: string;
  emotion?: string;
  cost?: {
    total: number;
    red: number;
    blue: number;
    yellow: number;
    green: number;
    colorless: number;
  };
  power?: number;
  ability?: string;
  image_url?: string;
  rarity: string;
  is_promo?: boolean;
  is_parallel?: boolean;
}

export interface Card {
  cardNo: string;
  name: string;
  type: string;
  color: string;
  attribute?: string;
  emotion?: string;
  cost?: {
    total: number;
    red: number;
    blue: number;
    yellow: number;
    green: number;
    colorless: number;
  };
  power?: number;
  ability?: string;
  image_url?: string;
  rarity: string;
  is_promo?: boolean;
  is_parallel?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: DeckCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckCard {
  card: Card;
  quantity: number;
}

export type CardType = 'ふれんど' | 'サポート' | 'フィールド';
export type CardColor = '赤' | '青' | '緑' | '黄' | '紫' | '無色';
export type CardRarity = 'コモン' | 'アンコモン' | 'レア' | 'スーパーレア';

// RawCardDataをCardに変換するユーティリティ関数
export function transformRawCardData(rawCard: RawCardData): Card {
  return {
    cardNo: rawCard.number,
    name: rawCard.name,
    type: rawCard.type,
    color: rawCard.color,
    attribute: rawCard.attribute,
    emotion: rawCard.emotion,
    cost: rawCard.cost,
    power: rawCard.power,
    ability: rawCard.ability,
    image_url: rawCard.image_url,
    rarity: rawCard.rarity,
    is_promo: rawCard.is_promo,
    is_parallel: rawCard.is_parallel,
  };
}