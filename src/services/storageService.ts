// ============================================
// CraveNow — Storage & Multi-User Isolation Service
// ============================================
import type { UserProfile, Order, Address, Restaurant, Dish, DeliveryLocation } from '@/types';

// Default Demo Users for all roles
export const DEFAULT_USERS: (UserProfile & { password?: string })[] = [
  {
    id: 'usr-priya',
    full_name: 'Priya Sharma',
    name: 'Priya Sharma',
    email: 'priya@cravenow.com',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    role: 'customer',
    created_at: '2024-01-01T00:00:00Z',
    password: 'password123',
  },
  {
    id: 'usr-aarav',
    full_name: 'Aarav Patel',
    name: 'Aarav Patel',
    email: 'aarav@cravenow.com',
    phone: '+91 98123 45678',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    role: 'customer',
    created_at: '2024-02-15T00:00:00Z',
    password: 'password123',
  },
  {
    id: 'usr-harpal',
    full_name: 'Chef Harpal Singh',
    name: 'Chef Harpal Singh',
    email: 'punjab@cravenow.com',
    phone: '+91 98234 56789',
    avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&h=120&fit=crop',
    role: 'restaurant_owner',
    created_at: '2024-01-10T00:00:00Z',
    password: 'password123',
  },
  {
    id: 'usr-rahul',
    full_name: 'Rahul Kumar',
    name: 'Rahul Kumar',
    email: 'rider@cravenow.com',
    phone: '+91 98345 67890',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    role: 'delivery_partner',
    created_at: '2024-03-01T00:00:00Z',
    password: 'password123',
  },
  {
    id: 'usr-admin',
    full_name: 'Operations Admin',
    name: 'Operations Admin',
    email: 'admin@cravenow.com',
    phone: '+91 98456 78901',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    password: 'adminpassword',
  },
];

// Seed Addresses
export const DEFAULT_ADDRESSES: Record<string, Address[]> = {
  'usr-priya': [
    {
      id: 'addr-p1',
      user_id: 'usr-priya',
      label: 'Home',
      full_address: 'Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034',
      lat: 12.9352,
      lng: 77.6245,
      is_default: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'addr-p2',
      user_id: 'usr-priya',
      label: 'Work',
      full_address: 'WeWork Galaxy, 43 Residency Rd, Shanthala Nagar, Bangalore - 560025',
      lat: 12.9716,
      lng: 77.5946,
      is_default: false,
      created_at: '2024-01-05T00:00:00Z',
    },
  ],
  'usr-aarav': [
    {
      id: 'addr-a1',
      user_id: 'usr-aarav',
      label: 'Home',
      full_address: '14B Sea Breeze Apartments, Bandra West, Mumbai - 400050',
      lat: 19.0596,
      lng: 72.8295,
      is_default: true,
      created_at: '2024-02-15T00:00:00Z',
    },
  ],
};

