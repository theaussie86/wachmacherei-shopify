'use client';

import { useSearchParams } from 'next/navigation';
import { type SlotsResponse } from '../../lib/calendar';

export default function ProductDateSeats({ slots, maximumSeats }: SlotsResponse) {
  const searchParams = useSearchParams();
  const datum = searchParams.get('datum');
  let availableSeats = maximumSeats;

  if (datum) {
    const attendees = slots[datum]?.[0]?.attendees ?? 0;
    availableSeats = maximumSeats - attendees;
  }
  return (
    <dt className="my-4 text-xs">
      {datum ? `Freie Plätze: ${availableSeats}` : 'Wähle ein Datum!'}
    </dt>
  );
}
