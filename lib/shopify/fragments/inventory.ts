export const inventoryLevelFragment = /* GraphQL */ `
  fragment inventoryLevel on InventoryLevel {
    available
    location {
      id
      name
    }
  }
`;

export const inventoryLevelConnectionFragment = /* GraphQL */ `
  fragment inventoryLevelConnection on InventoryLevelConnection {
    edges {
      node {
        ...inventoryLevel
      }
    }
  }
  ${inventoryLevelFragment}
`;
