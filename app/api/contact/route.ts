import { authorize, sendEmail } from 'lib/gmail';
import { NextRequest, NextResponse as Response } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const auth = await authorize();
  await sendEmail(auth, body);
  return Response.json({ msg: 'Kontaktanfrage verschickt' });
}
