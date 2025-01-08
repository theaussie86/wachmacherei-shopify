export const inventoryLevelFragment = /* GraphQL */ `
  fragment inventoryLevel on InventoryLevel {
    id
    location {
      id
      name
    }
    quantities {
      available
      incoming
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
