import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const headers = req.headers;
  const data = await req.json();
  const hash = headers.get('x-cal-signature-256');

  if (!hash) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }
  // revalidate server action for fetching available dates
  revalidateTag(TAGS.calendar);

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

// function validatePayload(hash: string, payload: string): boolean {
//   const secret = process.env.CAL_WEBHOOK_SECRET;
//   if (!secret) {
//     throw new Error('CAL_WEBHOOK_SECRET is not set');
//   }
//   const hmac = createHmac('sha256', secret);

//   hmac.update(payload);

//   const computedHash = hmac.digest('hex');

//   console.log('payload verified:', hash === computedHash);

//   return hash === computedHash;
// }
