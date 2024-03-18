import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Unauthorized request to cron route');
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  console.log('Cron job triggered');
  return NextResponse.json({ ok: true });
}
