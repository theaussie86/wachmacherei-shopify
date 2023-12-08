'use client';

import { useCookie } from 'lib/context/cookies';

function CookieStatus() {
  const { consentDate, setIsConsentOpen } = useCookie();
  return (
    <div className="mt-6 ">
      Datum der letzten Einwilligung: {consentDate} Uhr
      <br />
      <button
        className="mt-4 rounded-sm bg-secondary p-2 hover:bg-secondary/80"
        onClick={() => setIsConsentOpen(true)}
      >
        Auswahl anpassen
      </button>
    </div>
  );
}

export default CookieStatus;
