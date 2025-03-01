import { NavigationTracker } from 'components/layout/navigation-tracker';
import { CookieProvider } from 'lib/context/cookies';
import { PHProvider } from 'lib/context/posthog';
import QueryProvider from 'lib/context/query-client';
import ReCaptchaProvider from 'lib/context/recaptcha';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

function Providers({ children }: PropsWithChildren) {
  return (
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
  );
}
export default Providers;
