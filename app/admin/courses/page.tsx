import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CoursesList from 'components/admin/courses-list';
import EventTypeButton from 'components/admin/event-filter-button';
import { fetchEventTypes } from 'lib/calendar';
import { fetchAvailableDatesQueryOptions } from 'lib/calendar/query-options';
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
        <p className="text-base-content/70">
          Wählen Sie einen Kurstyp aus, um die verfügbaren Termine zu sehen.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <div className="mb-8">
          <div className="join join-horizontal flex-wrap justify-center gap-y-2">
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
