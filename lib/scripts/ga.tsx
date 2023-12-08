'use client';

import Cookies from 'js-cookie';
import Script from 'next/script';
import { FC } from 'react';

export const GoogleAnalytics: FC = () => {
  const hasGivenConsent = Cookies.get('wm-analytics') === 'true';

  if (!hasGivenConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_STREAM_ID}`}
      />
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${process.env.NEXT_PUBLIC_GA_STREAM_ID}');
            `}
      </Script>
    </>
  );
};
