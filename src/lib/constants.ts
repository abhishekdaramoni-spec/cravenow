// ============================================
// CraveNow — Design Constants & Utilities
// ============================================

// --- Currency Formatting (INR) ---
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPriceCompact(amount: number): string {
  return `₹${amount}`;
}

// --- Demo Mode Detection ---
export function isDemoMode(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const demoFlag = import.meta.env.VITE_DEMO_MODE;
  return demoFlag === 'true' || !url || url === 'https://your-project.supabase.co';
}

// --- Brand Colors ---
export const COLORS = {
  bg: '#141312',
  bgDim: '#0f0e0d',
  surface: '#1c1b1a',
  surfaceHigh: '#2b2a28',
  surfaceHighest: '#363433',
  text: '#e6e1df',
  textMuted: '#a88a81',
  textSubtle: '#e1bfb5',
  border: 'rgba(255,255,255,0.05)',
  primary: '#f36334',
  primaryHover: '#d44c20',
  primaryLight: '#ffb59f',
  brand: '#E65A2C',
  brandHover: '#D44C20',
  accent: '#ffba49',
  emerald: '#10B981',
  star: '#ffba49',
} as const;

// --- Order Status Labels ---
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  picked_up: 'Picked Up',
  on_the_way: 'On the Way',
  nearby: 'Almost There',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_SEQUENCE = [
  'pending', 'confirmed', 'preparing', 'ready',
  'picked_up', 'on_the_way', 'nearby', 'delivered',
] as const;

// --- Booking Status Labels ---
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

// --- Cuisine Options ---
export const CUISINES = [
  'North Indian', 'South Indian', 'Chinese', 'Italian',
  'Mughlai', 'Street Food', 'Biryani', 'Pizza',
  'Burgers', 'Desserts', 'Healthy', 'Beverages',
  'Rolls & Wraps', 'Continental',
] as const;

// --- Price Levels ---
export const PRICE_LEVELS: Record<number, string> = {
  1: '₹',
  2: '₹₹',
  3: '₹₹₹',
  4: '₹₹₹₹',
};

// --- Placeholder Images ---
export const PLACEHOLDER_IMAGES = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
} as const;

// --- Generate ID ---
export function generateId(prefix: string = ''): string {
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now().toString(36);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}

// --- Time formatting ---
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// --- Veg/Non-veg Indicator ---
export function getVegIndicator(isVeg: boolean): { color: string; label: string; icon: string } {
  return isVeg
    ? { color: '#10B981', label: 'Veg', icon: '🟢' }
    : { color: '#EF4444', label: 'Non-Veg', icon: '🔴' };
}
