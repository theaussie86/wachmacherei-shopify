'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
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
    { name: 'Kurse', href: '/admin/courses', current: pathname.startsWith('/admin/courses') },
    { name: 'Termine', href: '/admin/calendar', current: pathname.startsWith('/admin/calendar') }
  ];
  const userNavigation = [
    { name: 'Abmelden', onClick: () => signOut().then(() => router.push('/')) }
  ];

  return (
    <div className="bg-base-200">
      <Disclosure as="nav" className="border-b border-base-300 bg-base-100 shadow-sm">
        {({ open }) => (
          <>
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
                          'inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                          item.current
                            ? 'border-secondary font-bold text-secondary'
                            : 'border-transparent text-base-content hover:border-base-content/30 hover:text-base-content'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="mr-4 text-sm text-base-content/70">
                    Eingeloggt als{' '}
                    <span className="font-medium text-base-content">{user.email}</span>
                  </div>
                  <button
                    onClick={() => signOut().then(() => router.push('/'))}
                    className="btn btn-secondary btn-sm"
                  >
                    Abmelden
                  </button>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-base-200 p-2 text-base-content hover:bg-base-300 hover:text-base-content focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block size-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block size-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="border-b border-base-300 bg-base-100 sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={twMerge(
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                      item.current
                        ? 'border-secondary bg-secondary/10 font-bold text-secondary'
                        : 'border-transparent text-base-content hover:border-base-300 hover:bg-base-200 hover:text-base-content'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              <div className="border-t border-base-300 bg-base-200/50 px-4 py-4">
                <div className="mb-2 text-sm text-base-content/70">
                  Eingeloggt als <span className="font-medium text-base-content">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut().then(() => router.push('/'))}
                  className="btn btn-secondary btn-sm w-full"
                >
                  Abmelden
                </button>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

const Avatar = ({ user }: { user: User }) => {
  return (
    <div className="avatar placeholder">
      <div className="size-8 rounded-full bg-secondary/20 text-secondary">
        <span className="text-sm font-medium">
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
