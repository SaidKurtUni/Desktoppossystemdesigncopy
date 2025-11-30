import { useState } from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

type Category = 'biralar' | 'kokteyller' | 'atistirmalik';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderEntryScreenProps {
  tableNumber: number;
  tableId: string;
  currentBill: number;
  onAddOrder: (tableNumber: number, items: string, totalAmount: number) => void;
  onPartialPayment: (tableId: string, paidAmount: number) => void;
  onFullPayment: (tableId: string) => void;
}

const products: Product[] = [
  // Biralar
  { id: 'b1', name: 'EFES PİLSEN', price: 45, category: 'biralar' },
  { id: 'b2', name: 'BOMONTİ', price: 50, category: 'biralar' },
  { id: 'b3', name: 'TUBORG', price: 45, category: 'biralar' },
  { id: 'b4', name: 'CORONA', price: 65, category: 'biralar' },
  { id: 'b5', name: 'HEINEKEN', price: 60, category: 'biralar' },
  { id: 'b6', name: 'CARLSBERG', price: 55, category: 'biralar' },
  { id: 'b7', name: 'AMSTERDAM', price: 70, category: 'biralar' },
  { id: 'b8', name: 'MILLER', price: 58, category: 'biralar' },
  { id: 'b9', name: 'BECKs', price: 62, category: 'biralar' },
  
  // Kokteyller
  { id: 'c1', name: 'MOJİTO', price: 85, category: 'kokteyller' },
  { id: 'c2', name: 'MARGARİTA', price: 90, category: 'kokteyller' },
  { id: 'c3', name: 'COSMOPOLİTAN', price: 95, category: 'kokteyller' },
  { id: 'c4', name: 'LONG ISLAND', price: 110, category: 'kokteyller' },
  { id: 'c5', name: 'PIÑA COLADA', price: 100, category: 'kokteyller' },
  { id: 'c6', name: 'OLD FASHIONED', price: 105, category: 'kokteyller' },
  { id: 'c7', name: 'NEGRONI', price: 98, category: 'kokteyller' },
  { id: 'c8', name: 'APEROL SPRITZ', price: 88, category: 'kokteyller' },
  { id: 'c9', name: 'WHISKEY SOUR', price: 92, category: 'kokteyller' },
  
  // Atıştırmalık
  { id: 'f1', name: 'ÇITIR TAVUK KANAT', price: 75, category: 'atistirmalik' },
  { id: 'f2', name: 'NACHOS SUPREME', price: 65, category: 'atistirmalik' },
  { id: 'f3', name: 'BBQ KABURGA', price: 120, category: 'atistirmalik' },
  { id: 'f4', name: 'SEZAR SALATA', price: 55, category: 'atistirmalik' },
  { id: 'f5', name: 'MARGHERİTA PİZZA', price: 95, category: 'atistirmalik' },
  { id: 'f6', name: 'DANA BURGER', price: 85, category: 'atistirmalik' },
  { id: 'f7', name: 'PATATES KIZARTMASI', price: 40, category: 'atistirmalik' },
  { id: 'f8', name: 'SOĞAN HALKASI', price: 45, category: 'atistirmalik' },
  { id: 'f9', name: 'MEZE TABAĞI', price: 70, category: 'atistirmalik' },
];

