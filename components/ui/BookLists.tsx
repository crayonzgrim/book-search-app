'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BooksInfo } from '@/types';
import { Card, CardContent } from './Card';

export interface BookListsProps {
  bookInfo: BooksInfo[];
}

export const BookLists = ({ bookInfo }: BookListsProps) => {
  return bookInfo.map((book, index) => {
    const { title, subtitle, image, url, isbn13 } = book;

    const uuid = crypto.randomUUID();

    return (
      <Card key={uuid}>
        <button
          type="button"
          className="bg-amber-500 py-2 px-4 rounded-lg text-white m-2"
          onClick={(e) => {
            e.preventDefault();
            window.open(url, '_blank');
          }}
        >
          Buy
        </button>

        <Link href={`/search/${isbn13}`}>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className="sm:rounded-t-lg group-hover:opacity-80 transition-opacity duration-200"
              placeholder="blur"
              blurDataURL="/spinner.svg"
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
            <div className="px-2">
              <h2 className="text-lg font-bold mt-1">{title}</h2>
              <p className="line-clamp-2">{subtitle}</p>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  });
};
