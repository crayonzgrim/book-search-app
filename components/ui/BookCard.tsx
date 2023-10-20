import { Book } from '@/types';
import { createId } from '@/utils/common';
import { Card } from './Card';
import ToURLButton from './ToURLButton';
import BookInfo from './BookInfo';

export type Props = {
  book: Book;
};

export default function BookCard({
  book: { title, subtitle, image, url, isbn13 }
}: Props) {
  return (
    <Card key={createId()} className="flex items-center justify-center">
      <div className="mt-4 mb-2 px-10">
        <ToURLButton
          text={'Get the book'}
          url={url}
          className="bg-amber-500 py-2 px-4 rounded-lg text-white w-full"
        />
      </div>
      <BookInfo title={title} subtitle={subtitle} image={image} isbn={isbn13} />
    </Card>
  );
}
