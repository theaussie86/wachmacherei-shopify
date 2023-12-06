'use server';

export async function submitContactForm(data: FormData) {
  console.log('submitContactForm', data);
  return new Promise((resolve) => {
    resolve({ payload: data });
  });
}
