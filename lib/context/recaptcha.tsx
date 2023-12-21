'use client';

import { PropsWithChildren } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

function ReCaptchaProvider({ lng, children }: PropsWithChildren<{ lng: string }>) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || 'NOT DEFINED'}
      language={lng}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export default ReCaptchaProvider;
