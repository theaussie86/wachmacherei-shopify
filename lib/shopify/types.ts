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
  attributes: { key: string; value: string }[];
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
      attributes?: { key: string; value: string }[];
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

export type ShopifyGetCalEventTypeIdOfProductOperation = {
  data: { product: { title: ShopifyProduct['title']; metafield: { key: string; value: string } } };
  variables: {
    id: string;
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
    id: string;
    location: ShopifyLocation;
    quantities: Array<{
      id: string;
      name: string;
      quantity: number;
      updatedAt: string;
    }>;
  }>;
  variant: {
    id: string;
    metafield: ShopifyMetaField;
    contextualPricing: {
      price: Money;
    };
    product: {
      id: string;
      metafield: ShopifyMetaField;
    };
  };
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
export type ShopifyVariantsPriceAdjustment = {
  data: {
    productVariantsBulkUpdate: {
      product: {
        id: string;
      };
      productVariants: Array<{
        id: string;
        price: string;
      }>;
    };
  };
  variables: {
    productId: string;
    variants: Array<{
      id: string;
      price: string;
    }>;
  };
};

type InventoryLevel = {
  id: string;
  location: ShopifyLocation;
  quantities: {
    available: number;
    incoming: number;
  };
  deactivationAlert?: {
    title: string;
    action: string;
  };
};

export type ShopifyInventoryAdjustQuantitiesOperation = {
  data: {
    inventoryAdjustQuantities: {
      inventoryAdjustmentGroup: {
        changes: Array<{
          delta: number;
          name: string;
          location: ShopifyLocation;
        }>;
      };
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
  variables: {
    input: {
      name: string;
      reason?: string;
      changes: Array<{
        inventoryItemId: string;
        locationId: string;
        delta: number;
      }>;
    };
  };
};
