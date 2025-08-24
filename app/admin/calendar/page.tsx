import GoogleCalendarList from 'components/admin/google-calendar-list';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

async function AdminCalendarPage({
  searchParams
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Berechne Standard-Datumswerte auf dem Server
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Anfang dieses Monats (1. Tag)
  const defaultStartDate = new Date(currentYear, currentMonth, 1);

  // Ende nächsten Monats (letzter Tag)
  const defaultEndDate = new Date(currentYear, currentMonth + 2, 0);

  // Prüfe ob URL-Parameter vorhanden und gültig sind
  const startDateParam = resolvedSearchParams.startDate;
  const endDateParam = resolvedSearchParams.endDate;

  if (!startDateParam || !endDateParam) {
    // Keine URL-Parameter vorhanden - leite zu Standardwerten weiter
    const params = new URLSearchParams();
    params.set('startDate', format(defaultStartDate, 'yyyy-MM-dd'));
    params.set('endDate', format(defaultEndDate, 'yyyy-MM-dd'));

    redirect(`/admin/calendar?${params.toString()}`);
  }

  // Validiere vorhandene URL-Parameter
  const startDate = new Date(startDateParam!);
  const endDate = new Date(endDateParam!);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
    // Ungültige URL-Parameter - leite zu Standardwerten weiter
    const params = new URLSearchParams();
    params.set('startDate', format(defaultStartDate, 'yyyy-MM-dd'));
    params.set('endDate', format(defaultEndDate, 'yyyy-MM-dd'));

    redirect(`/admin/calendar?${params.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <GoogleCalendarList />
      </Suspense>
    </div>
  );
}

export default AdminCalendarPage;
