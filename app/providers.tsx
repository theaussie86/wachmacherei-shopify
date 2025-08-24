import { NavigationTracker } from 'components/layout/navigation-tracker';
import { PHProvider } from 'lib/context/posthog';
import QueryProvider from 'lib/context/query-client';
import ReCaptchaProvider from 'lib/context/recaptcha';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface ProvidersProps extends PropsWithChildren {
  session: Session | null;
}

function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ReCaptchaProvider lng="de">
        <QueryProvider>
          <PHProvider>
            <NavigationTracker />
            {children}
            <ToastContainer />
          </PHProvider>
        </QueryProvider>
      </ReCaptchaProvider>
    </SessionProvider>
  );
}
export default Providers;
