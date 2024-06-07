import CookieConsent from 'components/cookies/consent';
import CookieSettings from 'components/cookies/settings';
import MenuBar from 'components/layout/menu';
import { GoogleAnalytics } from 'lib/scripts/ga';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import Providers from './providers';

const { SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-white text-primary selection:bg-secondary dark:bg-primary dark:text-white dark:selection:bg-secondary dark:selection:text-white">
        <GoogleAnalytics />
        <Providers>
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
