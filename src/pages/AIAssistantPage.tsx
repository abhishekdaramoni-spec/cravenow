import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DISHES } from '@/data/dishes';
import { RESTAURANTS } from '@/data/restaurants';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/constants';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: any[];
};

const SUGGESTIONS = [
  'Something spicy under ₹300',
  'Best biryani',
  'Vegetarian food',
  'Quick breakfast',
  'Something sweet'
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hi! I\'m CraveNow AI 🍽️ Tell me what you\'re craving and I\'ll find the perfect dishes for you.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processQuery = (query: string) => {
    const q = query.toLowerCase();
    let results = [...DISHES];

    // Simple keyword matching for demo
    if (q.includes('veg') && !q.includes('non-veg')) {
      results = results.filter(d => d.isVeg);
    }
    
    if (q.includes('spicy')) {
      results = results.filter(d => d.description.toLowerCase().includes('spicy') || d.name.toLowerCase().includes('spicy'));
    }

    if (q.includes('under 300') || q.includes('under ₹300')) {
      results = results.filter(d => d.price < 300);
    }

    if (q.includes('biryani')) {
      results = results.filter(d => d.name.toLowerCase().includes('biryani'));
    }
    
    if (q.includes('sweet') || q.includes('dessert')) {
      results = results.filter(d => ['Gulab Jamun', 'Rasmalai', 'Ice Cream'].some(s => d.name.includes(s)) || d.category === 'Desserts');
    }

    // If no specific filters matched perfectly, just do a basic text search
    if (results.length === DISHES.length) {
       results = results.filter(d => 
         d.name.toLowerCase().includes(q) || 
         d.description.toLowerCase().includes(q)
       );
    }

    // Default recommendations if no match
    if (results.length === 0) {
      return DISHES.slice(0, 3);
    }

    return results.slice(0, 4); // Limit to 4
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const recommendations = processQuery(text);
      const aiText = recommendations.length > 0 && recommendations !== DISHES.slice(0, 3)
        ? `Here are some great options I found for you:`
        : `I couldn't find an exact match, but you might like these popular choices:`;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        recommendations
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAddToCart = (dish: any) => {
    addItem(dish);
    showToast(`Added ${dish.name} to cart`, 'success');
  };

  return (
    <div className="flex flex-col h-screen bg-[#141312] text-[#e6e1df]">
      {/* Header */}
      <div className="p-4 bg-[#1c1b1a] border-b border-[#141312] flex items-center gap-3 sticky top-0 z-10">
        <Link to="/" className="text-[#a88a81]">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="w-10 h-10 bg-gradient-to-br from-[#f36334] to-orange-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white">smart_toy</span>
        </div>
        <div>
          <h1 className="font-semibold text-white">CraveNow AI</h1>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.sender === 'user' ? '' : 'space-y-3'}`}>
              <div className={`p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-[#f36334] text-white rounded-tr-sm' 
                  : 'bg-[#1c1b1a] text-[#e6e1df] rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              
              {/* Recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2">
                  {msg.recommendations.map((dish) => {
                    const restaurant = RESTAURANTS.find(r => r.id === dish.restaurantId);
                    return (
                      <div key={dish.id} className="min-w-[220px] bg-[#1c1b1a] rounded-xl overflow-hidden border border-[#2a2826] flex-shrink-0 sm:min-w-0">
                        <img src={dish.image} alt={dish.name} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1 text-xs">
                            <span className={`material-symbols-outlined text-[12px] ${dish.isVeg ? 'text-green-500' : 'text-red-500'}`}>
                              fiber_manual_record
                            </span>
                            <span className="text-[#a88a81] truncate">{restaurant?.name || dish.restaurantName}</span>
                          </div>
                          <h3 className="font-medium text-sm line-clamp-1">{dish.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[#f36334] font-medium">{formatPrice(dish.price)}</span>
                            <div className="flex items-center gap-1 text-xs text-[#a88a81]">
                              <span className="material-symbols-outlined text-[12px] text-yellow-500">star</span>
                              4.5
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => handleAddToCart(dish)}
                              className="flex-1 bg-[#f36334] text-white py-1.5 rounded-lg text-xs font-medium"
                            >
                              Add
                            </button>
                            <Link 
                              to={`/restaurant/${restaurant?.slug}`}
                              className="flex-1 bg-[#141312] text-[#e6e1df] py-1.5 rounded-lg text-xs font-medium text-center border border-[#2a2826]"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1c1b1a] rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-[#a88a81] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#a88a81] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#a88a81] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#1c1b1a] p-4 border-t border-[#141312]">
        {messages.length === 1 && !isTyping && (
          <div className="flex overflow-x-auto gap-2 mb-4 pb-1 scrollbar-hide">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap bg-[#141312] border border-[#2a2826] px-3 py-1.5 rounded-full text-xs text-[#a88a81]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your craving..."
            className="flex-1 bg-[#141312] text-[#e6e1df] rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-[#f36334]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 bg-[#f36334] text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
