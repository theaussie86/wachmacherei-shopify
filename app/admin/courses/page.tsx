import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CoursesList from 'components/admin/courses-list';
import EventTypeButton from 'components/admin/event-filter-button';
import { fetchEventTypes } from 'lib/calendar';
import { fetchAvailableDatesQueryOptions } from 'lib/calendar/query-options';
import Link from 'next/link';
import { Suspense } from 'react';

async function AdminCoursesPage({ searchParams }: { searchParams: { eventType?: string } }) {
  const eventTypes = await fetchEventTypes();
  const eventTypeId = searchParams.eventType;
  const eventType = eventTypes.find((eventType) => eventType.id.toString() === eventTypeId);

  const queryClient = new QueryClient();
  if (eventTypeId) {
    await queryClient.prefetchQuery(fetchAvailableDatesQueryOptions(eventTypeId));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Kurse{eventType && ` - ${eventType.title}`}</h1>
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            Wählen Sie einen Kurstyp aus, um die verfügbaren Termine zu sehen.
          </p>
          <div className="flex gap-2">
            <Link
              href="https://app.cal.com/bookings/upcoming"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-secondary btn-sm"
            >
              Cal.com Dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-2 size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://cal.com/wachmacherei"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Zur Buchungsseite
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-2 size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <div className="mb-8">
          <div className="join join-horizontal flex-wrap justify-center gap-y-2 space-x-4">
            {eventTypes.map((eventType) => (
              <EventTypeButton key={eventType.id} eventType={eventType} />
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-base-200 p-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <CoursesList calEventType={eventType} title={eventType?.title} />
          </HydrationBoundary>
        </div>
      </Suspense>
    </div>
  );
}

export default AdminCoursesPage;
