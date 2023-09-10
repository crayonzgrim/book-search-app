'use client';

import { SearchInputField } from '@/components';
import React, { useState } from 'react';

export default function Home() {
  /** Property */
  const [searchQuery, setSearchQuery] = useState('');

  /** Render */
  return (
    <main className="container mx-auto p-4 min-h-screen max-w-5xl">
      <SearchInputField
        query={searchQuery}
        handleSearchQuery={setSearchQuery}
      />
    </main>
  );
}
