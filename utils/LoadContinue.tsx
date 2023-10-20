'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { BooksByQuery } from '@/types';
import { useBooksInfoContext } from '@/context/store';
import { getDataByQuery } from '@/utils/common';
import Spinner from './Spinner';

interface LoadContinueProps {
  query: string;
}

export default function LoadContinue({ query }: LoadContinueProps) {
  /** Property */
  const { booksInfo, setBooksInfo } = useBooksInfoContext();

  const { ref, inView } = useInView();

  const [pagesLoaded, setPagesLoaded] = useState(1);

  const [isKeepFetch, setIsKeepFetch] = useState(false);

  /** Function */
  const handleLoadMore = useCallback(async () => {
    const nextPage = pagesLoaded + 1;

    await getDataByQuery(query, nextPage)
      .then((books) => {
        setIsKeepFetch(true);

        setTimeout(() => {
          if (booksInfo) {
            const combineBooks = [...booksInfo.books, ...books.books];

            setBooksInfo((prev: BooksByQuery) => ({
              ...prev,
              books: combineBooks
            }));
          }
        }, 1200);

        setPagesLoaded(nextPage);
      })
      .catch((err) => {
        // TODO > error handling 필요
        console.error(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsKeepFetch(false);
        }, 1200);
      });
  }, [query, booksInfo, pagesLoaded]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView]);

  /** Render */
  return (
    <div ref={ref} className="flex items-center justify-center w-full">
      {isKeepFetch ? <Spinner /> : null}
    </div>
  );
}
