'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { useCookie } from 'lib/context/cookies';
import Link from 'next/link';
import { Fragment } from 'react';

const CookieConsent = () => {
  const { accept, isConsentOpen, setIsConsentOpen, setIsSettingOpen } = useCookie();

  const handleAccept = () => {
    setIsConsentOpen(false);
    accept();
    window.location.reload();
  };

  const handleSettings = () => {
    setIsConsentOpen(false);
    setIsSettingOpen(true);
  };

  return (
    <Transition show={isConsentOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsConsentOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-primary bg-opacity-50 transition-opacity" />
          </TransitionChild>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl border bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-white dark:bg-primary">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                Verwendung von Cookies
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Wir verwenden Cookies (auch von Drittanbietern), um Informationen über die Nutzung
                  unserer Websites zu sammeln. Diese Cookies helfen uns dabei, dir das bestmögliche
                  Online-Erlebnis zu bieten und dir Angebote zu unterbreiten, die auf deine
                  Interessen zugeschnitten sind. Mit dem Klick auf den Button &quot;Alles
                  Speichern&quot; erklärst du dich mit der Verwendung aller Cookies einverstanden.
                  Weitere Informationen findest du in unserer{' '}
                  <Link className="underline" href="/datenschutz">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-4 flex gap-x-1">
                <button
                  type="button"
                  className="rounded-sm bg-secondary px-4 py-2 text-sm outline-none hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary"
                  onClick={handleAccept}
                >
                  Akzeptieren
                </button>
                <button
                  type="button"
                  onClick={handleSettings}
                  className="px-4 py-2 text-sm text-primary outline-none dark:text-white"
                >
                  Einstellungen
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CookieConsent;
