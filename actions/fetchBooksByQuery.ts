'use server';

import { BooksByQuery } from '@/types';

export async function fetchBooksByQuery(query: string, page: number = 1) {
  let orPromise = [];

  try {
    let result: BooksByQuery = {
      total: '',
      page: '',
      books: []
    };

    if (query.includes('|')) {
      const operatedQuery = query.split('|');
      orPromise = operatedQuery.map((keyword) =>
        fetch(
          `https://api.itbook.store/1.0/search/${keyword.trim()}/${page}`
        ).then((response) => response.json())
      );

      const orResults = await Promise.all(orPromise);

      const combinedBooks = orResults.reduce(
        (result, response) => {
          return {
            total: result.total + response.total,
            page: result.page,
            books: [...result.books, ...response.books]
          };
        },
        { total: '0', page: '1', books: [] } as BooksByQuery
      );

      result = combinedBooks as BooksByQuery;
      // return combinedBooks;
    } else if (query.includes('-')) {
      const searchQuery = query.split('-')[0].toLowerCase();
      const excludeQuery = query.split('-')[1].toLowerCase();

      const data = (await fetch(
        `https://api.itbook.store/1.0/search/${searchQuery}/${page}`
      ).then((response) => response.json())) as BooksByQuery;

      const filteredData = data?.books.filter((item) => {
        return !item.title.toLowerCase().includes(excludeQuery);
      });

      const combineData = {
        ...data,
        books: filteredData
      };

      result = combineData as BooksByQuery;
      // return combineData as BooksByQuery;
    } else {
      const data = await fetch(
        `https://api.itbook.store/1.0/search/${query}/${page}`
      ).then((response) => response.json());

      result = data as BooksByQuery;
      // return data as BooksByQuery;
    }

    return result;
  } catch (err) {
    // TODO > 에러처리 필요
    console.error('API 요청 오류:', err);
  }
}
