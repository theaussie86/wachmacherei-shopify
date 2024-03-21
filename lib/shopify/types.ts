export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  metafield: {
    key: string;
    value: string;
  } | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  weight: number;
  weightUnit: string;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyMetaField = {
  id?: string;
  namespace?: string;
  key?: string;
  value?: string;
};

export type ShopifyCustomer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  defaultAddress: {
    address1: string;
    address2?: string;
    city: string;
    company?: string;
    country: string;
    countryCodeV2: string;
    phone?: string;
    zip: string;
  };
  admin_graphql_api_id: string;
  metafield: ShopifyMetaField | null;
  metafields: Array<ShopifyMetaField | null>;
};

export type ShopifyCustomerMetafieldUpdateInput = {
  input: {
    id: string;
    metafields: ShopifyMetaField[];
  };
};

export type ShopifyCustomerUpdateOperation = {
  data: {
    customerUpdate: {
      customer: ShopifyCustomer;
    };
  };
  variables: ShopifyCustomerMetafieldUpdateInput;
};

export type ShopifyCustomerOperation = {
  data: {
    customer: ShopifyCustomer;
  };
  variables: {
    id: string;
  };
};
export type ShopifyCustomerFindOperation = {
  data: {
    customers: Connection<ShopifyCustomer>;
  };
  variables: {
    query: string;
  };
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  metafields: Array<{ key: string; value: string } | null>;
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductInput = {
  title: string;
  status: string;
  handle: string;
  metafields: Array<{ key: string; value: string; namespace: string } | null>;
  publications: Array<{ publicationId: string }>;
  vendor: string;
  variants: Array<{
    price: string;
    sku: string;
    inventoryItem: {
      cost: string;
      tracked: boolean;
    };
    inventoryQuantities: {
      availableQuantity: number;
      locationId: string;
    };
  }>;
};

export type ShopifyProductCreationOperation = {
  data: { productCreate: { product: ShopifyProduct } };
  variables: {
    input: ShopifyProductInput;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyLocation = {
  id: string;
  name: string;
};

export type ShopifyStockLevel = {
  id: string;
  sku: string;
  inventoryLevels: Array<{
    available: number;
    location: ShopifyLocation;
  }>;
};

export type ShopifyStockLevelsOperation = {
  data: {
    inventoryItems: Connection<ShopifyStockLevel>;
  };
  variables: {
    query: string;
  };
};

export type ShopifyInventoryItemAdjustment = {
  inventoryItemId: string;
  availableDelta: number;
};

export type ShopifyStockLevelsAdjustment = {
  data: {
    inventoryLevels: Array<{
      available: number;
      location: ShopifyLocation;
    }>;
  };
  variables: {
    inventoryItemAdjustments: Array<ShopifyInventoryItemAdjustment>;
    locationId: string;
  };
};

export type ShopifySalesChannel = { id: string; name: string };

export type ShopifyChannelsQuery = {
  data: {
    publications: Connection<ShopifySalesChannel>;
  };
};
