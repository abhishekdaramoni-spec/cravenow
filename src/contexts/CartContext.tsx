import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Dish } from '@/types';
import { formatPrice } from '@/lib/constants';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (dish: Dish, restaurantId?: string, restaurantName?: string, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  appliedCoupon: string | null;
  conflictRestaurant: {
    isConflict: boolean;
    pendingDish: Dish | null;
    pendingRestaurantId: string | null;
    pendingRestaurantName: string | null;
  };
  resolveConflict: (replace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cravenow_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    const saved = localStorage.getItem('cravenow_cart_restaurant_id');
    return saved || null;
  });
  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    const saved = localStorage.getItem('cravenow_cart_restaurant_name');
    return saved || null;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [conflictRestaurant, setConflictRestaurant] = useState<{
    isConflict: boolean;
    pendingDish: Dish | null;
    pendingRestaurantId: string | null;
    pendingRestaurantName: string | null;
  }>({
    isConflict: false,
    pendingDish: null,
    pendingRestaurantId: null,
    pendingRestaurantName: null
  });

  useEffect(() => {
    localStorage.setItem('cravenow_cart', JSON.stringify(items));
    if (restaurantId) localStorage.setItem('cravenow_cart_restaurant_id', restaurantId);
    else localStorage.removeItem('cravenow_cart_restaurant_id');
    
    if (restaurantName) localStorage.setItem('cravenow_cart_restaurant_name', restaurantName);
    else localStorage.removeItem('cravenow_cart_restaurant_name');
  }, [items, restaurantId, restaurantName]);

  const addItem = (dish: Dish, rId?: string, rName?: string, quantity = 1, specialInstructions = '') => {
    const finalRId = rId || dish.restaurant_id || 'rest-1';
    const finalRName = rName || dish.restaurantName || 'CraveNow Kitchen';

    if (restaurantId && restaurantId !== finalRId && items.length > 0) {
      setConflictRestaurant({
        isConflict: true,
        pendingDish: dish,
        pendingRestaurantId: finalRId,
        pendingRestaurantName: finalRName
      });
      return;
    }

    if (!restaurantId) {
      setRestaurantId(finalRId);
      setRestaurantName(finalRName);
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.dish_id === dish.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.dish_id === dish.id
            ? { ...item, quantity: item.quantity + quantity, special_instructions: specialInstructions || item.special_instructions }
            : item
        );
      }

      const newItem: CartItem = {
        id: Math.random().toString(36).substring(7),
        dish_id: dish.id,
        restaurant_id: finalRId,
        restaurant_name: finalRName,
        name: dish.name,
        image: dish.image || '',
        price: dish.price,
        quantity,
        is_veg: dish.is_veg ?? true,
        special_instructions: specialInstructions
      };
      return [...prevItems, newItem];
    });
  };

  const resolveConflict = (replace: boolean) => {
    if (replace && conflictRestaurant.pendingDish && conflictRestaurant.pendingRestaurantId && conflictRestaurant.pendingRestaurantName) {
      setItems([]);
      setRestaurantId(conflictRestaurant.pendingRestaurantId);
      setRestaurantName(conflictRestaurant.pendingRestaurantName);
      addItem(
        conflictRestaurant.pendingDish,
        conflictRestaurant.pendingRestaurantId,
        conflictRestaurant.pendingRestaurantName
      );
    }
    setConflictRestaurant({
      isConflict: false,
      pendingDish: null,
      pendingRestaurantId: null,
      pendingRestaurantName: null
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== itemId);
      if (updated.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    setAppliedCoupon(code);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price || item.unitPrice || 0) * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 30 : 0;
  const platformFee = items.length > 0 ? 15 : 0;
  const tax = subtotal * 0.05;
  const discount = appliedCoupon ? Math.min(subtotal * 0.1, 100) : 0; // Simple 10% discount max 100
  const total = subtotal > 0 ? subtotal + deliveryFee + platformFee + tax - discount : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        platformFee,
        tax,
        discount,
        total,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        conflictRestaurant,
        resolveConflict
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
