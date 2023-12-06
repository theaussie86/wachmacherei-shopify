'use client';

import { submitContactForm } from 'actions';

function ContactForm() {
  return (
    <form className="mt-6 flex flex-col gap-4" action={submitContactForm}>
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          type="name"
          name="name"
          id="name"
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          placeholder="Name"
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="email">
          E-Mail
        </label>
        <input
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          type="email"
          placeholder="E-Mail-Adresse"
        />
      </div>
      <div>
        <label htmlFor="message" className="sr-only">
          Nachricht
        </label>
        <textarea
          className="block w-full rounded-md border-0 bg-primary px-4 py-3 text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary"
          name="message"
          id="message"
          cols={30}
          rows={5}
          placeholder="Nachricht"
        ></textarea>
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
