import Banner from 'components/banner';
import CookieConsent from 'components/cookies/consent';
import CookieSettings from 'components/cookies/settings';
import MenuBar from 'components/layout/menu';
import { GoogleAnalytics } from 'lib/scripts/ga';
import { ReactNode, Suspense } from 'react';
import { SITE_NAME, baseUrl, openGraphDefaults } from '../lib/utils';
import './globals.css';
import Providers from './providers';
import { auth } from 'lib/auth';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  openGraph: openGraphDefaults,
  robots: {
    follow: false,
    index: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html lang="de">
      <body className="bg-white text-primary selection:bg-secondary dark:bg-primary dark:text-white dark:selection:bg-secondary dark:selection:text-white">
        <GoogleAnalytics />
        <Providers session={session}>
          <Banner />
          <MenuBar />
          <Suspense>
            <main>{children}</main>
          </Suspense>
          <CookieConsent />
          <CookieSettings />
        </Providers>
      </body>
    </html>
  );
}
