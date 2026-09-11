-- ==========================================================
-- CraveNow — Production Supabase PostgreSQL Schema & Security
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles (Role-based users linked to Supabase Auth)
CREATE TYPE user_role AS ENUM ('customer', 'restaurant_owner', 'delivery_partner', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Restaurants
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cuisine TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  cover_image TEXT,
  logo TEXT,
  rating NUMERIC(2,1) DEFAULT 4.5 NOT NULL,
  rating_count INTEGER DEFAULT 0 NOT NULL,
  delivery_time_min INTEGER DEFAULT 20 NOT NULL,
  delivery_time_max INTEGER DEFAULT 35 NOT NULL,
  delivery_fee NUMERIC(6,2) DEFAULT 30.00 NOT NULL,
  price_level SMALLINT DEFAULT 2 NOT NULL CHECK (price_level BETWEEN 1 AND 4),
  is_open BOOLEAN DEFAULT true NOT NULL,
  is_veg BOOLEAN DEFAULT false NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  opening_hours TEXT DEFAULT '11:00 AM - 11:00 PM',
  popular_dishes TEXT[] DEFAULT '{}'::TEXT[],
  offers TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants are viewable by everyone"
  ON public.restaurants FOR SELECT USING (true);

CREATE POLICY "Owners and admins can update their restaurant"
  ON public.restaurants FOR ALL 
  USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Dishes
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL,
  original_price NUMERIC(8,2),
  image TEXT,
  category TEXT NOT NULL,
  is_veg BOOLEAN DEFAULT false NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  is_bestseller BOOLEAN DEFAULT false NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.5,
  rating_count INTEGER DEFAULT 0,
  prep_time TEXT DEFAULT '20 min',
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dishes are viewable by everyone"
  ON public.dishes FOR SELECT USING (true);

CREATE POLICY "Restaurant owners manage their dishes"
  ON public.dishes FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r 
      WHERE r.id = dishes.restaurant_id AND (r.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- 5. User Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Home' NOT NULL,
  full_address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses"
  ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- 6. Orders
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'preparing', 'ready',
  'picked_up', 'on_the_way', 'nearby', 'delivered', 'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded'
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE RESTRICT NOT NULL,
  delivery_partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  delivery_address TEXT NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  subtotal NUMERIC(8,2) NOT NULL,
  delivery_fee NUMERIC(6,2) DEFAULT 0.00 NOT NULL,
  platform_fee NUMERIC(6,2) DEFAULT 15.00 NOT NULL,
  tax NUMERIC(6,2) DEFAULT 0.00 NOT NULL,
  discount NUMERIC(6,2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(8,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_id TEXT,
  payment_method TEXT DEFAULT 'UPI' NOT NULL,
  estimated_delivery_time TEXT DEFAULT '30-40 min',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own orders"
  ON public.orders FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    auth.uid() = delivery_partner_id OR
    EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can place orders"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorized parties can update order status"
  ON public.orders FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    auth.uid() = delivery_partner_id OR
    EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(8,2) NOT NULL,
  total_price NUMERIC(8,2) NOT NULL,
  is_veg BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items viewable by order participants"
  ON public.order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_items.order_id AND (
        o.user_id = auth.uid() OR
        o.delivery_partner_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- 8. Table Bookings
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  guests SMALLINT NOT NULL CHECK (guests BETWEEN 1 AND 20),
  table_preference TEXT DEFAULT 'Indoor' NOT NULL,
  status booking_status DEFAULT 'confirmed' NOT NULL,
  special_request TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and restaurants see relevant bookings"
  ON public.bookings FOR ALL 
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = bookings.restaurant_id AND r.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 9. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, order_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Enable Supabase Realtime for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
