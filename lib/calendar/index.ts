'use server';

import { getTimeRange } from './query-options';

const calBaseUrl = 'https://api.cal.com';
const calApiVersion = '2024-06-14';
const revalidateInterval = 60 * 2; // 2 minutes

type Slots = Record<string, { time: string; attendees?: number; bookingUid?: string }[]>;

export type SlotsResponse = {
  slots: Slots;
  maximumSeats: number;
};

export async function fetchAvailableDates(calEventType: string): Promise<SlotsResponse> {
  // Get the maximum number of seats for the event type
  const eventTypeResponse = await fetch(
    `${calBaseUrl}/v1/event-types/${calEventType}?apiKey=${process.env.CAL_API_KEY}`
  );
  const eventTypeData = await eventTypeResponse.json();
  const maximumSeats = eventTypeData.event_type.seatsPerTimeSlot;

  // Get time range for the next 6 months
  const { start, end } = getTimeRange();

  // Get the available slots for the event type
  const slotsResponse = await fetch(
    `${calBaseUrl}/v2/slots/available/?eventTypeId=${calEventType}&startTime=${start}&endTime=${end}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        'cal-api-version': calApiVersion
      }
    }
  );
  const slotsData = await slotsResponse.json();
  return { ...slotsData.data, maximumSeats };
}

export type EventType = {
  id: string;
  title: string;
  seatsPerTimeSlot: number;
};

export async function fetchEventTypes(): Promise<EventType[]> {
  const response = await fetch(`${calBaseUrl}/event-types/?apiKey=${process.env.CAL_API_KEY}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.event_types;
}

export async function createCalEventBooking({
  eventTypeId,
  start,
  email,
  name
}: {
  eventTypeId: string;
  start: string;
  email: string;
  name: string;
}) {
  const body = {
    start,
    eventTypeId: parseInt(eventTypeId),
    responses: {
      name,
      email,
      location: {
        optionValue: '',
        value: 'inPerson'
      }
    },
    timeZone: 'Europe/Berlin',
    language: 'de',
    metadata: {}
  };

  const response = await fetch(`${calBaseUrl}/bookings/?apiKey=${process.env.CAL_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

export type Attendee = {
  id?: string;
  name: string;
  email: string;
  startTime: string;
};

export type Booking = {
  id: string;
  uid: string;
  title: string;
  start: string;
  attendees: Attendee[];
};

export async function getCalEventBookings(bookingUid?: string): Promise<Booking[]> {
  const response = await fetch(`${calBaseUrl}/v2/bookings/?cal-api-version=${calApiVersion}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CAL_API_KEY}`
    }
  });

  const res = await response.json();
  const bookings = res.data.bookings;

  return bookingUid ? bookings.filter((booking: Booking) => booking.uid === bookingUid) : bookings;
}

export async function fetchAllAttendees() {
  const response = await fetch(`${calBaseUrl}/attendees/?apiKey=${process.env.CAL_API_KEY}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export async function addAttendeeToCalEventBooking({
  bookingId,
  email,
  name
}: {
  bookingId: number;
  email: string;
  name: string;
}) {
  const body = {
    bookingId,
    email,
    name,
    timeZone: 'Europe/Berlin'
  };

  const response = await fetch(`${calBaseUrl}/attendees?apiKey=${process.env.CAL_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

export async function removeAttendeeFromCalEventBooking({
  attendeeId,
  bookingUid
}: {
  attendeeId: Attendee['id'];
  bookingUid: string;
}) {
  const bookings = await getCalEventBookings(bookingUid);
  const booking = bookings[0];
  // check if the attendee is the last one
  const attendeeIsLastOne =
    booking?.attendees.filter((attendee) => attendee.id !== attendeeId).length === 0;

  if (attendeeIsLastOne) {
    const lastAttendee = booking?.attendees[0];
    const cancellationReason = encodeURIComponent(
      `Letzter Teilnehmer ${lastAttendee?.name} (${lastAttendee?.email}) hat abgesagt.`
    );
    await fetch(
      `${calBaseUrl}/bookings/${booking.id}?apiKey=${process.env.CAL_API_KEY}&cancellationReason=${cancellationReason}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } else {
    // remove the attendee
    await fetch(`${calBaseUrl}/attendees/${attendeeId}?apiKey=${process.env.CAL_API_KEY}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
