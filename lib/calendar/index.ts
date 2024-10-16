import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';

const calBaseUrl = 'https://api.cal.com';
const calEventType = process.env.CAL_EVENT_TYPE_IDS?.split(',')[0];
const revalidateInterval = 60 * 2; // 2 minutes

type Slots = Record<string, { time: string; attendees?: number; bookingUid?: string }[]>;

export type SlotsResponse = {
  slots: Slots;
  maximumSeats: number;
};

export async function fetchAvailableDates(): Promise<SlotsResponse> {
  // Get the maximum number of seats for the event type
  const eventTypeResponse = await fetch(
    `${calBaseUrl}/v1/event-types/${calEventType}?apiKey=${process.env.CAL_API_KEY}`,
    {
      next: { tags: ['calendar'], revalidate: revalidateInterval }
    }
  );
  const eventTypeData = await eventTypeResponse.json();
  const maximumSeats = eventTypeData.event_type.seatsPerTimeSlot;

  // Get time range for the next 6 months
  const { start, end } = getTimeRange();

  // Get the available slots for the event type
  const slotsResponse = await fetch(
    `${calBaseUrl}/v1/slots/?apiKey=${process.env.CAL_API_KEY}&eventTypeId=${calEventType}&startTime=${start}&endTime=${end}`,
    {
      next: { tags: ['calendar'], revalidate: revalidateInterval }
    }
  );
  const slotsData = await slotsResponse.json();

  return { ...slotsData, maximumSeats };
}

function getTimeRange() {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const dateInSixMonths = addMonths(now, 6);
  const endOfMonthInSixMonths = endOfMonth(dateInSixMonths);
  return {
    start: format(startOfCurrentMonth, 'yyyy-MM-dd'),
    end: format(endOfMonthInSixMonths, 'yyyy-MM-dd')
  };
}
