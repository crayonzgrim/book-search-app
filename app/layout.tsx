import { Open_Sans } from 'next/font/google';
import type { Metadata } from 'next';

import ProvidersForTheme from '@/theme';

import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BooksInfoContextProvider } from '@/context/store';

const sans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Search developer books',
    template: 'Books | %s'
  },
  description: 'Search books for devleopers',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.className}>
      <body className="flex flex-col justify-between w-full h-full max-w-screen-2xl mx-auto px-4 lg:px-8">
        <ProvidersForTheme>
          <Header />
          <BooksInfoContextProvider>{children}</BooksInfoContextProvider>
          <Footer />
        </ProvidersForTheme>
      </body>
    </html>
  );
}
