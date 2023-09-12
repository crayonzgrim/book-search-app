import { Inter } from 'next/font/google';

import { Footer, Header } from '@/components';
import ProvidersForTheme from '@/theme';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Book Search App',
  description: 'Search books with operator'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProvidersForTheme>
          <Header />
          {children}
          <Footer />
        </ProvidersForTheme>
      </body>
    </html>
  );
}
