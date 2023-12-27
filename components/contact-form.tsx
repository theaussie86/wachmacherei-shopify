'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startVerifyRecaptcha } from 'lib/utils';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string({ required_error: 'Name ist erforderlich' }),
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  message: z
    .string({ required_error: 'Nachricht ist erforderlich' })
    .min(20, 'Nachricht muss mindestens 20 Zeichen lang sein.')
    .max(1500, 'Nachricht darf maximal 1500 Zeichen lang sein.')
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactForm() {
  const [message, setMessage] = useState();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: FieldValues) => {
    try {
      await startVerifyRecaptcha(executeRecaptcha, 'contact');
      console.log('recaptcha verified');
      console.log('submitting data', data);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const res = await response.json();
      console.log(res);
      setMessage(res.msg);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {message ? (
        <div className="relative rounded bg-secondary px-4 py-3 text-white">
          <span className="block sm:inline">{message}</span>
        </div>
      ) : null}
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          type="name"
          {...register('name')}
          id="name"
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          placeholder="Name"
        />
        {errors.name ? (
          <span className="mt-2 text-sm text-red-600" id="name-error">
            {errors.name.message}
          </span>
        ) : null}
      </div>
      <div>
        <label className="sr-only" htmlFor="email">
          E-Mail
        </label>
        <input
          {...register('email', { required: true })}
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          type="email"
          placeholder="E-Mail-Adresse"
          id="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby="email-error"
        />
        {errors.email ? (
          <span className="mt-2 text-sm text-red-600" id="email-error">
            {errors.email.message}
          </span>
        ) : null}
      </div>
      <div>
        <label htmlFor="message" className="sr-only">
          Nachricht
        </label>
        <textarea
          {...register('message', { required: true })}
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          name="message"
          id="message"
          cols={30}
          rows={5}
          placeholder="Nachricht"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby="message-error"
        ></textarea>
        {errors.message ? (
          <span className="mt-2 text-sm text-red-600" id="message-error">
            {errors.message.message}
          </span>
        ) : null}
      </div>
      <button
        className="rounded px-5 py-1.5 text-xl tracking-widest text-secondary ring-2 ring-secondary"
        type="submit"
      >
        Absenden
      </button>
    </form>
  );
}

export default ContactForm;
