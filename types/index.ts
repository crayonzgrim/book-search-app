export interface Book {
  title: string;
  subtitle: string;
  isbn13: string;
  price: string;
  image: string;
  url: string;
}

export interface BooksByQuery {
  books: Book[];
  error: string;
  total: string;
  page: string;
}

export interface BookDetailByIsbn extends Omit<Book, 'isbn13' | 'url'> {
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
