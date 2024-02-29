import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Register',
};
 
export default function Page() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold mx-auto my-4">Register page</h2>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Home
      </Link>
    </main>
  );
}