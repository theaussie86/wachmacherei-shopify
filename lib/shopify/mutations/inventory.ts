export const adjustInventoryQuantityMutation = /* GraphQL */ `
  mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
    inventoryAdjustQuantities(input: $input) {
      inventoryAdjustmentGroup {
        changes {
          delta
          name
          location {
            id
            name
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
