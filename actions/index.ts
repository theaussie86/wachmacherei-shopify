'use server';
import { kv } from '@vercel/kv';
import { fetchStock } from 'lib/r2o';
import { adjustStockLevels, getProduct, getStockLevels } from 'lib/shopify';
import { ShopifyInventoryItemAdjustment } from 'lib/shopify/types';

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

  if (handle && typeof handle === 'string') {
    const product = await getProduct(handle);
    const variants = product?.variants.map((v) => ({ id: v.id, sku: v.sku }));
    const uniqueVariants = variants?.filter((v, i, a) => a.findIndex((t) => t.sku === v.sku) === i);

    if (!uniqueVariants) return console.log('no variants found');

    const inventoryItemAdjustments: Array<ShopifyInventoryItemAdjustment> = [];
    let locationId: string | undefined = '';
    for (const variant of uniqueVariants) {
      const R2OStock = await fetchStock(variant.sku);
      const stockLevels = await getStockLevels(variant.sku);

      stockLevels.forEach((sl) => {
        if (!locationId) {
          locationId = sl.inventoryLevels[0]?.location.id;
        } else if (locationId !== sl.inventoryLevels[0]?.location.id) {
          throw new Error('locationId mismatch');
        }

        const currShopifyStock = sl.inventoryLevels[0]?.available || 0;
        const currR2OStock = R2OStock[0]?.product_stock || 0;
        const delta = currR2OStock - currShopifyStock;
        if (!delta) return;

        inventoryItemAdjustments.push({
          inventoryItemId: sl.id,
          availableDelta: currR2OStock - currShopifyStock
        });
      });
    }
    await adjustStockLevels(inventoryItemAdjustments, locationId);
  }
}
