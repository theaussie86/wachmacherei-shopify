'use client';

import type { EventType } from 'lib/calendar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export default function EventTypeButton({ eventType }: { eventType: EventType }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentEventType = searchParams.get('eventType');
  const isActive = currentEventType === eventType.id.toString();

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleClick = () => {
    router.push(
      `${pathname}?${createQueryString('eventType', isActive ? undefined : eventType.id)}`
    );
  };

  return (
    <button
      key={eventType.id}
      className={twMerge('btn btn-accent', isActive && 'btn-active')}
      onClick={handleClick}
    >
      {eventType.title}
    </button>
  );
}
