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

export async function checkIsAlreadyACustomer(email: string) {
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
  return filteredCustomers.length > 0;
}

export async function createCustomerInR2O(data: ShopifyCustomer) {
  const customerData = createCustomer(data);
  const response = await fetch(process.env.R2O_BASE_URL + '/v1/customers', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.R2O_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  });
  const customer = await response.json();
  return customer;
}

function createCustomer(data: ShopifyCustomer) {
  return {
    address: {
      delivery: {
        company: data.default_address?.company,
        city: data.default_address?.city,
        country: data.default_address?.country_code,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        street: data.default_address?.address1 + ' ' + data.default_address?.address2,
        zip: data.default_address?.zip
      },
      invoice: {
        company: data.default_address?.company,
        city: data.default_address?.city,
        country: data.default_address?.country_code,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        street: data.default_address?.address1 + ' ' + data.default_address?.address2,
        zip: data.default_address?.zip
      }
    },
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    company: data.default_address?.company,
    customerCategory_id: 125301
  };
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
