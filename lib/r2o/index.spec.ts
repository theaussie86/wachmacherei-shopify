import { ShopifyCustomer } from 'lib/shopify/types';
import { prepareCustomerData, removeNullAndUndefined } from '.';

describe.skip('remove empty keys', () => {
  test('should remove empty keys', () => {
    // Arrange
    const obj = {
      a: 1,
      b: undefined,
      c: null,
      d: '',
      e: 'e'
    };

    // Act
    const result = removeNullAndUndefined(obj);

    // Assert
    expect(result).toEqual({ a: 1, e: 'e', d: '' });
  });
});

// test the prepareCustomerData function
describe('prepareCustomerData', () => {
  test('should prepare customer data', () => {
    // Arrange

    const data: Partial<ShopifyCustomer> = {
      defaultAddress: {
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        company: 'company',
        country: 'DE',
        countryCodeV2: 'DE',
        phone: 'phone',
        zip: 'zip'
      },
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone'
    };

    // Act
    const result = prepareCustomerData(data);

    // Assert
    expect(result).toEqual({
      address: {
        delivery: {
          company: 'company',
          city: 'city',
          country: 'DE',
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: 'phone',
          street: 'address1 address2',
          zip: 'zip'
        },
        invoice: {
          company: 'company',
          city: 'city',
          country: 'DE',
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: 'phone',
          street: 'address1 address2',
          zip: 'zip'
        }
      },
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      company: 'company',
      customerCategory_id: 125301
    });
  });

  test('should prepare customer data without undefined or null fields', () => {
    // Arrange
    const data: Partial<ShopifyCustomer> = {
      defaultAddress: {
        address1: 'address1',
        address2: undefined,
        city: 'city',
        company: undefined,
        country: 'DE',
        countryCodeV2: 'DE',
        phone: 'phone',
        zip: 'zip'
      },
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone'
    };

    // Act
    const result = prepareCustomerData(data);

    // Assert
    expect(result).toEqual({
      address: {
        delivery: {
          city: 'city',
          country: 'DE',
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: 'phone',
          street: 'address1 ',
          zip: 'zip'
        },
        invoice: {
          city: 'city',
          country: 'DE',
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: 'phone',
          street: 'address1 ',
          zip: 'zip'
        }
      },
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      customerCategory_id: 125301
    });
  });
});
