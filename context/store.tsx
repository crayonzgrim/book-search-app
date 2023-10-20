'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';
import { BooksByQuery } from '@/types';

interface BooksInfoContextType {
  booksInfo: BooksByQuery;
  setBooksInfo: React.Dispatch<React.SetStateAction<BooksByQuery>>;
}

export const BooksInfoContext = createContext<BooksInfoContextType>({
  booksInfo: {
    books: [],
    error: '0',
    total: '0',
    page: '0'
  },
  setBooksInfo: (): BooksByQuery => ({
    books: [],
    error: '0',
    total: '0',
    page: '0'
  })
});

export const BooksInfoContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [booksInfo, setBooksInfo] = useState<BooksByQuery>({
    books: [],
    error: '0',
    total: '0',
    page: '0'
  });

  return (
    <BooksInfoContext.Provider value={{ booksInfo, setBooksInfo }}>
      {children}
    </BooksInfoContext.Provider>
  );
};

export const useBooksInfoContext = () => useContext(BooksInfoContext);
