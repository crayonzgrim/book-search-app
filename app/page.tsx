'use client';

import React, { useState } from 'react';

import { SearchInputField } from '@/components';
import { BooksByQuery } from '@/types';

export default function Home() {
  /** Property */
  const [searchQuery, setSearchQuery] = useState('');
  const [booksByQuery, setBooksByQuery] = useState<BooksByQuery | undefined>(
    undefined
  );

  /** Render */
  return (
    <main className="container mx-auto p-4 min-h-screen max-w-5xl">
      <SearchInputField
        query={searchQuery}
        handleSearchQuery={setSearchQuery}
        handleFetchedBooks={setBooksByQuery}
      />
    </main>
  );
}
