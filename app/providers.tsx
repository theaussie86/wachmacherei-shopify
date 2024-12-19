import { CookieProvider } from 'lib/context/cookies';
import { PHProvider } from 'lib/context/posthog';
import QueryProvider from 'lib/context/query-client';
import ReCaptchaProvider from 'lib/context/recaptcha';
import { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  return (
    <ReCaptchaProvider lng="de">
      <CookieProvider>
        <QueryProvider>
          <PHProvider>{children}</PHProvider>
        </QueryProvider>
      </CookieProvider>
    </ReCaptchaProvider>
  );
}
export default Providers;
