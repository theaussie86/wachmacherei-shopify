'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter, useSearchParams } from 'next/navigation';
import AttendeeManagement from './attendee-management';
import DateRangePicker from './date-range-picker';

import { useState } from 'react';

export default function GoogleCalendarList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hole aktuelle Datumswerte aus URL-Parametern
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['google-calendar', 'events', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) {
        // Setze Startdatum auf Anfang des Tages (00:00:00)
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        params.append('startDate', startOfDay.toISOString());
      }
      if (endDate) {
        // Setze Enddatum auf Ende des Tages (23:59:59)
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        params.append('endDate', endOfDay.toISOString());
      }

      const response = await fetch(`/api/calendar/google?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Kalender Events');
      }
      return response.json();
    },
    enabled: !!startDate && !!endDate
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const toggleEvent = (eventId: string) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const handleDateRangeChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    if (newStartDate && newEndDate) {
      const params = new URLSearchParams();
      params.set('startDate', format(newStartDate, 'yyyy-MM-dd'));
      params.set('endDate', format(newEndDate, 'yyyy-MM-dd'));

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  // Zeige Loading während der Standardwerte gesetzt werden
  if (!startDate || !endDate) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            defaultStartDate={startDate || undefined}
            defaultEndDate={endDate || undefined}
          />
        </div>
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            defaultStartDate={startDate || undefined}
            defaultEndDate={endDate || undefined}
          />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            defaultStartDate={startDate || undefined}
            defaultEndDate={endDate || undefined}
          />
        </div>
        <div className="rounded-lg bg-error/10 p-6 text-center">
          <h3 className="mb-4 text-xl font-bold text-error">Fehler beim Laden der Termine</h3>
          <p className="text-error">
            {error instanceof Error
              ? error.message
              : 'Unbekannter Fehler beim Laden der Kalenderdaten'}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.events || data.events.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            defaultStartDate={startDate || undefined}
            defaultEndDate={endDate || undefined}
          />
        </div>
        <div className="rounded-lg bg-base-200 p-6 text-center">
          <h3 className="mb-4 text-xl font-bold">Keine Termine gefunden</h3>
          <p className="text-base-content/70">
            Im ausgewählten Zeitraum sind keine Kurstermine in deinem Google Kalender geplant.
          </p>
        </div>
      </div>
    );
  }

  // Sortiere Events nach Datum (neueste zuerst)
  const sortedEvents = [...data.events].sort(
    (a, b) => new Date(b.start.dateTime).getTime() - new Date(a.start.dateTime).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Termine</h1>
          <p className="text-base-content/70">
            Übersicht aller Kurstermine aus deinem Google Kalender.
          </p>
        </div>
        <DateRangePicker
          onDateRangeChange={handleDateRangeChange}
          defaultStartDate={startDate || undefined}
          defaultEndDate={endDate || undefined}
        />
      </div>

      <ul role="list" className="space-y-4">
        {sortedEvents.map((event) => (
          <li
            key={event.id}
            className="collapse collapse-arrow w-full rounded-lg border bg-base-100 shadow-sm transition-all hover:shadow-md"
          >
            <input
              type="radio"
              name="google-calendar-events"
              className="peer"
              checked={selectedEventId === event.id}
              onChange={() => toggleEvent(event.id)}
            />
            <div
              className="collapse-title min-w-0 cursor-pointer py-4"
              onClick={() => toggleEvent(event.id)}
            >
              <div className="flex items-start gap-x-3">
                <p className="text-base font-semibold leading-6">{event.summary}</p>
                <p
                  className={`mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    event.attendees && event.attendees.length >= 6
                      ? 'bg-error/10 text-error ring-error/20'
                      : 'bg-success/10 text-success ring-success/20'
                  }`}
                >
                  {event.attendees && event.attendees.length >= 6
                    ? 'voll'
                    : `${event.attendees?.length || 0}/6 Plätze`}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-x-2 text-sm text-base-content/70">
                <p className="whitespace-nowrap">
                  Termin:{' '}
                  <time dateTime={event.start.dateTime}>
                    {format(new Date(event.start.dateTime), 'dd.MM.yyyy HH:mm', { locale: de })} Uhr
                  </time>
                </p>
                <svg viewBox="0 0 2 2" className="size-1 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p>
                  {event.attendees && event.attendees.length > 0
                    ? `${event.attendees.length} Teilnehmer`
                    : 'Keine Teilnehmer'}
                </p>
              </div>
              {event.description && (
                <p className="mt-2 line-clamp-2 text-sm text-base-content/60">
                  {event.description}
                </p>
              )}
            </div>
            <div className="collapse-content border-t bg-base-200/50">
              <div className="py-4">
                <AttendeeManagement
                  eventId={event.id}
                  attendees={event.attendees || []}
                  maxAttendees={6}
                  eventStartDate={event.start.dateTime}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
