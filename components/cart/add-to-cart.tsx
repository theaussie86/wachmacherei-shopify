'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem, AddItemFormData } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: AddItemFormData['selectedVariantId'];
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-secondary p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Ausverkauft
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        In den Warenkorb
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      In den Warenkorb
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale,
  isCourseProduct
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  isCourseProduct: boolean;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;

  // filter searchParams for additional attributes. For example, if you have a product with a custom attribute "date" we want to add this to the cart as a line item property.
  const selectedOptions = variants.find(
    (variant) => variant.id === selectedVariantId
  )?.selectedOptions;
  // convert searchParams to array with items of name and value pairs
  const searchParamsArray = Array.from(searchParams.entries()).map(([name, value]) => ({
    name,
    value
  }));

  const additionalAttributes = searchParamsArray.filter(
    (searchParam) =>
      !selectedOptions?.some(
        (selectedOption) => selectedOption.name.toLowerCase() === searchParam.name
      )
  );

  const indexes: Record<string, number> = {};
  const additionalData = additionalAttributes
    .map((attribute, _, array) => {
      const occurrences = array.filter((attr) => attr.name === attribute.name).length;
      if (occurrences > 1) {
        const count = (indexes[attribute.name] || 0) + 1;
        indexes[attribute.name] = count;

        return {
          key: `${count + 1}. ${attribute.name.charAt(0).toUpperCase()}${attribute.name.slice(1)}`,
          value: attribute.value
        };
      }
      return {
        key: attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1),
        value: attribute.value
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  const additionalQuantity = indexes['teilnehmer'] || 0;

  const actionWithVariantAndAttributes = formAction.bind(null, {
    selectedVariantId,
    additionalData,
    quantity: additionalQuantity + 1
  });

  return (
    <form action={actionWithVariantAndAttributes}>
      <SubmitButton
        availableForSale={
          isCourseProduct
            ? availableForSale &&
              additionalAttributes.findIndex((attr) => attr.name === 'datum') > -1
            : availableForSale
        }
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
