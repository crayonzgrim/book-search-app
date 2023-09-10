import React from 'react';
import Link from 'next/link';
import { ThemeSwitch } from '../ui';

export const Header = () => {
  return (
    <div className="flex justify-end items-center mx-2 max-w-6xl sm:mx-auto py-6">
      <ThemeSwitch />

      <div className="flex items-center ml-3">
        <Link href="/">
          <h2 className="flex items-center text-2xl">
            <span className="font-bold bg-amber-500 py-1 px-4 py-2 rounded-lg mr-1">
              BOOK SEARCH APP
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};
