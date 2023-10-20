import { BooksByQuery } from '@/types';
import { baseURL } from '@/utils/common';

// 일반 검색 시 함수
export async function getBooksByQuery(
  query: string,
  page = 1
): Promise<BooksByQuery> {
  const data = await fetch(`${baseURL}/search/${query}/${page}`)
    .then((response) => response.json())
    .catch((err) => {
      // TODO > Error 처리 필요
      console.error('NORMAL ERROR >> ', err);
    });

  return data;
}

// '|'로 검색 시 함수
export async function getBooksByContainQuery(
  query: string,
  page: number = 1
): Promise<BooksByQuery> {
  let orPromise = [];

  const orQuery = query.replace(/ /g, '').split('|');

  orPromise = orQuery.map((keyword) =>
    fetch(`${baseURL}/search/${keyword}/${page}`)
      .then((response) => response.json())
      .catch((err) => {
        // TODO > Error 처리 필요
        console.error(err);
      })
  );

  const orResults = await Promise.all(orPromise);

  return orResults.reduce(
    (result, response) => {
      return {
        total: result.total + response.total,
        page: result.page,
        books: [...result.books, ...response.books]
      };
    },
    { error: '0', total: '0', page: '1', books: [] } as BooksByQuery
  );
}

// '-'로 검색 시 함수
export async function getBooksByExceptQuery(
  query: string,
  page: number = 1
): Promise<BooksByQuery> {
  const searchQuery = query.split('-')[0].replace(/ /g, '').toLowerCase();
  const excludeQuery = query.split('-')[1].replace(/ /g, '').toLowerCase();

  const data = (await fetch(`${baseURL}/search/${searchQuery}/${page}`)
    .then((response) => response.json())
    .catch((err) => {
      // TODO > Error 처리 필요
      console.error(err);
    })) as BooksByQuery;

  const filteredData = data?.books.filter((item) => {
    return !item.title.toLowerCase().includes(excludeQuery);
  });

  return {
    ...data,
    books: filteredData
  };
}
