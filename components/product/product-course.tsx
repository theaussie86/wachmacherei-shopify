import clsx from 'clsx';
import { fetchAvailableDates } from 'lib/calendar';
import ProductAddParticipants from './product-add-participants';
import ProductDateButton from './product-date-btn';
import ProductDateSeats from './product-date-seats';

export default async function ProductCourseSelector({ eventType }: { eventType: string }) {
  const dates = await fetchAvailableDates(eventType);

  return (
    <dl className={clsx('mb-8')}>
      <dt className="mb-4 text-sm uppercase tracking-wide">Datum auswählen</dt>
      <dd className="flex flex-wrap gap-3">
        {Object.entries(dates.slots).map((slot) => {
          const key = slot[0];
          const timeSlot = slot[1][0];
          const value = timeSlot?.time;
          const attendees = timeSlot?.attendees ?? 0;
          const isAvailableForSale = attendees < dates.maximumSeats;

          return value ? (
            <ProductDateButton
              key={key}
              slot={{ date: key, timestamp: value }}
              isAvailableForSale={isAvailableForSale}
            />
          ) : null;
        })}
      </dd>
      <ProductDateSeats {...dates} />
      <ProductAddParticipants {...dates} />
    </dl>
  );
}
