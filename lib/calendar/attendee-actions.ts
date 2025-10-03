'use server';

import { getGoogleCalendarEvent, updateGoogleCalendarEvent } from './google';

export async function addAttendeeToEvent(
  eventId: string,
  attendeeEmail: string,
  attendeeName?: string
) {
  try {
    // Hole das aktuelle Event
    const currentEvent = await getGoogleCalendarEvent(eventId);
    if (!currentEvent) {
      throw new Error('Event nicht gefunden');
    }

    // Prüfe, ob der Teilnehmer bereits existiert
    const existingAttendee = currentEvent.attendees?.find(
      (attendee) => attendee.email.toLowerCase() === attendeeEmail.toLowerCase()
    );

    if (existingAttendee) {
      throw new Error('Teilnehmer ist bereits angemeldet');
    }

    // Prüfe maximale Teilnehmeranzahl
    if (currentEvent.attendees && currentEvent.attendees.length >= 6) {
      throw new Error('Maximale Teilnehmeranzahl erreicht (6)');
    }

    // Füge den neuen Teilnehmer hinzu
    const updatedAttendees = [
      ...(currentEvent.attendees || []),
      {
        email: attendeeEmail,
        displayName: attendeeName || attendeeEmail
      }
    ];

    // Aktualisiere das Event
    await updateGoogleCalendarEvent(eventId, {
      attendees: updatedAttendees
    });

    return { success: true, message: 'Teilnehmer erfolgreich hinzugefügt' };
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Teilnehmers:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Fehler beim Hinzufügen des Teilnehmers'
    );
  }
}

export async function removeAttendeeFromEvent(eventId: string, attendeeEmail: string) {
  try {
    // Hole das aktuelle Event
    const currentEvent = await getGoogleCalendarEvent(eventId);
    if (!currentEvent) {
      throw new Error('Event nicht gefunden');
    }

    // Entferne den Teilnehmer
    const updatedAttendees = (currentEvent.attendees || []).filter(
      (attendee) => attendee.email.toLowerCase() !== attendeeEmail.toLowerCase()
    );

    // Aktualisiere das Event
    await updateGoogleCalendarEvent(eventId, {
      attendees: updatedAttendees
    });

    return { success: true, message: 'Teilnehmer erfolgreich entfernt' };
  } catch (error) {
    console.error('Fehler beim Entfernen des Teilnehmers:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Fehler beim Entfernen des Teilnehmers'
    );
  }
}
