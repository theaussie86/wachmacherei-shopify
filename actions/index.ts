'use server';
import { kv } from '@vercel/kv';

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
