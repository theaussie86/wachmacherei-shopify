import { kv } from '@vercel/kv';
import { fetchStock } from 'lib/r2o';
import { adjustInventoryQuantities, adjustVariantsPrice, getStockLevels } from 'lib/shopify';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log(req.headers.get('x-r2o-webhook-created-at'));
  let sku;
  try {
    const secret = req.nextUrl.searchParams.get('secret');

    if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret.');
      return NextResponse.json({ status: 200 });
    }
    const lastRequestTime = await kv.get('x-r2o-webhook-created-at');
    if (lastRequestTime) {
      const currentRequestTime = headers().get('x-r2o-webhook-created-at');
      if (currentRequestTime && currentRequestTime === lastRequestTime) {
        console.warn('Too many requests in the last second.');
        return NextResponse.json({ status: 200 });
      }
    } else {
      await kv.set('x-r2o-webhook-created-at', headers().get('x-r2o-webhook-created-at'));
    }

    const topic = headers().get('x-r2o-webhook-event');
    if (!topic || topic !== 'product.updated') {
      console.error('Invalid topic.', topic);
      return NextResponse.json({ status: 200 });
    }

    const cid = headers().get('x-r2o-webhook-cid');
    if (!cid || cid !== process.env.R2O_CID) {
      console.error('Invalid cid from ready2order.', cid);
      return NextResponse.json({ status: 200 });
    }

    const dataString = await req.text();
    const params = new URLSearchParams(decodeURIComponent(dataString));
    const data = Object.fromEntries(params);
    // fetch actual data from r2o, because old and new stock values are being mixed up.
    sku = data['resource[product_itemnumber]'];

    if (!sku || sku === 'null') {
      console.error('No sku found in data.', data);
      return NextResponse.json({ status: 200 });
    }
    // check if the product is already being fetched
    const isAlreadyBeingFetched = await kv.get(`${sku}-stock`);
    console.log('isAlreadyBeingFetched', isAlreadyBeingFetched, `${sku}-stock`);
    if (isAlreadyBeingFetched) {
      console.log('Already being fetched.', sku);
      return NextResponse.json({ status: 202 });
    }

    await kv.set(`${sku}-stock`, true, { ex: 120 });
    console.log('Data', data);
    // get product price and check if it changed
    const r2oProductID = data['resource[product_id]'];
    const r2oProductPrice = parseFloat(data['resource[product_price]'] || 'NaN');

    let r2oStockLevel = 0;
    try {
      const r2oStock = await fetchStock(sku);
      r2oStockLevel = r2oStock[0]?.product_stock || 0;
    } catch (error) {
      console.error('Error fetching stock from r2o.', error);
    }

    // check stock levels in shopify and update if necessary
    const shopifyStock = await getStockLevels(sku);

    console.log('shopifystock', shopifyStock);
    const adjustments = [];
    let locationId: string | undefined = undefined;
    let productID: string | undefined = undefined;
    const variants = [];
    for (const item of shopifyStock) {
      const shopifyStockLevel = item.inventoryLevels[0]?.quantities.find(
        (q) => q.name === 'available'
      )?.quantity;
      if (!locationId) {
        locationId = item.inventoryLevels[0]?.location.id;
      }

      if (r2oStockLevel !== shopifyStockLevel && locationId) {
        adjustments.push({
          inventoryItemId: item.id,
          availableDelta: r2oStockLevel - (shopifyStockLevel || 0)
        });
      }

      const shopifyR2oId = item.variant.metafield?.value || item.variant.product.metafield?.value;
      const shopifyPrice = parseFloat(item.variant.contextualPricing.price.amount);

      if (!productID) {
        productID = item.variant.product.id;
      }

      console.log('item Ids', r2oProductID, shopifyR2oId, r2oProductID === shopifyR2oId);
      if (r2oProductID === shopifyR2oId && r2oProductPrice !== shopifyPrice) {
        variants.push({
          id: item.variant.id,
          price: r2oProductPrice.toString()
        });
      }
    }

    if (!locationId) {
      console.error('No location id found.');
      return NextResponse.json({ status: 200 });
    }
    await adjustInventoryQuantities(adjustments, locationId);
    await kv.del(`${sku}-stock`);

    if (!productID) {
      console.error('No product id found.');
      return NextResponse.json({ status: 200 });
    }
    await adjustVariantsPrice(productID, variants);
    await kv.del('x-r2o-webhook-created-at');
    return NextResponse.json({ status: 200, body: data });
  } catch (error) {
    console.error('Error in inventory route.', error);
    await kv.del(`${sku}-stock`);
    await kv.del('x-r2o-webhook-created-at');
    return NextResponse.json({ status: 200, body: error });
  }
}
