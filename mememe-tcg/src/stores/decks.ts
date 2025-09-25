import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Deck, DeckCard, Card } from '@/types/card';

interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface DecksState {
  decks: Deck[];
  currentDeck: Deck | null;

  // Actions
  createDeck: (name: string, description?: string) => Deck;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  deleteDeck: (deckId: string) => void;
  selectDeck: (deckId: string) => void;
  clearCurrentDeck: () => void;

  // Card management
  addCardToDeck: (deckId: string, card: Card, quantity?: number) => void;
  removeCardFromDeck: (deckId: string, cardNo: string) => void;
  updateCardQuantity: (deckId: string, cardNo: string, quantity: number) => void;

  // Validation
  validateDeck: (deckId: string) => DeckValidation;

  // Utilities
  getDeckById: (deckId: string) => Deck | undefined;
  getTotalCards: (deck: Deck) => number;
  exportDeck: (deckId: string) => string;
  importDeck: (deckData: string) => Deck | null;
}

const generateId = () => {
  return `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const validateDeckRules = (deck: Deck): DeckValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Calculate total cards
  const totalCards = deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);

  // Rule 1: Exactly 50 cards
  if (totalCards !== 50) {
    errors.push(`デッキは正確に50枚でなければなりません（現在: ${totalCards}枚）`);
  }

  // Rule 2: Maximum 4 of the same card
  deck.cards.forEach(dc => {
    if (dc.quantity > 4) {
      errors.push(`「${dc.card.name}」は4枚までです（現在: ${dc.quantity}枚）`);
    }
  });

  // Warning: Balance check
  const typeCount: Record<string, number> = {};
  deck.cards.forEach(dc => {
    typeCount[dc.card.type] = (typeCount[dc.card.type] || 0) + dc.quantity;
  });

  if (!typeCount['ふれんど'] || typeCount['ふれんど'] < 10) {
    warnings.push('ふれんどカードが少なすぎる可能性があります');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const useDecksStore = create<DecksState>()(
  persist(
    (set, get) => ({
      decks: [],
      currentDeck: null,

      createDeck: (name, description) => {
        const newDeck: Deck = {
          id: generateId(),
          name,
          description,
          cards: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          decks: [...state.decks, newDeck],
          currentDeck: newDeck,
        }));

        return newDeck;
      },

      updateDeck: (deckId, updates) => {
        set(state => ({
          decks: state.decks.map(deck =>
            deck.id === deckId
              ? { ...deck, ...updates, updatedAt: new Date() }
              : deck
          ),
          currentDeck: state.currentDeck?.id === deckId
            ? { ...state.currentDeck, ...updates, updatedAt: new Date() }
            : state.currentDeck,
        }));
      },

      deleteDeck: (deckId) => {
        set(state => ({
          decks: state.decks.filter(deck => deck.id !== deckId),
          currentDeck: state.currentDeck?.id === deckId ? null : state.currentDeck,
        }));
      },

      selectDeck: (deckId) => {
        const deck = get().getDeckById(deckId);
        if (deck) {
          set({ currentDeck: deck });
        }
      },

      clearCurrentDeck: () => {
        set({ currentDeck: null });
      },

      addCardToDeck: (deckId, card, quantity = 1) => {
        set(state => {
          const deck = state.decks.find(d => d.id === deckId);
          if (!deck) return state;

          const existingCard = deck.cards.find(dc => dc.card.cardNo === card.cardNo);
          let updatedCards: DeckCard[];

          if (existingCard) {
            // Update quantity if card exists
            const newQuantity = Math.min(existingCard.quantity + quantity, 4);
            updatedCards = deck.cards.map(dc =>
              dc.card.cardNo === card.cardNo
                ? { ...dc, quantity: newQuantity }
                : dc
            );
          } else {
            // Add new card
            updatedCards = [...deck.cards, { card, quantity: Math.min(quantity, 4) }];
          }

          const updatedDeck = { ...deck, cards: updatedCards, updatedAt: new Date() };

          return {
            decks: state.decks.map(d => d.id === deckId ? updatedDeck : d),
            currentDeck: state.currentDeck?.id === deckId ? updatedDeck : state.currentDeck,
          };
        });
      },

      removeCardFromDeck: (deckId, cardNo) => {
        set(state => {
          const deck = state.decks.find(d => d.id === deckId);
          if (!deck) return state;

          const updatedCards = deck.cards.filter(dc => dc.card.cardNo !== cardNo);
          const updatedDeck = { ...deck, cards: updatedCards, updatedAt: new Date() };

          return {
            decks: state.decks.map(d => d.id === deckId ? updatedDeck : d),
            currentDeck: state.currentDeck?.id === deckId ? updatedDeck : state.currentDeck,
          };
        });
      },

      updateCardQuantity: (deckId, cardNo, quantity) => {
        if (quantity < 1 || quantity > 4) return;

        set(state => {
          const deck = state.decks.find(d => d.id === deckId);
          if (!deck) return state;

          const updatedCards = deck.cards.map(dc =>
            dc.card.cardNo === cardNo ? { ...dc, quantity } : dc
          );
          const updatedDeck = { ...deck, cards: updatedCards, updatedAt: new Date() };

          return {
            decks: state.decks.map(d => d.id === deckId ? updatedDeck : d),
            currentDeck: state.currentDeck?.id === deckId ? updatedDeck : state.currentDeck,
          };
        });
      },

      validateDeck: (deckId) => {
        const deck = get().getDeckById(deckId);
        if (!deck) {
          return { isValid: false, errors: ['デッキが見つかりません'], warnings: [] };
        }
        return validateDeckRules(deck);
      },

      getDeckById: (deckId) => {
        return get().decks.find(deck => deck.id === deckId);
      },

      getTotalCards: (deck) => {
        return deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
      },

      exportDeck: (deckId) => {
        const deck = get().getDeckById(deckId);
        if (!deck) return '';

        const exportData = {
          name: deck.name,
          description: deck.description,
          cards: deck.cards.map(dc => ({
            cardNo: dc.card.cardNo,
            quantity: dc.quantity,
          })),
        };

        return JSON.stringify(exportData, null, 2);
      },

      importDeck: (deckData) => {
        try {
          const data = JSON.parse(deckData);
          // Note: This would need card data to reconstruct full Card objects
          // For now, returning null as we need the cards store
          return null;
        } catch {
          return null;
        }
      },
    }),
    {
      name: 'mememe-tcg-decks',
      storage: createJSONStorage(() => localStorage),
    }
  )
);