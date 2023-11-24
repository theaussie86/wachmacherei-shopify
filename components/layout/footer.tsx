import { DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import FacebookIcon from 'components/icons/facebook';
import InstagramIcon from 'components/icons/instagram';
import { getMenu } from 'lib/shopify';
import Image from 'next/image';
import { Suspense } from 'react';
import ottobeurenWhite from '../images/Ottobeuren_white.png';
import FooterMenu from './footer-menu';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2022 + (currentYear > 2022 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="bg-primary text-base text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-lg px-6 pb-8 pt-16 sm:pt-24 md:max-w-2xl lg:max-w-7xl lg:px-8 lg:pt-32">
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:mt-0">
          <div>
            <h3 className="text-xl tracking-wider text-secondary">Wachmacherei</h3>
            <p className="my-3">
              Die Rösterei in Ottobeuren
              <br />
              Bahnhofstraße 6<br />
              87724 Ottobeuren
            </p>
            <p className="my-3 flex items-end hover:underline">
              <EnvelopeIcon className="mr-2 h-5 w-5" />
              <a href="mailto:kaffee@wachamcherei.de">kaffee(at)wachmadcherei.de</a>
            </p>
            <p className="flex items-end hover:underline">
              <DevicePhoneMobileIcon className="mr-2 inline-block h-5 w-5" />
              <a href="tel:+4983324134076">+49 (0) 8332 413 40 76</a>
            </p>
          </div>
          <div>
            <h3 className="text-xl tracking-wider text-secondary">Öffnungszeiten</h3>
            <div className="my-3 grid grid-cols-3 gap-y-2">
              <span>Mo + So</span>
              <span className="col-span-2">geschlossen</span>
              <span>Di + Mi</span>
              <span className="col-span-2">8:30 - 12:30 Uhr</span>
              <span>Do + Fr</span>
              <span className="col-span-2">
                8:30 - 12:30 Uhr
                <br />
                14:30 - 18:00 Uhr
              </span>
              <span>Sa</span>
              <span className="col-span-2">08:00 - 12:00 Uhr</span>
            </div>
          </div>
          <div className="max-w-xs self-center">
            <Image alt="Logo Ottobeuren in weiß" src={ottobeurenWhite} />
          </div>
          <div>
            <h3 className="text-xl tracking-wider text-secondary">
              &copy; {copyrightDate} {copyrightName}
            </h3>
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <FooterMenu menu={menu} />
            </Suspense>
            <div className="mt-3 inline-flex gap-3">
              <a href="https://www.facebook.com/WACHMACHEREI">
                <FacebookIcon className="h-8 w-8 rounded bg-secondary p-1" />
              </a>
              <a href="https://www.instagram.com/wach.macherei/">
                <InstagramIcon className="h-8 w-8 rounded bg-secondary p-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
