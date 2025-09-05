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

  // ISBN으로 중복 제거
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
