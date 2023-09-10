'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

type ProviderProps = {
  children: React.ReactNode;
};

export default function ProvidersForTheme({ children }: ProviderProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <div className="dark:bg-gray-700 dark:text-gray-200 text-gray-700 transition-colors duration-300 min-h-screen">
        {children}
      </div>
    </ThemeProvider>
  );
}
