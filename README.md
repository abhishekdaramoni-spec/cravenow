# CraveNow — Modern Full-Stack Food-Tech Platform 🍔

CraveNow is a realistic, production-ready food delivery and table booking web application built with a dark visual identity, warm orange accents, and complete multi-role functionality for Customers, Restaurant Kitchens, Delivery Riders, and Platform Admins.

---

## 🚀 Key Highlights & Capabilities

- **✨ Dark Visual Identity**: Handcrafted with `#141312` rich dark surfaces, `#f36334` warm orange accent, Plus Jakarta Sans typography, and fluid mobile-first responsive design.
- **🍛 Comprehensive Indian Food Catalog**: 12 curated restaurants across Delhi, Bangalore, Mumbai, Hyderabad, and Pune with 80+ handcrafted dishes priced realistically in Indian Rupees (₹29–₹599).
- **🛒 Dynamic Multi-Restaurant Cart**: Single-kitchen cart validation with conflict resolution, quantity steppers, special instructions, and coupon engine.
- **🛵 Live Order Tracking**: Real-time visual tracking with SVG route maps, step progression (Confirmed → Preparing → Ready → On the Way → Delivered), and rider coordination.
- **🍽️ Dine-in Table Reservations**: Complete table booking flow with date, time slot, guest count, and seating preference (Indoor, Balcony, Private Dining).
- **🤖 CraveNow AI Assistant**: Intelligent food recommendation chat that grounds suggestions in real restaurant and dish catalog data.
- **📊 3-Role Partner Dashboards**:
  - **Admin Operations Console (`/admin`)**: Metric tracking, live orders stream, restaurant toggling, and user management.
  - **Kitchen Portal (`/partner/restaurant`)**: Accept orders, advance cooking statuses, view catalog items, and track table reservations.
  - **Rider Console (`/partner/delivery`)**: Shift availability toggle (Online/Offline), active trip routing, direct calling, and delivery fulfillment.
- **⚡ Dual-Mode Engine (Supabase + Demo Fallback)**: Zero-config demo mode out of the box with realistic mock profiles; plug in Supabase credentials anytime for full cloud persistence.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (TypeScript, Strict Mode) |
| **Bundler & Dev Server** | Vite 6 |
| **Styling & Theme** | Tailwind CSS v4 (with `@theme` CSS variable tokens) |
| **Routing** | React Router v7 (`BrowserRouter`, lazy-loaded pages) |
| **Icons & Media** | Material Symbols Outlined + Unsplash CDN |
| **Backend & Auth** | Supabase (PostgreSQL 15, Auth, Row Level Security, Realtime) |
| **Payments** | Razorpay-ready integration architecture |

---

## 🗂️ Application Sitemap & Routes

### Customer Routes
- `/` — **Home Page**: Restaurant discovery, food category horizontal scroller, quick filter chips, and promo banner.
- `/search` — **Discovery & Search**: Real-time search across dishes and kitchens, trending tags, and category filters.
- `/restaurant/:slug` — **Restaurant Detail & Menu**: Restaurant hero, ratings, delivery time, veg/non-veg filter, in-menu search, and dish customizer.
- `/cart` — **Shopping Bag**: Itemised breakdown, quantity adjustment, coupon engine (`CRAVE30`, `FIRST50`), and bill breakdown.
- `/checkout` — **Checkout & Payment**: Address confirmation, contact details, payment method selection (UPI, Cards, Cash on Delivery).
- `/orders` — **Order History**: Active deliveries and past fulfilled orders.
- `/tracking/:orderId` — **Live Delivery Tracker**: Route map, status stepper, driver details, and receipts.
- `/booking/:restaurantSlug` — **Table Booking**: Reserve dine-in tables with guest count and seating preference.
- `/favorites` — **Saved Kitchens & Dishes**: Quick re-orders and bookmarks.
- `/ai` — **CraveNow AI**: Natural language food recommendations.
- `/profile` — **Account & Preferences**: Profile settings, saved addresses, and membership status.

### Partner & Admin Routes
- `/admin` — **Platform Operations Dashboard**
- `/partner/restaurant` — **Kitchen Order & Table Manager**
- `/partner/delivery` — **Rider Delivery Console**

### Authentication Routes
- `/login` — Account sign in
- `/signup` — Registration with role selection

---

## 🗄️ Database Schema (Supabase PostgreSQL)

A complete migration script with Row Level Security (RLS) is located at `supabase/migrations/001_schema.sql`:

- `profiles`: User accounts with role check (`customer`, `restaurant_owner`, `delivery_partner`, `admin`)
- `restaurants`: Kitchen details, operating hours, geolocation, delivery fees, and rating tallies
- `dishes`: Menu items categorized by restaurant with veg indicators, pricing, and badges
- `addresses`: User delivery locations
- `orders`: Order state machine with status timestamps and payment references
- `order_items`: Line items with quantities and snapshot pricing
- `bookings`: Table reservations with status tracking
- `reviews`: Customer feedback with ratings and photos
- `supabase_realtime`: Realtime publication enabled for `orders` and `bookings`

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (see `.env.example` for details):

```bash
# Supabase Configuration (Optional for demo mode, required for cloud persistence)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Demo Mode (Defaults to true when credentials are not configured)
VITE_DEMO_MODE="true"

# Razorpay Test Keys (Optional)
VITE_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Type check & build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🎨 Design System

- **Background Base**: `#141312`
- **Surface Elevation 1**: `#1c1b1a`
- **Surface Elevation 2**: `#211f1e`
- **Primary Brand Orange**: `#f36334` / `#E65A2C`
- **Success / Veg Green**: `#10B981`
- **Accent Amber / Rating**: `#ffba49`
- **Text Hierarchy**: White (`#ffffff`), Dimmed (`#e6e1df`), Muted (`#a88a81`)
- **Typography**: Plus Jakarta Sans (Headings), Inter (Body)
