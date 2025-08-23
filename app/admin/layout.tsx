import AdminMenuBar from 'components/layout/menu/admin';
import { auth } from 'lib/auth';
import { redirect } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <AdminMenuBar user={session.user} />
      {children}
      <ToastContainer />
    </>
  );
}
