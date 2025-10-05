'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  addAttendeeToEvent,
  getGoogleCalendarEvents,
  removeAttendeeFromEvent
} from 'lib/actions/calendar';
import { useRouter, useSearchParams } from 'next/navigation';
import DateRangePicker from './date-range-picker';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function GoogleCalendarList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Hole aktuelle Datumswerte aus URL-Parametern
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['google-calendar', 'events', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error('Start- und Enddatum sind erforderlich');
      }

      // Setze Startdatum auf Anfang des Tages (00:00:00)
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Setze Enddatum auf Ende des Tages (23:59:59)
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      return await getGoogleCalendarEvents(startOfDay, endOfDay);
    },
    enabled: !!startDate && !!endDate
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [isAddingAttendee, setIsAddingAttendee] = useState<string | null>(null);

  const toggleEvent = (eventId: string) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  // Mutation für das Hinzufügen von Teilnehmern
  const addAttendeeMutation = useMutation({
    mutationFn: async ({
      eventId,
      attendeeEmail,
      attendeeName
    }: {
      eventId: string;
      attendeeEmail: string;
      attendeeName: string;
    }) => {
      return await addAttendeeToEvent(eventId, attendeeEmail, attendeeName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-calendar'] });
      setNewAttendeeEmail('');
      setNewAttendeeName('');
      setIsAddingAttendee(null);
    }
  });

  // Mutation für das Entfernen von Teilnehmern
  const removeAttendeeMutation = useMutation({
    mutationFn: async ({ eventId, attendeeEmail }: { eventId: string; attendeeEmail: string }) => {
      return await removeAttendeeFromEvent(eventId, attendeeEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-calendar'] });
    }
  });

  const handleAddAttendee = (eventId: string) => {
    if (!newAttendeeEmail.trim()) return;

    addAttendeeMutation.mutate({
      eventId,
      attendeeEmail: newAttendeeEmail.trim(),
      attendeeName: newAttendeeName.trim() || newAttendeeEmail.trim()
    });
  };

  const handleRemoveAttendee = (eventId: string, attendeeEmail: string) => {
    removeAttendeeMutation.mutate({ eventId, attendeeEmail });
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
          <p className="mb-4 text-error">
            {error instanceof Error
              ? error.message
              : 'Unbekannter Fehler beim Laden der Kalenderdaten'}
          </p>
          {error instanceof Error && error.message.includes('Service Account') && (
            <div className="rounded-lg bg-warning/10 p-4 text-left">
              <h4 className="mb-2 font-semibold text-warning">Konfiguration erforderlich</h4>
              <p className="text-sm text-warning">
                Um die Kalender-Funktionen zu nutzen, müssen die folgenden Umgebungsvariablen
                gesetzt werden:
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-warning">
                <li>
                  <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>
                </li>
                <li>
                  <code>GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code>
                </li>
              </ul>
              <p className="mt-2 text-sm text-warning">
                Bitte wende dich an den Administrator, um die Google Service Account Konfiguration
                abzuschließen.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
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
  const sortedEvents = [...data.items].sort(
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
              <div className="space-y-4 py-4">
                {/* Teilnehmerliste */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-base-content">
                    Teilnehmer ({event.attendees?.length || 0}/6)
                  </h4>

                  {event.attendees && event.attendees.length > 0 ? (
                    <div className="space-y-2">
                      {event.attendees.map(
                        (
                          attendee: {
                            displayName?: string;
                            email: string;
                            responseStatus?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-base-100 p-3"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {attendee.displayName || attendee.email}
                              </p>
                              <p className="text-xs text-base-content/60">{attendee.email}</p>
                              {attendee.responseStatus && (
                                <span
                                  className={`rounded px-2 py-1 text-xs ${
                                    attendee.responseStatus === 'accepted'
                                      ? 'bg-success/20 text-success'
                                      : attendee.responseStatus === 'declined'
                                        ? 'bg-error/20 text-error'
                                        : 'bg-warning/20 text-warning'
                                  }`}
                                >
                                  {attendee.responseStatus === 'accepted'
                                    ? 'Angenommen'
                                    : attendee.responseStatus === 'declined'
                                      ? 'Abgelehnt'
                                      : 'Ausstehend'}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveAttendee(event.id, attendee.email)}
                              disabled={removeAttendeeMutation.isPending}
                              className="btn btn-outline btn-error btn-sm"
                            >
                              {removeAttendeeMutation.isPending ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                'Entfernen'
                              )}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60">Keine Teilnehmer</p>
                  )}
                </div>

                {/* Teilnehmer hinzufügen */}
                {event.attendees && event.attendees.length < 6 && (
                  <div className="border-t pt-4">
                    <h4 className="mb-2 text-sm font-semibold text-base-content">
                      Teilnehmer hinzufügen
                    </h4>

                    {isAddingAttendee === event.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            type="email"
                            placeholder="E-Mail-Adresse"
                            value={newAttendeeEmail}
                            onChange={(e) => setNewAttendeeEmail(e.target.value)}
                            className="input input-sm input-bordered"
                            disabled={addAttendeeMutation.isPending}
                          />
                          <input
                            type="text"
                            placeholder="Name (optional)"
                            value={newAttendeeName}
                            onChange={(e) => setNewAttendeeName(e.target.value)}
                            className="input input-sm input-bordered"
                            disabled={addAttendeeMutation.isPending}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddAttendee(event.id)}
                            disabled={addAttendeeMutation.isPending || !newAttendeeEmail.trim()}
                            className="btn btn-primary btn-sm"
                          >
                            {addAttendeeMutation.isPending ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              'Hinzufügen'
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingAttendee(null);
                              setNewAttendeeEmail('');
                              setNewAttendeeName('');
                            }}
                            className="btn btn-ghost btn-sm"
                            disabled={addAttendeeMutation.isPending}
                          >
                            Abbrechen
                          </button>
                        </div>
                        {addAttendeeMutation.error && (
                          <div className="alert alert-error">
                            <span className="text-xs">{addAttendeeMutation.error.message}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingAttendee(event.id)}
                        className="btn btn-outline btn-sm"
                      >
                        + Teilnehmer hinzufügen
                      </button>
                    )}
                  </div>
                )}

                {/* Maximale Teilnehmeranzahl erreicht */}
                {event.attendees && event.attendees.length >= 6 && (
                  <div className="alert alert-info">
                    <span className="text-sm">Maximale Teilnehmeranzahl erreicht (6)</span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
