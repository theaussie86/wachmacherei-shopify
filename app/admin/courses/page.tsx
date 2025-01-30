import CoursesList, { type Course } from 'components/admin/courses-list';
import EventTypeButton from 'components/admin/event-filter-button';
import { fetchAvailableDates, fetchEventTypes } from 'lib/calendar';
import { Suspense } from 'react';

async function AdminCoursesPage({ searchParams }: { searchParams: { eventType?: string } }) {
  const eventTypes = await fetchEventTypes();
  const eventTypeId = searchParams.eventType;
  const eventType = eventTypes.find((eventType) => eventType.id.toString() === eventTypeId);

  let courses: Course[] = [];
  if (eventType) {
    const data = await fetchAvailableDates(eventType.id);
    courses = Object.entries(data?.slots || {}).map(([key, value]) => ({
      id: key,
      ...value[0]
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Kurse</h1>
      <div className="flex w-full justify-center gap-4">
        {eventTypes.map((eventType) => (
          <EventTypeButton key={eventType.id} eventType={eventType} />
        ))}
      </div>
      <Suspense fallback={<div>Laden...</div>}>
        <CoursesList courses={courses} calEventType={eventType} title={eventType?.title} />
      </Suspense>
    </div>
  );
}

export default AdminCoursesPage;
