import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-md text-secondary transition-colors">
      <ShoppingCartIcon
        className={clsx('h-10 transition-all ease-in-out hover:scale-110', className)}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-full bg-red-600 text-sm font-medium leading-4 text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
