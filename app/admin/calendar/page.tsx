import GoogleCalendarList from 'components/admin/google-calendar-list';
import { Suspense } from 'react';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

async function AdminCalendarPage() {
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
