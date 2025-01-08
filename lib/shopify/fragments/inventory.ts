export const inventoryLevelFragment = /* GraphQL */ `
  fragment inventoryLevel on InventoryLevel {
    id
    location {
      id
      name
    }
    quantities(names: ["available"]) {
      id
      name
      quantity
      updatedAt
    }
    deactivationAlert {
      title
      action
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
