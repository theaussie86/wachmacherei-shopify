'use client';

import { XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function Banner() {
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>();

  const handleDismiss = () => {
    Cookies.set('wm-banner', 'dismissed', { expires: 1 });
    setIsBannerVisible(false);
  };

  useEffect(() => {
    // Hide banner after end date
    const endDate = new Date('2024-09-09');

    if (new Date() > endDate) {
      return;
    }

    // Show banner if not dismissed
    if (Cookies.get('wm-banner') !== 'dismissed') {
      setIsBannerVisible(true);
    }
  }, []);

  return (
    <div
      className={clsx(
        isBannerVisible !== true && 'hidden',
        'flex items-center gap-x-6 bg-secondary px-6 py-2.5 sm:px-3.5 sm:before:flex-1'
      )}
    >
      <p className="text-sm leading-6 text-white">
        <strong className="font-semibold">Die Wachmacherei geht in eine kurze Sommerruhe</strong>
        <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline h-0.5 w-0.5 fill-current">
          <circle r={1} cx={1} cy={1} />
        </svg>
        In der Zeit von 25.08 bis 09.09 ist das Geschäft nur von Donnerstag bis Samstag besetzt und
        auch nur in dieser Zeit werden Online Bestellungen versendet. Vielen Dank für euer
        Verständnis.&nbsp;
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          onClick={() => handleDismiss()}
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
