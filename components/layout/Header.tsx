import Link from 'next/link';
import ThemeSwitch from '../ui/ThemeSwitch';

export default function Header() {
  return (
    <div className="flex justify-end items-center mx-2 max-w-5xl sm:mx-auto py-6">
      <ThemeSwitch />

      <div className="flex items-center ml-3">
        <Link href="/">
          <h2 className="flex items-center text-2xl">
            <span className="font-bold bg-amber-500 py-1 px-4 rounded-lg mr-1">
              BOOK SEARCH APP
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
}
