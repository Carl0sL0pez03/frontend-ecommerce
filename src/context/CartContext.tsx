import { createContext, useContext, useEffect, useState } from "react";

import type { Product } from "./ProductsContext";

export interface CartItem {
  _id: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getQuantity: (productId: string) => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const item = prev.find((i) => i._id === product._id);
      if (item) {
        if (item.quantity < product.stock) {
          return prev.map((i) =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          alert("Stock máximo alcanzado");
          return prev;
        }
      }
      return [...prev, { _id: product._id, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i._id !== productId));
  };

  const getQuantity = (productId: string) => {
    return cart.find((i) => i._id === productId)?.quantity || 0;
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
