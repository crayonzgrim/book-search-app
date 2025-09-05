# 과제 제출 비즈니스 로직

### **1. 검색 쿼리 파서**

**파일**: `utils/search-query-parser.ts`

```typescript
export interface ParsedSearchQuery {
  terms: string[];
  excludeTerms: string[];
  hasOrOperator: boolean;
  hasNotOperator: boolean;
}

export class SearchQueryParser {
  private static readonly OPERATORS = {
    OR: '|',
    NOT: '-'
  } as const;

  static parse(query: string): ParsedSearchQuery {
    if (!query?.trim()) {
      return this.createEmptyResult();
    }

    const result: ParsedSearchQuery = {
      terms: [],
      excludeTerms: [],
      hasOrOperator: false,
      hasNotOperator: false
    };

    let processedQuery = query.trim();

    processedQuery = this.extractExcludeTerms(processedQuery, result);

    this.extractSearchTerms(processedQuery, result);

    return result;
  }

  private static createEmptyResult(): ParsedSearchQuery {
    return {
      terms: [],
      excludeTerms: [],
      hasOrOperator: false,
      hasNotOperator: false
    };
  }

  private static extractExcludeTerms(
    query: string,
    result: ParsedSearchQuery
  ): string {
    const notPattern = new RegExp(
      `\\${this.OPERATORS.NOT}\\s*([^\\s\\${this.OPERATORS.OR}]+)`,
      'g'
    );
    const notMatches = query.match(notPattern);

    if (notMatches) {
      result.hasNotOperator = true;
      notMatches.forEach((match) => {
        const term = match.replace(
          new RegExp(`^\\${this.OPERATORS.NOT}\\s*`),
          ''
        );
        result.excludeTerms.push(term);
        query = query.replace(match, '');
      });
    }

    return query;
  }

  private static extractSearchTerms(
    query: string,
    result: ParsedSearchQuery
  ): void {
    if (query.includes(this.OPERATORS.OR)) {
      result.hasOrOperator = true;

      const orTerms = query
        .split(this.OPERATORS.OR)
        .map((term) => term.trim())
        .filter(Boolean);
      result.terms.push(...orTerms);
    } else {
      const terms = query.split(/\s+/).filter(Boolean);
      result.terms.push(...terms);
    }
  }

  static isValidQuery(parsedQuery: ParsedSearchQuery): boolean {
    return parsedQuery.terms.length > 0 || parsedQuery.excludeTerms.length > 0;
  }
}
```

### **2. 검색 API 로직**

**파일**: `actions/fetchBooksByQuery.ts`

```typescript
import { BooksByQuery } from '@/types';
import { SearchQueryParser } from '@/utils/search-query-parser';

const API_BASE_URL = 'https://api.itbook.store/1.0/search';

export async function fetchBooksByQuery(
  query: string,
  page: number = 1
): Promise<BooksByQuery | undefined> {
  try {
    const parsedQuery = SearchQueryParser.parse(query);

    if (!SearchQueryParser.isValidQuery(parsedQuery)) {
      return { total: '0', page: '1', books: [] };
    }

    if (parsedQuery.hasOrOperator) {
      return await handleOrSearch(parsedQuery.terms, page);
    }

    if (parsedQuery.hasNotOperator) {
      return await handleNotSearch(
        parsedQuery.terms[0],
        parsedQuery.excludeTerms,
        page
      );
    }

    return await handleSimpleSearch(parsedQuery.terms.join(' '), page);
  } catch (err) {
    console.error('API 요청 오류:', err);
    return undefined;
  }
}

async function handleOrSearch(
  terms: string[],
  page: number
): Promise<BooksByQuery> {
  const searchPromises = terms.map((keyword) =>
    fetch(`${API_BASE_URL}/${keyword.trim()}/${page}`).then((response) =>
      response.json()
    )
  );

  const results = await Promise.all(searchPromises);
  return combineSearchResults(results);
}

async function handleNotSearch(
  mainTerm: string,
  excludeTerms: string[],
  page: number
): Promise<BooksByQuery> {
  const response = await fetch(`${API_BASE_URL}/${mainTerm}/${page}`);
  const data = (await response.json()) as BooksByQuery;

  const filteredBooks =
    data.books?.filter((book) => {
      const title = book.title.toLowerCase();
      return !excludeTerms.some((excludeTerm) =>
        title.includes(excludeTerm.toLowerCase())
      );
    }) || [];

  return {
    ...data,
    books: filteredBooks
  };
}

async function handleSimpleSearch(
  searchTerm: string,
  page: number
): Promise<BooksByQuery> {
  const response = await fetch(`${API_BASE_URL}/${searchTerm}/${page}`);
  return await response.json();
}

function combineSearchResults(results: BooksByQuery[]): BooksByQuery {
  const allBooks = results.flatMap((result) => result.books || []);
  const totalCount = results.reduce(
    (sum, result) => sum + parseInt(result.total || '0'),
    0
  );

  const uniqueBooks = allBooks.filter(
    (book, index, arr) =>
      arr.findIndex((b) => b.isbn13 === book.isbn13) === index
  );

  return {
    total: totalCount.toString(),
    page: '1',
    books: uniqueBooks
  };
}
```

