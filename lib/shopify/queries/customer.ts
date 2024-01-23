import { customerFragment } from '../fragments/customer';

export const getCustomerByIdQuery = /* GraphQL */ `
  query getCustomerById($id: ID!) {
    customer(id: $id) {
      ...customer
    }
  }
  ${customerFragment}
`;

export const getCustomerByEmailQuery = /* GraphQL */ `
  query getCustomerByEmail($query: String!) {
    customers(first: 3, query: $query) {
      edges {
        node {
          ...customer
        }
      }
    }
  }
  ${customerFragment}
`;
