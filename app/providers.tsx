import { CookieProvider } from 'lib/context/cookies';
import ReCaptchaProvider from 'lib/context/recaptcha';
import { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  return (
    <ReCaptchaProvider lng="de">
      <CookieProvider>{children}</CookieProvider>
    </ReCaptchaProvider>
  );
}

export default Providers;
