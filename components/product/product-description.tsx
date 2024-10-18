import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import ProductPrice from './price';
import ProductCourseSelection from './product-course';
import ProductProperties from './product-properties';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  const isCourseProduct = product.metafields.some(
    (metafield) => metafield?.key === 'cal_eventtypeid'
  );
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
      {isCourseProduct ? (
        <Suspense fallback={<DatesSkeleton />}>
          <ProductCourseSelection
            eventType={
              product.metafields.find((metafield) => metafield?.key === 'cal_eventtypeid')?.value ??
              'MISSING_EVENT_TYPE'
            }
          />
        </Suspense>
      ) : null}

      <AddToCart
        variants={product.variants}
        availableForSale={product.availableForSale}
        isCourseProduct={isCourseProduct}
      />
    </>
  );
}

function DatesSkeleton() {
  return (
    <dl className={clsx('mb-8')}>
      <dt className="mb-4 text-sm uppercase tracking-wide">Datum auswählen</dt>
      <dd className="flex flex-wrap gap-3">
        {new Array(4).fill(null).map((_, index) => {
          return <div key={index} className="skeleton h-6 w-20"></div>;
        })}
      </dd>
      <dt className="skeleton my-4 h-6 w-20"></dt>
    </dl>
  );
}
