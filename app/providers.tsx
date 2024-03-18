import { CookieProvider } from 'lib/context/cookies';
import { PHProvider } from 'lib/context/posthog';
import ReCaptchaProvider from 'lib/context/recaptcha';
import { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  return (
    <ReCaptchaProvider lng="de">
      <CookieProvider>
        <PHProvider>{children}</PHProvider>
      </CookieProvider>
    </ReCaptchaProvider>
  );
}

export default Providers;
