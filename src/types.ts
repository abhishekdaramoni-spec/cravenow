export type ScreenType = 
  | 'feed' 
  | 'tracker' 
  | 'chat' 
  | 'receipt' 
  | 'search' 
  | 'favorites' 
  | 'profile';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  deliveryFee: string;
  image: string;
  category: string;
  badge?: string;
  isChefPick?: boolean;
}

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

export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  image: string;
  size: SizeOption;
  selectedToppings: ToppingOption[];
  instructions: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
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

export interface ChatMessage {
  id: string;
  sender: 'courier' | 'customer' | 'system';
  senderName?: string;
  text: string;
  time: string;
  avatar?: string;
  imageUrl?: string;
  imageCaption?: string;
}
