import React from 'react';

export default function IconWrapper({ children }: { children: React.ReactNode }) {
  return <span aria-hidden className="inline-flex">{children}</span>;
}
