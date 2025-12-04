'use client';

import { useEffect, useState } from 'react';
import { useTaiKhoanStore } from '@/zustand/taikhoan-store';

interface ClientHydrationProps {
  children: React.ReactNode;
}

/**
 * Client-side hydration wrapper to prevent SSR/client mismatch
 * Ensures authentication state is properly initialized before rendering
 */
export default function ClientHydration({ children }: ClientHydrationProps) {
  const [isClient, setIsClient] = useState(false);
  const { isHydrated, hydrate } = useTaiKhoanStore();

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Ensure store is hydrated
    if (!isHydrated) {
      hydrate();
    }
  }, [isHydrated, hydrate]);

  // Don't render until we're client-side and hydrated
  if (!isClient || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}