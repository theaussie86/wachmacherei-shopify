'use server';

export async function submitContactForm(data: FormData) {
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
