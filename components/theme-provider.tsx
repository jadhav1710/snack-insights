// components/theme-provider.tsx
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  // No-op until next-themes is fixed for Next 14
  return <>{children}</>;
}
