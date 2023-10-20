import {
  getBooksByContainQuery,
  getBooksByExceptQuery,
  getBooksByQuery
} from '@/actions';
import { BooksByQuery } from '@/types';

export const baseURL = `https://api.itbook.store/1.0`;

// 검색 방식에 맞는 함수 호출
export const getDataByQuery = async (query: string, page = 1) => {
  let data: BooksByQuery;

  if (query.indexOf('|') > 0) {
    data = await getBooksByContainQuery(query, page);
  } else if (query.indexOf('-') > 0) {
    data = await getBooksByExceptQuery(query, page);
  } else {
    data = await getBooksByQuery(query, page);
  }

  return data;
};
