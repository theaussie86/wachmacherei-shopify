import Footer from 'components/layout/footer';
import BackgroundOverlay from 'components/overlay';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import TasseImage from '../components/images/Tasse.png';
import HeroBgImage from '../components/images/roesterei-hero.jpg';
import RoesterImage from '../components/images/wm_homepage_quer.jpg';
import RespektImg from '../components/images/wm_homepage_respekt.jpg';
import BohnenImage from '../components/images/wm_homepage_schwarzes_glueck.jpg';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <BackgroundOverlay img={HeroBgImage}>
        <div className="relative mx-auto max-w-2xl py-16 sm:py-24 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-medium !leading-relaxed tracking-wider text-secondary sm:text-7xl">
              Die Kaffeerösterei in Ottobeuren
            </h1>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/shop"
                className="bg-secondary px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Zum Shop
              </Link>
            </div>
          </div>
        </div>
      </BackgroundOverlay>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-4">
              <div className="shadow-2xl lg:max-w-lg">
                <Image
                  className=" inset-0 w-full object-cover "
                  src={RespektImg}
                  alt="Respekt von Anfang an"
                />
              </div>
            </div>
            <div>
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Respekt. Von Anfang an!
                </h2>
                <div className="max-w-xl">
                  <p className="mt-6">
                    <span className="font-bold uppercase">Respekt vor dem Produkt.</span>
                    <br />
                    <span className="font-bold uppercase">Respekt vor der Natur.</span>
                    <br />
                    <span className="font-bold uppercase">Respekt vor den Bauern vor Ort.</span>
                  </p>
                  <p className="mt-8">
                    „Nur“ guter Kaffee reicht uns nicht. Der WACHMACHEREI liegen die Qualität der
                    Produkte, sowie Fairness und der respektvolle Umgang mit allen an der
                    Wertschöpfungskette beteiligten Menschen und Ressourcen am Herzen.
                  </p>
                  <p className="mt-8">
                    Zurück zum Ursprungshandwerk, weg von der industriellen Fertigung – das ist
                    unser Ziel. Die WACHMACHEREI steht für kurze Wege und direktem Kontakt zu den
                    Kaffeebauern. Wir garantieren faire Bezahlung und respektvolles Handeln bis zum
                    Ende der Produktkette.
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
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:order-2 lg:pr-4">
              <div className="relative overflow-hidden px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
                <Image
                  className="absolute inset-0 h-full w-full object-cover "
                  src={BohnenImage}
                  alt=""
                />
              </div>
            </div>
            <div className="lg:order-1">
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Schwarzes Glück
                </h2>
                <div className="max-w-xl">
                  <p className="mt-8">
                    <span className="font-bold uppercase">Respekt vor den Bauern vor Ort</span>
                    <br />
                    Ein Dank an die Kaffeebauern – Deshalb beziehen wir unsere Bohnen nur von
                    ausgesuchten Händlern, welche Fair Trade und Organic (Bio) nachweisen können.
                    Die WACHMACHEREI ist stetig bemüht, die Lieferketten so direkt wie möglich zu
                    halten. So unterstützen wir die Bauern vor Ort mit einem fairen, gesichterten
                    Einkommen.
                  </p>
                  <p className="mt-8">
                    <span className="font-bold uppercase">Respekt vor der Natur</span>
                    <br />
                    Das Handwerk des Kaffeeröstens beginnt mit der Auswahl der perfekten
                    Kaffeebohne. Deshalb werden unsere Bohnen sowohl vor wie auch nach dem Rösten
                    handverlesen. Wir arbeiten stets daran, die besten Aromen der Bohnen freizulegen
                    und kreieren ständig Neues. Mit viel Liebe, Freude und Neugier.
                  </p>
                  <p className="mt-8">
                    <span className="font-bold uppercase">Respekt vor dem Produkt</span>
                    <br />
                    Die WACHMACHEREI röstet traditionell im Trommelröster mit Gasflamme. Das
                    bedeutet, die Bohnen werden in einer rotierenden Trommel geröstet, die durch
                    Wärmezufuhr erhitzt wird. Diese Schonröstung gibt den Kaffeebohnen die
                    notwendige Zeit, ihre Aromen auszubauen und ungewollte Bitterstoffe oder Säuren
                    werden abgebaut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-4">
              <div className="relative overflow-hidden px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
                <Image
                  className="absolute inset-0 h-full w-full object-cover "
                  src={TasseImage}
                  alt=""
                />
              </div>
            </div>
            <div>
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Schwarzes Glück auch für zu Hause
                </h2>
                <div className="max-w-xl">
                  <p className="mt-8">
                    Tu Dir oder Deinen Liebsten etwas Gutes und bestelle Dir jetzt gleich Dein
                    SCHWARZES GLÜCK nach Hause. Natürlich auch in Bio-Qualität!
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Link
                      href="/shop"
                      className="bg-white px-3.5 py-2.5 font-semibold text-secondary shadow-sm hover:bg-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      Zum Shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-secondary/25 sm:-top-80" aria-hidden="true" />
      </div>

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
