export const getStockLevelsQuery = /* GraphQL */ `
  query getStockLevels($query: String!) {
    inventoryItems(query: $query, first: 10) {
      edges {
        node {
          id
          sku
          inventoryLevels(first: 5) {
            edges {
              node {
                available
                location {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getLocationsQuery = /* GraphQL */ `
  query getLocations {
    locations(first: 3) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
