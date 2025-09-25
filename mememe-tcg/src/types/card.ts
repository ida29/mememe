export interface Card {
  cardNo: string;
  name: string;
  type: string;
  color: string;
  level?: number;
  cost?: number;
  power?: number;
  abilities?: string[];
  flavorText?: string;
  rarity: string;
  imageUrl?: string;
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