'use client';

import Image from 'next/image';
import { Card } from '@/types/card';

interface CardDetailProps {
  card: Card;
  onClose?: () => void;
}

export default function CardDetail({ card, onClose }: CardDetailProps) {
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
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-80 aspect-[2/3]">
            <Image
              src={getCardImagePath(card.cardNo, card.rarity)}
              alt={card.name}
              fill
              className="object-contain"
              sizes="320px"
              priority
            />
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-4">{card.name}</h2>
            <div className="space-y-2">
              <p><span className="text-gray-400">カード番号:</span> {card.cardNo}</p>
              <p><span className="text-gray-400">タイプ:</span> {card.type}</p>
              <p><span className="text-gray-400">色:</span> {card.color}</p>
              {card.attribute && (
                <p><span className="text-gray-400">属性:</span> {card.attribute}</p>
              )}
              {card.emotion && (
                <p><span className="text-gray-400">感情:</span> {card.emotion}</p>
              )}
              {card.cost && (
                <div>
                  <p><span className="text-gray-400">コスト:</span> {card.cost.total}</p>
                  {(card.cost.red > 0 || card.cost.blue > 0 || card.cost.yellow > 0 || card.cost.green > 0) && (
                    <p className="text-sm text-gray-300">
                      赤:{card.cost.red} 青:{card.cost.blue} 黄:{card.cost.yellow} 緑:{card.cost.green}
                    </p>
                  )}
                </div>
              )}
              {card.power !== undefined && (
                <p><span className="text-gray-400">パワー:</span> {card.power}</p>
              )}
              <p><span className="text-gray-400">レアリティ:</span> {card.rarity}</p>
              {card.ability && (
                <div>
                  <p className="text-gray-400 mb-2">能力:</p>
                  <div className="text-sm bg-gray-800 rounded p-2">
                    {card.ability}
                  </div>
                </div>
              )}
              {card.is_promo && (
                <p className="text-yellow-400">プロモカード</p>
              )}
              {card.is_parallel && (
                <p className="text-purple-400">パラレルカード</p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                閉じる
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}