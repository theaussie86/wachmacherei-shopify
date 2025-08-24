'use server';
import { signIn, signOut as signOutAuth } from 'lib/auth';
import { fetchStock } from 'lib/r2o';
import { adjustInventoryQuantities, getProduct, getStockLevels } from 'lib/shopify';
import { ShopifyInventoryItemAdjustment } from 'lib/shopify/types';

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

        const currShopifyStock =
          sl.inventoryLevels[0]?.quantities.find((q) => q.name === 'available')?.quantity || 0;
        const currR2OStock = R2OStock[0]?.product_stock || 0;
        const delta = currR2OStock - currShopifyStock;
        if (!delta) return;

        inventoryItemAdjustments.push({
          inventoryItemId: sl.id,
          availableDelta: currR2OStock - currShopifyStock
        });
      });
    }
    await adjustInventoryQuantities(inventoryItemAdjustments, locationId);
  }
}

export async function signInWithGoogle(input: FormData) {
  const action = input.get('action');
  if (!action) return console.error('no action found');
  if (typeof action !== 'string') return console.error('action is not a string');
  await signIn(action, { redirectTo: '/admin' });
}

export async function signOut() {
  await signOutAuth();
}