### **3. NextJS 메타데이터 생성 로직**

**파일**: `app/search/page.tsx`

```typescript
import { Metadata } from 'next';
import { SearchQueryParser } from '@/utils/search-query-parser';

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({
  searchParams
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';

  if (!query) {
    return {
      title: 'Search Books',
      description: 'Search for programming books using advanced operators'
    };
  }

  const parsedQuery = SearchQueryParser.parse(query);
  const searchType = parsedQuery.hasOrOperator
    ? 'OR'
    : parsedQuery.hasNotOperator
    ? 'NOT'
    : 'AND';

  return {
    title: `Search: "${query}" | Book Search`,
    description: `Search results for "${query}" using ${searchType} search. Find programming books with advanced search operators.`,
    openGraph: {
      title: `Book Search Results: ${query}`,
      description: `Discover books about ${query}`,
      type: 'website'
    }
  };
}
```

### **4. ISR 정적 생성 로직**

**파일**: `app/search/[id]/page.tsx`

```typescript
import { Metadata } from 'next';
import { fetchBooksByQuery, fetchDetailByIsbn } from '@/actions';

export const revalidate = 86400;

interface BookDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  try {
    const popularSearches = [
      'javascript',
      'python',
      'react',
      'nodejs',
      'typescript'
    ];
    const staticParams: { id: string }[] = [];

    for (const search of popularSearches.slice(0, 2)) {
      const results = await fetchBooksByQuery(search, 1);
      if (results?.books) {
        staticParams.push(
          ...results.books.slice(0, 3).map((book) => ({ id: book.isbn13 }))
        );
      }
    }

    return staticParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params
}: BookDetailPageProps): Promise<Metadata> {
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
      description:
        bookDetail.desc ||
        `Learn about ${bookDetail.title} by ${bookDetail.authors}`,
      openGraph: {
        title: bookDetail.title,
        description: bookDetail.desc || `A book by ${bookDetail.authors}`,
        images: [{ url: bookDetail.image }],
        type: 'book',
        authors: [bookDetail.authors]
      },
      twitter: {
        card: 'summary_large_image',
        title: bookDetail.title,
        description: bookDetail.desc || `A book by ${bookDetail.authors}`,
        images: [bookDetail.image]
      }
    };
  } catch (error) {
    return {
      title: 'Book Details',
      description: 'View detailed information about this book.'
    };
  }
}
```

### **5. 무한 스크롤 상태 관리 로직**

**파일**: `utils/LoadContinue.tsx`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchBooksByQuery } from '@/actions';
import { BooksInfo } from '@/types';

interface LoadContinueProps {
  query: string;
  startPage?: number;
}

export const LoadContinue = ({ query, startPage = 2 }: LoadContinueProps) => {
  const { ref, inView } = useInView();

  const [books, setBooks] = useState<BooksInfo[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(startPage - 1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasMoreData, setHasMoreData] = useState<boolean | undefined>(
    undefined
  );

  const handleLoadMore = useCallback(async () => {
    if (currentQuery !== query) {
      setCurrentQuery(query);
      setBooks([]);
      setPagesLoaded(1);
      return;
    }

    const nextPage = pagesLoaded + 1;
    const newBooks = await fetchBooksByQuery(query, nextPage);

    if (newBooks?.books && newBooks.books.length > 0) {
      setHasMoreData(true);
      setBooks((prev: BooksInfo[]) => [...prev, ...newBooks.books]);
      setPagesLoaded(nextPage);
    } else {
      setHasMoreData(false);
    }
  }, [query, pagesLoaded, currentQuery, startPage]);

  useEffect(() => {
    if (inView || currentQuery !== query) {
      handleLoadMore();
    }
  }, [inView, currentQuery, query, handleLoadMore]);

  return { books, hasMoreData, observerRef: ref };
};
```
