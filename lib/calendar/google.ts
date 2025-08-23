'use server';

import { google } from 'googleapis';

// OAuth2 Client für alle Google Calendar Operationen
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Setze den Refresh Token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Google Calendar API mit OAuth2
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export type GoogleCalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  organizer?: {
    email: string;
    displayName?: string;
  };
};

export type GoogleCalendarEventsResponse = {
  events: GoogleCalendarEvent[];
  nextPageToken?: string;
};

/**
 * Holt alle Events aus dem Google Kalender
 */
export async function getGoogleCalendarEvents(
  startDate?: Date,
  endDate?: Date
): Promise<GoogleCalendarEventsResponse> {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Verwende übergebene Datumswerte oder Standard (Anfang dieses Monats bis Ende nächsten Monats)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Anfang dieses Monats (1. Tag)
    const defaultStartDate = new Date(currentYear, currentMonth, 1);

    // Ende nächsten Monats (letzter Tag)
    const defaultEndDate = new Date(currentYear, currentMonth + 2, 0);

    const timeMin = startDate || defaultStartDate;
    const timeMax = endDate || defaultEndDate;

    const eventsResponse = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100
    });

    // Direkte Umwandlung der Google API Objekte in einfache JavaScript-Objekte
    const events =
      eventsResponse.data.items
        ?.filter((e) => !e.attendees?.some((a) => a.email === process.env.GOOGLE_CALENDAR_ID)) // Filtert aus die Termine von Cal.com
        .map((event) => {
          // Erstelle ein komplett neues einfaches Objekt
          const simpleEvent = {
            id: String(event.id || ''),
            summary: String(event.summary || 'Unbenanntes Event'),
            description: event.description ? String(event.description) : undefined,
            start: {
              dateTime: String(event.start?.dateTime || event.start?.date || ''),
              timeZone: String(event.start?.timeZone || 'Europe/Berlin')
            },
            end: {
              dateTime: String(event.end?.dateTime || event.end?.date || ''),
              timeZone: String(event.end?.timeZone || 'Europe/Berlin')
            },
            attendees: [] as Array<{
              email: string;
              displayName?: string;
              responseStatus?: string;
            }>,
            organizer: undefined as
              | {
                  email: string;
                  displayName?: string;
                }
              | undefined
          };

          // Verarbeite attendees separat
          if (event.attendees && Array.isArray(event.attendees)) {
            simpleEvent.attendees = event.attendees.map((attendee) => ({
              email: String(attendee.email || ''),
              displayName: attendee.displayName ? String(attendee.displayName) : undefined,
              responseStatus: attendee.responseStatus ? String(attendee.responseStatus) : undefined
            }));
          }

          // Verarbeite organizer separat
          if (event.organizer) {
            simpleEvent.organizer = {
              email: String(event.organizer.email || ''),
              displayName: event.organizer.displayName
                ? String(event.organizer.displayName)
                : undefined
            };
          }

          return simpleEvent;
        }) || [];

    return {
      events,
      nextPageToken: eventsResponse.data.nextPageToken
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Google Kalender Events:', error);
    throw new Error(
      `Fehler beim Abrufen der Kalender Events: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    );
  }
}

/**
 * Holt einen spezifischen Event aus dem Google Kalender
 */
export async function getGoogleCalendarEvent(eventId: string): Promise<GoogleCalendarEvent | null> {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const eventResponse = await calendar.events.get({
      calendarId: calendarId,
      eventId: eventId
    });

    const event = eventResponse.data;
    if (!event) return null;

    // Direkte Umwandlung in ein einfaches JavaScript-Objekt
    const simpleEvent = {
      id: String(event.id || ''),
      summary: String(event.summary || 'Unbenanntes Event'),
      description: event.description ? String(event.description) : undefined,
      start: {
        dateTime: String(event.start?.dateTime || event.start?.date || ''),
        timeZone: String(event.start?.timeZone || 'Europe/Berlin')
      },
      end: {
        dateTime: String(event.end?.dateTime || event.end?.date || ''),
        timeZone: String(event.end?.timeZone || 'Europe/Berlin')
      },
      attendees: [] as Array<{
        email: string;
        displayName?: string;
        responseStatus?: string;
      }>,
      organizer: undefined as
        | {
            email: string;
            displayName?: string;
          }
        | undefined
    };

    // Verarbeite attendees separat
    if (event.attendees && Array.isArray(event.attendees)) {
      simpleEvent.attendees = event.attendees.map((attendee) => ({
        email: String(attendee.email || ''),
        displayName: attendee.displayName ? String(attendee.displayName) : undefined,
        responseStatus: attendee.responseStatus ? String(attendee.responseStatus) : undefined
      }));
    }

    // Verarbeite organizer separat
    if (event.organizer) {
      simpleEvent.organizer = {
        email: String(event.organizer.email || ''),
        displayName: event.organizer.displayName ? String(event.organizer.displayName) : undefined
      };
    }

    return simpleEvent;
  } catch (error) {
    console.error('Fehler beim Abrufen des Google Kalender Events:', error);
    return null;
  }
}

/**
 * Erstellt ein neues Event im Google Kalender
 */
export async function createGoogleCalendarEvent(eventData: {
  summary: string;
  description?: string;
  start: string;
  end: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: 'Europe/Berlin'
      },
      end: {
        dateTime: eventData.end,
        timeZone: 'Europe/Berlin'
      },
      attendees: eventData.attendees?.map((a) => ({
        email: a.email,
        displayName: a.displayName
      })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
      sendUpdates: 'all'
    });

    return response.data;
  } catch (error) {
    console.error('Fehler beim Erstellen des Google Kalender Events:', error);
    throw new Error(
      `Fehler beim Erstellen des Events: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    );
  }
}

