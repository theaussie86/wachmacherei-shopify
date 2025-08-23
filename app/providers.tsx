import { NavigationTracker } from 'components/layout/navigation-tracker';
import { CookieProvider } from 'lib/context/cookies';
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
        <CookieProvider>
          <QueryProvider>
            <PHProvider>
              <NavigationTracker />
              {children}
              <ToastContainer />
            </PHProvider>
          </QueryProvider>
        </CookieProvider>
      </ReCaptchaProvider>
    </SessionProvider>
  );
}
export default Providers;
