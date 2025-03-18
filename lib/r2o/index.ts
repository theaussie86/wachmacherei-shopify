'use server';

import { updateShopifyCustomerMetafield } from 'lib/shopify';
import { ShopifyCustomer } from 'lib/shopify/types';
import { prepareCustomerData } from './util';

type R20Address = {
  salutation: string | null;
  title: string | null;
  company: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  street: string;
  zip: string;
};

type R2OCustomer = {
  customer_id: number;
  address: {
    delivery?: R20Address;
    invoice?: R20Address;
  };
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  customerCategory_id: number;
};

export async function getCustomerID(email: string) {
  const response = await fetch(process.env.R2O_BASE_URL + '/v1/customers', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  const customers = await response.json();

  const filteredCustomers = customers.filter(
    (customer: R2OCustomer) =>
      customer.address.invoice?.email === email || customer.address.delivery?.email === email
  );

  console.log('filtered customers', filteredCustomers);
  const isAlreadyCustomer = filteredCustomers.length > 0;
  let customerId;
  if (isAlreadyCustomer) {
    customerId = filteredCustomers[0].customer_id;
    console.log('customer', customerId);
  }

  return customerId;
}

export async function createOrUpdateCustomerInR2O(data: ShopifyCustomer, customerId?: number) {
  console.log('source data', data, customerId);
  const customerData = prepareCustomerData(data);
  console.log('customer data', customerData);
  const response = await fetch(
    `${process.env.R2O_BASE_URL}/v1/customers/${customerId ? `${customerId}/` : ''}`,
    {
      method: customerId ? 'POST' : 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    }
  );
  const customer = await response.json();
  console.log('customer after update', customer);
  if (!customerId) {
    await updateShopifyCustomerMetafield({
      input: {
        id: data.id,
        metafields: [
          {
            key: 'r2o_id',
            namespace: 'custom',
            value: customer.customer_id.toString()
          }
        ]
      }
    });
  }
  return customer;
}

export async function fetchStock(sku: string) {
  const response = await fetch(`${process.env.R2O_BASE_URL}/v1/products/itemNumber/${sku}/stock`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  const stock = await response.json();
  return stock;
}

export async function fetchProduct(productId: string) {
  const response = await fetch(
    `${process.env.R2O_BASE_URL}/v1/products/${productId}?includeVariations=true`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const product = await response.json();
  return product;
}

export async function findR2OProduct({ itemNumber, name }: { itemNumber?: string; name?: string }) {
  const query = new URLSearchParams();
  query.set('includeProductVariations', 'true');
  query.set('includeProductGroup', 'true');

  if (itemNumber) {
    query.set('itemNumber', itemNumber);
  }
  if (name) {
    query.set('name', name);
  }
  const response = await fetch(`${process.env.R2O_BASE_URL}/v1/products?${query.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  const products = await response.json();
  return products;
}
