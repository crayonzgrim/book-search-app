import Link from 'next/link';

export const Footer = () => (
  <div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 sm:px-16 px-6 py-10">
    <p>@2023 KIM DONG IL. All rights reserved</p>

    <div className="footer__copyrights-link">
      <Link href="/" className="text-gray-500 mr-4">
        Privacy & Policy
      </Link>
      <Link href="/" className="text-gray-500">
        Terms & Condition
      </Link>
    </div>
  </div>
);
