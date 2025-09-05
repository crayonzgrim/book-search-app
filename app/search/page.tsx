import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchBooksByQuery } from '@/actions';
import { SearchQueryParser } from '@/utils/search-query-parser';
import { BookLists } from '@/components';
import { SearchResultsClient } from './components/SearchResultsClient';

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  
  if (!query) {
    return {
      title: 'Search Books',
      description: 'Search for programming books using advanced operators'
    };
  }

  const parsedQuery = SearchQueryParser.parse(query);
  const searchType = parsedQuery.hasOrOperator ? 'OR' : parsedQuery.hasNotOperator ? 'NOT' : 'AND';
  
  return {
    title: `Search: "${query}" | Book Search`,
    description: `Search results for "${query}" using ${searchType} search. Find programming books with advanced search operators.`,
    openGraph: {
      title: `Book Search Results: ${query}`,
      description: `Discover books about ${query}`,
      type: 'website',
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  const page = parseInt(searchParams.page || '1');

  if (!query) {
    return (
      <main className="mx-auto p-4 max-w-5xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Search Books</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter a search term to find programming books
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto p-4 max-w-5xl">
      {/* 검색 헤더 */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          Search Results for <span className="text-blue-600">"{query}"</span>
        </h1>
        <SearchQueryInfo query={query} />
      </div>

      {/* 검색 결과 - Suspense로 감싸서 Streaming */}
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </main>
  );
}

// 검색 쿼리 정보 표시
function SearchQueryInfo({ query }: { query: string }) {
  const parsedQuery = SearchQueryParser.parse(query);
  
  if (!parsedQuery.hasOrOperator && !parsedQuery.hasNotOperator) {
    return null;
  }

  return (
    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {parsedQuery.hasOrOperator && (
        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded mr-2">
          OR Search
        </span>
      )}
      {parsedQuery.hasNotOperator && (
        <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1 rounded">
          NOT Search
        </span>
      )}
    </div>
  );
}

// 서버에서 검색 결과 로드
async function SearchResults({ query, page }: { query: string; page: number }) {
  try {
    const initialResults = await fetchBooksByQuery(query, page);

    if (!initialResults || !initialResults.books || initialResults.books.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No results found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try different keywords or check your spelling
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Go back to search
          </Link>
        </div>
      );
    }

    return (
      <div>
        {/* 결과 통계 */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Found {initialResults.total} results
        </div>

        {/* 초기 결과 (SSR) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <BookLists bookInfo={initialResults.books} />
        </div>

        {/* 무한 스크롤 (CSR) */}
        <SearchResultsClient query={query} initialPage={page} />
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Search Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Something went wrong while searching. Please try again.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Go back to search
        </Link>
      </div>
    );
  }
}

function SearchResultsSkeleton() {
  return (
    <div>
      <div className="mb-6 h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}