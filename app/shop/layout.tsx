import HeroBgImage from 'components/images/wachmacherei_shop_hero.jpg';
import Footer from 'components/layout/footer';
import Search from 'components/layout/navbar/search';
import Collections from 'components/layout/search/collections';
import BackgroundOverlay from 'components/overlay';
import { Suspense } from 'react';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <BackgroundOverlay img={HeroBgImage}>
        <div className="relative mx-auto max-w-2xl py-16 sm:py-24 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-medium !leading-relaxed tracking-wider text-secondary sm:text-7xl">
              Schwarzes Glück für Zuhause
            </h1>
          </div>
        </div>
      </BackgroundOverlay>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white">
        <div className="order-first w-full flex-none">
          <Collections />
          <div className="mx-auto mt-5 max-w-5xl flex-none">
            <h3 className="mb-3 text-4xl text-neutral-500 dark:text-neutral-400">
              Oder nutze die Suche
            </h3>
            <Search />
          </div>
        </div>
        <div className="order-last mx-auto min-h-screen w-full max-w-5xl md:order-none">
          {children}
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
