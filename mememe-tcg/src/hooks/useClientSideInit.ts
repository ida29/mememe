import { useEffect, useState } from 'react';

export function useClientSideInit() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行されることを保証
    setIsClient(true);
  }, []);

  return isClient;
}