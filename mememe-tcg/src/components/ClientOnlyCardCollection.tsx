'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CollectionPage = dynamic(() => import('../app/collection/page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-2xl">コレクションページを読み込み中...</div>
    </div>
  ),
});

export default function ClientOnlyCardCollection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">読み込み中...</div>
      </div>
    );
  }

  return <CollectionPage />;
}