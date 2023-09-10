'use client';

import React, { useState } from 'react';

import { BookLists, LoadContinue, SearchInputField } from '@/components';
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {!booksByQuery || +booksByQuery?.total === 0 ? (
          <div className="w-full min-h-screen flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3 border-2 rounded-xl">
            Try to search books!
          </div>
        ) : (
          <>
            <BookLists bookInfo={booksByQuery.books} />
            <LoadContinue query={searchQuery} />
          </>
        )}
      </div>
    </main>
  );
}
