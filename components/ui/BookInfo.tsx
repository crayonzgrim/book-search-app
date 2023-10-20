import Image from 'next/image';
import Link from 'next/link';
import { CardContent } from './Card';

export type Props = {
  title: string;
  subtitle: string;
  image: string;
  isbn: string;
  width?: number;
  height?: number;
};

export default function BookInfo({
  title,
  subtitle,
  image,
  isbn,
  width = 500,
  height = 300
}: Props) {
  return (
    <Link href={`/search/${isbn}`}>
      <CardContent className="flex flex-col items-center justify-center">
        <Image
          priority
          src={image ?? ''}
          alt={title}
          width={width}
          height={height}
          className="sm:rounded-t-lg group-hover:opacity-80 transition-opacity duration-200"
          placeholder="blur"
          blurDataURL="/spinner.svg"
        />
        <div className="px-2 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mt-1">{title}</h2>
          <p className="line-clamp-2">{subtitle}</p>
        </div>
      </CardContent>
    </Link>
  );
}
