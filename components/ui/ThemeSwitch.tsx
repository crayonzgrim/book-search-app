'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MdLightMode } from 'react-icons/md';
import { BsFillMoonFill } from 'react-icons/bs';

export const ThemeSwitch = () => {
  /** Property */
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const [mounted, setMounted] = useState(false);

  /** Function */
  useEffect(() => {
    setMounted(true);
  }, []);

  /** Render */
  return (
    <div>
      {mounted && currentTheme === 'dark' ? (
        <MdLightMode
          className="text-[2rem] cursor-pointer hover:text-yellow-300"
          onClick={() => setTheme('light')}
        />
      ) : (
        <BsFillMoonFill
          className="text-[1.5rem] cursor-pointer hover:text-gray-500"
          onClick={() => setTheme('dark')}
        />
      )}
    </div>
  );
};
