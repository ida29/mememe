'use client';

import Image from 'next/image';
import { Card } from '@/types/card';

interface CardListProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  className?: string;
}

export default function CardList({ cards, onCardClick, className = '' }: CardListProps) {
  const getCardImagePath = (cardNo: string, rarity: string) => {
    const rarityMap: { [key: string]: string } = {
      'コモン': 'C',
      'アンコモン': 'U',
      'レア': 'R',
      'スーパーレア': 'SR'
    };
    const rarityCode = rarityMap[rarity] || 'C';
    return `/images/cards/${cardNo}_${rarityCode}.jpg`;
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {cards.map((card) => (
        <div
          key={card.cardNo}
          onClick={() => onCardClick?.(card)}
          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-opacity-20 transition-all hover:scale-105"
        >
          <div className="relative aspect-[2/3]">
            <Image
              src={getCardImagePath(card.cardNo, card.rarity)}
              alt={card.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 16.66vw"
              loading="lazy"
            />
          </div>
          <div className="p-2">
            <p className="text-xs text-gray-300">{card.cardNo}</p>
            <p className="text-sm font-bold truncate text-white">{card.name}</p>
            <p className="text-xs text-gray-400">{card.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}