import React, { createContext, useContext, useState, useEffect } from 'react';

// Cart item shape
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  images?: string[];
  quantity: number;
  // add any other fields you need
}

interface CartContextType {
  cart: { items: CartItem[] } | null;
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  removeFromCart: (productId: string | number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Load cart from localStorage on initial render
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        // ensure items array exists
        if (parsed && Array.isArray(parsed.items)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage');
    }
    return { items: [] };
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = (product: any, quantity: number = 1) => {
    if (!cart) {
      // initialize if null
      setCart({ items: [] });
      // re-run after state update? use a callback? we'll handle via useEffect pattern
      // simpler: just call add again after set? Not ideal, but we'll do direct manipulation
      const newCart = { items: [{ ...product, quantity }] };
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return;
    }

    const existingIndex = cart.items.findIndex((item) => item.id === product.id);
    let newItems;
    if (existingIndex >= 0) {
      // update quantity
      newItems = [...cart.items];
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems = [...cart.items, { ...product, quantity }];
    }
    setCart({ items: newItems });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (!cart) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = cart.items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart({ items: newItems });
  };

  const removeFromCart = (productId: string | number) => {
    if (!cart) return;
    const newItems = cart.items.filter((item) => item.id !== productId);
    setCart({ items: newItems });
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal = cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  const value: CartContextType = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};