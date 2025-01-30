'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { EventType, getCalEventBooking } from 'lib/calendar';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type Course = {
  id: string;
  time?: string;
  attendees?: number;
  bookingUid?: string;
};

type CoursesListProps = {
  courses: Course[];
  calEventType?: EventType;
  title?: string;
};

export default function CoursesList({ courses, calEventType, title }: CoursesListProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (!calEventType) return <div>Wähle ein Event aus!</div>;

  const statuses = {
    available: 'text-green-700 bg-green-50 ring-green-600/20',
    full: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    cancelled: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20'
  };

  const toggleCourse = (courseId: string) => {
    console.log('toggleCourse', courseId);
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
  };

  return (
    <ul role="list" className="p-8">
      {courses.map((course) => (
        <li key={course.id} className="collapse collapse-arrow w-full py-5">
          <input
            type="radio"
            name={`course-${title}`}
            className="peer"
            checked={selectedCourseId === course.id}
            onChange={() => toggleCourse(course.id)}
          />
          <div
            className="collapse-title min-w-0 cursor-pointer"
            onClick={() => toggleCourse(course.id)}
          >
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold">{title}</p>
              <p
                className={twMerge(
                  statuses[course.attendees === 6 ? 'full' : 'available'],
                  'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {course.attendees === 6 ? 'voll' : 'frei'}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">
                Termin:{' '}
                <time dateTime={course.time}>
                  {course.time ? format(new Date(course.time), 'dd.MM.yyyy HH:mm') : null}
                </time>{' '}
                Uhr
              </p>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              {course.attendees ? (
                <p>{course.attendees} von 6 Plätzen belegt</p>
              ) : (
                <p className="text-secondary">alle Plätze frei</p>
              )}
            </div>
          </div>
          <div className="collapse-content flex flex-none items-center gap-x-4">
            <SlotContent course={course} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function SlotContent({ course }: { course: Course }) {
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', course.bookingUid],
    queryFn: ({ queryKey }) => queryKey[1] && getCalEventBooking(queryKey[1]),
    enabled: !!course.bookingUid
  });
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {data && <div>{JSON.stringify(data.data.attendees)}</div>}
    </div>
  );
}
