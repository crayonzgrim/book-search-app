'use client';

import React, { useEffect, useState } from 'react';

import SearchInputField from '@/components/ui/SearchInputField';
import BooksListLayout from '@/components/layout/BookListsLayout';

export default function HomePage() {
  /** Property */
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== undefined) {
      return sessionStorage.getItem('query') ?? '';
    }

    return '';
  });

  /** Function */
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.addEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /** Render */
  return (
    <main className="grow mx-auto">
      <SearchInputField
        query={searchQuery}
        handleSearchQuery={setSearchQuery}
      />
      <BooksListLayout query={searchQuery} />
    </main>
  );
}
