'use client';

import Cookies from 'js-cookie';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

export const CONSENT_DISPLAY_KEY = 'cookie_consent_shown';
export const USER_CONSENT_DATE_KEY = 'cookie_consent_date';
export const EXPIRE_DATE = 365;

type CookieCategory = {
  name: string;
  description: string;
  required: boolean;
  services: Record<string, { name: string; purpose: string; url: string }>;
  cookies?: string[];
};

export const cookieConfigurations: Record<string, CookieCategory> = {
  necessary: {
    name: 'Notwendig',
    description: 'Diese Cookies sind für den Betrieb der Website notwendig.',
    services: {
      owner: {
        name: 'Wachmacherei',
        purpose:
          'Wachmacherei verwendet Cookies, die grundlegende Funktionen ermöglichen, die für die Funktion dieses Cookie-Banners unerlässlich sind.',
        url: 'https://wachmacherei.de/datenschutz'
      },
      recaptcha: {
        name: 'Google Recaptcha',
        purpose: 'Google Recaptcha ist ein Service, der uns vor Spam und Missbrauch schützt.',
        url: 'https://policies.google.com/privacy?hl=de'
      }
    },
    required: true
  },
  analytics: {
    name: 'Analytics',
    description: 'Diese Cookies helfen uns, das Nutzungsverhalten zu verstehen.',
    cookies: ['_gid', '_ga', `${process.env.NEXT_PUBLIC_GA_STREAM_ID?.replace('G-', '_ga_')}`],
    services: {
      googleAnalytics: {
        name: 'Google Analytics',
        purpose:
          'Google Analytics ist ein Webanalysedienst, der Ihnen Werkzeuge zur Messung des Erfolgs Ihrer Website oder Blogs in Bezug auf Marketing, Inhaltsoptimierung oder E-Commerce zur Verfügung stellt. Google Analytics hat seinen Ursprung in der Webanalysefirma Urchin, die Ende 2005 von Google übernommen wurde. Die Google Analytics-Integration ermöglicht es Website-Besitzern, Besucher auf ihrer Website zu verfolgen und zu analysieren. Google Analytics sammelt Besucherdaten über URLs und Webseitenansichten, Referrer-URLs, IP-Adressen und Geräteinformationen, die das Betriebssystem, den Browser und die Bildschirmauflösung umfassen. Google Analytics erfasst auch grundlegende demografische Informationen wie Geschlecht und Altersgruppe, die über Google-Anmeldedaten erfasst werden.',
        url: 'https://marketingplatform.google.com/about/analytics/terms/us/'
      }
    },
    required: false
  }
};

type CookieContextProps = {
  isConsentOpen: boolean;
  setIsConsentOpen: Dispatch<SetStateAction<boolean>>;
  isSettingOpen: boolean;
  setIsSettingOpen: Dispatch<SetStateAction<boolean>>;
  accept: Function;
  decline: () => void;
};

const CookieContext = createContext<CookieContextProps>({
  isConsentOpen: false,
  setIsConsentOpen: () => {},
  isSettingOpen: false,
  setIsSettingOpen: () => {},
  accept: () => {},
  decline: () => {}
});

export function CookieProvider({ children }: PropsWithChildren) {
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const accept = (categories?: Record<string, boolean>) => {
    acceptNecessary();

    if (categories) {
      Object.entries(categories).forEach(([key, value]) => {
        Cookies.set(`wm-${key}`, String(value), { expires: EXPIRE_DATE });
      });
    } else {
      Object.entries(cookieConfigurations).forEach(([key]) => {
        if (key === 'necessary') return;
        Cookies.set(`wm-${key}`, 'true', { expires: EXPIRE_DATE });
      });
    }

    Cookies.set(USER_CONSENT_DATE_KEY, Date.now().toString(), {
      expires: EXPIRE_DATE
    });
    window.location.reload();
  };

  const decline = () => {
    Cookies.set(CONSENT_DISPLAY_KEY, 'true', { expires: EXPIRE_DATE });
    acceptNecessary();

    Object.entries(cookieConfigurations).forEach(([key, { cookies }]) => {
      if (key === 'necessary') return;
      Cookies.set(`wm-${key}`, 'false', { expires: EXPIRE_DATE });
      cookies?.forEach((cookieKey) => {
        Cookies.remove(cookieKey);
      });
    });
    Cookies.set(USER_CONSENT_DATE_KEY, Date.now().toString(), {
      expires: EXPIRE_DATE
    });
    window.location.reload();
  };

  const acceptNecessary = () => {
    Cookies.set(CONSENT_DISPLAY_KEY, 'true', { expires: EXPIRE_DATE });
    Cookies.set(`wm-necessary`, 'true', { expires: EXPIRE_DATE });
  };

  useEffect(() => {
    const alreadyShown = Cookies.get(CONSENT_DISPLAY_KEY) === 'true';
    setIsConsentOpen(!alreadyShown);

    Object.entries(cookieConfigurations).forEach(([key, { cookies }]) => {
      if (key === 'necessary') return;

      const consented = Cookies.get(`wm-${key}`) === 'true';
      if (!consented) {
        cookies?.forEach((cookieKey) => {
          Cookies.remove(cookieKey);
        });
      }
    });
  }, []);

  return (
    <CookieContext.Provider
      value={{ isConsentOpen, setIsConsentOpen, isSettingOpen, setIsSettingOpen, accept, decline }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const context = useContext(CookieContext);

  if (!context) {
    throw new Error('useCookie must be used within a CookieProvider');
  }

  return context;
}
