'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchBooksByQuery } from '@/actions/fetchBooksByQuery';
import { BooksInfo } from '@/types';

import { BookLists } from './BookLists';
import { Spinner } from './Spinner';

interface LoadContinueProps {
  query: string;
}

export const LoadContinue = ({ query }: LoadContinueProps) => {
  /** Property */
  const { ref, inView } = useInView();

  const [books, setBooks] = useState<BooksInfo[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);

  const [isKeepFetch, setIsKeepFetch] = useState<boolean | undefined>(
    undefined
  );

  /** Function */
  const handleLoadMore = useCallback(async () => {
    const nextPage = pagesLoaded + 1;
    const newProducts = await fetchBooksByQuery(query, nextPage);

    if (newProducts?.books) {
      if (newProducts?.books?.length > 0) {
        setIsKeepFetch(true);

        setBooks((prev: BooksInfo[]) => [...prev, ...newProducts?.books]);
        setPagesLoaded(nextPage);
      } else {
        setIsKeepFetch(false);
      }
    }
  }, [query, pagesLoaded, isKeepFetch]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView]);

  /** Render */
  return (
    <>
      {isKeepFetch ? (
        <>
          <BookLists bookInfo={books} />
        </>
      ) : null}

      <div
        ref={ref}
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {isKeepFetch ? <Spinner /> : null}
      </div>
    </>
  );
};
