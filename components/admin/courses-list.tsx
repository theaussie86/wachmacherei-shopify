'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { Attendee } from 'lib/calendar';
import {
  addAttendeeToCalEventBooking,
  createCalEventBooking,
  EventType,
  getCalEventBookings,
  removeAttendeeFromCalEventBooking
} from 'lib/calendar';
import {
  fetchAllAttendeesQueryOptions,
  fetchAvailableDatesQueryOptions,
  QUERY_KEYS
} from 'lib/calendar/query-options';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export type Course = {
  id: string;
  time?: string;
  attendees?: number;
  bookingUid?: string;
};

type CoursesListProps = {
  calEventType?: EventType;
  title?: string;
};

export default function CoursesList({ calEventType, title }: CoursesListProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { data, isFetching } = useQuery(
    fetchAvailableDatesQueryOptions(calEventType?.id ?? 'MISSING_EVENT_TYPE_ID')
  );
  const courses = Object.entries(data?.slots || {}).map(([key, value]) => ({
    id: key,
    ...value[0]
  }));

  const maximumSeats = data?.maximumSeats;

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
    <ul role="list" className="space-y-4">
      {isFetching ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-full"></div>
          ))}
        </div>
      ) : (
        courses.map((course) => (
          <li
            key={course.id}
            className="collapse collapse-arrow w-full rounded-lg border bg-base-100 shadow-sm transition-all hover:shadow-md"
          >
            <input
              type="radio"
              name={`course-${title}`}
              className="peer"
              checked={selectedCourseId === course.id}
              onChange={() => toggleCourse(course.id)}
            />
            <div
              className="collapse-title min-w-0 cursor-pointer py-4"
              onClick={() => toggleCourse(course.id)}
            >
              <div className="flex items-start gap-x-3">
                <p className="text-base font-semibold leading-6">{title}</p>
                <p
                  className={twMerge(
                    statuses[course.attendees === 6 ? 'full' : 'available'],
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {course.attendees === 6 ? 'voll' : 'frei'}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-x-2 text-sm text-base-content/70">
                <p className="whitespace-nowrap">
                  Termin:{' '}
                  <time dateTime={course.time}>
                    {course.time ? format(new Date(course.time), 'dd.MM.yyyy HH:mm') : null}
                  </time>{' '}
                  Uhr
                </p>
                <svg viewBox="0 0 2 2" className="size-1 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                {course.attendees ? (
                  <p>{course.attendees} von 6 Plätzen belegt</p>
                ) : (
                  <p className="text-secondary">alle Plätze frei</p>
                )}
              </div>
            </div>
            <div className="collapse-content border-t bg-base-200/50">
              <div className="py-4">
                <SlotContent course={course} maximumSeats={maximumSeats} />
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

function SlotContent({ course, maximumSeats }: { course: Course; maximumSeats?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', course.bookingUid],
    queryFn: ({ queryKey }) => getCalEventBookings(queryKey[1]),
    enabled: !!course.bookingUid
  });
  const { data: fetchedAttendees } = useQuery(fetchAllAttendeesQueryOptions());

  const bookingId = data?.[0]?.id;
  const attendees = fetchedAttendees?.filter((attendee) => attendee.bookingId === bookingId);

  const isFull = maximumSeats ? (attendees ?? []).length >= maximumSeats : false;

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        {isLoading && <div>Loading...</div>}
        {attendees?.map((attendee) => (
          <Attendee
            key={attendee.id}
            attendee={attendee}
            bookingUid={course.bookingUid ?? 'MISSING_BOOKING_UID'}
          />
        ))}
      </div>
      {isFull ? (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-center text-error">
          Dieser Kurs ist bereits voll belegt.
        </div>
      ) : (
        <div
          className={twMerge(
            'pt-4',
            data && data?.[0]?.attendees && data?.[0]?.attendees?.length > 0 && 'border-t'
          )}
        >
          <AddAttendee
            bookingUid={course.bookingUid}
            bookingId={parseInt(bookingId ?? '')}
            start={course.time}
          />
        </div>
      )}
    </div>
  );
}

function AddAttendee({
  bookingUid,
  bookingId,
  start
}: {
  bookingUid?: string;
  bookingId?: number;
  start?: string;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const eventTypeId = searchParams.get('eventType');
  const { mutate: addAttendee } = useMutation({
    mutationFn: addAttendeeToCalEventBooking,
    onSuccess: () => {
      toast.success('Teilnehmer erfolgreich hinzugefügt');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendar.attendees()
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendar.bookings(bookingUid)
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: createBooking, isPending: isCreatingBooking } = useMutation({
    mutationFn: createCalEventBooking,
    onSuccess: () => {
      toast.success('Termin erfolgreich erstellt');
      queryClient.invalidateQueries({
        queryKey: ['calendar', 'availability']
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendar.attendees()
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendar.bookings()
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = async (input: { name: string; email: string }) => {
    if (bookingId) {
      await addAttendee({ bookingId, ...input });
    } else {
      if (eventTypeId && start) {
        await createBooking({ eventTypeId, start, ...input });
      }
    }
  };

  const { register, handleSubmit, reset } = useForm<{ name: string; email: string }>();

  return (
    <form className="flex w-full flex-wrap gap-x-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-grow space-x-3">
        <input
          type="text"
          disabled={isCreatingBooking}
          placeholder="Name"
          className="input input-bordered w-48"
          {...register('name')}
        />
        <input
          type="email"
          placeholder="E-Mail"
          disabled={isCreatingBooking}
          className="input input-bordered w-48"
          {...register('email')}
        />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={isCreatingBooking}>
        Teilnehmer hinzufügen
      </button>
    </form>
  );
}

function Attendee({ attendee, bookingUid }: { attendee: Attendee; bookingUid: string }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const eventTypeId = searchParams.get('eventType');
  const { mutate: removeAttendee } = useMutation({
    mutationFn: () => removeAttendeeFromCalEventBooking({ attendeeId: attendee.id, bookingUid }),
    onSuccess: (data) => {
      toast.success('Teilnehmer erfolgreich entfernt');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.attendees() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.bookings(bookingUid) });
      if (data.attendeeIsLastOne) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.calendar.availability(eventTypeId ?? 'MISSING_EVENT_TYPE_ID')
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  return (
    <div
      className="flex w-full items-center justify-between gap-x-2 rounded-lg bg-base-200/50 p-3"
      key={attendee.id}
    >
      <div className="flex-grow-1 flex flex-col">
        <p className="font-medium">{attendee.name ? attendee.name : attendee.email}</p>
        {attendee.name && <p className="text-xs text-base-content/70">({attendee.email})</p>}
      </div>
      {attendee.id && (
        <button className="btn btn-ghost btn-sm text-error" onClick={() => removeAttendee()}>
          Löschen
        </button>
      )}
    </div>
  );
}
