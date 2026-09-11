/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, Dish, CartItem, OrderTrackingState, ChatMessage } from './types';
import {
  INITIAL_ORDER_STATE,
  INITIAL_CHAT_MESSAGES,
  DISHES,
  APP_IMAGES,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreFeed } from './components/ExploreFeed';
import { LiveTrackerScreen } from './components/LiveTrackerScreen';
import { CourierChatScreen } from './components/CourierChatScreen';
import { OrderReceiptScreen } from './components/OrderReceiptScreen';
import { SearchScreen } from './components/SearchScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrderCustomizerModal } from './components/OrderCustomizerModal';
import { TipRatingModal } from './components/TipRatingModal';
import { EmailPdfModal } from './components/EmailPdfModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('feed');
  const [order, setOrder] = useState<OrderTrackingState>(INITIAL_ORDER_STATE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals state
  const [customizerDish, setCustomizerDish] = useState<Dish | null>(null);
  const [isTipRatingModalOpen, setIsTipRatingModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Add to cart handler
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    showToast(`Added ${item.name} to Feast bag! 🍔`);
  };

  // Courier chat send message handler
  const handleSendMessage = (text: string) => {
    const newCustomerMsg: ChatMessage = {
      id: 'msg-cust-' + Date.now(),
      sender: 'customer',
      text,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newCustomerMsg]);

    // Simulated automated courier response if helpful
    setTimeout(() => {
      let courierReplyText = "Got it! Thanks for letting me know! 👍";
      if (text.toLowerCase().includes('door') || text.toLowerCase().includes('buzzer')) {
        courierReplyText = "Understood! I'll buzz unit 4B and leave it on the doorstep mat safely.";
      } else if (text.toLowerCase().includes('tip')) {
        courierReplyText = "Thank you so much! I really appreciate your generosity! ❤️";
      } else if (text.toLowerCase().includes('outside')) {
        courierReplyText = "Awesome, see you at the curb in just a couple minutes!";
      }

      const courierReply: ChatMessage = {
        id: 'msg-sarah-' + Date.now(),
        sender: 'courier',
        senderName: order.courier.name,
        avatar: order.courier.avatar,
        text: courierReplyText,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, courierReply]);
    }, 900);
  };

  // Simulate Order Delivered
  const handleSimulateDelivery = () => {
    // 1. Update order status
    setOrder((prev) => ({
      ...prev,
      status: 'delivered',
      deliveredTime: '7:34 PM',
    }));

    // 2. Append doorstep delivery photo message to chat
    const deliveryPhotoMsg: ChatMessage = {
      id: 'msg-sarah-delivered-' + Date.now(),
      sender: 'courier',
      senderName: order.courier.name,
      avatar: order.courier.avatar,
      text: "Delivered! Left safely by your door at Apt 4B as requested. Enjoy your artisan meal! 🍔✨",
      imageUrl: APP_IMAGES.doorstepDelivery,
      time: '7:34 PM',
    };
    setChatMessages((prev) => [...prev, deliveryPhotoMsg]);

    showToast('Sarah arrived! Order delivered to Apt 4B 🚪');

    // 3. Prompt the Tip & Rating modal after a brief moment
    setTimeout(() => {
      setIsTipRatingModalOpen(true);
    }, 600);
  };

  // Rating and Tip submitted
  const handleRatingSubmit = (
    rating: number,
    tip: number,
    compliments: string[],
    note: string
  ) => {
    setIsTipRatingModalOpen(false);

    setOrder((prev) => ({
      ...prev,
      isRated: true,
      userRating: rating,
      userTip: tip,
      userCompliments: compliments,
      tipAmount: tip,
      tipPercentText: tip === 5.0 ? '20%' : tip > 0 ? 'Custom' : '0%',
      totalPaid: prev.subtotal + prev.tax + tip,
    }));

    showToast(`Rating of ${rating}⭐ & $${tip.toFixed(2)} tip sent to Sarah! 🎉`);
    setCurrentScreen('receipt');
  };

  // Update tip on live tracker
  const handleUpdateTip = (tipAmount: number, tipLabel: string) => {
    setOrder((prev) => ({
      ...prev,
      tipAmount,
      tipPercentText: tipLabel,
      totalPaid: prev.subtotal + prev.tax + tipAmount,
    }));
  };

  // Reorder meal
  const handleReorder = () => {
    showToast('Reorder confirmed! Kitchen has received your request 🍳');
    setOrder((prev) => ({
      ...prev,
      orderId: 'CN-' + Math.floor(1000 + Math.random() * 9000),
      status: 'on_the_way',
    }));
    setCurrentScreen('tracker');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col font-sans selection:bg-[#f36334] selection:text-white">
      {/* Top Demo Screen Quick-Switcher Bar */}
      <nav aria-label="Demo screen switcher" className="bg-[#0c0b0a] border-b border-[#2b2a28]/80 px-2 py-1.5 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1 text-[11px] overflow-x-auto custom-scrollbar whitespace-nowrap">
          <span className="font-bold text-[#f36334] uppercase tracking-wider text-[10px] pl-1 flex items-center gap-1 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Screens:
          </span>

          <button
            onClick={() => setCurrentScreen('feed')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              currentScreen === 'feed'
                ? 'bg-[#f36334] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white bg-[#1a1918]'
            }`}
          >
            🍔 Feed
          </button>

          <button
            onClick={() => setCurrentScreen('tracker')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              currentScreen === 'tracker'
                ? 'bg-[#f36334] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white bg-[#1a1918]'
            }`}
          >
            📍 GPS Tracker
          </button>

          <button
            onClick={() => setCurrentScreen('chat')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              currentScreen === 'chat'
                ? 'bg-[#f36334] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white bg-[#1a1918]'
            }`}
          >
            💬 Courier Chat
          </button>

          <button
            onClick={() => setCurrentScreen('receipt')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              currentScreen === 'receipt'
                ? 'bg-[#f36334] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white bg-[#1a1918]'
            }`}
          >
            🧾 Receipt
          </button>

          <button
            onClick={() => setCustomizerDish(DISHES[0])}
            className="px-2 py-1 rounded-full font-medium text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/30"
            title="Preview Order Customizer (Image 14)"
          >
            ⚙️ Customize
          </button>

          <button
            onClick={() => setIsTipRatingModalOpen(true)}
            className="px-2 py-1 rounded-full font-medium text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-500/30"
            title="Preview Tip & Rating Modal (Image 9)"
          >
            ⭐ Tip &amp; Rate
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-2 py-1 rounded-full font-medium text-sky-300 hover:text-white bg-sky-950/40 border border-sky-500/30"
            title="Preview PDF & Email Export (Image 16)"
          >
            📄 PDF
          </button>
        </div>
      </nav>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative shadow-2xl bg-[#141312]">
        {/* Persistent Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          activeOrderCount={order.status !== 'delivered' ? 1 : 0}
        />

        {/* Screen Views */}
        <main className="flex-1 flex flex-col w-full">
          {currentScreen === 'feed' && (
            <ExploreFeed
              onOpenCustomizer={(dish) => setCustomizerDish(dish)}
              onNavigate={(s) => setCurrentScreen(s)}
              cart={cart}
              hasActiveOrder={order.status !== 'delivered'}
              onToast={showToast}
            />
          )}

          {currentScreen === 'tracker' && (
            <LiveTrackerScreen
              order={order}
              onNavigate={(s) => setCurrentScreen(s)}
              onUpdateTip={handleUpdateTip}
              onSimulateDelivery={handleSimulateDelivery}
              onToast={showToast}
            />
          )}

          {currentScreen === 'chat' && (
            <CourierChatScreen
              order={order}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenRatingModal={() => setIsTipRatingModalOpen(true)}
              onToast={showToast}
            />
          )}

          {currentScreen === 'receipt' && (
            <OrderReceiptScreen
              order={order}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              onReorder={handleReorder}
              onToast={showToast}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              onOpenCustomizer={(dish) => setCustomizerDish(dish)}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {currentScreen === 'favorites' && (
            <FavoritesScreen
              onOpenCustomizer={(dish) => setCustomizerDish(dish)}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              order={order}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              onToast={showToast}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          activeOrderActive={order.status !== 'delivered'}
        />
      </div>

      {/* Interactive Order Customizer Modal (Image 14) */}
      <OrderCustomizerModal
        dish={customizerDish}
        isOpen={!!customizerDish}
        onClose={() => setCustomizerDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Interactive Tip & Rating Modal (Image 9) */}
      <TipRatingModal
        courier={order.courier}
        isOpen={isTipRatingModalOpen}
        onClose={() => setIsTipRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />

      {/* Interactive Email & PDF Export Modal (Image 16) */}
      <EmailPdfModal
        order={order}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onToast={showToast}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-4 z-50 max-w-sm mx-auto pointer-events-none animate-toast-in">
          <div className="bg-[#24211e]/95 backdrop-blur-md text-white text-xs font-semibold py-2.5 px-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f36334] animate-pulse"></span>
              <span>{toastMessage}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
