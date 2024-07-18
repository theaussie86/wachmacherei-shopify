import { verifyRecaptcha } from 'actions';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Product } from './shopify/types';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

export const formatPrice = (amount: string, currencyCode: string) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  }).format(parseFloat(amount));
};

export const calculateAveragePrice = (
  price: string,
  weight: number,
  weightUnit: string,
  currencyCode = 'EUR'
) => {
  console.log('price', price);
  console.log('weight', weight);
  console.log('weightUnit', weightUnit);
  if (weightUnit === 'KILOGRAMS') {
    return formatPrice((parseFloat(price) / weight).toString(), currencyCode) + ' / kg';
  }
  // we always return the average price in kilograms
  return weight;
};

export const isMinEqualMaxPrice = (priceRange: Product['priceRange']) => {
  return (
    priceRange.minVariantPrice.amount === priceRange.maxVariantPrice.amount &&
    priceRange.minVariantPrice.currencyCode === priceRange.maxVariantPrice.currencyCode
  );
};

export const startVerifyRecaptcha = async (
  // eslint-disable-next-line no-unused-vars
  executeRecaptcha: ((action?: string | undefined) => Promise<string>) | undefined,
  action: string
) => {
  if (!executeRecaptcha) {
    throw new Error('Recaptcha not available');
  }
  const token = await executeRecaptcha(action);
  if (!token) {
    throw new Error('Recaptcha token not available');
  }
  // console.log(token);
  const verifyRes = await verifyRecaptcha(token);
  // console.log(verifyRes);
  if (!verifyRes.success || verifyRes.score < 0.5) {
    throw new Error('Recaptcha verification failed');
  }
};

export const { SITE_NAME } = process.env;
export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const openGraphDefaults = {
  type: 'website',
  title: SITE_NAME!,
  description: 'Ihre Kaffeerösterei im Allgäu im wunderschönen Ottobeuren',
  url: baseUrl,
  locale: 'de_DE'
};
