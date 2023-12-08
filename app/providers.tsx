import { CookieProvider } from 'lib/context/cookies';
import { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  return <CookieProvider>{children}</CookieProvider>;
}

export default Providers;
