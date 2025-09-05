'use client';

import { LoadContinue } from '@/utils';

interface SearchResultsClientProps {
  query: string;
  initialPage: number;
}

export function SearchResultsClient({ query, initialPage }: SearchResultsClientProps) {
  // 2페이지부터 무한 스크롤 시작
  return <LoadContinue query={query} startPage={initialPage + 1} />;
}