'use client';

import { Dialog, Transition } from '@headlessui/react';
import { useCookie } from 'lib/context/cookies';
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-primary bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Verwendung von Cookies
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Wir verwenden Cookies (auch von Drittanbietern), um Informationen über die Nutzung
                  unserer Websites zu sammeln. Diese Cookies helfen uns dabei, dir das bestmögliche
                  Online-Erlebnis zu bieten und dir Angebote zu unterbreiten, die auf deine
                  Interessen zugeschnitten sind. Mit dem Klick auf den Button &quot;Alles
                  Speichern&quot; erklärst du dich mit der Verwendung aller Cookies einverstanden.
                </p>
              </div>

              <div className="mt-4 flex gap-x-1">
                <button
                  type="button"
                  className="rounded-sm bg-secondary px-4 py-2 text-sm outline-none hover:bg-secondary/90"
                  onClick={handleAccept}
                >
                  Akzeptieren
                </button>
                <button
                  type="button"
                  onClick={handleSettings}
                  className="px-4 py-2 text-sm text-primary outline-none"
                >
                  Einstellungen
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CookieConsent;
