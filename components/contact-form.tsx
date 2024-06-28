'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { sendContactEmail } from 'lib/microsoft';
import { startVerifyRecaptcha } from 'lib/utils';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name ist erforderlich' }),
  email: z
    .string()
    .min(1, { message: 'E-Mail-Adresse ist erforderlich' })
    .email({ message: 'Ungültige E-Mail-Adresse' }),
  message: z
    .string({ required_error: 'Nachricht ist erforderlich' })
    .min(20, 'Nachricht muss mindestens 20 Zeichen lang sein.')
    .max(1500, 'Nachricht darf maximal 1500 Zeichen lang sein.')
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactForm() {
  const [message, setMessage] = useState<string>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    // control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await startVerifyRecaptcha(executeRecaptcha, 'contact');
      console.log('recaptcha verified');
      console.log('submitting data', data);
      await sendContactEmail(data).then(() => {
        setMessage('Nachricht erfolgreich gesendet');
      });

      reset();
    } catch (error) {
      console.error(error);
      setMessage('Nachricht konnte nicht gesendet werden');
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
        className={clsx(
          'flex items-center justify-center gap-x-2 rounded px-5 py-1.5 text-xl tracking-widest text-secondary ring-2 ring-secondary hover:opacity-80',
          isSubmitting && 'cursor-not-allowed opacity-50'
        )}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-secondary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        Absenden
      </button>
      {/* <DevTool control={control} placement="bottom-left" /> */}
    </form>
  );
}

export default ContactForm;
