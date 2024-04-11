import CookieConsent from 'components/cookies/consent';
import CookieSettings from 'components/cookies/settings';
import MenuBar from 'components/layout/menu';
import { GoogleAnalytics } from 'lib/scripts/ga';
import MetaPixel from 'lib/scripts/meta';
import { ensureStartsWith } from 'lib/utils';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import Providers from './providers';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

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
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-white text-primary selection:bg-secondary dark:bg-primary dark:text-white dark:selection:bg-secondary dark:selection:text-white">
        <GoogleAnalytics />
        <MetaPixel />
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
