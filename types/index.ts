export interface BooksInfo {
  title: string;
  subtitle: string;
  isbn13: string;
  price: string;
  image: string;
  url: string;
}

export interface BooksByQuery {
  total: string;
  page: string;
  books: BooksInfo[];
}

export interface BookDetailByIsbn extends Omit<BooksInfo, 'isbn13' | 'url'> {
  error: string;
  authors: string;
  desc: string;
  isbn10: string;
  language: string;
  pages: string;
  publisher: string;
  rating: string;
  year: string;
  pdf: Record<string, string>;
}
