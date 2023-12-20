'use client';

import { Product } from 'lib/shopify/types';
import { calculateAveragePrice, formatPrice, isMinEqualMaxPrice } from 'lib/utils';
import { useSearchParams } from 'next/navigation';

function ProductPrice({ product }: { product: Product }) {
  const { variants, priceRange } = product;
  const searchParams = useSearchParams();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;

  const amount = selectedVariantId ? variant?.price.amount : null;
  const currency = selectedVariantId ? variant?.price.currencyCode : null;

  const averageWeight =
    selectedVariantId && variant && variant.weight !== 0
      ? calculateAveragePrice(variant.price.amount, variant.weight, variant.weightUnit)
      : null;
  return (
    <div className="mb-6 flex flex-col items-start gap-2 pb-6">
      <div className="flex-none rounded-full bg-secondary p-2 text-white">
        {selectedVariantId && amount && currency
          ? formatPrice(amount, currency)
          : isMinEqualMaxPrice(priceRange)
          ? formatPrice(priceRange.minVariantPrice.amount, priceRange.minVariantPrice.currencyCode)
          : `${formatPrice(
              priceRange.minVariantPrice.amount,
              priceRange.minVariantPrice.currencyCode
            )} - ${formatPrice(
              priceRange.maxVariantPrice.amount,
              priceRange.maxVariantPrice.currencyCode
            )}`}
      </div>
      {averageWeight ? <span>({averageWeight})</span> : null}
    </div>
  );
}

export default ProductPrice;
