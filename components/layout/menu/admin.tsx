'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'actions';
import { User } from 'next-auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const AdminMenuBar = ({ user }: { user: User }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', current: pathname === '/admin' },
    { name: 'Kurse', href: '/admin/courses', current: pathname === '/admin/courses' }
  ];
  const userNavigation = [
    { name: 'Abmelden', onClick: () => signOut().then(() => router.push('/')) }
  ];
  return (
    <div>
      <Disclosure as="nav" className="border-b border-neutral-content/20 bg-neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={twMerge(
                      item.current
                        ? 'border-neutral text-neutral-content'
                        : 'border-transparent text-neutral-content/70 hover:border-neutral-content/30 hover:text-neutral-content',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-neutral text-sm focus:outline-none focus:ring-2 focus:ring-neutral focus:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Avatar user={user} />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <button
                        className="data-[focus]:bg-neutral-focus block px-4 py-2 text-sm text-neutral-content data-[focus]:outline-none"
                        type="button"
                        onClick={item.onClick}
                      >
                        {item.name}
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="hover:bg-neutral-focus group relative inline-flex items-center justify-center rounded-md bg-neutral p-2 text-neutral-content/70 hover:text-neutral-content focus:outline-none focus:ring-2 focus:ring-neutral focus:ring-offset-2">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={twMerge(
                  item.current
                    ? 'bg-neutral-focus border-neutral text-neutral-content'
                    : 'hover:bg-neutral-focus border-transparent text-neutral-content/70 hover:border-neutral-content/30 hover:text-neutral-content',
                  'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-neutral-content/20 pb-3 pt-4">
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <Avatar user={user} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-content">{user.name}</div>
                <div className="text-sm font-medium text-neutral-content/70">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="button"
                  onClick={item.onClick}
                  className="hover:bg-neutral-focus block px-4 py-2 text-base font-medium text-neutral-content/70 hover:text-neutral-content"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

const Avatar = ({ user }: { user: User }) => {
  return (
    <div className="avatar placeholder">
      <div className="bg-neutral-focus size-8 rounded-full text-neutral-content">
        <span>
          {user.name
            ?.split(' ')
            .map((name) => name.charAt(0).toUpperCase())
            .join('')}
        </span>
      </div>
    </div>
  );
};

export default AdminMenuBar;
