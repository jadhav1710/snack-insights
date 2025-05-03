// app/client-root.tsx
'use client';

import React from 'react';
import ThemeProvider   from '@/components/theme-provider';
import { FilterProvider } from '@/lib/filter-store';
import { BasicAuth }       from '@/lib/basic-auth';
import FilterBar           from '@/components/filter-bar';
import Toaster             from '@/components/ui/toaster';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
    >
      <BasicAuth>
        <FilterProvider>
          <div className="flex min-h-screen flex-col">
            <FilterBar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
          <Toaster />
        </FilterProvider>
      </BasicAuth>
    </ThemeProvider>
  );
}