/**
 * Aktualisiert ein bestehendes Event im Google Kalender
 */
export async function updateGoogleCalendarEvent(
  eventId: string,
  eventData: {
    summary?: string;
    description?: string;
    start?: string;
    end?: string;
    attendees?: Array<{ email: string; displayName?: string }>;
  }
) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Hole zuerst das aktuelle Event, um bestehende Daten zu bekommen
    const currentEvent = await getGoogleCalendarEvent(eventId);
    if (!currentEvent) {
      throw new Error('Event nicht gefunden');
    }

    // Kombiniere bestehende Daten mit den neuen Daten
    const event = {
      summary: eventData.summary || currentEvent.summary,
      description:
        eventData.description !== undefined ? eventData.description : currentEvent.description,
      start: eventData.start
        ? {
            dateTime: eventData.start,
            timeZone: 'Europe/Berlin'
          }
        : {
            dateTime: currentEvent.start.dateTime,
            timeZone: currentEvent.start.timeZone
          },
      end: eventData.end
        ? {
            dateTime: eventData.end,
            timeZone: 'Europe/Berlin'
          }
        : {
            dateTime: currentEvent.end.dateTime,
            timeZone: currentEvent.end.timeZone
          },
      attendees:
        eventData.attendees?.map((a) => ({
          email: a.email,
          displayName: a.displayName
        })) ||
        currentEvent.attendees?.map((a) => ({
          email: a.email,
          displayName: a.displayName
        }))
    };

    const response = await calendar.events.update({
      calendarId: calendarId,
      eventId: eventId,
      requestBody: event,
      sendUpdates: 'all'
    });

    return response.data;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Google Kalender Events:', error);
    throw new Error(
      `Fehler beim Aktualisieren des Events: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    );
  }
}

/**
 * Löscht ein Event aus dem Google Kalender
 */
export async function deleteGoogleCalendarEvent(eventId: string) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
      sendUpdates: 'all'
    });

    return { success: true };
  } catch (error) {
    console.error('Fehler beim Löschen des Google Kalender Events:', error);
    throw new Error(
      `Fehler beim Löschen des Events: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    );
  }
}
