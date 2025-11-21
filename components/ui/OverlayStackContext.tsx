'use client';

import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';

type OverlayItem = {
  id: string;
  onClose: () => void;
};

type OverlayStackContextValue = {
  register: (id: string, onClose: () => void) => void;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
};

const OverlayStackContext = createContext<OverlayStackContextValue | null>(null);

export function OverlayStackProvider({ children }: { children: React.ReactNode }) {
  const stackRef = useRef<OverlayItem[]>([]);

  const register = useCallback((id: string, onClose: () => void) => {
    // push to stack
    stackRef.current = [...stackRef.current, { id, onClose }];
  }, []);

  const unregister = useCallback((id: string) => {
    stackRef.current = stackRef.current.filter((it) => it.id !== id);
  }, []);

  const isTop = useCallback((id: string) => {
    const top = stackRef.current[stackRef.current.length - 1];
    return !!top && top.id === id;
  }, []);

  // single global ESC handler that closes only the topmost overlay
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const top = stackRef.current[stackRef.current.length - 1];
      if (top && typeof top.onClose === 'function') {
        top.onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const value = { register, unregister, isTop };

  return <OverlayStackContext.Provider value={value}>{children}</OverlayStackContext.Provider>;
}

export function useOverlayStack() {
  return useContext(OverlayStackContext);
}

export default OverlayStackContext;
