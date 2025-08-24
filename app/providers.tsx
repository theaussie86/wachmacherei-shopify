import { NavigationTracker } from 'components/layout/navigation-tracker';
import QueryProvider from 'lib/context/query-client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

interface ProvidersProps extends PropsWithChildren {
  session: Session | null;
}

function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <NavigationTracker />
        {children}
        <ToastContainer />
      </QueryProvider>
    </SessionProvider>
  );
}
export default Providers;