// Seed Orders
export const DEFAULT_ORDERS: Record<string, Order[]> = {
  'usr-priya': [
    {
      id: 'CN-89412',
      user_id: 'usr-priya',
      restaurant_id: 'rest-1',
      restaurant_name: 'Punjab Grill',
      restaurant_image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
      delivery_partner_id: 'usr-rahul',
      address_id: 'addr-p1',
      delivery_address: 'Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034',
      status: 'on_the_way',
      subtotal: 548,
      delivery_fee: 30,
      platform_fee: 15,
      tax: 27.4,
      discount: 50,
      total: 570.4,
      payment_status: 'successful',
      payment_id: 'pay_live_89412',
      payment_method: 'UPI (priya@okaxis)',
      estimated_delivery_time: '25-30 min',
      special_instructions: 'Please ring bell and leave with security if unavailable',
      items: [
        {
          id: 'item-1',
          order_id: 'CN-89412',
          dish_id: 'd-1',
          name: 'Butter Chicken (Double)',
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 299,
          total_price: 299,
          is_veg: false,
        },
        {
          id: 'item-2',
          order_id: 'CN-89412',
          dish_id: 'd-2',
          name: 'Dal Makhani',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 249,
          total_price: 249,
          is_veg: true,
        },
      ],
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'CN-87103',
      user_id: 'usr-priya',
      restaurant_id: 'rest-2',
      restaurant_name: 'Dosa Republic',
      restaurant_image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
      delivery_partner_id: 'usr-rahul',
      address_id: 'addr-p1',
      delivery_address: 'Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034',
      status: 'delivered',
      subtotal: 297,
      delivery_fee: 20,
      platform_fee: 15,
      tax: 14.85,
      discount: 0,
      total: 346.85,
      payment_status: 'successful',
      payment_id: 'pay_live_87103',
      payment_method: 'Card (•••• 4128)',
      estimated_delivery_time: 'Delivered',
      special_instructions: 'Extra spicy coconut chutney please',
      items: [
        {
          id: 'item-3',
          order_id: 'CN-87103',
          dish_id: 'd-9',
          name: 'Masala Dosa',
          image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 149,
          total_price: 149,
          is_veg: true,
        },
        {
          id: 'item-4',
          order_id: 'CN-87103',
          dish_id: 'd-10',
          name: 'Idli Sambar',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 99,
          total_price: 99,
          is_veg: true,
        },
      ],
      created_at: '2024-09-08T19:30:00Z',
      updated_at: '2024-09-08T20:05:00Z',
    },
  ],
  'usr-aarav': [
    {
      id: 'CN-86221',
      user_id: 'usr-aarav',
      restaurant_id: 'rest-4',
      restaurant_name: 'La Piazza',
      restaurant_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
      delivery_partner_id: 'usr-rahul',
      address_id: 'addr-a1',
      delivery_address: '14B Sea Breeze Apartments, Bandra West, Mumbai - 400050',
      status: 'delivered',
      subtotal: 648,
      delivery_fee: 40,
      platform_fee: 15,
      tax: 32.4,
      discount: 0,
      total: 735.4,
      payment_status: 'successful',
      payment_id: 'pay_live_86221',
      payment_method: 'UPI',
      estimated_delivery_time: 'Delivered',
      special_instructions: '',
      items: [
        {
          id: 'item-5',
          order_id: 'CN-86221',
          dish_id: 'd-23',
          name: 'Margherita Pizza',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 349,
          total_price: 349,
          is_veg: true,
        },
        {
          id: 'item-6',
          order_id: 'CN-86221',
          dish_id: 'd-24',
          name: 'Penne Arrabbiata',
          image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
          quantity: 1,
          unit_price: 299,
          total_price: 299,
          is_veg: true,
        },
      ],
      created_at: '2024-09-05T13:15:00Z',
      updated_at: '2024-09-05T13:48:00Z',
    },
  ],
};

// Seed Favorites
export const DEFAULT_FAVORITES: Record<string, { restaurantIds: string[]; dishIds: string[] }> = {
  'usr-priya': {
    restaurantIds: ['rest-1', 'rest-2', 'rest-6'],
    dishIds: ['d-1', 'd-4', 'd-9', 'd-36'],
  },
  'usr-aarav': {
    restaurantIds: ['rest-4', 'rest-5'],
    dishIds: ['d-23', 'd-30'],
  },
};

// ============================================
// Storage Access Helpers
// ============================================

