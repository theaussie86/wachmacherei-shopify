'use client';

import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Switch,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import { cookieConfigurations, useCookie } from 'lib/context/cookies';
import { Fragment } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

const CookieSettings = () => {
  const { accept, decline, isSettingOpen, setIsSettingOpen } = useCookie();
  const onSubmit = (data: FieldValues) => {
    setIsSettingOpen(false);
    accept(data);
  };

  const handleDecline = () => {
    setIsSettingOpen(false);
    decline();
  };

  const { handleSubmit, control } = useForm({
    defaultValues: Object.entries(cookieConfigurations).reduce<Record<string, boolean>>(
      (acc, [key]) => ({
        ...acc,
        [key]: key === 'necessary' || Cookies.get(`wm-${key}`) === 'true'
      }),
      {}
    )
  });

  return (
    <Transition show={isSettingOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsSettingOpen(false)}
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
            <div className="my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Cookie Einstellungen
              </DialogTitle>
              <div className="my-3">
                <p className="text-sm text-gray-500">
                  Diese Website nutzt die folgenden Arten von Diensten. Erfahren Sie mehr in unserer
                  Cookie-Richtlinie.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {Object.entries(cookieConfigurations).map(
                  ([key, { name, description, services }]) => (
                    <div key={key} className="border bg-gray-50 p-4">
                      <Field as="div" className="flex items-center justify-between">
                        <span className="flex flex-grow flex-col">
                          <Label
                            as="h4"
                            className="text-sm font-medium leading-6 text-gray-900"
                            passive
                          >
                            {name}
                          </Label>
                          <Description as="span" className="text-sm text-gray-500">
                            {description}
                          </Description>
                        </span>
                        {key !== 'necessary' && (
                          <Controller
                            name={key}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Switch
                                checked={value}
                                onChange={onChange}
                                className={twMerge(
                                  value ? 'bg-secondary' : 'bg-gray-200',
                                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={twMerge(
                                    value ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                  )}
                                />
                              </Switch>
                            )}
                          />
                        )}
                      </Field>
                      <Disclosure as="div" className="mt-4">
                        {({ open }) => (
                          <>
                            <DisclosureButton className="inline-flex items-center text-sm text-primary">
                              Dienste anzeigen
                              <ChevronDownIcon
                                className={twMerge(
                                  open ? '-rotate-90 transform' : '',
                                  'ml-1 h-4 w-4'
                                )}
                              />
                            </DisclosureButton>
                            <DisclosurePanel>
                              <div className="grid grid-cols-[repeat(2,minmax(0,max-content))] bg-white p-2">
                                <div className="border-b-2 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-primary sm:pl-0">
                                  Dienst
                                </div>
                                <div className="border-b-2 px-3 py-3.5 text-left text-sm font-medium text-primary">
                                  Beschreibung
                                </div>
                                {Object.entries(services).map(([key, { name, purpose }], index) => (
                                  <>
                                    <div
                                      key={key}
                                      className={twMerge(
                                        index % 2 === 0 ? 'bg-gray-100' : '',
                                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm text-primary sm:pl-0'
                                      )}
                                    >
                                      {name}
                                    </div>
                                    <div
                                      key={key}
                                      className={twMerge(
                                        index % 2 === 0 ? 'bg-gray-100' : '',
                                        'break-words px-3 py-4 text-sm text-gray-500'
                                      )}
                                    >
                                      {purpose}
                                    </div>
                                  </>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  )
                )}

                <div className="mt-4 flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm text-primary outline-none"
                  >
                    Alle Ablehnen
                  </button>
                  <button
                    type="submit"
                    className="rounded-sm bg-secondary px-4 py-2 text-sm outline-none hover:bg-secondary/90"
                  >
                    Auswahl speichern
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CookieSettings;
