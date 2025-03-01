'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Hook zum Verfolgen des Navigationsverlaufs mit localStorage
 * Dieser Hook sollte in einer Layout-Komponente verwendet werden,
 * um den Navigationsverlauf auf allen Seiten zu verfolgen.
 */
export function useNavigationTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Sicherstellen, dass wir im Browser-Kontext sind
    if (typeof window !== 'undefined') {
      // Wenn wir einen vorherigen Pfad haben und dieser sich vom aktuellen unterscheidet,
      // speichern wir ihn als Referenzpfad für die aktuelle Seite
      if (prevPathRef.current && prevPathRef.current !== pathname) {
        // Wir speichern für jede Seite, von welcher Seite aus sie besucht wurde
        const referrers = JSON.parse(localStorage.getItem('pageReferrers') || '{}');
        referrers[pathname] = prevPathRef.current;
        localStorage.setItem('pageReferrers', JSON.stringify(referrers));
      }

      // Aktuellen Pfad für den nächsten Seitenwechsel merken
      prevPathRef.current = pathname;
    }
  }, [pathname]);
}