export const StorageService = {
  // --- USERS ---
  getUsers(): (UserProfile & { password?: string })[] {
    const raw = localStorage.getItem('cravenow_users');
    if (!raw) {
      localStorage.setItem('cravenow_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUser(newUser: UserProfile & { password?: string }) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push(newUser);
    }
    localStorage.setItem('cravenow_users', JSON.stringify(users));
  },

  getActiveUser(): UserProfile | null {
    const raw = localStorage.getItem('cravenow_active_user');
    if (!raw) {
      // Default to Priya Sharma on first visit
      const defaultUser = DEFAULT_USERS[0];
      localStorage.setItem('cravenow_active_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setActiveUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem('cravenow_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cravenow_active_user');
    }
  },

  // --- ORDERS (ISOLATED PER USER) ---
  getUserOrders(userId: string): Order[] {
    const key = `cravenow_orders_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const defaults = DEFAULT_ORDERS[userId] || [];
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getAllOrders(): Order[] {
    const users = this.getUsers();
    const all: Order[] = [];
    users.forEach(u => {
      const userOrders = this.getUserOrders(u.id);
      all.push(...userOrders);
    });
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getOrderById(orderId: string): Order | null {
    // Search across all users or active user
    const users = this.getUsers();
    for (const u of users) {
      const orders = this.getUserOrders(u.id);
      const found = orders.find(o => o.id === orderId);
      if (found) return found;
    }
    // Also check guest orders
    const guestOrders = this.getUserOrders('guest');
    const guestFound = guestOrders.find(o => o.id === orderId);
    if (guestFound) return guestFound;

    // Check defaults
    for (const list of Object.values(DEFAULT_ORDERS)) {
      const found = list.find(o => o.id === orderId);
      if (found) return found;
    }
    return null;
  },

  saveOrder(order: Order): Order {
    const userId = order.user_id || 'guest';
    const key = `cravenow_orders_${userId}`;
    const orders = this.getUserOrders(userId);
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(key, JSON.stringify(orders));
    return order;
  },

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date().toISOString();
    return this.saveOrder(order);
  },

  // --- ADDRESSES (ISOLATED PER USER) ---
  getUserAddresses(userId: string): Address[] {
    const key = `cravenow_addresses_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const defaults = DEFAULT_ADDRESSES[userId] || [
        {
          id: `addr-${Date.now()}`,
          user_id: userId,
          label: 'Home',
          full_address: 'Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034',
          lat: 12.9352,
          lng: 77.6245,
          is_default: true,
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveAddress(userId: string, address: Address): Address[] {
    const key = `cravenow_addresses_${userId}`;
    const list = this.getUserAddresses(userId);
    if (address.is_default) {
      list.forEach(a => { a.is_default = false; });
    }
    const idx = list.findIndex(a => a.id === address.id);
    if (idx >= 0) {
      list[idx] = address;
    } else {
      list.push(address);
    }
    localStorage.setItem(key, JSON.stringify(list));
    return list;
  },

  deleteAddress(userId: string, addressId: string): Address[] {
    const key = `cravenow_addresses_${userId}`;
    let list = this.getUserAddresses(userId);
    list = list.filter(a => a.id !== addressId);
    if (list.length > 0 && !list.some(a => a.is_default)) {
      list[0].is_default = true;
    }
    localStorage.setItem(key, JSON.stringify(list));
    return list;
  },

  // --- FAVORITES (ISOLATED PER USER) ---
  getUserFavorites(userId: string): { restaurantIds: string[]; dishIds: string[] } {
    const key = `cravenow_favs_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const defaults = DEFAULT_FAVORITES[userId] || { restaurantIds: [], dishIds: [] };
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { restaurantIds: [], dishIds: [] };
    }
  },

  toggleFavoriteRestaurant(userId: string, restaurantId: string): boolean {
    const key = `cravenow_favs_${userId}`;
    const favs = this.getUserFavorites(userId);
    const exists = favs.restaurantIds.includes(restaurantId);
    if (exists) {
      favs.restaurantIds = favs.restaurantIds.filter(id => id !== restaurantId);
    } else {
      favs.restaurantIds.push(restaurantId);
    }
    localStorage.setItem(key, JSON.stringify(favs));
    return !exists;
  },

  toggleFavoriteDish(userId: string, dishId: string): boolean {
    const key = `cravenow_favs_${userId}`;
    const favs = this.getUserFavorites(userId);
    const exists = favs.dishIds.includes(dishId);
    if (exists) {
      favs.dishIds = favs.dishIds.filter(id => id !== dishId);
    } else {
      favs.dishIds.push(dishId);
    }
    localStorage.setItem(key, JSON.stringify(favs));
    return !exists;
  },

  isRestaurantFavorite(userId: string, restaurantId: string): boolean {
    const favs = this.getUserFavorites(userId);
    return favs.restaurantIds.includes(restaurantId);
  },

  isDishFavorite(userId: string, dishId: string): boolean {
    const favs = this.getUserFavorites(userId);
    return favs.dishIds.includes(dishId);
  },

  // --- ACTIVE DELIVERY LOCATION ---
  getActiveLocation(userId?: string): DeliveryLocation {
    const uid = userId || this.getActiveUser()?.id || 'guest';
    const key = `cravenow_active_loc_${uid}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore parse error
      }
    }

    // Fall back to default saved address if present
    const addresses = this.getUserAddresses(uid);
    const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
    if (defaultAddr) {
      return {
        id: defaultAddr.id,
        address: defaultAddr.full_address,
        locality: defaultAddr.label || 'Koramangala',
        city: 'Bangalore',
        lat: defaultAddr.lat,
        lng: defaultAddr.lng,
        source: 'saved',
        label: defaultAddr.label,
      };
    }

    return {
      id: 'loc-default',
      address: 'Prestige Lakeside, Koramangala, Bangalore - 560034',
      locality: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      postal_code: '560034',
      lat: 12.9352,
      lng: 77.6245,
      source: 'default',
      label: 'Home',
    };
  },

  setActiveLocation(location: DeliveryLocation, userId?: string): void {
    const uid = userId || this.getActiveUser()?.id || 'guest';
    const key = `cravenow_active_loc_${uid}`;
    localStorage.setItem(key, JSON.stringify(location));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cravenow_location_changed', { detail: location }));
    }
  },
};
