import HeroBgImage from 'components/images/wachmacherei_shop_hero.jpg';
import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import BackgroundOverlay from 'components/overlay';
import { Suspense } from 'react';

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
        </div>
        {/* <div className="flex-none">
          <FilterList list={sorting} title="Sort by" />
        </div> */}
        <div className="order-last min-h-screen w-full md:order-none">{children}</div>
      </div>
      <Footer />
    </Suspense>
  );
}
