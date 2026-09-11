import { Dish, Courier, OrderTrackingState, ChatMessage, SizeOption, ToppingOption } from '../types';

export const APP_IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2yt2f18hOATVCZC3JFmC9-EtEjEZ0qbjstZl8mqcAdcvLVhX-VRdKoEwTNA3vGGTihG5QAgVvx6TZ7-QoJgx31DXelfrYc_y3A9jBNy24ZgUhSh4H6N1EPBiNnWQaJYS2sfktEfDA7nuU4juJPkZ679A-d4yVrpudTihjASMP3rhGJGmY64L5kplH19dHQuQDwuA3OFh44eh3v9JxGTDs6diZGlHboai-ZtSk45Qg3zbOem1_yDx6Gw",
  userProfile: "https://lh3.googleusercontent.com/aida-public/AB6AXuCseV3v4Jet4fzADFMKslbOkbAmUgQsV07_TlI5U8FPW6m2LpsT-h95GpB7Wyin56Ee2PwH5nmF7_n5yGo29iQZrBjjdZt9bZtYOODGcMMdQGQEzGQXqSF7GxqGX8E3d4eWnEkPaFT60LMSHCl4_egPvxIMa7AbW3Jk5hWKYy3N4hlZw3Ac7gelTiwoWG8kbNE-YWJtyUjnTmDyuQe7pOJ2HiGfOyfT0fDZcIxBYQbR5DtCYZRUMzM6tQ",
  courierProfile: "https://lh3.googleusercontent.com/aida/AEtjO1VX_UFliadMrveF8GLM6Dwvn0DvBS6Mqc8z95LXZNsMgGUaCz216XhTQWrac2HOEiGBrfEr-FcrMXgiJilcp6IUTf1Vps9omLhNtg7tx9Xq7RPhEZFVQRDkNmXsucXdmsomDOSOtCbzoQnGNAytaoWb78CoRmdZkE69K9-jPAdlTg3-ZHEL2sCCuRcz1dlMUmBO5486X7zzITOej07Qn0h1MqzySAZj23lEHGbN-kSSRXAkvmMignoAcxam",
  burgerDish: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA5mD8bUGo6ErECpK9Q5HTENQLHe-Ppp54p-RVXnbPqqv9D8oicueDHOBkQzI6s_fw12lOUTKbygjGuiZ0WvhZSsNPNiW6UeffHc0SGQQ9iN2Aa96IUa3GXPksoIHMoUm0biq4x7AOT3nA9SLtfLvv2w2YtnUsTkp6ON6rBsCNxWnd1yJrXOiIFLrQPEvwF3TyuV5659LsSXbObjpT57-tYcjYgvW8rtrLXEquws8RFDbyj3yuAqBHRw",
  pizzaDish: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDXf0WFHSX3-7bfc9y9aZpL2ED_FHOrf3hWOcLPe0u8drYSwfyGYHwLnCgf4vCqoaJCE6uBQ11n23Y2cyFKkpYoUBustt0Zq3n5OMb74k55UyE2wk0W9bv68lMyISKEFm2Spd39TtbiUBpO91qXFFSyh9bvXbr0jMa1Qd2WHVvuQYVnTj3Sey0xWrE4WIzrIF9nZ9bfm8l4L5lzxRH53YUBmcOfGzX1aFdq0KE-gXXWd1n2udRaLFBdQ",
  ramenDish: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6zS1-iGVZIy2y76yBpnf4GCNbSqTCd6MBWcEsUn8VgIYq-K5BrQNx1XO7LERn5eWrUfKm_YodXFeCYY5RzY_gxUrFALBmcbAK3nO1lP2FKMtUPy1tD_JKXZOk7Js0T_kRDnaiTf821vC0fmNJIc-Dt2PWzRbb2fSt4_TBX8AnFmtvC_BgYpYOx1wfKWxVAG1fmqllc6h__pDIFwcN7Eds8LVl4IfCUPXUpTafLh7ULwfOoOJHhE2SPw",
  doorstepDelivery: "https://lh3.googleusercontent.com/aida-public/AB6AXuAumHMC-2Ebzfmhjr5bd8NbxIQKUc2_LHuPSK9MJlNqND8dN95owx57uOtPqOAyICA81rDALsm7TF8LgHMANfWjvfU3FVmqQfO0zS2X7FgDL1a9N2ZuoK8HL0sVgmkI_TZ-YBCEm_V2R6lHhIF6jJPts-Qey-931cas2Fg9alCTEfcbNzbt4zXqi5v8kELaSmSx4SR2zRtcPULZ2GLq0BCDyoF-7NK3AmN6FIyDyXwMB7ppdA1iVLzxEg",
};

