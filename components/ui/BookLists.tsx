import { Book } from '@/types';
import BookCard from './BookCard';

export type props = {
  books: Book[];
};

export default function BookLists({ books }: props) {
  return (
    <>
      {books.map((book) => {
        return <BookCard key={book.isbn13} book={book} />;
      })}
    </>
  );
}
