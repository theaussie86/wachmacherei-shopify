import { inventoryLevelFragment } from '../fragments/inventory';

export const adjustInventoryQuantityMutation = /* GraphQL */ `
  mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
    inventoryAdjustQuantities(input: $input) {
      inventoryLevels {
        ...inventoryLevel
      }
      userErrors {
        field
        message
      }
    }
  }
  ${inventoryLevelFragment}
`;
