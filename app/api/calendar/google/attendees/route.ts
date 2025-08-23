import { getGoogleCalendarEvent, updateGoogleCalendarEvent } from 'lib/calendar/google';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { eventId, action, email, displayName } = await request.json();
    console.log('Attendee management request:', { eventId, action, email, displayName });

    if (!eventId || !action || !email) {
      return NextResponse.json(
        { error: 'Fehlende Parameter: eventId, action und email sind erforderlich' },
        { status: 400 }
      );
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json(
        { error: 'Ungültige Aktion: Nur "add" oder "remove" sind erlaubt' },
        { status: 400 }
      );
    }

    // Hole das aktuelle Event über die bestehende Funktion
    console.log('Fetching current event...');
    const currentEvent = await getGoogleCalendarEvent(eventId);
    if (!currentEvent) {
      console.error('Event not found:', eventId);
      return NextResponse.json({ error: 'Event nicht gefunden' }, { status: 404 });
    }

    console.log('Current event attendees:', currentEvent.attendees);
    let currentAttendees = currentEvent.attendees || [];

    if (action === 'add') {
      // Prüfe, ob der Teilnehmer bereits existiert
      const existingAttendee = currentAttendees.find((a) => a.email === email);
      if (existingAttendee) {
        console.log('Attendee already exists:', email);
        return NextResponse.json({ error: 'Teilnehmer existiert bereits' }, { status: 400 });
      }

      // Füge neuen Teilnehmer hinzu
      currentAttendees.push({
        email,
        displayName: displayName || email,
        responseStatus: 'accepted'
      });
      console.log('Added attendee:', { email, displayName });
    } else if (action === 'remove') {
      // Entferne Teilnehmer
      currentAttendees = currentAttendees.filter((a) => a.email !== email);
      console.log('Removed attendee:', email);
    }

    console.log('Updated attendees list:', currentAttendees);

    // Aktualisiere das Event über die bestehende Funktion
    console.log('Updating event...');
    const updatedEvent = await updateGoogleCalendarEvent(eventId, {
      attendees: currentAttendees.map((a) => ({
        email: a.email,
        displayName: a.displayName
      }))
    });

    console.log('Event updated successfully');
    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error('Fehler bei der Teilnehmerverwaltung:', error);
    return NextResponse.json(
      {
        error: 'Interner Serverfehler',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
}
