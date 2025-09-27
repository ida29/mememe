'use client';

import Image from 'next/image';
import { Card } from '@/types/card';
import { getCardImagePath } from '@/utils/imageUtils';
import { useState } from 'react';

interface CardListProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  className?: string;
}

export default function CardList({ cards, onCardClick, className = '' }: CardListProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (cardNo: string) => {
    setImageErrors(prev => ({ ...prev, [cardNo]: true }));
    console.error(`Failed to load image for card: ${cardNo}`);
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
            {imageErrors[card.cardNo] ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center p-4">
                  <p className="text-gray-400 text-xs">画像読み込みエラー</p>
                  <p className="text-white text-sm mt-1">{card.name}</p>
                </div>
              </div>
            ) : (
              <Image
                src={getCardImagePath(card.cardNo, card.rarity)}
                alt={card.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 16.66vw"
                loading="lazy"
                onError={() => handleImageError(card.cardNo)}
              />
            )}
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