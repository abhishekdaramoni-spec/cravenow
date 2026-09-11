import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Dish, SizeOption, ToppingOption } from '@/types';
import { useAuth } from './AuthContext';
import { COUPONS } from '@/data/restaurants';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (
    dish: Dish,
    restaurantId?: string,
    restaurantName?: string,
    quantity?: number,
    specialInstructions?: string,
    customization?: { size?: SizeOption; toppings?: ToppingOption[]; unitPrice?: number }
  ) => void;
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
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  conflictRestaurant: {
    isConflict: boolean;
    pendingDish: Dish | null;
    pendingRestaurantId: string | null;
    pendingRestaurantName: string | null;
    pendingCustomization?: { size?: SizeOption; toppings?: ToppingOption[]; unitPrice?: number };
  };
  resolveConflict: (replace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `cravenow_cart_${userId}`;

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`${storageKey}_rest_id`) || null;
    } catch {
      return null;
    }
  });

  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`${storageKey}_rest_name`) || null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [conflictRestaurant, setConflictRestaurant] = useState<{
    isConflict: boolean;
    pendingDish: Dish | null;
    pendingRestaurantId: string | null;
    pendingRestaurantName: string | null;
    pendingCustomization?: { size?: SizeOption; toppings?: ToppingOption[]; unitPrice?: number };
  }>({
    isConflict: false,
    pendingDish: null,
    pendingRestaurantId: null,
    pendingRestaurantName: null,
  });

  // Switch cart when user changes (complete isolation)
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(storageKey);
      const savedRestId = localStorage.getItem(`${storageKey}_rest_id`);
      const savedRestName = localStorage.getItem(`${storageKey}_rest_name`);
      setItems(savedItems ? JSON.parse(savedItems) : []);
      setRestaurantId(savedRestId || null);
      setRestaurantName(savedRestName || null);
      setAppliedCoupon(null);
    } catch {
      setItems([]);
      setRestaurantId(null);
      setRestaurantName(null);
    }
  }, [userId]);

  // Persist cart whenever items or restaurant changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      if (restaurantId) localStorage.setItem(`${storageKey}_rest_id`, restaurantId);
      else localStorage.removeItem(`${storageKey}_rest_id`);

      if (restaurantName) localStorage.setItem(`${storageKey}_rest_name`, restaurantName);
      else localStorage.removeItem(`${storageKey}_rest_name`);
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, restaurantId, restaurantName, storageKey]);

  const addItem = (
    dish: Dish,
    rId?: string,
    rName?: string,
    quantity = 1,
    specialInstructions = '',
    customization?: { size?: SizeOption; toppings?: ToppingOption[]; unitPrice?: number }
  ) => {
    const finalRId = rId || dish.restaurant_id || 'rest-1';
    const finalRName = rName || dish.restaurantName || 'CraveNow Kitchen';

    // Different restaurant conflict check
    if (restaurantId && restaurantId !== finalRId && items.length > 0) {
      setConflictRestaurant({
        isConflict: true,
        pendingDish: dish,
        pendingRestaurantId: finalRId,
        pendingRestaurantName: finalRName,
        pendingCustomization: customization,
      });
      return;
    }

    if (!restaurantId) {
      setRestaurantId(finalRId);
      setRestaurantName(finalRName);
    }

    const unitPrice = customization?.unitPrice ?? dish.price;
    const sizeName = customization?.size?.name;
    const toppings = customization?.toppings || [];
    const displayName = sizeName ? `${dish.name} (${sizeName})` : dish.name;

    setItems((prevItems) => {
      // Find matching item with same dish AND same customizations
      const existingIdx = prevItems.findIndex(
        (item) =>
          item.dish_id === dish.id &&
          item.size?.id === customization?.size?.id &&
          JSON.stringify(item.selectedToppings?.map(t => t.id).sort()) ===
            JSON.stringify(toppings.map(t => t.id).sort())
      );

      if (existingIdx >= 0) {
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          special_instructions: specialInstructions || updated[existingIdx].special_instructions,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${dish.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        dish_id: dish.id,
        dishId: dish.id,
        restaurant_id: finalRId,
        restaurant_name: finalRName,
        restaurantName: finalRName,
        name: displayName,
        image: dish.image || '',
        price: unitPrice,
        unitPrice: unitPrice,
        quantity,
        is_veg: dish.is_veg ?? true,
        isVeg: dish.is_veg ?? true,
        special_instructions: specialInstructions,
        size: customization?.size,
        selectedToppings: toppings,
      };
      return [...prevItems, newItem];
    });
  };

  const resolveConflict = (replace: boolean) => {
    if (
      replace &&
      conflictRestaurant.pendingDish &&
      conflictRestaurant.pendingRestaurantId &&
      conflictRestaurant.pendingRestaurantName
    ) {
      setItems([]);
      setRestaurantId(conflictRestaurant.pendingRestaurantId);
      setRestaurantName(conflictRestaurant.pendingRestaurantName);
      addItem(
        conflictRestaurant.pendingDish,
        conflictRestaurant.pendingRestaurantId,
        conflictRestaurant.pendingRestaurantName,
        1,
        '',
        conflictRestaurant.pendingCustomization
      );
    }
    setConflictRestaurant({
      isConflict: false,
      pendingDish: null,
      pendingRestaurantId: null,
      pendingRestaurantName: null,
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => {
      const next = prevItems.filter((item) => item.id !== itemId);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
        setAppliedCoupon(null);
      }
      return next;
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
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_rest_id`);
      localStorage.removeItem(`${storageKey}_rest_name`);
    } catch {}
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price || item.unitPrice || 0) * item.quantity, 0);

  // Delivery fee is waived if subtotal > ₹500
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 500 ? 0 : 30;
  const platformFee = items.length === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST

  // Coupon calculation
  let couponDiscount = 0;
  if (appliedCoupon && subtotal > 0) {
    const coupon = COUPONS.find(c => c.code === appliedCoupon);
    if (coupon) {
      if (subtotal >= coupon.min_order) {
        if (coupon.discount_type === 'percentage') {
          couponDiscount = Math.min((subtotal * coupon.discount_value) / 100, coupon.max_discount);
        } else {
          couponDiscount = Math.min(coupon.discount_value, coupon.max_discount);
        }
      }
    }
  }

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: `Invalid promo code "${cleanCode}". Try CRAVE30 or FIRST50` };
    }
    if (!coupon.is_active) {
      return { success: false, message: 'This coupon has expired.' };
    }
    if (subtotal < coupon.min_order) {
      return {
        success: false,
        message: `Add ₹${coupon.min_order - subtotal} more to use code ${coupon.code} (Min order ₹${coupon.min_order})`,
      };
    }
    setAppliedCoupon(coupon.code);
    return { success: true, message: `Code ${coupon.code} applied! Saved discount.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const total = subtotal > 0 ? Math.max(0, subtotal + deliveryFee + platformFee + tax - couponDiscount) : 0;

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
        discount: couponDiscount,
        couponDiscount,
        total,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        conflictRestaurant,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
