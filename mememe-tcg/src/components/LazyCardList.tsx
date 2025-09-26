'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/types/card';
import CardList from './CardList';

interface LazyCardListProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  initialLoadCount?: number;
  loadMoreCount?: number;
}

export default function LazyCardList({
  cards,
  onCardClick,
  initialLoadCount = 24,
  loadMoreCount = 12
}: LazyCardListProps) {
  const [displayCount, setDisplayCount] = useState(initialLoadCount);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const displayedCards = cards.slice(0, displayCount);
  const hasMore = displayCount < cards.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // 実際のロード時間をシミュレート
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + loadMoreCount, cards.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, loadMoreCount, cards.length]);

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    if (!currentLoadMoreRef || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(currentLoadMoreRef);

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMore, hasMore]);

  useEffect(() => {
    setDisplayCount(initialLoadCount);
  }, [cards, initialLoadCount]);

  return (
    <div className="space-y-8">
      <CardList
        cards={displayedCards}
        onCardClick={onCardClick}
      />

      {hasMore && (
        <>
          <div ref={loadMoreRef} className="h-4" />

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white">カードを読み込み中...</span>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>読み込み中...</span>
                </span>
              ) : (
                `もっと見る (${displayCount} / ${cards.length})`
              )}
            </button>
          </div>
        </>
      )}

      {!hasMore && cards.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-300">すべてのカードを表示しました ({cards.length}枚)</p>
        </div>
      )}
    </div>
  );
}