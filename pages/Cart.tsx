import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, CheckCircle, ShoppingBag, ArrowLeft, CreditCard, Banknote, MapPin, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/format';
import AddressModal from '../components/AddressModal';
import { useToast } from '../components/Toast';
import { Order } from '../types';

const PAYMENT_METHOD_LABELS: Record<Order['paymentMethod'], string> = {
  cash: 'Naqd',
  click: 'Click',
  payme: 'Payme',
};

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user, currentAddress, setCurrentAddress } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();

  // State for checkout flow
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'click' | 'payme'>('cash');
  const [comment, setComment] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  const handleProceedToCheckout = () => {
    if (!user) {
        navigate('/profile'); // prompt login
        return;
    }
    setStep('checkout');
    // Scroll top
    window.scrollTo(0, 0);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setIsSubmitting(true);

    try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const createdOrder = await placeOrder(
            items,
            total,
            currentAddress,
            user.phone,
            user.name || 'Mijoz',
            paymentMethod,
            comment
        );

        setLastCreatedOrder(createdOrder);
        clearCart();
        setStep('success');
        showToast('Buyurtma muvaffaqiyatli yuborildi');
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Order submit failed:', error);
        showToast('Buyurtma yuborishda xatolik yuz berdi', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- RENDER: SUCCESS SCREEN ---
  if (step === 'success') {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-slide-up">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600 w-12 h-12" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Buyurtma Qabul Qilindi!</h1>
              <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">Tez orada operatorlarimiz siz bilan bog'lanishadi. Buyurtma raqamingizni saqlab qo'ying.</p>
              
              <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-sm mb-8 border border-slate-100">
                  {lastCreatedOrder && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500">Buyurtma raqami:</span>
                        <span className="font-bold text-slate-900">{lastCreatedOrder.id}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">To'lov turi:</span>
                      <span className="font-bold text-slate-900">{PAYMENT_METHOD_LABELS[lastCreatedOrder?.paymentMethod || paymentMethod]}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Jami summa:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(lastCreatedOrder?.total || total)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Telefon:</span>
                      <span className="font-bold text-slate-900">{lastCreatedOrder?.phone || user?.phone}</span>
                  </div>
                  <div className="text-left text-sm mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-500 mb-1">Yetkazib berish manzili:</p>
                      <p className="font-medium text-slate-900">{lastCreatedOrder?.address || currentAddress}</p>
                  </div>
              </div>

              <button 
                  onClick={() => navigate('/')}
                  className="w-full max-w-sm bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                  Bosh sahifaga qaytish
              </button>
          </div>
      )
  }

  // --- RENDER: EMPTY CART ---
  if (items.length === 0 && step === 'cart') {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] px-4">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <ShoppingBag size={56} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.emptyCart}</h2>
            <p className="text-slate-500 text-center mb-8 max-w-md">{t.emptyCartDesc}</p>
            <button 
                onClick={() => navigate('/menu')}
                className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors"
            >
                {t.goToMenu}
            </button>
        </div>
    );
  }

  // --- RENDER: CHECKOUT FORM ---
  if (step === 'checkout') {
      return (
        <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto min-h-screen animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep('cart')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={20} className="text-slate-700" />
                </button>
                <h1 className="text-2xl font-black text-slate-900">{t.checkout}</h1>
            </div>

            <div className="space-y-6">
                {/* 1. Address Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <MapPin size={18} className="text-orange-600" />
                            {t.delivery}
                        </h3>
                        <button onClick={() => setIsAddressModalOpen(true)} className="text-orange-600 text-xs font-bold bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100">
                            O'zgartirish
                        </button>
                    </div>
                    <p className="text-slate-600 text-sm font-medium border-l-2 border-orange-200 pl-3 py-1">
                        {currentAddress}
                    </p>
                </div>

                {/* 2. Contact Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Aloqa ma'lumotlari</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Telefon raqam</p>
                        <p className="font-bold text-slate-900">{user?.phone}</p>
                    </div>
                </div>

                {/* 3. Payment Method */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">To'lov turi</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button 
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'cash' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-slate-100 bg-white text-slate-500 hover:border-orange-200'
                            }`}
                        >
                            <Banknote size={24} className="mb-2" />
                            <span className="text-xs font-bold">Naqd</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('click')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'click' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200'
                            }`}
                        >
                            <CreditCard size={24} className="mb-2" />
                            <span className="text-xs font-bold">Click</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('payme')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'payme' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-100 bg-white text-slate-500 hover:border-cyan-200'
                            }`}
                        >
                            <CreditCard size={24} className="mb-2" />
                            <span className="text-xs font-bold">Payme</span>
                        </button>
                    </div>
                </div>

                {/* 4. Comment */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Edit3 size={18} className="text-slate-400" />
                        Izoh (ixtiyoriy)
                    </h3>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Masalan: Domofon ishlamaydi..."
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:border-orange-500 outline-none resize-none h-24"
                    />
                </div>

                {/* 5. Summary & Action */}
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 sticky bottom-4 z-20">
                    <div className="flex justify-between items-center mb-6 text-sm">
                        <span className="text-slate-500 font-bold">Jami to'lov:</span>
                        <span className="text-2xl font-black text-orange-600">{formatCurrency(total)}</span>
                    </div>
                    <button 
                        onClick={handleConfirmOrder}
                        disabled={isSubmitting}
                        className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-[0.98] hover:bg-orange-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtmani Tasdiqlash'}
                    </button>
                </div>
            </div>

            <AddressModal 
                isOpen={isAddressModalOpen} 
                onClose={() => setIsAddressModalOpen(false)}
                onConfirm={(addr) => { setCurrentAddress(addr); setIsAddressModalOpen(false); }}
            />
        </div>
      );
  }

  // --- RENDER: DEFAULT CART VIEW ---
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-black mb-6 md:mb-8 text-slate-900">{t.cart}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Items List */}
          <div className="flex-1 w-full space-y-4">
            {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                    <div className="ml-4 flex-grow pr-8">
                        <h3 className="font-bold text-slate-800 text-base md:text-lg line-clamp-1">{item.name}</h3>
                        <p className="text-slate-500 text-xs md:text-sm line-clamp-1 mb-1">{item.description}</p>
                        <p className="text-orange-600 font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    
                    {/* Delete Button (Absolute) */}
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-1.5 absolute bottom-4 right-4">
                        <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-orange-600 active:scale-95 transition-all"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-sm md:text-base font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-green-600 active:scale-95 transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            ))}
          </div>

          {/* Right: Summary Card (Desktop) */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-4">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{t.checkout}</h3>
                        <p className="text-xs text-slate-500">{items.length} xil mahsulot</p>
                    </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-slate-600">
                        <span>{t.subtotal}</span>
                        <span className="font-medium">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>{t.delivery}</span>
                        <span className="font-medium text-green-600">{t.freeDelivery}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="font-black text-lg text-slate-900">{t.total}</span>
                        <span className="font-black text-2xl text-orange-600">{formatCurrency(total)}</span>
                    </div>
                </div>

                <button 
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-[0.98] hover:bg-orange-700 transition-all"
                    onClick={handleProceedToCheckout}
                >
                    Rasmiylashtirish
                </button>
            </div>
          </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 bg-white p-4 rounded-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.1)] border border-slate-100 z-30">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-900">{t.total}</span>
            <span className="font-black text-xl text-orange-600">{formatCurrency(total)}</span>
        </div>
        <button 
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-[0.98]"
            onClick={handleProceedToCheckout}
        >
            Rasmiylashtirish
        </button>
      </div>
    </div>
  );
};

export default Cart;
