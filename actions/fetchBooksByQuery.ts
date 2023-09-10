'use server';

import { BooksByQuery } from '@/types';

export async function fetchBooksByQuery(query: string, page: number = 1) {
  try {
    const data = await fetch(
      `https://api.itbook.store/1.0/search/${query}/${page}`
    ).then((response) => response.json());

    return data as BooksByQuery;
  } catch (err) {
    // TODO > 에러처리 필요
    console.error('API 요청 오류:', err);
  }
}
