'use client';

import React, { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Tailwind width class, e.g. 'w-[80%]' or 'md:w-[600px] w-full'
  widthClass?: string;
  children?: React.ReactNode;
  backdropClassName?: string;
  panelClassName?: string;
}

export default function SlideOverLayout({
  isOpen,
  onClose,
  widthClass = 'w-[80%]',
  children,
  backdropClassName = 'fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity duration-300 opacity-100',
  panelClassName = 'fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0',
}: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={backdropClassName} onClick={onClose} />
      <div className={`${panelClassName} ${widthClass}`}>{children}</div>
    </>
  );
}
