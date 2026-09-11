// ============================================
// CraveNow — Complete Type System
// ============================================

// --- User & Auth ---
export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_partner' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  name?: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
}

// --- Restaurant ---
export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  cover_image: string;
  image?: string;
  logo: string;
  rating: number;
  rating_count: number;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_fee: number;
  deliveryTime?: string;
  price_level: 1 | 2 | 3 | 4;
  is_open: boolean;
  is_veg: boolean;
  isVeg?: boolean;
  address: string;
  location?: string;
  lat: number;
  lng: number;
  opening_hours: string;
  popular_dishes: string[];
  offers: string[];
  created_at: string;
}

// --- Dish ---
export interface Dish {
  id: string;
  restaurant_id?: string;
  restaurantName?: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  originalPrice?: number;
  image: string;
  image_url?: string;
  category: string;
  is_veg?: boolean;
  isVeg?: boolean;
  is_available?: boolean;
  is_bestseller?: boolean;
  isChefPick?: boolean;
  rating: number;
  rating_count?: number;
  reviewsCount?: number;
  prep_time?: string;
  prepTime?: string;
  deliveryFee?: string;
  badge?: string;
  created_at?: string;
}

export interface DishCategory {
  id: string;
  name: string;
  icon: string;
}

// --- Options for Customizer ---
export interface SizeOption {
  id: string;
  name: string;
  label: string;
  extraPrice: number;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

// --- Cart ---
export interface CartItem {
  id: string;
  dish_id?: string;
  dishId?: string;
  restaurant_id?: string;
  restaurant_name?: string;
  name: string;
  image: string;
  price?: number;
  quantity: number;
  is_veg?: boolean;
  isVeg?: boolean;
  restaurantName?: string;
  special_instructions?: string;
  size?: SizeOption;
  selectedToppings?: ToppingOption[];
  instructions?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface CartState {
  items: CartItem[];
  restaurant_id: string | null;
  restaurant_name: string | null;
}

// --- Address ---
export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_address: string;
  lat: number;
  lng: number;
  is_default: boolean;
  created_at: string;
}

// --- Order ---
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'on_the_way'
  | 'nearby'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_image: string;
  delivery_partner_id: string | null;
  address_id: string;
  delivery_address: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  tax: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  payment_id: string | null;
  payment_method: string;
  estimated_delivery_time: string;
  special_instructions: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string;
  name: string;
  image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_veg: boolean;
}

// --- Booking ---
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_image: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  table_preference: string;
  status: BookingStatus;
  special_request: string;
  created_at: string;
}

// --- Review ---
export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  order_id: string;
  restaurant_id: string;
  rating: number;
  text: string;
  photo_url: string | null;
  created_at: string;
}

// --- Delivery Partner & Courier ---
export interface DeliveryPartner {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  phone: string;
  vehicle_type: string;
  plate: string;
  is_available: boolean;
  current_lat: number;
  current_lng: number;
  total_deliveries: number;
  rating: number;
  badge: string;
}

export interface Courier {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  plate: string;
  rating: number;
  totalDeliveries: number;
  phone: string;
  badge: string;
}

export interface OrderTrackingState {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  estimatedArrivalMin: number;
  estimatedArrivalMax: number;
  status: 'confirmed' | 'kitchen' | 'on_the_way' | 'delivered';
  confirmedTime: string;
  kitchenTime: string;
  onTheWayTime: string;
  deliveredTime: string;
  dropOffPhotoUrl: string;
  courier: Courier;
  items: {
    name: string;
    customization?: string;
    details?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  deliveryFeeText: string;
  tipAmount: number;
  tipPercentText: string;
  totalPaid: number;
  paymentMethod: string;
  authCode: string;
  isRated: boolean;
  userRating: number;
  userCompliments: string[];
  userTip: number;
}

// --- Notification ---
export type NotificationType = 'order' | 'booking' | 'promo' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  data?: Record<string, string>;
  created_at: string;
}

// --- Coupon ---
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order: number;
  max_discount: number;
  is_active: boolean;
  expires_at: string;
}

// --- Chat ---
export interface ChatMessage {
  id: string;
  sender: 'courier' | 'customer' | 'system';
  sender_name?: string;
  senderName?: string;
  text: string;
  time: string;
  avatar?: string;
  image_url?: string;
  imageUrl?: string;
  imageCaption?: string;
}

// --- Filter & Search ---
export interface RestaurantFilters {
  cuisine: string[];
  rating: number | null;
  delivery_time: number | null;
  price_level: number | null;
  is_veg: boolean;
  has_offers: boolean;
  is_open: boolean;
  sort_by: 'relevance' | 'rating' | 'delivery_time' | 'price_low' | 'price_high';
}

// --- UI Helpers ---
export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

export type ScreenType = 
  | 'feed' 
  | 'tracker' 
  | 'chat' 
  | 'receipt' 
  | 'search' 
  | 'favorites' 
  | 'profile';
