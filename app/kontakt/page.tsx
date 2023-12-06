import ContactForm from 'components/contact-form';
import FacebookIcon from 'components/icons/facebook';
import InstagramIcon from 'components/icons/instagram';
import HeroBgImage from 'components/images/wachmacherei_background.jpg';
import Footer from 'components/layout/footer';
import MapComponent from 'components/map';
import BackgroundOverlay from 'components/overlay';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function AboutPage() {
  return (
    <>
      <BackgroundOverlay img={HeroBgImage}>
        <div className="relative mx-auto max-w-2xl p-8 sm:py-16 md:max-w-4xl">
          <h1 className="mb-12 text-4xl tracking-wider text-secondary">Kontakt</h1>
          <div className="grid gap-12 sm:grid-cols-2">
            <div className="overflow-hidden rounded bg-primary shadow-lg">
              <div className="flex flex-col gap-y-3 p-10">
                <div className="mb-2 font-gin text-2xl font-bold">Wachmacherei</div>
                <p className="text-base text-secondary">
                  Bahnhofstraße 6
                  <br />
                  87724 Ottobeuren
                </p>
                <p className="text-base text-secondary">
                  Telefon: <a href="tel:+4983324134076">+49 8332 413 40 76</a>
                  <br />
                  E-Mail: <a href="mailto:kaffee@wachmacherei.de">kaffee(at)wachmacherei.de</a>
                </p>
                <div className="mt-3 inline-flex gap-3">
                  <a href="https://www.facebook.com/WACHMACHEREI">
                    <FacebookIcon className="h-8 w-8 rounded-full bg-secondary p-2" />
                  </a>
                  <a
                    className="rounded-full bg-secondary"
                    href="https://www.instagram.com/wach.macherei/"
                  >
                    <InstagramIcon className="h-8 w-8 p-2" />
                  </a>
                </div>
              </div>
              <MapComponent />
            </div>
            <div className="overflow-hidden rounded bg-primary p-10 shadow-lg">
              <span className="font-gin text-2xl leading-none">
                Falls du jetzt ein Kribbeln in den Fingern spürst, ist das der Drang uns hier zu
                schreiben.
              </span>
              <ContactForm />
            </div>
          </div>
        </div>
      </BackgroundOverlay>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