export function OrderEntryScreen({ 
  tableNumber, 
  tableId, 
  currentBill, 
  onAddOrder, 
  onPartialPayment, 
  onFullPayment 
}: OrderEntryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('biralar');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalWithCurrentBill = () => {
    return currentBill + getCartTotal();
  };

  const handleConfirmOrder = () => {
    if (cart.length > 0) {
      // Sipariş özetini oluştur
      const orderSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
      onAddOrder(tableNumber, orderSummary, getCartTotal());
      setCart([]);
      // Dashboard'a geri dön - navigation App.tsx'de handle edilecek
    }
  };

  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePartialPaymentComplete = (paidAmount: number) => {
    onPartialPayment(tableId, paidAmount);
    setShowPaymentModal(false);
  };

  const handleFullPaymentComplete = () => {
    onFullPayment(tableId);
    setCart([]);
    setShowPaymentModal(false);
  };

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  return (
    <>
      <div className="h-full flex">
        {/* Category Sidebar - 15% */}
        <div className="w-[15%] bg-[#121212] border-r border-[#2C2C2C] p-3">
          <h3 className="text-neutral-500 mb-3 text-xs tracking-widest">KATEGORİLER</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('biralar')}
              className={`w-full py-5 px-3 rounded-lg transition-all relative overflow-hidden ${
                selectedCategory === 'biralar'
                  ? 'bg-[#2C2C2C] text-white font-bold border-l-4 border-[#FFC400] shadow-lg'
                  : 'bg-[#1E1E1E] text-neutral-400 hover:bg-[#2C2C2C] border-l-4 border-transparent'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🍺</span>
                <span className="text-xs tracking-wide">BİRALAR</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedCategory('kokteyller')}
              className={`w-full py-5 px-3 rounded-lg transition-all relative overflow-hidden ${
                selectedCategory === 'kokteyller'
                  ? 'bg-[#2C2C2C] text-white font-bold border-l-4 border-purple-500 shadow-lg'
                  : 'bg-[#1E1E1E] text-neutral-400 hover:bg-[#2C2C2C] border-l-4 border-transparent'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🍹</span>
                <span className="text-xs tracking-wide">KOKTEYLLER</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedCategory('atistirmalik')}
              className={`w-full py-5 px-3 rounded-lg transition-all relative overflow-hidden ${
                selectedCategory === 'atistirmalik'
                  ? 'bg-[#2C2C2C] text-white font-bold border-l-4 border-[#FF9100] shadow-lg'
                  : 'bg-[#1E1E1E] text-neutral-400 hover:bg-[#2C2C2C] border-l-4 border-transparent'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🍔</span>
                <span className="text-xs tracking-wide">ATIŞTIRMALIK</span>
              </div>
            </button>
          </div>
        </div>

        {/* Products Grid - 60% */}
        <div className="w-[60%] bg-[#1E1E1E] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl tracking-wider">MASA {tableNumber} - MENÜ</h2>
              <p className="text-xs text-neutral-500 mt-1">Ürün seçimi yapın</p>
            </div>
            {currentBill > 0 && (
              <div className="bg-[#FF1744]/20 border-2 border-[#FF1744] rounded-lg px-4 py-2">
                <span className="text-xs text-neutral-400">Mevcut Hesap:</span>
                <span className="text-xl font-bold text-[#FF1744] ml-2">₺{currentBill}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 h-[calc(100%-90px)] overflow-y-auto pr-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-[#333333] hover:bg-[#3C3C3C] border border-[#444444] hover:border-[#00E676] rounded-lg p-4 transition-all h-24 flex flex-col items-center justify-center active:scale-95 shadow-lg"
              >
                <span className="font-bold text-white tracking-wide text-center leading-tight mb-2">{product.name}</span>
                <span className="text-[#00E676] font-bold">{product.price} TL</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Ticket Sidebar - 25% */}
        <div className="w-[25%] bg-[#121212] border-l border-[#2C2C2C] flex flex-col">
          <div className="p-4 border-b border-[#2C2C2C] bg-[#1E1E1E]">
            <h2 className="font-bold tracking-wider">YENİ SİPARİŞ</h2>
            <p className="text-xs text-neutral-500 mt-1">Masa {tableNumber}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center text-neutral-600 mt-16">
                <p className="text-sm">Henüz ürün eklenmedi</p>
                <p className="text-xs mt-2">Menüden ürün seçin</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2C2C2C] rounded-lg p-3 border border-[#333333]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <p className="text-xs text-[#00E676]">{item.price} TL</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-[#1E1E1E] hover:bg-[#333333] p-1.5 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-[#1E1E1E] hover:bg-[#333333] p-1.5 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold">{item.price * item.quantity} TL</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#2C2C2C] space-y-3">
            {/* Yeni Sipariş Toplamı */}
            {cart.length > 0 && (
              <div className="flex items-center justify-between bg-[#2C2C2C] p-3 rounded-lg">
                <span className="text-neutral-400 text-sm">Yeni Sipariş:</span>
                <span className="font-bold text-lg text-white">{getCartTotal()} TL</span>
              </div>
            )}

            {/* Toplam Tutar */}
            <div className="flex items-center justify-between bg-[#2C2C2C] p-3 rounded-lg border-2 border-[#FFD600]/30">
              <span className="text-neutral-400">Toplam:</span>
              <span className="font-bold text-2xl text-[#FFD600]">{getTotalWithCurrentBill()} TL</span>
            </div>

            {/* Butonlar */}
            <div className="space-y-2">
              <button
                onClick={handleConfirmOrder}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all ${
                  cart.length === 0
                    ? 'bg-[#2C2C2C] text-neutral-600 cursor-not-allowed'
                    : 'bg-[#00E676] hover:bg-[#00E676]/90 text-[#121212] active:scale-95 shadow-lg shadow-[#00E676]/40'
                }`}
              >
                SİPARİŞİ ONAYLA
              </button>

              <button
                onClick={handleOpenPayment}
                disabled={getTotalWithCurrentBill() === 0}
                className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all ${
                  getTotalWithCurrentBill() === 0
                    ? 'bg-[#2C2C2C] text-neutral-600 cursor-not-allowed'
                    : 'bg-[#FF9100] hover:bg-[#FF9100]/90 text-[#121212] active:scale-95 shadow-lg shadow-[#FF9100]/40'
                }`}
              >
                ÖDEME
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          totalAmount={getTotalWithCurrentBill()}
          tableNumber={tableNumber}
          tableId={tableId}
          onClose={() => setShowPaymentModal(false)}
          onPartialPayment={handlePartialPaymentComplete}
          onFullPayment={handleFullPaymentComplete}
        />
      )}
    </>
  );
}
