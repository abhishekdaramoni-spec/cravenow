import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { MainLayout } from '@/layouts/MainLayout';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const RestaurantPage = lazy(() => import('@/pages/RestaurantPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const TrackingPage = lazy(() => import('@/pages/TrackingPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RestaurantDashboard = lazy(() => import('@/pages/restaurant/RestaurantDashboard'));
const DeliveryDashboard = lazy(() => import('@/pages/delivery/DeliveryDashboard'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#141312] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-[#f36334] border-t-transparent animate-spin" />
        <span className="text-sm text-[#a88a81] font-medium">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Auth routes (no layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Main app routes with layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/restaurant/:slug" element={<RestaurantPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/tracking/:orderId" element={<TrackingPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/booking/:restaurantSlug" element={<BookingPage />} />
                  <Route path="/ai" element={<AIAssistantPage />} />
                  
                  {/* Partner & Admin Dashboards */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/partner/restaurant" element={<RestaurantDashboard />} />
                  <Route path="/partner/delivery" element={<DeliveryDashboard />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
