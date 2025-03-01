'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const BackButton = () => {
  const router = useRouter();
  const [referrerPath, setReferrerPath] = useState<string | null>(null);

  useEffect(() => {
    // Sicherstellen, dass wir im Browser-Kontext sind
    if (typeof window !== 'undefined') {
      // Aktuelle URL abrufen
      const currentPath = window.location.pathname;

      // Referrer-Informationen aus dem localStorage abrufen
      const referrers = JSON.parse(localStorage.getItem('pageReferrers') || '{}');

      // Prüfen, ob wir einen Referrer für die aktuelle Seite haben
      if (referrers[currentPath]) {
        setReferrerPath(referrers[currentPath]);
      }
    }
  }, []);

  const handleBack = () => {
    if (referrerPath) {
      // Wenn wir einen Referrer haben, navigieren wir direkt dorthin
      router.push(referrerPath);
    } else {
      // Fallback auf router.back(), wenn kein Referrer bekannt ist
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="rounded bg-secondary text-white dark:text-primary"
    >
      <ArrowLeftIcon className="h-12 w-12 p-2" />
    </button>
  );
};
