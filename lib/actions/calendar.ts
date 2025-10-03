'use server';

import { auth } from 'lib/auth';

export async function getGoogleCalendarEvents(startDate?: Date, endDate?: Date) {
  try {
    const session = await auth();

    if (!session?.calendarAccessToken) {
      throw new Error('Nicht authentifiziert. Bitte melde dich zuerst an.');
    }

    // Verwende den konfigurierten Calendar oder primary
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Baue Google Calendar API URL
    const calendarUrl = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
    );

    if (startDate) {
      calendarUrl.searchParams.set('timeMin', startDate.toISOString());
    }
    if (endDate) {
      calendarUrl.searchParams.set('timeMax', endDate.toISOString());
    }

    calendarUrl.searchParams.set('singleEvents', 'true');
    calendarUrl.searchParams.set('orderBy', 'startTime');

    // Rufe Google Calendar API auf
    const response = await fetch(calendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${session.calendarAccessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        throw new Error(
          'Google Calendar Authentifizierung fehlgeschlagen. Bitte melde dich erneut an.'
        );
      }

      if (response.status === 404) {
        throw new Error(
          'Kalender nicht gefunden. Bitte überprüfe die GOOGLE_CALENDAR_ID Konfiguration.'
        );
      }

      throw new Error(`Google Calendar API Fehler: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Kalender Events:', error);
    throw error;
  }
}

export async function addAttendeeToEvent(
  eventId: string,
  attendeeEmail: string,
  attendeeName?: string
) {
  try {
    const session = await auth();

    if (!session?.calendarAccessToken) {
      throw new Error('Nicht authentifiziert');
    }

    if (!eventId || !attendeeEmail) {
      throw new Error('Event ID und E-Mail sind erforderlich');
    }

    // Verwende den konfigurierten Calendar oder primary
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Hole das Event vom Google Calendar API
    const eventResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${session.calendarAccessToken}`
        }
      }
    );

    if (!eventResponse.ok) {
      throw new Error('Event nicht gefunden');
    }

    const event = await eventResponse.json();

    // Füge den neuen Teilnehmer hinzu
    const attendees = event.attendees || [];
    const newAttendee = {
      email: attendeeEmail,
      displayName: attendeeName || attendeeEmail,
      responseStatus: 'needsAction'
    };

    // Prüfe, ob der Teilnehmer bereits existiert
    const existingAttendee = attendees.find((a: any) => a.email === attendeeEmail);
    if (existingAttendee) {
      throw new Error('Teilnehmer bereits vorhanden');
    }

    attendees.push(newAttendee);

    // Aktualisiere das Event
    const updateResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.calendarAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendees
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Fehler beim Aktualisieren des Events');
    }

    const updatedEvent = await updateResponse.json();

    return {
      success: true,
      event: updatedEvent
    };
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Teilnehmers:', error);
    throw error;
  }
}

export async function removeAttendeeFromEvent(eventId: string, attendeeEmail: string) {
  try {
    const session = await auth();

    if (!session?.calendarAccessToken) {
      throw new Error('Nicht authentifiziert');
    }

    if (!eventId || !attendeeEmail) {
      throw new Error('Event ID und E-Mail sind erforderlich');
    }

    // Verwende den konfigurierten Calendar oder primary
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Hole das Event vom Google Calendar API
    const eventResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${session.calendarAccessToken}`
        }
      }
    );

    if (!eventResponse.ok) {
      throw new Error('Event nicht gefunden');
    }

    const event = await eventResponse.json();

    // Entferne den Teilnehmer
    const attendees = (event.attendees || []).filter(
      (attendee: any) => attendee.email !== attendeeEmail
    );

    // Aktualisiere das Event
    const updateResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.calendarAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendees
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Fehler beim Aktualisieren des Events');
    }

    const updatedEvent = await updateResponse.json();

    return {
      success: true,
      event: updatedEvent
    };
  } catch (error) {
    console.error('Fehler beim Entfernen des Teilnehmers:', error);
    throw error;
  }
}
