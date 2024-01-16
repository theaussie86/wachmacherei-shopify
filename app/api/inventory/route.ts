import { kv } from '@vercel/kv';
import { fetchStock } from 'lib/r2o';
import { adjustStockLevels, getStockLevels } from 'lib/shopify';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let sku;
  try {
    const secret = req.nextUrl.searchParams.get('secret');

    if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret.');
      return NextResponse.json({ status: 200 });
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

    const isAlreadyBeingFetched = await kv.get(`${sku}-stock`);
    if (isAlreadyBeingFetched) {
      console.log('Already being fetched.', sku);
      return NextResponse.json({ status: 202 });
    }

    await kv.set(`${sku}-stock`, true);

    const r2oStock = await fetchStock(sku);
    const r2oStockLevel = r2oStock[0].product_stock;

    // check stock levels in shopify and update if necessary
    const shopifyStock = await getStockLevels(sku);
    const shopifyStockLevel = shopifyStock[0]?.inventoryLevels[0]?.available;
    const locationId = shopifyStock[0]?.inventoryLevels[0]?.location.id;
    console.log(r2oStockLevel, shopifyStock);

    if (r2oStockLevel !== shopifyStockLevel && locationId) {
      const adjustments = shopifyStock.map((item) => ({
        inventoryItemId: item.id,
        availableDelta: r2oStockLevel - (shopifyStockLevel || 0)
      }));

      await adjustStockLevels(adjustments, locationId);
    }
    return NextResponse.json({ status: 200, body: data });
  } finally {
    // Remove the request from active requests after completion or error
    await kv.del(`${sku}-stock`);
  }
}
