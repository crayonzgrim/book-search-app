import Image from 'next/image';

import { BookDetailByIsbn } from '@/types';

export type Props = {
  bookDetail: BookDetailByIsbn;
};

export default function BookDetail({
  bookDetail: {
    image,
    title,
    price,
    subtitle,
    desc,
    authors,
    rating,
    pages,
    publisher
  }
}: Props) {
  return (
    <div className="p-4 md:pt-8 flex flex-col flex-1 md:flex-row items-center content-center max-w-6xl mx-auto md:space-x-6">
      <div className="flex-1">
        <Image
          src={image}
          alt={title}
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
            <h2 className="text-lg mb-3 font-bold">{title} </h2>
            <p className="text-md mb-3">{price}</p>
          </div>
          <h4 className="text-lg mb-3 font-bold">{subtitle}</h4>
        </div>

        <div className="p-2 rounded-xl border-2 mb-3">
          <label>Description</label>
          <p className="mb-3">{desc}</p>
        </div>

        <div className="p-2 rounded-xl border-2">
          This book was written by <span className="font-bold">{authors}</span>{' '}
          and received
          <span className="font-bold"> a rating of {rating}</span>, total{' '}
          <span className="font-bold">{pages} pages </span>, and published by{' '}
          <span className="font-bold">{publisher}</span>
        </div>
      </div>
    </div>
  );
}
