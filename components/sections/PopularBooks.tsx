import Link from 'next/link';
import { BooksByQuery } from '@/types';
import { BookLists } from '@/components';

interface PopularBooksProps {
  data: BooksByQuery[];
  searches: string[];
}

export function PopularBooks({ data, searches }: PopularBooksProps) {
  return (
    <div className="space-y-8">
      {data.map((booksData, index) => (
        <div key={searches[index]} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize">{searches[index]} Books</h3>
            <Link 
              href={`/search?q=${encodeURIComponent(searches[index])}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <BookLists bookInfo={booksData.books.slice(0, 4)} />
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Popular books will be loaded here</p>
        </div>
      )}
    </div>
  );
}