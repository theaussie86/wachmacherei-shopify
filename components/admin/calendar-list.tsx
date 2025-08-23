'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { Attendee, Booking } from 'lib/calendar';
import {
  addAttendeeToCalEventBooking,
  getCalEventBookings,
  removeAttendeeFromCalEventBooking
} from 'lib/calendar';
import { fetchAllAttendeesQueryOptions, QUERY_KEYS } from 'lib/calendar/query-options';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export default function CalendarList() {
  const { data: bookings, isFetching } = useQuery({
    queryKey: ['calendar', 'bookings'],
    queryFn: () => getCalEventBookings()
  });

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const toggleBooking = (bookingId: string) => {
    setSelectedBookingId(selectedBookingId === bookingId ? null : bookingId);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 w-full"></div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-lg bg-base-200 p-6 text-center">
        <h3 className="mb-4 text-xl font-bold">Keine Termine gefunden</h3>
        <p className="text-base-content/70">Aktuell sind keine Kurstermine geplant.</p>
      </div>
    );
  }

  // Sortiere Buchungen nach Datum (neueste zuerst)
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  );

  return (
    <ul role="list" className="space-y-4">
      {sortedBookings.map((booking) => (
        <li
          key={booking.id}
          className="collapse collapse-arrow w-full rounded-lg border bg-base-100 shadow-sm transition-all hover:shadow-md"
        >
          <input
            type="radio"
            name="calendar-bookings"
            className="peer"
            checked={selectedBookingId === booking.id}
            onChange={() => toggleBooking(booking.id)}
          />
          <div
            className="collapse-title min-w-0 cursor-pointer py-4"
            onClick={() => toggleBooking(booking.id)}
          >
            <div className="flex items-start gap-x-3">
              <p className="text-base font-semibold leading-6">{booking.title}</p>
              <p
                className={twMerge(
                  booking.attendees.length >= 6
                    ? 'bg-error/10 text-error ring-error/20'
                    : 'bg-success/10 text-success ring-success/20',
                  'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {booking.attendees.length >= 6 ? 'voll' : `${booking.attendees.length}/6 Plätze`}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-x-2 text-sm text-base-content/70">
              <p className="whitespace-nowrap">
                Termin:{' '}
                <time dateTime={booking.start}>
                  {format(new Date(booking.start), 'dd.MM.yyyy HH:mm')} Uhr
                </time>
              </p>
              <svg viewBox="0 0 2 2" className="size-1 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p>{booking.attendees.length} Teilnehmer</p>
            </div>
          </div>
          <div className="collapse-content border-t bg-base-200/50">
            <div className="py-4">
              <BookingContent booking={booking} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function BookingContent({ booking }: { booking: Booking }) {
  const { data: fetchedAttendees } = useQuery(fetchAllAttendeesQueryOptions());
  const attendees = fetchedAttendees?.filter((attendee) => attendee.bookingId === booking.id);
  const isFull = attendees ? attendees.length >= 6 : false;

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">Teilnehmer:</h4>
        {attendees && attendees.length > 0 ? (
          attendees.map((attendee) => (
            <AttendeeItem key={attendee.id} attendee={attendee} bookingUid={booking.uid} />
          ))
        ) : (
          <p className="italic text-base-content/70">Keine Teilnehmer eingetragen</p>
        )}
      </div>

      {isFull ? (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-center text-error">
          Dieser Kurs ist bereits voll belegt (6/6 Plätze).
        </div>
      ) : (
        <div className="border-t pt-4">
          <AddAttendee bookingId={parseInt(booking.id)} start={booking.start} />
        </div>
      )}
    </div>
  );
}

function AddAttendee({ bookingId, start }: { bookingId: number; start: string }) {
  const queryClient = useQueryClient();
  const { mutate: addAttendee, isPending } = useMutation({
    mutationFn: addAttendeeToCalEventBooking,
    onSuccess: () => {
      toast.success('Teilnehmer erfolgreich hinzugefügt');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendar.attendees()
      });
      queryClient.invalidateQueries({
        queryKey: ['calendar', 'bookings']
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Fehler beim Hinzufügen des Teilnehmers');
    }
  });

  const onSubmit = async (input: { name: string; email: string }) => {
    await addAttendee({ bookingId, ...input });
  };

  const { register, handleSubmit, reset } = useForm<{ name: string; email: string }>();

  return (
    <form className="flex w-full flex-wrap gap-x-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-grow space-x-3">
        <input
          type="text"
          disabled={isPending}
          placeholder="Name"
          className="input input-bordered w-48"
          {...register('name', { required: 'Name ist erforderlich' })}
        />
        <input
          type="email"
          placeholder="E-Mail"
          disabled={isPending}
          className="input input-bordered w-48"
          {...register('email', { required: 'E-Mail ist erforderlich' })}
        />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={isPending}>
        {isPending ? 'Wird hinzugefügt...' : 'Teilnehmer hinzufügen'}
      </button>
    </form>
  );
}

function AttendeeItem({ attendee, bookingUid }: { attendee: Attendee; bookingUid: string }) {
  const queryClient = useQueryClient();
  const { mutate: removeAttendee, isPending } = useMutation({
    mutationFn: () => removeAttendeeFromCalEventBooking({ attendeeId: attendee.id, bookingUid }),
    onSuccess: () => {
      toast.success('Teilnehmer erfolgreich entfernt');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.attendees() });
      queryClient.invalidateQueries({ queryKey: ['calendar', 'bookings'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Fehler beim Entfernen des Teilnehmers');
    }
  });

  return (
    <div className="flex w-full items-center justify-between gap-x-2 rounded-lg bg-base-200/50 p-3">
      <div className="flex-grow">
        <p className="font-medium">{attendee.name || 'Unbekannt'}</p>
        <p className="text-xs text-base-content/70">{attendee.email}</p>
      </div>
      {attendee.id && (
        <button
          className="btn btn-ghost btn-sm text-error"
          onClick={() => removeAttendee()}
          disabled={isPending}
        >
          {isPending ? 'Wird gelöscht...' : 'Löschen'}
        </button>
      )}
    </div>
  );
}
