import LoginForm from 'components/login';
import { auth } from 'lib/auth';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="w-full max-w-md rounded-lg border bg-base-100 p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-base-content/70">Willkommen im Administrationsbereich</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Kursverwaltung Card */}
        <Link
          href="/admin/courses"
          className="card bg-base-100 shadow-sm transition-all hover:shadow-md"
        >
          <div className="card-body">
            <h2 className="card-title">Kursverwaltung</h2>
            <p className="text-base-content/70">Verwalten Sie hier Ihre Kurse und Termine</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Öffnen</button>
            </div>
          </div>
        </Link>

        {/* Statistiken Card */}
        {/* <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Statistiken</h2>
            <p className="text-base-content/70">Übersicht über Buchungen und Teilnehmer</p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm" disabled>
                Demnächst verfügbar
              </button>
            </div>
          </div>
        </div> */}

        {/* Einstellungen Card */}
        {/* <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Einstellungen</h2>
            <p className="text-base-content/70">
              Konfigurieren Sie Ihre Administrationseinstellungen
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-ghost btn-sm" disabled>
                Demnächst verfügbar
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
