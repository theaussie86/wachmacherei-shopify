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
