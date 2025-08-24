import { kv } from '@vercel/kv';
import {
  addAttendeeToCalEventBooking,
  createCalEventBooking,
  fetchAvailableDates,
  getCalEventBookings
} from 'lib/calendar';
import { shopifyAdminFetch } from 'lib/shopify';
import { getCalEventIdOfProduct } from 'lib/shopify/queries/product';
import { ShopifyGetCalEventTypeIdOfProductOperation } from 'lib/shopify/types';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type LineItemProps = {
  properties: { name: string; value: string }[];
  product_id: string;
  quantity: number;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  const resolvedHeaders = await headers();
  const topic = resolvedHeaders.get('x-shopify-topic') || 'unknown';
  if (topic !== 'orders/paid') {
    console.log('Invalid topic');
    return NextResponse.json({ status: 200 });
  }

  // get the body
  const body = await req.json();
  const {
    customer,
    line_items,
    id: orderId
  }: {
    customer: { email: string; first_name: string; last_name: string } & Record<string, unknown>;
    line_items: LineItemProps[];
    id: string;
  } = body;

  // Check if this order has already been processed
  const orderKey = `order-${orderId}-${customer.email}`;
  const isProcessed = await kv.get(orderKey);
  if (isProcessed) {
    console.log('Order already processed', orderKey);
    return NextResponse.json({ status: 200, message: 'Order already processed' });
  }

  const { email, first_name, last_name } = customer;

  // filter out the line items that don't have extra attributes
  const courseLineItems = line_items.filter(
    (line) => line.properties.length > 0 && line.properties.some((prop) => prop.name === 'Datum')
  );

  for (const line of courseLineItems) {
    // get the date of the course
    const datum = line.properties.find((prop) => prop.name === 'Datum')?.value;
    if (!datum) {
      console.error('No date found in line item properties', line);
      continue;
    }

    // get the calendar event type id of the product in shopify
    const {
      body: {
        data: { product }
      }
    } = await shopifyAdminFetch<ShopifyGetCalEventTypeIdOfProductOperation>({
      query: getCalEventIdOfProduct,
      variables: { id: `gid://shopify/Product/${line.product_id}` }
    });

    if (!product || !product.metafield || product.metafield.key !== 'cal_eventtypeid') {
      console.error('Product has no calendar event type id', product);
      continue;
    }
    const calendarEventTypeId = product.metafield.value;
    // get the available dates for the calendar event type
    const slotsData = await fetchAvailableDates(calendarEventTypeId);
    const slot = slotsData.slots[datum];

    if (!slot || !slot[0]) {
      console.error('No slot found for date', datum);
      continue;
    }

    const slotData = slot[0];

    let bookingData;
    const promises = [];
    if (slotData.bookingUid) {
      // get the booking data
      const bookingDataRes = await getCalEventBookings(slotData.bookingUid);
      bookingData = bookingDataRes[0];
      if (!bookingData) {
        console.error('Booking data not found', slotData.bookingUid);
        continue;
      }

      promises.push(
        addAttendeeToCalEventBooking({
          bookingId: parseInt(bookingData.id),
          email,
          name: `${first_name} ${last_name}`
        })
      );
    } else {
      // create a booking
      bookingData = await createCalEventBooking({
        eventTypeId: calendarEventTypeId,
        start: slotData.time,
        email,
        name: `${first_name} ${last_name}`
      });
    }

    // add additional attendees
    if (line.quantity > 1) {
      for (let i = 1; i < line.quantity; i++) {
        promises.push(
          addAttendeeToCalEventBooking({
            bookingId: parseInt(bookingData.id),
            email,
            name: `${i}. Gast von ${first_name}`
          })
        );
      }
    }
    await Promise.all(promises);
  }

  // Mark order as processed
  await kv.set(orderKey, true, { ex: 60 * 60 * 1 }); // Expire after 1 hour

  return NextResponse.json({ message: 'Order processed successfully' });
}
