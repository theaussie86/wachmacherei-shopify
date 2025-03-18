import ProductDetailsForm from './form';

function AdminProductDetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Produkt Details suchen</h1>
        <p className="text-base-content/70">
          Geben Sie die Artikelnummer eines Produkts aus r2o ein, um die Details zu sehen.
        </p>
      </div>
      <ProductDetailsForm />
    </div>
  );
}

export default AdminProductDetailsPage;
