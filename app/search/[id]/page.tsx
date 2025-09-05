import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchDetailByIsbn } from '@/actions';
import { fetchBooksByQuery } from '@/actions';

interface BookDetailPageProps {
  params: { id: string };
}

// ISR - 24시간마다 재생성
export const revalidate = 86400;

// 인기 도서들을 미리 Static Generation
export async function generateStaticParams() {
  try {
    // 인기 검색어들의 첫 번째 결과들을 미리 생성
    const popularSearches = ['javascript', 'python', 'react', 'nodejs', 'typescript'];
    const staticParams: { id: string }[] = [];

    for (const search of popularSearches.slice(0, 2)) {
      const results = await fetchBooksByQuery(search, 1);
      if (results?.books) {
        staticParams.push(...results.books.slice(0, 3).map(book => ({ id: book.isbn13 })));
      }
    }

    return staticParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  try {
    const bookDetail = await fetchDetailByIsbn(params.id);
    
    if (!bookDetail || bookDetail.error) {
      return {
        title: 'Book Not Found',
        description: 'The requested book could not be found.'
      };
    }

    return {
      title: `${bookDetail.title} | Book Details`,
      description: bookDetail.desc || `Learn about ${bookDetail.title} by ${bookDetail.authors}`,
      openGraph: {
        title: bookDetail.title,
        description: bookDetail.desc || `A book by ${bookDetail.authors}`,
        images: [{ url: bookDetail.image }],
        type: 'book',
        authors: [bookDetail.authors],
      },
      twitter: {
        card: 'summary_large_image',
        title: bookDetail.title,
        description: bookDetail.desc || `A book by ${bookDetail.authors}`,
        images: [bookDetail.image],
      },
    };
  } catch (error) {
    return {
      title: 'Book Details',
      description: 'View detailed information about this book.'
    };
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  try {
    const bookDetail = await fetchDetailByIsbn(params.id);

    if (!bookDetail || bookDetail.error) {
      notFound();
    }

    return (
      <main className="mx-auto p-4 max-w-4xl">
        {/* 네비게이션 */}
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Home
          </Link>
        </nav>

        {/* 책 상세 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* 책 이미지 */}
            <div className="md:w-1/3 p-6">
              <img
                src={bookDetail.image}
                alt={bookDetail.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
            </div>

            {/* 책 정보 */}
            <div className="md:w-2/3 p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {bookDetail.title}
                  </h1>
                  {bookDetail.subtitle && (
                    <h2 className="text-xl text-gray-600 dark:text-gray-300">
                      {bookDetail.subtitle}
                    </h2>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Author:</span> {bookDetail.authors}
                  </div>
                  <div>
                    <span className="font-semibold">Publisher:</span> {bookDetail.publisher}
                  </div>
                  <div>
                    <span className="font-semibold">Year:</span> {bookDetail.year}
                  </div>
                  <div>
                    <span className="font-semibold">Pages:</span> {bookDetail.pages}
                  </div>
                  <div>
                    <span className="font-semibold">Language:</span> {bookDetail.language}
                  </div>
                  <div>
                    <span className="font-semibold">Rating:</span> {bookDetail.rating}/5
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-green-600">{bookDetail.price}</span>
                </div>

                {/* 설명 */}
                {bookDetail.desc && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {bookDetail.desc}
                    </p>
                  </div>
                )}

                {/* PDF 다운로드 링크들 */}
                {bookDetail.pdf && Object.keys(bookDetail.pdf).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Available Resources</h3>
                    <div className="space-y-2">
                      {Object.entries(bookDetail.pdf).map(([key, url]) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          {key}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 관련 도서 추천 (선택사항) */}
        <RelatedBooks currentBook={bookDetail} />
      </main>
    );
  } catch (error) {
    console.error('Error loading book details:', error);
    notFound();
  }
}

// 관련 도서 추천 컴포넌트
async function RelatedBooks({ currentBook }: { currentBook: any }) {
  try {
    // 제목의 첫 번째 단어로 관련 도서 검색
    const firstWord = currentBook.title.split(' ')[0].toLowerCase();
    const relatedBooks = await fetchBooksByQuery(firstWord, 1);
    
    if (!relatedBooks?.books || relatedBooks.books.length <= 1) {
      return null;
    }

    // 현재 책 제외
    const filteredBooks = relatedBooks.books.filter(book => book.isbn13 !== currentBook.isbn13);

    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.slice(0, 4).map((book) => (
            <Link
              key={book.isbn13}
              href={`/search/${book.isbn13}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-sm line-clamp-2" title={book.title}>
                {book.title}
              </h3>
              <p className="text-green-600 font-bold mt-2">{book.price}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading related books:', error);
    return null;
  }
}