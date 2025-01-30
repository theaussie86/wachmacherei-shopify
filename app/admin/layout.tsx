import AdminMenuBar from 'components/layout/menu/admin';
import { auth } from 'lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <AdminMenuBar user={session.user} />
      {children}
    </>
  );
}
