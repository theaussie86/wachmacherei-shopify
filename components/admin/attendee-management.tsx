'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Attendee {
  email: string;
  displayName?: string;
  responseStatus?: string;
}

interface AttendeeManagementProps {
  eventId: string;
  attendees: Attendee[];
  maxAttendees?: number;
  eventStartDate: string; // Neue Prop für das Startdatum des Events
}

export default function AttendeeManagement({
  eventId,
  attendees,
  maxAttendees = 6,
  eventStartDate
}: AttendeeManagementProps) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Prüfe, ob der Termin in der Vergangenheit liegt
  const isPastEvent = new Date(eventStartDate) < new Date();
  const isFull = attendees.length >= maxAttendees;
  const canEdit = !isPastEvent && !isFull;

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || !newEmail.trim()) {
      setError('Bitte fülle alle Felder aus');
      return;
    }

    if (isPastEvent) {
      setError('Termine in der Vergangenheit können nicht mehr bearbeitet werden');
      return;
    }

    if (attendees.length >= maxAttendees) {
      setError(`Maximale Anzahl von ${maxAttendees} Teilnehmern erreicht`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar/google/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          action: 'add',
          email: newEmail.trim(),
          displayName: newName.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Hinzufügen des Teilnehmers');
      }

      // Formular zurücksetzen
      setNewName('');
      setNewEmail('');

      // Cache invalidieren, um die aktualisierten Daten zu laden
      queryClient.invalidateQueries({ queryKey: ['google-calendar', 'events'] });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAttendee = async (email: string) => {
    if (isPastEvent) {
      setError('Termine in der Vergangenheit können nicht mehr bearbeitet werden');
      return;
    }

    if (!confirm(`Möchtest du ${email} wirklich entfernen?`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar/google/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          action: 'remove',
          email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Entfernen des Teilnehmers');
      }

      // Cache invalidieren, um die aktualisierten Daten zu laden
      queryClient.invalidateQueries({ queryKey: ['google-calendar', 'events'] });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Termin in der Vergangenheit Warnung */}
      {isPastEvent && (
        <div className="rounded-lg border border-warning/20 bg-warning/10 p-4 text-center text-warning">
          <p className="font-medium">Termin in der Vergangenheit</p>
          <p className="text-sm">
            Dieser Termin liegt in der Vergangenheit und kann nicht mehr bearbeitet werden.
          </p>
        </div>
      )}

      {/* Teilnehmerliste */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">
          Teilnehmer ({attendees.length}/{maxAttendees}):
        </h4>

        {attendees.length > 0 ? (
          <div className="space-y-2">
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between gap-x-2 rounded-lg bg-base-200/50 p-3"
              >
                <div className="flex-grow">
                  <p className="font-medium">{attendee.displayName || attendee.email}</p>
                  {attendee.displayName && (
                    <p className="text-xs text-base-content/70">({attendee.email})</p>
                  )}
                  {attendee.responseStatus && (
                    <span
                      className={`mt-1 inline-block rounded px-2 py-1 text-xs ${
                        attendee.responseStatus === 'accepted'
                          ? 'bg-success/20 text-success'
                          : attendee.responseStatus === 'declined'
                            ? 'bg-error/20 text-error'
                            : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {attendee.responseStatus === 'accepted'
                        ? 'Zugesagt'
                        : attendee.responseStatus === 'declined'
                          ? 'Abgesagt'
                          : attendee.responseStatus === 'tentative'
                            ? 'Unentschieden'
                            : 'Unbekannt'}
                    </span>
                  )}
                </div>
                {!isPastEvent && (
                  <button
                    onClick={() => handleRemoveAttendee(attendee.email)}
                    disabled={isLoading}
                    className="btn btn-error btn-xs"
                  >
                    Löschen
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-base-content/70">Keine Teilnehmer eingetragen</p>
        )}
      </div>

      {/* Fehlermeldung */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-center text-error">
          {error}
        </div>
      )}

      {/* Vollständig belegt Warnung */}
      {isFull && !isPastEvent && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-center text-error">
          Dieser Kurs ist bereits voll belegt ({maxAttendees}/{maxAttendees} Plätze).
        </div>
      )}

      {/* Teilnehmer hinzufügen Formular */}
      {canEdit && (
        <div className="border-t pt-4">
          <h5 className="mb-3 text-base font-semibold">Teilnehmer hinzufügen</h5>
          <form onSubmit={handleAddAttendee} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input input-bordered w-full"
                disabled={isLoading}
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="email"
                placeholder="E-Mail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input input-bordered w-full"
                disabled={isLoading}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-warning">
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Teilnehmer hinzufügen'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
