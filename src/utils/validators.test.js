import {
  validateDescription,
  validatePrice,
  validateQuantity,
} from './validators';

describe('form validators', () => {
  test('requires a description', () => {
    expect(validateDescription('')).toBe('You must enter a description');
    expect(validateDescription('Mint')).toBeNull();
  });

  test('rejects quantity 0 while the item is in stock', () => {
    expect(validateQuantity('0', true)).toBe(
      'An in stock item should have a quantity'
    );
    expect(validateQuantity('0', false)).toBeNull();
    expect(validateQuantity('2', true)).toBeNull();
  });

  test('requires a price with two decimal places', () => {
    expect(validatePrice('')).toBe('You must enter a price');
    expect(validatePrice('0.00')).toBe('You must enter a price');
    expect(validatePrice('1.5')).toBe('Please enter a valid price');
    expect(validatePrice('1.50')).toBeNull();
  });
});
