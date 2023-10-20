'use client';

import React, { useCallback, useState } from 'react';

import { useBooksInfoContext } from '@/context/store';
import { getDataByQuery } from '@/utils/common';
import { Spinner } from './Spinner';

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

export const SearchInputField = (props: SearchInputProps) => {
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
    [query]
  );

  /** Render */
  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-between align-center max-w-6xl mx-auto mt-6 mb-6"
    >
      <input
        type="text"
        placeholder="Search book keywords..."
        value={query ?? ''}
        onChange={(e) => handleSearchQuery(e.target.value)}
        className={`w-full h-14 rounded-lg placeholder-gray-500 border-2 ${
          query.length > 0
            ? 'border-amber-600 outline-amber-600'
            : 'border-gray-400'
        } outline-amber-600 bg-transparent px-4 py-4`}
      />
      <button
        type="submit"
        disabled={!query}
        className="font-bold bg-amber-500 px-8 rounded-lg disabled:bg-gray-200 ml-5 disabled:text-gray-300"
      >
        {isLoading ? <Spinner /> : 'Search'}
      </button>
    </form>
  );
};
