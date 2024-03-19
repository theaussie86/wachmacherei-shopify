export const createProductMutation = /* GraphQL */ `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
        status
        metafields(first: 100) {
          edges {
            node {
              id
              key
              namespace
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
