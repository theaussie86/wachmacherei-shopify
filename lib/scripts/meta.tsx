/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
import * as pixel from 'lib/scripts/meta-pixel';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const MetaPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  //   const hasGivenConsent = Cookies.get('wm-marketing') === 'true';

  useEffect(() => {
    if (!loaded) return;

    pixel.pageview();
  }, [pathname, loaded]);

  //   if (!hasGivenConsent) {
  //     return null;
  //   }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        src="/scripts/pixel.js"
        onLoad={() => setLoaded(true)}
        data-pixel-id={process.env.NEXT_PUBLIC_META_PIXEL_ID}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
};

export default MetaPixel;
