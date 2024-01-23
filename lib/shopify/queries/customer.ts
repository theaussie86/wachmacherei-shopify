export const getCustomerByIdQuery = /* GraphQL */ `
  query getCustomerById($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
      metafield(key: "r2o_id", namespace: "custom") {
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
  }
`;
