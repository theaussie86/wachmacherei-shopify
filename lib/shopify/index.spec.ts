import { createProduct } from '.';

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
      ]
    };
    // Act
    const product = await createProduct(input);
    // Assert
    expect(product).toBeDefined();
  });
});
