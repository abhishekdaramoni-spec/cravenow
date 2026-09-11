import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, OrderTrackingState, ScreenType } from '../types';

interface CourierChatScreenProps {
  order: OrderTrackingState;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenRatingModal: () => void;
  onToast: (msg: string) => void;
}

export const CourierChatScreen: React.FC<CourierChatScreenProps> = ({
  order,
  messages,
  onSendMessage,
  onNavigate,
  onOpenRatingModal,
  onToast,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'Thank you so much! 🙌',
    'Got it! ⭐⭐⭐⭐⭐',
    'Add extra tip 💵',
    'Everything looks great! 👌',
    "I'll meet you outside 👋",
    'Leave at the door 🚪',
  ];

  const handleQuickReply = (text: string) => {
    if (text.includes('Add extra tip') || text.includes('⭐⭐⭐⭐⭐')) {
      onOpenRatingModal();
    } else {
      onSendMessage(text);
    }
  };

  const handleAttachPhoto = () => {
    onToast('Camera opened • Photo attached to chat');
    onSendMessage('📷 [Customer shared building access gate photo]');
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#141312] pb-24 text-[#e6e1df]">
      {/* Top Action Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#141312]/95 backdrop-blur-xl pt-safe border-b border-[#2b2a28]/60">
        <div className="h-14 px-3 flex items-center justify-between max-w-md mx-auto w-full">
          <button
            onClick={() => onNavigate('tracker')}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#211f1e] text-white hover:text-[#f36334] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Tracker</span>
          </button>

          {/* Masked Privacy Indicator */}
          <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#211f1e] text-[#a88a81] text-[11px] font-medium border border-white/5">
            <span className="material-symbols-outlined text-[#f36334] text-[14px]">verified_user</span>
            <span className="truncate">Private &amp; Masked</span>
          </div>

          {/* Quick Call Button */}
          <a
            href={`tel:${order.courier.phone}`}
            aria-label="Call Driver"
            className="w-9 h-9 rounded-full bg-[#211f1e] flex items-center justify-center text-[#f36334] hover:bg-[#2b2a28] transition-all active:scale-95 shadow-sm border border-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>
      </div>

      {/* Driver Context & Status Card (Level 2 Elevation) */}
      <div className="max-w-md mx-auto w-full px-3 pt-2">
        <div className="rounded-2xl bg-[#1c1b1a] shadow-xl overflow-hidden border border-white/5">
          {/* Courier Identity & Vehicle Grid */}
          <div className="p-3.5 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                alt={order.courier.name}
                className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-[#f36334]/30"
                src={order.courier.avatar}
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#f36334] text-white rounded-full p-0.5 shadow-sm flex items-center justify-center ring-2 ring-[#1c1b1a]">
                <span className="material-symbols-outlined text-[13px]">verified</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base truncate">
                  {order.courier.name}
                </h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#2b2a28] text-[#ffba49] text-[11px] font-bold">
                  <span
                    className="material-symbols-outlined text-[13px] text-[#ffba49]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {order.courier.rating}
                </span>
              </div>
              <p className="text-xs text-[#a88a81] truncate mt-0.5">
                {order.courier.vehicle} • {order.courier.plate}
              </p>
            </div>
          </div>

          {/* Active Delivery Metric Pill Bar */}
          <div className="px-3.5 pb-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0f0e0d] border border-white/5 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-black flex-shrink-0">
                  <span className="material-symbols-outlined text-[13px] font-extrabold">check</span>
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {order.status === 'delivered' ? 'Delivered at 7:34 PM' : 'Arriving in 12–14 mins'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#a88a81] text-[11px] font-medium flex-shrink-0">
                <span className="material-symbols-outlined text-[13px] text-emerald-400">
                  verified
                </span>
                <span>{order.status === 'delivered' ? 'Completed' : '0.8 mi away'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Order Context Tag */}
        <div
          onClick={() => onNavigate('tracker')}
          className="mt-2.5 px-3 py-2.5 rounded-xl bg-[#1c1b1a] shadow-sm flex items-center justify-between gap-2 border border-white/5 cursor-pointer hover:bg-[#211f1e] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#211f1e] flex items-center justify-center flex-shrink-0 text-[#f36334]">
              <span className="material-symbols-outlined text-[16px]">lunch_dining</span>
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">
                {order.restaurantName} <span className="text-[#a88a81] font-normal">• 3 items</span>
              </div>
              <div className="text-[11px] text-[#f36334] truncate font-medium">
                Order #{order.orderId} • {order.status === 'delivered' ? 'Delivered' : 'On the way'}
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">receipt_long</span>
        </div>

        {/* Chat History Stream */}
        <div className="flex flex-col gap-3 mt-4" id="chat-messages-container">
          {/* Day/Time Divider */}
          <div className="flex justify-center my-1">
            <span className="px-3 py-1 rounded-full bg-[#1c1b1a] text-[11px] text-[#a88a81] font-medium tracking-wider shadow-sm border border-white/5">
              Today, 7:24 PM
            </span>
          </div>

          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 max-w-[92%] mx-auto bg-[#0f0e0d] px-3.5 py-2.5 rounded-xl shadow-sm border border-white/5"
                >
                  <span className="material-symbols-outlined text-[#f36334] text-[18px] flex-shrink-0 mt-0.5">
                    moped
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-200 leading-snug">
                      Sarah picked up your order and is heading to{' '}
                      <span className="font-bold text-white">{order.deliveryAddress}</span>.
                    </p>
                    <span className="block text-[10px] text-[#a88a81] mt-1 text-right font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            }

            if (msg.sender === 'courier') {
              return (
                <div key={msg.id} className="flex items-end gap-2.5 max-w-[88%]">
                  <img
                    alt="Sarah"
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1 shadow-sm ring-1 ring-white/10"
                    src={order.courier.avatar}
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-[11px] font-medium text-[#a88a81] ml-2">
                      {order.courier.name}
                    </span>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#211f1e] text-neutral-100 shadow-md border border-white/5 flex flex-col gap-2">
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      
                      {/* Attached confirmation photo if present */}
                      {msg.imageUrl && (
                        <div
                          onClick={() => setSelectedPhoto(msg.imageUrl || null)}
                          className="relative overflow-hidden rounded-xl bg-black shadow-md group cursor-pointer"
                        >
                          <img
                            alt="Delivery Confirmation Photo"
                            className="w-full h-44 object-cover block rounded-xl hover:scale-102 transition-transform duration-300"
                            src={msg.imageUrl}
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-white">
                            <span className="material-symbols-outlined text-[13px] text-emerald-400">
                              photo_camera
                            </span>
                            <span>Confirmation Photo</span>
                          </div>
                          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/85 backdrop-blur-md">
                            <div className="flex items-center gap-1 text-[11px] text-white truncate">
                              <span className="material-symbols-outlined text-[14px] text-[#f36334]">
                                pin_drop
                              </span>
                              <span className="truncate">Dropped off at Apt 4B</span>
                            </div>
                            <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#f36334]">
                              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                              Tap
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-0.5">
                        <span className="text-[10px] text-[#a88a81] font-mono">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Customer Outgoing Message
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 max-w-[85%] self-end">
                <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-[#f36334] text-white shadow-md">
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-white/80">
                    <span className="text-[10px] font-mono">{msg.time}</span>
                    <span className="material-symbols-outlined text-[14px]">done_all</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Smart Quick Suggestions Rail */}
        <div className="mt-4 pt-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="material-symbols-outlined text-[#f36334] text-[15px]">auto_awesome</span>
            <span className="text-[10px] font-bold text-[#a88a81] uppercase tracking-wider">
              Quick Replies
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-[#1c1b1a] hover:bg-[#2b2a28] text-white text-xs font-semibold transition-all active:scale-95 shadow-sm border border-white/5 whitespace-nowrap"
                type="button"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Message Composer Panel */}
        <div className="mt-3 bg-[#1c1b1a]/95 rounded-2xl p-2 shadow-2xl backdrop-blur-md border border-white/5">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Media / Photo Attachment */}
            <button
              onClick={handleAttachPhoto}
              aria-label="Attach Photo"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#a88a81] hover:text-white hover:bg-[#2b2a28] transition-colors active:scale-95 flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </button>

            {/* Input Text Field */}
            <div className="flex-1 relative flex items-center">
              <input
                autoComplete="off"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-[#0f0e0d] text-white placeholder:text-[#a88a81] text-xs py-2.5 pl-3.5 pr-9 rounded-full focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 transition-all"
                placeholder="Type a message to Sarah..."
                type="text"
              />
              <button
                aria-label="Record voice message"
                onClick={() => onToast('Voice message recording simulated 🎙️')}
                className="absolute right-2 text-[#a88a81] hover:text-white transition-colors p-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
              </button>
            </div>

            {/* Send Button */}
            <button
              aria-label="Send Message"
              className="w-10 h-10 rounded-full bg-[#f36334] text-white flex items-center justify-center shadow-lg shadow-[#f36334]/30 active:scale-90 transition-all flex-shrink-0"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>

        {/* Subtext Security Disclaimer */}
        <div className="mt-2 text-center pb-2">
          <p className="text-[11px] text-[#a88a81] leading-tight">
            Direct communication protected by CraveNow SecureMask™
          </p>
        </div>
      </div>

      {/* Expanded Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-toast-in cursor-pointer"
        >
          <div className="relative max-w-sm w-full bg-[#1c1b1a] rounded-2xl overflow-hidden p-3 border border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <img
              src={selectedPhoto}
              alt="Expanded Drop-Off Photo"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="pt-3 text-center">
              <span className="text-xs font-bold text-white block">
                Doorstep Delivery Verified • Apt 4B
              </span>
              <span className="text-[11px] text-[#a88a81]">
                Left by courier Sarah Jenkins at 7:34 PM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
