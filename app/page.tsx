import { Suspense } from 'react';
import { fetchBooksByQuery } from '@/actions';
import { SearchSection } from '@/components/sections/SearchSection';
import { PopularBooks } from '@/components/sections/PopularBooks';

// 인기 검색어들 (실제로는 DB나 분석 데이터에서 가져올 수 있음)
const POPULAR_SEARCHES = ['javascript', 'python', 'react', 'nextjs', 'typescript'];

async function getPopularBooksData() {
  // 인기 검색어들의 결과를 미리 로드
  const popularBooksPromises = POPULAR_SEARCHES.slice(0, 3).map(search => 
    fetchBooksByQuery(search, 1)
  );
  
  const results = await Promise.allSettled(popularBooksPromises);
  return results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)
    .filter(data => data?.books?.length > 0);
}

export default async function HomePage() {
  // 서버에서 인기 도서들 미리 로드
  const popularBooksData = await getPopularBooksData();

  return (
    <main className="mx-auto p-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Book Search</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for books using advanced operators like | (OR) and - (NOT)
        </p>
      </div>

      {/* 검색 섹션 - Client Component */}
      <SearchSection />

      {/* 인기 도서들 - Server Component */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Books</h2>
        <Suspense fallback={<PopularBooksSkeleton />}>
          <PopularBooks data={popularBooksData} searches={POPULAR_SEARCHES.slice(0, 3)} />
        </Suspense>
      </section>

      {/* 검색 가이드 */}
      <section className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Search Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">javascript|python</code> - Find books about JavaScript OR Python</li>
          <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">react -tutorial</code> - Find React books but exclude tutorials</li>
          <li><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">node.js web</code> - Find books about both Node.js AND web</li>
        </ul>
      </section>
    </main>
  );
}

function PopularBooksSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse" />
      ))}
    </div>
  );
}
