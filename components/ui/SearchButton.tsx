import Spinner from '@/utils/Spinner';
import { LoadingStatus } from './SearchInputField';

type props = {
  isLoading: LoadingStatus;
  query: string;
};

export default function SearchButton({ isLoading, query }: props) {
  return (
    <button
      type="submit"
      disabled={!query}
      className="font-bold bg-amber-500 px-8 rounded-lg disabled:bg-gray-200 ml-5 disabled:text-gray-300"
    >
      {isLoading === 'normal' && 'Search'}
      {isLoading === 'loading' && <Spinner />}
      {isLoading === 'success' && 'Success!!'}
      {isLoading === 'error' && 'Failed..'}
    </button>
  );
}
