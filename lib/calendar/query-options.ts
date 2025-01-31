import { queryOptions } from '@tanstack/react-query';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { fetchAllAttendees, fetchAvailableDates } from '.';

export const QUERY_KEYS = {
  calendar: {
    availability: (eventTypeId: string) => ['calendar', 'availability', parseInt(eventTypeId)],
    bookings: (bookingUid?: string) => ['bookings', bookingUid],
    attendees: () => ['attendees']
  }
} as const;

export function fetchAvailableDatesQueryOptions(calEventType: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.calendar.availability(calEventType),
    queryFn: () => fetchAvailableDates(calEventType)
  });
}

export function fetchAllAttendeesQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.calendar.attendees(),
    queryFn: () => fetchAllAttendees()
  });
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
