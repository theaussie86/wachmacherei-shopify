import RoesterImage from 'components/images/wachmacherei_roester.jpg';
import HeroBgImage from 'components/images/wachmacherei_ueber_uns_hero.jpg';
import Footer from 'components/layout/footer';
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
        <div className="relative mx-auto max-w-2xl py-16 sm:py-24 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-medium !leading-relaxed tracking-wider text-secondary sm:text-7xl">
              Respekt. Zeit. Liebe. Neugier.
            </h1>
          </div>
        </div>
      </BackgroundOverlay>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24">
            <div>
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Zurück zum Ursprungshandwerk
                </h2>
                <div className="max-w-xl">
                  <p className="ml-12 mt-8">
                    Wir nehmen uns Zeit unsere Produkte sowie die Produktion sorgfältig zu prüfen
                    und kreieren mit viel Liebe, Freude und Neugier ständig Neues.
                  </p>
                  <p className="ml-12 mt-8">
                    In unserer hauseigenen Rösterei findet sich handwerkliche Verarbeitung gepaart
                    mit modernen Standards und hohen Ansprüchen an die Qualitätssicherung. Immer mit
                    dem Ziel unseren Kunden einen unvergesslichen WACHMACHEREI-Moment zu bescheren
                    und ihnen ein Lächeln ins Gesicht zu zaubern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackgroundOverlay img={RoesterImage}>
        <div className="h-96"></div>
      </BackgroundOverlay>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24">
            <div className="lg:order-1">
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Der Wachmacher
                </h2>
                <div className="max-w-xl">
                  <p className="ml-12 mt-8">
                    <span className="font-bold uppercase">Bernd Frieß</span>
                  </p>
                  <p className="ml-12 mt-8">
                    „Die Neugier und die Liebe zum Kaffee brachte mich zum Kaffeerösten. Und es ließ
                    mich nicht mehr los. Fasziniert von den vielen unterschiedlichen Möglichkeiten
                    der Aromen-Entfaltung beim Rösten sowie der unterschiedlichen
                    Zubereitungsmöglichkeiten arbeiten wir an ständig neuen und einzigartigen
                    Kreationen.
                  </p>
                  <p className="ml-12 mt-8">
                    Die jahrelange Erfahrung in der Lebensmittelbranche, dem Arbeiten mit und am
                    Produkt hilft mir unglaublich weiter meine Ziele zu verfolgen.
                  </p>
                  <p className="ml-12 mt-8">
                    Der Respekt vor dem Produkt steht hier immer im Mittelpunkt. Respekt, Fairness,
                    Geschmack – All das vereint unser WACHMACHEREI-Kaffee.“
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
