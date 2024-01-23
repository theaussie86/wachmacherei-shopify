export const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    email
    firstName
    lastName
    phone
    metafield(key: "r2o_id", namespace: "custom") {
      id
      key
      value
    }
    defaultAddress {
      company
      firstName
      lastName
      address1
      address2
      zip
      city
      country
      countryCodeV2
    }
  }
`;
