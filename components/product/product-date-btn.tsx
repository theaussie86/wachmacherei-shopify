'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const optionName = 'Datum';

export default function ProductDateButton({
  isAvailableForSale,
  slot
}: {
  isAvailableForSale: boolean;
  slot: { date: string; timestamp: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = slot.date;
  const value = slot.timestamp;

  const optionNameLowerCase = optionName.toLowerCase();

  // base option params on current params so we can preserve any other param state in the url.
  const optionSearchParams = new URLSearchParams(searchParams.toString());

  // The option is active if it's in the url params.
  const isActive = searchParams.get(optionNameLowerCase) === key;

  // Update the option params using the current option to reflect how the url *would* change,
  // if the option was clicked.
  if (isActive) {
    optionSearchParams.delete(optionNameLowerCase);
  } else {
    optionSearchParams.set(optionNameLowerCase, key);
  }

  const optionUrl = createUrl(pathname, optionSearchParams);

  // To find out if the date is available for sale, we need to check if the date has available places that can be booked.

  return (
    <button
      key={key}
      aria-disabled={!isAvailableForSale}
      disabled={!isAvailableForSale}
      onClick={() => {
        router.replace(optionUrl, { scroll: false });
      }}
      title={`${key} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
      className={clsx(
        'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
        {
          'ring-2 ring-secondary': isActive,
          'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-secondary':
            !isActive && isAvailableForSale,
          'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
            !isAvailableForSale
        }
      )}
    >
      {format(value, 'dd.MM.yyyy, HH:mm')} Uhr
    </button>
  );
}
