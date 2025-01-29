import LoginForm from 'components/login';
import LogoutForm from 'components/logout';
import { auth } from 'lib/auth';

export default async function AdminPage() {
  const session = await auth();
  return (
    <div className="relative mx-auto max-w-2xl p-8 sm:py-16 md:max-w-4xl">
      <h1 className="mb-12 text-4xl tracking-wider text-secondary">Admin</h1>
      {session ? (
        <>
          <LogoutForm />
          <section className="mt-12">
            <h2 className="text-2xl tracking-wider text-secondary">Kurse</h2>
          </section>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
