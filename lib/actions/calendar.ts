'use server';

/**
 * Holt ein Access Token für Google Calendar API über Service Account
 */
async function getGoogleCalendarAccessToken(): Promise<string> {
  try {
    // Prüfe ob Service Account konfiguriert ist
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error(
        'Google Service Account ist nicht konfiguriert. Bitte setze GOOGLE_SERVICE_ACCOUNT_EMAIL in den Umgebungsvariablen.'
      );
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error(
        'Google Service Account Private Key ist nicht konfiguriert. Bitte setze GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in den Umgebungsvariablen.'
      );
    }

    // Einfache JWT-Erstellung ohne externe Library
    const crypto = require('crypto');

    // Erstelle JWT Header und Payload
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
      // Domain-wide delegation: Impersonate the user
      sub: 'christoph@weissteiner-automation.com'
    };

    // Base64 URL encode
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Signiere mit RSA-SHA256
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
    const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), privateKey);
    const encodedSignature = signature.toString('base64url');

    const jwt = `${signatureInput}.${encodedSignature}`;

    // Tausche JWT gegen Access Token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google OAuth Error:', errorText);
      throw new Error(`Google OAuth Fehler: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Fehler beim Abrufen des Google Calendar Access Tokens:', error);
    throw error;
  }
}

export async function getGoogleCalendarEvents(startDate?: Date, endDate?: Date) {
  try {
    // Verwende Service Account Token statt Session Token
    const accessToken = await getGoogleCalendarAccessToken();

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
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        throw new Error(
          'Google Calendar Authentifizierung fehlgeschlagen. Bitte überprüfe die Service Account Konfiguration.'
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
    // Verwende Service Account Token statt Session Token
    const accessToken = await getGoogleCalendarAccessToken();

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
          Authorization: `Bearer ${accessToken}`
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
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendees
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Google Calendar API Fehler beim Hinzufügen:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        body: errorText
      });
      throw new Error(
        `Fehler beim Aktualisieren des Events: ${updateResponse.status} - ${errorText}`
      );
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
    // Verwende Service Account Token statt Session Token
    const accessToken = await getGoogleCalendarAccessToken();

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
          Authorization: `Bearer ${accessToken}`
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
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendees
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Google Calendar API Fehler beim Entfernen:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        body: errorText
      });
      throw new Error(
        `Fehler beim Aktualisieren des Events: ${updateResponse.status} - ${errorText}`
      );
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
