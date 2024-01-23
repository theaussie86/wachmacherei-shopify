export const updateCustomerMetafieldMutation = /* GraphQL */ `
  mutation updateCustomerMetafield($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafields(first: 1) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`;
