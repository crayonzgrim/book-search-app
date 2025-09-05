'use client';

import React, { useState } from 'react';
import { BookLists, SearchInputField } from '@/components';
import { BooksByQuery } from '@/types';
import { LoadContinue } from '@/utils';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [booksByQuery, setBooksByQuery] = useState<BooksByQuery | undefined>(undefined);

  return (
    <section>
      <SearchInputField
        query={searchQuery}
        handleSearchQuery={setSearchQuery}
        handleFetchedBooks={setBooksByQuery}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {!booksByQuery || +booksByQuery?.total === 0 ? (
          <div className="w-full min-h-[200px] flex flex-col justify-center items-center p-8 col-span-1 sm:col-span-2 md:col-span-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter keywords to find books. Try using | for OR search or - to exclude terms.
              </p>
            </div>
          </div>
        ) : (
          <>
            <BookLists bookInfo={booksByQuery.books} />
            <LoadContinue query={searchQuery} />
          </>
        )}
      </div>
    </section>
  );
}