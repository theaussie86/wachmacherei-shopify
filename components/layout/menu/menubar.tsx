'use client';
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import FacebookIcon from 'components/icons/facebook';
import InstagramIcon from 'components/icons/instagram';
import Link from 'next/link';
import { Fragment } from 'react';

function MenuBarList() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2022 + (currentYear > 2022 ? `-${currentYear}` : '');
  const copyrightName = 'Wachmacherei';

  return (
    <PopoverGroup className="flex">
      <Popover>
        <PopoverButton className="flex items-center gap-x-1 p-4 text-sm font-semibold leading-6 text-gray-900 md:p-0">
          <span className="sr-only">Menü öffnen</span>
          <Bars3Icon className="h-9 w-9 text-secondary" aria-hidden="true" />
        </PopoverButton>
        <PopoverBackdrop className="fixed inset-0 bg-primary opacity-50" />

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-full"
        >
          <PopoverPanel className="absolute inset-x-0 top-0 z-10 flex h-screen w-full flex-col justify-between bg-primary px-6 py-14 md:w-60">
            <div className="px-6 lg:px-8">
              <PopoverButton className="absolute right-6 top-6 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                <span className="sr-only">Menü schließen</span>
                <XMarkIcon className="h-9 w-9 text-secondary" aria-hidden="true" />
              </PopoverButton>
              <div className="grid max-w-7xl gap-y-4 xl:gap-y-8">
                {[
                  { name: 'Home', to: '/' },
                  { name: 'Shop', to: '/shop' },
                  { name: 'Über Uns', to: '/ueber-uns' },
                  { name: 'Kontakt', to: '/kontakt' }
                ].map((item) => (
                  <PopoverButton as={Link} key={item.name} href={item.to} className="block">
                    <span className="group relative font-gin text-3xl leading-loose tracking-wide hover:underline">
                      {item.name}
                    </span>
                  </PopoverButton>
                ))}
              </div>
            </div>
            <div className="">
              <div className="mx-auto flex max-w-7xl flex-col gap-y-6 px-6 lg:px-8">
                <h3 className="text-xl tracking-wider text-secondary">
                  &copy; {copyrightDate} {copyrightName}
                </h3>
                <div className="flex gap-x-2">
                  <a href="https://www.facebook.com/WACHMACHEREI">
                    <FacebookIcon className="h-8 w-8 rounded bg-secondary p-1" />
                  </a>
                  <a href="https://www.instagram.com/wach.macherei/">
                    <InstagramIcon className="h-8 w-8 rounded bg-secondary p-1" />
                  </a>
                </div>
              </div>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </PopoverGroup>
  );
}

export default MenuBarList;
