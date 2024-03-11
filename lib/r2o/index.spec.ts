import { removeNullAndUndefined } from '.';

describe('remove empty keys', () => {
  test('should remove empty keys', () => {
    // Arrange
    const obj = {
      a: 1,
      b: undefined,
      c: null,
      d: '',
      e: 'e'
    };

    // Act
    const result = removeNullAndUndefined(obj);

    // Assert
    expect(result).toEqual({ a: 1, e: 'e' });
  });
});