export const DEFAULT_COURIER: Courier = {
  id: 'courier-sarah',
  name: 'Sarah Jenkins',
  avatar: APP_IMAGES.courierProfile,
  vehicle: 'Navy Honda Civic',
  plate: '#7XYZ89',
  rating: 4.95,
  totalDeliveries: 1420,
  phone: '+1 (800) 555-0199',
  badge: 'CraveNow Top Courier',
};

export const DISHES: Dish[] = [
  {
    id: 'dish-1',
    name: 'Artisan Truffle Smash Burger',
    description: 'Double Wagyu smash, melted Gruyère, black truffle aioli & brioche bun with pickled sweet shallots',
    price: 14.99,
    originalPrice: 18.00,
    rating: 4.9,
    reviewsCount: 240,
    prepTime: '15-25 min',
    deliveryFee: 'Free Delivery',
    image: APP_IMAGES.burgerDish,
    category: 'Burgers',
    badge: 'Chef Special',
    isChefPick: true,
  },
  {
    id: 'dish-2',
    name: 'Wood-Fired Margherita D.O.P',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil',
    price: 16.50,
    rating: 4.8,
    reviewsCount: 185,
    prepTime: '20-30 min',
    deliveryFee: '$1.99 Delivery',
    image: APP_IMAGES.pizzaDish,
    category: 'Artisan Pizza',
    badge: 'Authentic D.O.P',
    isChefPick: true,
  },
  {
    id: 'dish-3',
    name: 'Tonkotsu Chashu Ramen',
    description: '16-hour rich pork marrow broth, slow-braised pork belly chashu, ajitsuke tamago & wood ear mushroom',
    price: 15.75,
    rating: 4.9,
    reviewsCount: 310,
    prepTime: '25-35 min',
    deliveryFee: 'Free Delivery',
    image: APP_IMAGES.ramenDish,
    category: 'Ramen & Broth',
    badge: 'Top 1% Comfort',
    isChefPick: true,
  },
  {
    id: 'dish-4',
    name: 'Crispy Rosemary Fries (L)',
    description: 'Freshly cut Idaho russets double fried in peanut oil, tossed in fresh rosemary and sea salt, served with garlic aioli',
    price: 5.00,
    rating: 4.8,
    reviewsCount: 142,
    prepTime: '10-15 min',
    deliveryFee: 'Free Delivery',
    image: APP_IMAGES.burgerDish,
    category: 'Burgers',
  },
  {
    id: 'dish-5',
    name: 'Craft Artisanal Ginger Ale',
    description: 'Handcrafted with cold-pressed organic ginger root, chilled cane sugar edition with subtle lime twist',
    price: 3.00,
    rating: 4.7,
    reviewsCount: 98,
    prepTime: '5 min',
    deliveryFee: 'Free Delivery',
    image: APP_IMAGES.burgerDish,
    category: 'Drinks',
  },
];

export const SIZE_OPTIONS: SizeOption[] = [
  { id: 'single', name: 'Single', label: 'Standard', extraPrice: 0 },
  { id: 'double', name: 'Double', label: '+$3.50', extraPrice: 3.50 },
  { id: 'triple', name: 'Triple Beast', label: '+$6.00', extraPrice: 6.00 },
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'top-bacon', name: 'Applewood Smoked Bacon', price: 2.00 },
  { id: 'top-cheese', name: 'Aged Swiss Gruyère', price: 1.50 },
  { id: 'top-onions', name: 'Caramelized Truffle Onions', price: 1.25 },
  { id: 'top-egg', name: 'Crispy Sunny Fried Egg', price: 1.50 },
];

