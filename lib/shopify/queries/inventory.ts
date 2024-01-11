import { inventoryLevelConnectionFragment } from '../fragments/inventory';

export const getStockLevelsQuery = /* GraphQL */ `
  query getStockLevels($query: String!) {
    inventoryItems(query: $query, first: 10) {
      edges {
        node {
          id
          sku
          inventoryLevels(first: 5) {
            ...inventoryLevelConnection
          }
        }
      }
    }
  }
  ${inventoryLevelConnectionFragment}
`;
