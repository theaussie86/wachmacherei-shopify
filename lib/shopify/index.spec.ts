import { createProduct, fetchAvailableSalesChannels } from '.';

describe('Fetch channels', () => {
  test('should fetch channels', async () => {
    // Act
    const channels = await fetchAvailableSalesChannels();

    // Assert
    expect(channels).toBeDefined();
    expect(channels.length).toBeGreaterThan(0);
  });
});

describe('Create Product', () => {
  test('should create a product', async () => {
    // Arrange
    const input = {
      title: 'Test Product',
      status: 'DRAFT',
      handle: 'test-product',
      metafields: [
        {
          key: 'r2o_id',
          namespace: 'custom',
          value: 'test_r2o_id'
        }
      ],
      publications: [
        {
          publicationId: 'gid://shopify/Publication/183742529880'
        },
        {
          publicationId: 'gid://shopify/Publication/183742628184'
        },
        {
          publicationId: 'gid://shopify/Publication/184559501656'
        }
      ],
      vendor: 'WACHMACHEREI',
      variants: [
        {
          price: '10.00',
          sku: 'test-sku',
          inventoryItem: {
            cost: '4.00',
            tracked: true
          },
          inventoryQuantities: {
            availableQuantity: 3,
            locationId: 'gid://shopify/Location/88945131864'
          }
        }
      ]
    };
    // Act
    const product = await createProduct(input);
    // Assert
    expect(product).toBeDefined();
  });
});
