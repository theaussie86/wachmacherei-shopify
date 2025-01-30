import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import WMLogoSchriftWeiß from '../../images/Schriftzug_Wachmacherei_weiss640x250.png';
import WMLogoIcon from '../../images/favicon.png';
import MenuBarList from './menubar';

const MenuBar = () => {
  return (
    <header className="relative isolate z-10 bg-primary">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 text-secondary md:px-8"
        aria-label="Global"
      >
        <MenuBarList />
        <Link href="/" className="relative -mb-4 bg-secondary">
          <span className="sr-only">Wachmacherei</span>
          <Image
            className="hidden h-16 w-auto md:block md:h-24"
            src={WMLogoSchriftWeiß}
            alt="Wachmacherei Logo"
          />
          <Image className="h-16 w-auto md:hidden" src={WMLogoIcon} alt="Wachmacherei Logo" />
          <div
            className="absolute left-0 mt-[2px] hidden h-[2px] w-full bg-secondary md:block"
            style={{ top: '100%', transform: 'translateY(4px)' }}
          ></div>
        </Link>
        <div className="flex p-4 md:p-0">
          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

export default MenuBar;
