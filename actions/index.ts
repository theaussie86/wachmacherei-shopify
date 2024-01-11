'use server';
import { kv } from '@vercel/kv';
import { fetchStock } from 'lib/r2o';
import { getProduct, getStockLevels } from 'lib/shopify';

export async function submitContactForm(data: FormData) {
  await kv.set('token', 'my test token');
  const token = await kv.get('token');
  console.log('token', token);
  if (process.env.GAPI_CREDS) console.log('credt', atob(process.env.GAPI_CREDS));
  console.log('submitContactForm', data);
  return new Promise((resolve) => {
    resolve({ payload: data });
  });
}

export async function verifyRecaptcha(token: string) {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  const data = await res.json();
  console.log('recaptcha result', data);

  return data;
}

export async function updateStock(input: FormData) {
  const handle = input.get('handle');

  if (!handle) return console.error('no handle found');
  if (typeof handle !== 'string') return console.error('handle is not a string');

  const stockLevels = await getStockLevels('E-BRA-1000');
  console.log('stockLevels', stockLevels);

  if (handle && typeof handle === 'string') {
    const product = await getProduct(handle);
    const variants = product?.variants.map((v) => ({ id: v.id, sku: v.sku }));
    const unigueVariants = variants?.filter((v, i, a) => a.findIndex((t) => t.sku === v.sku) === i);

    if (!unigueVariants) return console.log('no variants found');

    const inputs = [];
    for (const variant of unigueVariants) {
      console.log('variant', variant);
      const stock = await fetchStock(variant.sku);
      console.log('stock', stock);

      variants
        ?.filter((v) => v.sku === variant.sku)
        .forEach((v) => inputs.push({ id: v.id, newStock: stock[0].product_stock }));
    }
  }
}
