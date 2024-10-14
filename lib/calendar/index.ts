import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';

const calBaseUrl = 'https://api.cal.com';
const calEventType = '1216590';

type Slots = Record<string, { time: string; attendees?: number; bookingUid?: string }[]>;

type SlotsResponse = {
  slots: Slots;
  maximumSeats: number;
};

export async function fetchAvailableDates(): Promise<SlotsResponse> {
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
    `${calBaseUrl}/v1/slots/?apiKey=${process.env.CAL_API_KEY}&eventTypeId=${calEventType}&startTime=${start}&endTime=${end}`
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
