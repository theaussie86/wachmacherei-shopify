import { authorize, sendEmail } from 'lib/gmail';
import { NextRequest, NextResponse as Response } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('body', body);
  const auth = await authorize();
  // const labels = await listLabels(auth);
  await sendEmail(auth, body);
  return Response.json({ msg: 'Kontaktanfrage verschickt' });
}
