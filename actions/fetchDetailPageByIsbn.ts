'use server';

import { BookDetailByIsbn } from '@/types';

// 도서 디테일 정보 함수
export async function fetchDetailByIsbn(isbn13: string) {
  try {
    const response = await fetch(
      `https://api.itbook.store/1.0/books/${isbn13}`
    );

    if (!response.ok) {
      throw new Error('API 요청 오류');
    }

    const data = await response.json();

    return data as BookDetailByIsbn;
  } catch (err) {
    // TODO > 에러처리 필요
    console.error('API 요청 오류:', err);
  }
}
