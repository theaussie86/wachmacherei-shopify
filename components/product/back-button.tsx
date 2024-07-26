'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="rounded bg-secondary text-white dark:text-primary"
    >
      <ArrowLeftIcon className="h-12 w-12 p-2" />
    </button>
  );
};
