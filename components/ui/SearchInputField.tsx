'use client';

import React, { useCallback, useState } from 'react';

import { useBooksInfoContext } from '@/context/store';
import { getDataByQuery } from '@/utils/common';
import SearchButton from './SearchButton';

type SearchInputProps = {
  query: string;
  handleSearchQuery: (query: string) => void;
};

export enum LoadingStatus {
  NORMAL = 'normal',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export default function SearchInputField(props: SearchInputProps) {
  /** Property */
  const { query, handleSearchQuery } = props;

  const { setBooksInfo } = useBooksInfoContext();

  const [isLoading, setIsLoading] = useState(LoadingStatus.NORMAL);

  /** Function */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(LoadingStatus.LOADING);

      await getDataByQuery(query)
        .then((data) => {
          if (data) {
            setIsLoading(LoadingStatus.SUCCESS);
            setBooksInfo(data);
          }
        })
        .catch((err) => {
          // TODO > Error 처리 필요
          setIsLoading(LoadingStatus.ERROR);
        });

      setTimeout(() => {
        setIsLoading(LoadingStatus.NORMAL);
      }, 1500);
    },
    [query, setBooksInfo]
  );

  /** Render */
  return (
    <form
      className="flex justify-between align-center mt-6 mb-12 max-w-5xl mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Search book keywords..."
        value={query ?? ''}
        onChange={(e) => {
          handleSearchQuery(e.target.value);
          window.sessionStorage.setItem('query', e.target.value);
        }}
        className={`w-full h-14 rounded-lg placeholder-gray-500 border-2 ${
          query.length > 0
            ? 'border-amber-600 outline-amber-600'
            : 'border-gray-400'
        } outline-amber-600 bg-transparent px-4 py-4`}
      />
      <SearchButton isLoading={isLoading} query={query} />
    </form>
  );
}
