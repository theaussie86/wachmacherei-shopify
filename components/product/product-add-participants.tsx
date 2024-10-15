'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { SlotsResponse } from 'lib/calendar';
import { createUrl } from 'lib/utils';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateCourseItem } from './actions';

const formSchema = z.object({
  participant: z.string().email({ message: 'Ungültige E-Mail-Adresse' })
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductAddParticipants({ slots, maximumSeats }: SlotsResponse) {
  const searchParams = useSearchParams();
  const { handle } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialParticipant = searchParams.getAll('teilnehmer');

  const attendees = slots[searchParams.get('datum') ?? '']?.[0]?.attendees ?? 0;

  const disabled = maximumSeats - 1 - attendees - initialParticipant.length <= 0;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async ({ participant }: FormValues) => {
    const participantEmail = participant.trim();

    try {
      if (typeof handle === 'string') {
        await updateCourseItem(handle, participantEmail, searchParams.get('datum') ?? '', 'add');
      }
    } catch (error) {
      console.error(error);
    }
    const newSearchParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      newSearchParams.append(key, value);
    });
    newSearchParams.append('teilnehmer', participantEmail);

    const newUrl = createUrl(pathname, newSearchParams);
    router.replace(newUrl, { scroll: false });
    reset();
  };

  if (!searchParams.has('datum')) {
    return null;
  }

  return (
    <div>
      {disabled ? (
        <div className="block text-sm font-medium uppercase leading-6 tracking-wide">
          Leider sind keine weiteren Plätze verfügbar.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="participant"
            className="block text-sm font-medium uppercase leading-6 tracking-wide"
          >
            zusätzliche Teilnehmer
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type="email"
                {...register('participant')}
                id="participant"
                placeholder="E-Mail-Adresse"
                className={clsx(
                  'block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6 dark:bg-transparent dark:text-white',
                  {
                    'ring-red-500': errors.participant
                  }
                )}
              />
            </div>
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-secondary px-3 py-2 text-sm font-semibold text-gray-50 ring-1 ring-inset ring-gray-300 hover:bg-secondary/80 focus:ring-2 focus:ring-inset focus:ring-secondary"
            >
              hinzufügen
            </button>
          </div>
          {errors.participant ? (
            <span className="mt-2 text-sm text-red-600" id="email-error">
              {errors.participant.message}
            </span>
          ) : null}
        </form>
      )}
      <div className="mt-4">
        {initialParticipant.map((email) => (
          <AdditionalParticipant key={email} email={email} />
        ))}
      </div>
    </div>
  );
}

function AdditionalParticipant({ email }: { email: string }) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const newSearchParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    newSearchParams.append(key, value);
  });

  async function removeParticipant() {
    newSearchParams.delete('teilnehmer', email);
    const { handle } = params;
    try {
      if (handle && typeof handle === 'string') {
        await updateCourseItem(handle, email, searchParams.get('datum') ?? '', 'remove');
      }
    } catch (error) {
      console.error(error);
    }
    const newUrl = createUrl(pathname, newSearchParams);
    router.replace(newUrl, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm text-gray-900 dark:text-gray-400">{email}</div>
      <button onClick={removeParticipant} className="text-sm text-red-500">
        <TrashIcon className="size-5" />
      </button>
    </div>
  );
}
