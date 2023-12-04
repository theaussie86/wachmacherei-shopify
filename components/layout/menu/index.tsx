'use client';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import FacebookIcon from 'components/icons/facebook';
import InstagramIcon from 'components/icons/instagram';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import WMLogoSchriftWeiß from '../../images/Schriftzug_Wachmacherei_weiss640x250.png';

const MenuBar = () => {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2022 + (currentYear > 2022 ? `-${currentYear}` : '');
  const copyrightName = 'Wachmacherei';

  return (
    <header className="relative isolate z-10 bg-primary ">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between text-secondary lg:px-8"
        aria-label="Global"
      >
        <Popover.Group className="flex lg:flex-1">
          <Popover>
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              <span className="sr-only">Menü öffnen</span>
              <Bars3Icon className="h-9 w-9 text-secondary" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 -translate-x-full"
            >
              <Popover.Panel className="absolute inset-x-0 top-0 z-10 flex h-screen w-full flex-col justify-between bg-primary px-6 py-14 md:w-60">
                <div className="px-6 lg:px-8">
                  <Popover.Button className=" absolute right-6 top-6 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 md:hidden">
                    <span className="sr-only">Menü schließen</span>
                    <XMarkIcon className="h-9 w-9 text-secondary" aria-hidden="true" />
                  </Popover.Button>
                  <div className="grid max-w-7xl gap-y-4 lg:px-8 xl:gap-y-8">
                    {[
                      { name: 'Home', to: '/' },
                      { name: 'Shop', to: '/shop' },
                      { name: 'Über Uns', to: '/about' },
                      { name: 'Kontakt', to: '/kontakt' }
                    ].map((item) => (
                      <Popover.Button as={Link} key={item.name} href={item.to} className="block">
                        <span className="group relative font-gin text-3xl leading-loose tracking-wide hover:underline">
                          {item.name}
                        </span>
                      </Popover.Button>
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
              </Popover.Panel>
            </Transition>
          </Popover>
        </Popover.Group>
        <Link href="/" className="relative -mb-4 bg-secondary">
          <span className="sr-only">Wachmacherei</span>
          <Image className=" h-24 w-auto" src={WMLogoSchriftWeiß} alt="Wachmacherei Logo" />
          <div
            className="absolute left-0 mt-[2px] h-[2px] w-full bg-secondary"
            style={{ top: '100%', transform: 'translateY(4px)' }}
          ></div>
        </Link>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/shop">
            <span className="sr-only">Wachmacherei Shop</span>
            <ShoppingCartIcon className="h-9 w-9 text-secondary" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default MenuBar;
