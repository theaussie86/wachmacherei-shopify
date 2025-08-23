import ProductTransferForm from './form';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

function AdminProductTransferPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Produkt übertragen</h1>
        <p className="text-base-content/70">
          Geben Sie die Artikelnummer eines Produkts aus r2o ein, um es zu Shopify zu übertragen.
        </p>
      </div>
      <ProductTransferForm />
    </div>
  );
}

export default AdminProductTransferPage;
