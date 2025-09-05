'use client';

import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchBooksByQuery } from '@/actions';
import { BookLists, Spinner } from '@/components';
import { BooksInfo } from '@/types';

interface LoadContinueProps {
  query: string;
  startPage?: number;
}

export const LoadContinue = ({ query, startPage = 2 }: LoadContinueProps) => {
  /** Property */
  const { ref, inView } = useInView();

  const [books, setBooks] = useState<BooksInfo[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(startPage - 1);
  const [currentQuery, setCurrentQuery] = useState('');

  const [hasMoreData, setHasMoreData] = useState<boolean | undefined>(
    undefined
  );

  /** Function */
  const handleLoadMore = useCallback(async () => {
    // 쿼리 변경 시 상태 초기화
    if (currentQuery !== query) {
      setCurrentQuery(query);
      setBooks([]);
      setPagesLoaded(1);
      return;
    }

    const nextPage = pagesLoaded + 1;
    const newBooks = await fetchBooksByQuery(query, nextPage);

    if (newBooks?.books && newBooks.books.length > 0) {
      setHasMoreData(true);
      setBooks((prev: BooksInfo[]) => [...prev, ...newBooks.books]);
      setPagesLoaded(nextPage);
    } else {
      setHasMoreData(false);
    }
  }, [query, pagesLoaded, currentQuery]);

  useEffect(() => {
    if (inView || currentQuery !== query) {
      handleLoadMore();
    }
  }, [inView, currentQuery, query]);

  /** Render */
  return (
    <>
      {hasMoreData && <BookLists bookInfo={books} />}

      <div
        ref={ref}
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {hasMoreData && <Spinner />}
      </div>
    </>
  );
};