export const INITIAL_ORDER_STATE: OrderTrackingState = {
  orderId: 'CN-8492',
  restaurantName: 'Smash & Truffle Grill',
  restaurantAddress: '8th Ave Gourmet Row',
  deliveryAddress: '123 Main St, Apt 4B',
  estimatedArrivalMin: 12,
  estimatedArrivalMax: 18,
  status: 'on_the_way',
  confirmedTime: '7:14 PM',
  kitchenTime: '7:22 PM',
  onTheWayTime: 'Active',
  deliveredTime: '~7:42 PM',
  dropOffPhotoUrl: APP_IMAGES.doorstepDelivery,
  courier: DEFAULT_COURIER,
  items: [
    {
      name: '1× Double Truffle Smash Burger',
      customization: 'Custom',
      details: '+ Applewood Bacon, Aged Gruyère, Truffle Aioli',
      quantity: 1,
      price: 16.50,
    },
    {
      name: '1× Crispy Rosemary Fries (L)',
      details: 'With house smoked garlic dip',
      quantity: 1,
      price: 5.00,
    },
    {
      name: '1× Craft Artisanal Ginger Ale',
      details: 'Chilled cane sugar edition',
      quantity: 1,
      price: 3.00,
    },
  ],
  subtotal: 24.50,
  tax: 2.20,
  deliveryFeeText: 'FREE (CravePass)',
  tipAmount: 4.90,
  tipPercentText: '20%',
  totalPaid: 31.60,
  paymentMethod: 'Apple Pay (•••• 4128)',
  authCode: '9812-CRV-US',
  isRated: false,
  userRating: 5,
  userCompliments: ['Super Fast', 'Handled with Care', 'Great Communication'],
  userTip: 5.00,
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-sys-1',
    sender: 'system',
    text: 'Sarah picked up your order and is heading to 123 Main St, Apt 4B.',
    time: '7:25 PM',
  },
  {
    id: 'msg-sarah-1',
    sender: 'courier',
    senderName: 'Sarah Jenkins',
    avatar: APP_IMAGES.courierProfile,
    text: "Hi! I just picked up your fresh smash burger & fries. The restaurant was super quick! GPS says I'll be there in about 12 minutes. 🚗",
    time: '7:26 PM',
  },
  {
    id: 'msg-cust-1',
    sender: 'customer',
    text: 'Awesome, thank you so much! Please buzz unit 4B or leave at the front doorstep if the gate is unlocked.',
    time: '7:27 PM',
  },
  {
    id: 'msg-sarah-2',
    sender: 'courier',
    senderName: 'Sarah Jenkins',
    avatar: APP_IMAGES.courierProfile,
    text: "Got it! I'll buzz 4B as soon as I pull up to the gate. See you shortly! 🍔✨",
    time: '7:28 PM',
  },
];

export const CATEGORIES = [
  { id: 'burgers', name: 'Burgers', icon: '🍔', active: true },
  { id: 'pizza', name: 'Artisan Pizza', icon: '🍕' },
  { id: 'ramen', name: 'Ramen & Broth', icon: '🍜' },
  { id: 'bowls', name: 'Bowls', icon: '🥗' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Drinks', icon: '🧋' },
];

export const FILTER_CHIPS = [
  { id: 'top-rated', icon: '🔥', label: 'Top Rated', active: true },
  { id: 'fastest', icon: '⚡', label: 'Fastest (under 25m)' },
  { id: 'under-15', icon: '🏷️', label: 'Under $15' },
  { id: 'vegan', icon: '🌱', label: 'Vegan & Green' },
  { id: 'new', icon: '🌟', label: 'New on Crave' },
];
