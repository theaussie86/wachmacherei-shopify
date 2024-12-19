'use client';

import { useQuery } from '@tanstack/react-query';
import Price from 'components/price';
import { fetchAvailableDatesQueryOptions } from 'lib/calendar';
import { DEFAULT_OPTION } from 'lib/constants';
import type { CartItem } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';

interface CartItemProps {
  item: CartItem;
  closeCart: VoidFunction;
}

export function CartItem({ item, closeCart }: CartItemProps) {
  const merchandiseSearchParams = new URLSearchParams();

  const calEventId = item.merchandise.product.metafields.find(
    (metafield) => metafield?.key === 'cal_eventtypeid'
  )?.value;
  const isCourse = calEventId !== null;
  const date = item.attributes.find((attr) => attr.key === 'Datum')?.value;

  const { data: calEvent } = useQuery({
    ...fetchAvailableDatesQueryOptions(calEventId ?? ''),
    enabled: isCourse
  });

  let availableSlots = calEvent?.maximumSeats;

  if (isCourse && calEvent && date) {
    const slot = calEvent?.slots[date];
    availableSlots = calEvent.maximumSeats - (slot?.[0]?.attendees ?? 0);
  }

  item.merchandise.selectedOptions.forEach(({ name, value }) => {
    if (value !== DEFAULT_OPTION) {
      merchandiseSearchParams.append(name.toLowerCase(), value);
    }
  });

  item.attributes.forEach(({ key, value }) => {
    merchandiseSearchParams.append(key.toLowerCase(), value);
  });

  const merchandiseUrl = createUrl(
    `/product/${item.merchandise.product.handle}`,
    merchandiseSearchParams
  );

  return (
    <li className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
      <div className="relative flex w-full flex-row justify-between px-1 py-4">
        <div className="absolute z-40 -mt-2 ml-[55px]">
          <DeleteItemButton item={item} />
        </div>
        <Link href={merchandiseUrl} onClick={closeCart} className="z-30 flex flex-row space-x-4">
          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <Image
              className="h-full w-full object-cover"
              width={64}
              height={64}
              alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
              src={item.merchandise.product.featuredImage.url}
            />
          </div>

          <div className="flex flex-1 flex-col text-base">
            <span className="leading-tight">{item.merchandise.product.title}</span>
            {item.merchandise.title !== DEFAULT_OPTION ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.merchandise.title}
              </p>
            ) : item.attributes.length ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.attributes.map((attr) => `${attr.key}: ${attr.value}`).join(' / ')}
              </p>
            ) : null}
          </div>
        </Link>
        <div className="flex h-16 flex-col justify-between">
          <Price
            className="flex justify-end space-y-2 text-right text-sm"
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
          />
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <EditItemQuantityButton item={item} type="minus" />
            <p className="w-6 text-center">
              <span className="w-full text-sm">{item.quantity}</span>
            </p>
            <EditItemQuantityButton
              item={item}
              disabled={isCourse && availableSlots ? availableSlots - item.quantity <= 0 : false}
              type="plus"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
