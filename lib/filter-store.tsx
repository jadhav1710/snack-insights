// lib/filter-store.ts
'use client';

import { create } from 'zustand';
import React, { createContext, useContext } from 'react';

// 1. Define the full state + action interface
export interface FilterState {
  markets: string[];
  dateRange: { start: Date | null; end: Date | null };
  pilotStoresOnly: boolean;
  searchQuery: string;
  setMarkets: (markets: string[]) => void;
  setDateRange: (dateRange: { start: Date | null; end: Date | null }) => void;
  setPilotStoresOnly: (flag: boolean) => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
}

// 2. Create the Zustand store (state + setters)
export const useFilterStore = create<FilterState>((set) => ({
  markets: [],
  dateRange: { start: null, end: null },
  pilotStoresOnly: false,
  searchQuery: '',
  setMarkets: (markets) => set({ markets }),
  setDateRange: (dateRange) => set({ dateRange }),
  setPilotStoresOnly: (pilotStoresOnly) => set({ pilotStoresOnly }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () =>
    set({
      markets: [],
      dateRange: { start: null, end: null },
      pilotStoresOnly: false,
      searchQuery: '',
    }),
}));

// 3. Create a React context to pass the store value
const FilterContext = createContext<FilterState | null>(null);

// 4. Provider: subscribe once to the store and re-provide on updates
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const store = useFilterStore();  // subscribes to all state & actions
  return <FilterContext.Provider value={store}>{children}</FilterContext.Provider>;
}

// 5. Hook: read from context (guaranteed to be the same store)
export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return ctx;
}
