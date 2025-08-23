import { getGoogleCalendarEvents } from 'lib/calendar/google';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Parse Datumsparameter
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json({ error: 'Ungültiges Startdatum' }, { status: 400 });
      }
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json({ error: 'Ungültiges Enddatum' }, { status: 400 });
      }
    }

    // Validiere, dass Enddatum nach Startdatum liegt
    if (startDate && endDate && startDate >= endDate) {
      return NextResponse.json({ error: 'Enddatum muss nach Startdatum liegen' }, { status: 400 });
    }

    const events = await getGoogleCalendarEvents(startDate, endDate);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Fehler in der Kalender API:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
