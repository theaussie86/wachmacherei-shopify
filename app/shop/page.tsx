import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import { baseUrl, openGraphDefaults } from '../../lib/utils';

export const metadata = {
  title: 'Shop',
  description:
    'Hier findest du alle Produkte aus unserem Sortiment. Nutze die Suchfunktion um Produkte zu finden.',
  openGraph: {
    ...openGraphDefaults,
    url: baseUrl + '/shop'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function ShopPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'Keine Produkte gefunden die übereinstimmen mit '
            : `${products.length} Treffer gefunden für `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
