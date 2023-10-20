'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { BookDetailByIsbn } from '@/types';
import { fetchDetailByIsbn } from '@/actions';
import Spinner from '@/utils/Spinner';

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
      {bookDetail ? (
        <div className="p-4 md:pt-8 flex flex-col flex-1 md:flex-row items-center content-center max-w-6xl mx-auto md:space-x-6">
          <div className="flex-1">
            <Image
              src={bookDetail.image}
              alt={bookDetail.title}
              width={500}
              height={300}
              className="rounded-lg"
              placeholder="blur"
              blurDataURL="/spinner.svg"
              style={{
                maxWidth: '100%',
                height: '100%'
              }}
            />
          </div>

          <div className="flex-1">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg mb-3 font-bold">{bookDetail.title} </h2>
                <p className="text-md mb-3">{bookDetail.price}</p>
              </div>
              <h4 className="text-lg mb-3 font-bold">{bookDetail.subtitle}</h4>
            </div>

            <div className="p-2 rounded-xl border-2 mb-3">
              <label>Description</label>
              <p className="mb-3">{bookDetail.desc}</p>
            </div>

            <div className="p-2 rounded-xl border-2">
              This book was written by{' '}
              <span className="font-bold">{bookDetail.authors}</span> and
              received
              <span className="font-bold">
                {' '}
                a rating of {bookDetail.rating}
              </span>
              , total{' '}
              <span className="font-bold">{bookDetail.pages} pages </span>, and
              published by{' '}
              <span className="font-bold">{bookDetail.publisher}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
