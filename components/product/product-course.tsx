import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchAvailableDatesQueryOptions } from 'lib/calendar/query-options';
import ProductDateButton from './product-date-btn';
import ProductDateSeats from './product-date-seats';

export default async function ProductCourseSelector({ eventType }: { eventType: string }) {
  const queryClient = new QueryClient();
  const dates = await queryClient.fetchQuery(fetchAvailableDatesQueryOptions(eventType));

  return (
    <dl className={clsx('mb-8')}>
      <HydrationBoundary state={dehydrate(queryClient)}>
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
      </HydrationBoundary>
    </dl>
  );
}
