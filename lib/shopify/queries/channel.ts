export const getChannelsQuery = /* GraphQL */ `
  query getChannels {
    publications(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
