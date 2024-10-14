import { AddToCart } from 'components/cart/add-to-cart';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import ProductPrice from './price';
import ProductDateSelector from './product-date';
import ProductProperties from './product-properties';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
      </div>

      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      <ProductProperties metafields={product.metafields} />
      <ProductPrice product={product} />
      <VariantSelector options={product.options} variants={product.variants} />
      {['barista-kurs'].includes(product.handle) ? (
        <Suspense fallback={'...loading'}>
          <ProductDateSelector />
        </Suspense>
      ) : null}

      <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
    </>
  );
}
