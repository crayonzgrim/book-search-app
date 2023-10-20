import { useBooksInfoContext } from '@/context/store';
import LoadContinue from '@/utils/LoadContinue';
import BookLists from '../ui/BookLists';

type Props = {
  query: string;
};

export default function BooksListLayout({ query }: Props) {
  const { booksInfo } = useBooksInfoContext();

  if (+booksInfo.page > 0) {
    const { books } = booksInfo;

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <BookLists books={books} />
        </div>
        <LoadContinue query={query} />
      </>
    );
  } else {
    return (
      <div className="flex justify-center items-center w-full h-screen p-4 border-4 rounded-xl">
        <p className="text-2xl">Try to search books!</p>
      </div>
    );
  }
}
