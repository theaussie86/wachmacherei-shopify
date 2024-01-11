import { inventoryLevelFragment } from '../fragments/inventory';

export const adjustStockLevelsMutation = /* GraphQL */ `
  mutation adjustStockLevels(
    $inventoryItemAdjustments: [InventoryAdjustItemInput!]!
    $locationId: ID!
  ) {
    inventoryBulkAdjustQuantityAtLocation(
      inventoryItemAdjustments: $inventoryItemAdjustments
      locationId: $locationId
    ) {
      inventoryLevels {
        ...inventoryLevel
      }
    }
  }
  ${inventoryLevelFragment}
`;
