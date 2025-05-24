import type { CartItem } from "../../context/CartContext";
import type { Product } from "../../context/ProductsContext";

export const calculateSubtotal = (cart: CartItem[], products: Product[]) =>
  cart.reduce((acc, item) => {
    const product = products.find((prod) => prod._id === item._id);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

export const detectCardType = (number: string) => {
  const clean = number.replace(/\s+/g, "");
  if (/^4[0-9]{0,}$/.test(clean)) return "visa";
  if (/^5[1-5]/.test(clean) || /^2(2[2-9]|[3-6]|7[01])/.test(clean))
    return "mastercard";
  return null;
};

export const isValidExpiry = (expiry: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  return regex.test(expiry);
};

export const isValidCardNumber = (card: string): boolean => {
  const cleanCard = card.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanCard.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCard[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
