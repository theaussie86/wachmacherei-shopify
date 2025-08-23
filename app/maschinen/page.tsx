import Footer from 'components/layout/footer';
import BackgroundOverlay from 'components/overlay';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import RoesterImage from '../../components/images/wachmacherei-roester.jpg';
import BaristaImage from '../../components/images/wm-barista-kurs.jpeg';
import SeminarImage from '../../components/images/wm-kaffee-seminar.jpeg';
import HeroBgImage from '../../components/images/wm_ueberuns_hero.jpg';
import { baseUrl, openGraphDefaults } from '../../lib/utils';

export const metadata = {
  title: 'Über uns',
  description: 'Die Wachmacherei - Respekt. Zeit. Liebe. Neugier.',
  openGraph: {
    ...openGraphDefaults,
    url: baseUrl + '/ueber-uns'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function AboutPage() {
  return (
    <>
      <BackgroundOverlay img={HeroBgImage}>
        <div className="relative mx-auto max-w-2xl py-16 sm:py-24 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-medium !leading-relaxed tracking-wider text-secondary sm:text-7xl">
              Maschinen
            </h1>
          </div>
        </div>
      </BackgroundOverlay>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="">
              <div className="shadow-2xl">
                <Image
                  className="inset-0 max-h-[600px] w-full object-cover object-top"
                  src={BaristaImage}
                  alt="Respekt von Anfang an"
                />
              </div>
            </div>
            <div>
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Barista Kurs - Basic
                </h2>
                <div className="max-w-xl">
                  <p className="ml-12 mt-8">
                    Du hast bereits schon einen Siebträger oder spielst mit dem Gedanken, dir den
                    perfekten Espresso / Cappuccino nach Hause zu holen?
                  </p>
                  <p className="ml-12 mt-8">
                    Bei uns lernst Du die Basics, welcher Kaffee passt zu Dir und deiner Maschine
                    und wie bekomme ich die perfekte Tasse zustande.
                  </p>
                  <p className="ml-12 mt-8">Themen im Kurs:</p>
                  <ul className="ml-16 mt-2 list-disc">
                    <li>Kaffeesorten und Unterschiede</li>
                    <li>Was steckt hinter Sortenrein und Blends</li>
                    <li>Das richtige einstellen des Mahlgrades</li>
                    <li>Zubereiten der unterschiedlichen Kaffees</li>
                    <li>Was steckt hinter dem Geheimnis Milch richtig zu schäumen</li>
                  </ul>
                  <div className="mt-8 flex items-center justify-center">
                    <Link
                      href="/product/barista-kurs"
                      className="bg-secondary px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      Jetzt Platz sichern
                    </Link>
                  </div>
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
            <div className="place-self-center lg:order-2">
              <div className="shadow-2xl">
                <Image
                  className="inset-0 max-h-[600px] w-full object-cover object-top"
                  src={SeminarImage}
                  alt="Respekt von Anfang an"
                />
              </div>
            </div>
            <div className="lg:order-1">
              <div className="text-base leading-7 text-primary lg:max-w-lg">
                <h2 className="mt-2 text-3xl tracking-tight text-secondary sm:text-4xl">
                  Kaffee Seminar
                </h2>
                <div className="max-w-xl">
                  <p className="ml-12 mt-8">
                    Du würdest gerne wissen, wie ungerösteter Kaffee aussieht? Welche Unterschiede
                    die einzelnen Bohnen haben und welche Geheimnisse dahinter stecken?
                  </p>
                  <p className="ml-12 mt-8">
                    In unserem Seminar zeigen wir dir alles was nötig ist, damit der Rohkaffee bei
                    uns im Päckchen landen kann.
                  </p>
                  <p className="ml-12 mt-8">Themen im Seminar:</p>
                  <ul className="ml-16 mt-2 list-disc">
                    <li>Rohkaffeeanbau / Herkunft</li>
                    <li>Bio / Fairtrade / Lieferkettengesetz</li>
                    <li>Probenröstung</li>
                    <li>Besichtigung der Rösterei</li>
                    <li>Verkostung von unterschiedlichen Proben</li>
                  </ul>
                  <div className="mt-8 flex items-center justify-center">
                    <Link
                      href="/product/kaffee-seminar"
                      className="bg-secondary px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      Jetzt Platz sichern
                    </Link>
                  </div>
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
