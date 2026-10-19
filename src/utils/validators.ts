export const validateDescription = (description: string): string | null =>
  description ? null : "You must enter a description";

export const validateQuantity = (
  quantity: string,
  inStock: boolean | null,
): string | null =>
  inStock && quantity === "0"
    ? "An in stock item should have a quantity"
    : null;

export const validatePrice = (price: string): string | null => {
  const regex = /^[0-9]+(\.[0-9][0-9])$/;

  if (!price || price === "0.00") {
    return "You must enter a price";
  } else if (!regex.test(price.trim())) {
    return "Please enter a valid price";
  }
  return null;
};
