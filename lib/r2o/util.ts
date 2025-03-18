import { ShopifyCustomer } from 'lib/shopify/types';

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
