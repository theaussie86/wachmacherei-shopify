import { queryOptions } from '@tanstack/react-query';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';

const calBaseUrl = 'https://api.cal.com';
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
        'cal-api-version': '2024-06-14'
      }
    }
  );
  const slotsData = await slotsResponse.json();
  return { ...slotsData.data, maximumSeats };
}

export function fetchAvailableDatesQueryOptions(calEventType: string) {
  return queryOptions({
    queryKey: ['calendar', calEventType],
    queryFn: () => fetchAvailableDates(calEventType)
  });
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

  const response = await fetch(`${calBaseUrl}/bookings?apiKey=${process.env.CAL_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

export async function getCalEventBooking(bookingUid: string) {
  const response = await fetch(
    `${calBaseUrl}/v2/bookings/${bookingUid}?cal-api-version=2024-06-14`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CAL_API_KEY}`
      }
    }
  );
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

export function getTimeRange() {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const dateInSixMonths = addMonths(now, 6);
  const endOfMonthInSixMonths = endOfMonth(dateInSixMonths);
  return {
    start: format(startOfCurrentMonth, 'yyyy-MM-dd'),
    end: format(endOfMonthInSixMonths, 'yyyy-MM-dd')
  };
}
