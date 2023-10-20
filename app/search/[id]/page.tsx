'use client';

import React, { useEffect, useState } from 'react';

import { BookDetailByIsbn } from '@/types';
import BookDetail from '@/components/ui/BookDetail';
import { fetchDetailByIsbn } from '@/actions';

export default function SearchPage({ params }: any) {
  const searchId = params.id;

  const [bookDetail, setBookDetail] = useState<BookDetailByIsbn | undefined>(
    undefined
  );

  const handleFetchByISBN = async (id: string) => {
    const data = await fetchDetailByIsbn(id);

    setBookDetail(data);
  };

  useEffect(() => {
    handleFetchByISBN(searchId);
  }, [searchId]);

  return (
    <div
      className={`w-full flex items-center justify-center ${
        bookDetail ? '' : 'min-h-screen'
      }`}
    >
      {bookDetail && <BookDetail bookDetail={bookDetail} />}
    </div>
  );
}
