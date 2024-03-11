import { updateShopifyCustomerMetafield } from 'lib/shopify';
import { ShopifyCustomer } from 'lib/shopify/types';

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

export function removeNullAndUndefined(obj: any): any {
  Object.keys(obj).forEach((key) =>
    obj[key] && typeof obj[key] === 'object'
      ? removeNullAndUndefined(obj[key])
      : obj[key] == null && delete obj[key]
  );
  return obj;
}

export function prepareCustomerData(data: Partial<ShopifyCustomer>) {
  return removeNullAndUndefined({
    address: {
      delivery: {
        company: data.defaultAddress?.company,
        city: data.defaultAddress?.city,
        country: data.defaultAddress?.countryCodeV2,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: `${data.defaultAddress?.address1 ?? ''} ${data.defaultAddress?.address2 ?? ''}`,
        zip: data.defaultAddress?.zip
      },
      invoice: {
        company: data.defaultAddress?.company,
        city: data.defaultAddress?.city,
        country: data.defaultAddress?.countryCodeV2,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: `${data.defaultAddress?.address1} ${data.defaultAddress?.address2 ?? ''}`,
        zip: data.defaultAddress?.zip
      }
    },
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    company: data.defaultAddress?.company,
    customerCategory_id: 125301
  });
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
