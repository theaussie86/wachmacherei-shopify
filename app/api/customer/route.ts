import { createOrUpdateCustomerInR2O } from 'lib/r2o';
import { shopifyAdminFetch } from 'lib/shopify';
import { getCustomerByIdQuery } from 'lib/shopify/queries/customer';
import { ShopifyCustomer, ShopifyCustomerOperation } from 'lib/shopify/types';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');
  const topic = headers().get('x-shopify-topic');
  const domain = headers().get('x-shopify-shop-domain');
  const shopDomains = ['wachmacherei.myshopify.com', '15c1d2-4.myshopify.com'];
  const customerTopics = ['customers/create', 'customers/update'];

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!topic || !customerTopics.includes(topic)) {
    console.error('Invalid topic.', topic);
    return NextResponse.json({ status: 200 });
  }

  if (!domain || !shopDomains.includes(domain)) {
    console.error('Invalid shop domain.', domain);
    return NextResponse.json({ status: 200 });
  }

  const data: ShopifyCustomer = await req.json();
  const res = await shopifyAdminFetch<ShopifyCustomerOperation>({
    query: getCustomerByIdQuery,
    variables: {
      id: data.admin_graphql_api_id
    },
    cache: 'no-cache'
  });
  const customerData = res.body.data.customer;
  const customerId = customerData.metafield?.value;

  const customerR2OData = await createOrUpdateCustomerInR2O(
    customerData,
    customerId ? parseInt(customerId) : undefined
  );
  return NextResponse.json({ status: 200, body: customerR2OData });
}
