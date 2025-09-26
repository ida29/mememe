import { create } from 'zustand';
import { Card, CardType, CardColor, CardRarity } from '@/types/card';

interface CardFilters {
  searchTerm: string;
  type: CardType | 'all';
  color: CardColor | 'all';
  rarity: CardRarity | 'all';
}

interface CardsState {
  cards: Card[];
  filteredCards: Card[];
  filters: CardFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCards: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: CardType | 'all') => void;
  setColorFilter: (color: CardColor | 'all') => void;
  setRarityFilter: (rarity: CardRarity | 'all') => void;
  resetFilters: () => void;
  getCardByNumber: (cardNo: string) => Card | undefined;
}

const defaultFilters: CardFilters = {
  searchTerm: '',
  type: 'all',
  color: 'all',
  rarity: 'all',
};

const applyFilters = (cards: Card[], filters: CardFilters): Card[] => {
  let filtered = cards;

  if (filters.searchTerm) {
    filtered = filtered.filter(card =>
      card.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      card.cardNo.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }

  if (filters.type !== 'all') {
    filtered = filtered.filter(card => card.type === filters.type);
  }

  if (filters.color !== 'all') {
    filtered = filtered.filter(card => card.color === filters.color);
  }

  if (filters.rarity !== 'all') {
    filtered = filtered.filter(card => card.rarity === filters.rarity);
  }

  return filtered;
};

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  filteredCards: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  loadCards: async () => {
    set({ isLoading: true, error: null });
    try {
      // GitHub Pages用にbasePathを考慮
      // window.location.pathnameでサブパスでのホスティングを検出
      let basePath = '';
      if (typeof window !== 'undefined' && window.location.pathname.includes('/mememe')) {
        basePath = '/mememe';
      }
      const response = await fetch(`${basePath}/data/mememe_cards_complete.json`);
      if (!response.ok) {
        throw new Error('カードデータの読み込みに失敗しました');
      }
      const cards = await response.json();
      set(state => ({
        cards,
        filteredCards: applyFilters(cards, state.filters),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
        isLoading: false,
      });
    }
  },

  setSearchTerm: (term) => {
    set(state => ({
      filters: { ...state.filters, searchTerm: term },
      filteredCards: applyFilters(state.cards, { ...state.filters, searchTerm: term }),
    }));
  },

  setTypeFilter: (type) => {
    set(state => ({
      filters: { ...state.filters, type },
      filteredCards: applyFilters(state.cards, { ...state.filters, type }),
    }));
  },

  setColorFilter: (color) => {
    set(state => ({
      filters: { ...state.filters, color },
      filteredCards: applyFilters(state.cards, { ...state.filters, color }),
    }));
  },

  setRarityFilter: (rarity) => {
    set(state => ({
      filters: { ...state.filters, rarity },
      filteredCards: applyFilters(state.cards, { ...state.filters, rarity }),
    }));
  },

  resetFilters: () => {
    set(state => ({
      filters: defaultFilters,
      filteredCards: state.cards,
    }));
  },

  getCardByNumber: (cardNo) => {
    return get().cards.find(card => card.cardNo === cardNo);
  },
}));