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
          variant {
            id
            contextualPricing(context: { country: DE }) {
              price {
                amount
                currencyCode
              }
            }
            metafield(key: "r2o_id", namespace: "custom") {
              value
            }
            product {
              id
              metafield(key: "r2o_prod_id", namespace: "wachmacherei") {
                value
              }
            }
          }
        }
      }
    }
  }
  ${inventoryLevelConnectionFragment}
`;
