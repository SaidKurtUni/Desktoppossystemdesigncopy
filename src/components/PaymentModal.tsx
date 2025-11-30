import { useState } from 'react';
import { X, CreditCard, Banknote, Percent } from 'lucide-react';

interface PaymentModalProps {
  totalAmount: number;
  tableNumber: number;
  tableId: string;
  onClose: () => void;
  onPartialPayment: (paidAmount: number) => void;
  onFullPayment: () => void;
}

export function PaymentModal({ 
  totalAmount, 
  tableNumber, 
  tableId, 
  onClose, 
  onPartialPayment, 
  onFullPayment 
}: PaymentModalProps) {
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const calculateTotal = () => {
    const discount = discountPercent ? parseFloat(discountPercent) : 0;
    const discountAmount = (totalAmount * discount) / 100;
    return totalAmount - discountAmount;
  };

  const finalTotal = calculateTotal();
  const cashValue = cashAmount ? parseFloat(cashAmount) : 0;
  const cardValue = cardAmount ? parseFloat(cardAmount) : 0;
  const paidTotal = cashValue + cardValue;
  const remaining = finalTotal - paidTotal;

  const handlePartialPayment = () => {
    if (paidTotal > 0 && remaining > 0) {
      setSuccessMessage('ARA ÖDEME ALINDI');
      setShowSuccess(true);
      setTimeout(() => {
        onPartialPayment(paidTotal);
      }, 1500);
    }
  };

  const handleFullPayment = () => {
    if (paidTotal >= finalTotal) {
      setSuccessMessage('ÖDEME TAMAMLANDI');
      setShowSuccess(true);
      setTimeout(() => {
        onFullPayment();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-8">
      <div className="bg-[#1E1E1E] rounded-lg border-2 border-[#333333] w-full max-w-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2C2C2C] bg-[#121212]">
          <div>
            <h2 className="font-bold text-2xl tracking-wider">ÖDEME - MASA {tableNumber}</h2>
            <p className="text-xs text-neutral-500 mt-1">Ödeme işlemini tamamlayın</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-[#00E676] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#00E676]/50">
              <svg className="w-12 h-12 text-[#121212]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-2xl mb-2">{successMessage}</h3>
            <p className="text-neutral-400">İşlem başarılı</p>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Total Amount Display */}
              <div className="bg-[#121212] rounded-lg p-5 border border-[#2C2C2C]">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-neutral-400">Toplam Tutar:</span>
                  <span className="text-3xl font-bold text-white">{totalAmount.toFixed(2)} TL</span>
                </div>
                {discountPercent && parseFloat(discountPercent) > 0 && (
                  <>
                    <div className="flex items-baseline justify-between text-[#FF9100] text-sm mt-2">
                      <span>İndirim ({discountPercent}%):</span>
                      <span>-{((totalAmount * parseFloat(discountPercent)) / 100).toFixed(2)} TL</span>
                    </div>
                    <div className="border-t border-[#333333] mt-3 pt-3 flex items-baseline justify-between">
                      <span className="text-neutral-400">Ödenecek:</span>
                      <span className="text-4xl font-bold text-[#00E676]">{finalTotal.toFixed(2)} TL</span>
                    </div>
                  </>
                )}
              </div>

              {/* Discount Input */}
              <div>
                <label className="text-neutral-400 mb-2 flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4" />
                  İndirim Yüzdesi
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="% Giriniz"
                    min="0"
                    max="100"
                    className="flex-1 bg-[#121212] border-2 border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF9100] transition-colors"
                  />
                  <button
                    className="bg-[#FF9100] hover:bg-[#FF9100]/90 text-[#121212] font-bold px-5 rounded-lg transition-all shadow-lg shadow-[#FF9100]/30"
                  >
                    İNDİRİM UYGULA
                  </button>
                </div>
              </div>

              {/* Split Payment */}
              <div className="space-y-4">
                <h3 className="font-bold tracking-wide border-l-4 border-[#00E676] pl-3">BÖLÜNMÜŞ ÖDEME</h3>
                
                <div>
                  <label className="text-neutral-400 mb-2 flex items-center gap-2 text-sm">
                    <Banknote className="w-4 h-4" />
                    Nakit (Cash)
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0.00 TL"
                    min="0"
                    step="0.01"
                    className="w-full bg-[#121212] border-2 border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E676] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 mb-2 flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    Kredi Kartı (Card)
                  </label>
                  <input
                    type="number"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    placeholder="0.00 TL"
                    min="0"
                    step="0.01"
                    className="w-full bg-[#121212] border-2 border-[#2C2C2C] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E676] transition-colors"
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#121212] rounded-lg p-4 border border-[#2C2C2C] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Nakit:</span>
                  <span className="text-white font-semibold">{cashValue.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Kredi Kartı:</span>
                  <span className="text-white font-semibold">{cardValue.toFixed(2)} TL</span>
                </div>
                <div className="border-t border-[#333333] pt-2 flex justify-between">
                  <span className="text-neutral-400 font-bold">Kalan:</span>
                  <span className={`font-bold text-xl ${remaining > 0 ? 'text-[#FF1744]' : 'text-[#00E676]'}`}>
                    {remaining.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-[#2C2C2C] bg-[#121212] flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-[#2C2C2C] hover:bg-[#333333] text-neutral-300 rounded-lg font-bold tracking-wide transition-colors"
              >
                İPTAL
              </button>
              
              <button
                onClick={handlePartialPayment}
                disabled={paidTotal <= 0 || remaining <= 0}
                className={`flex-1 py-4 rounded-lg font-bold tracking-wider transition-all ${
                  paidTotal > 0 && remaining > 0
                    ? 'bg-[#FFD600] hover:bg-[#FFD600]/90 text-[#121212] active:scale-95 shadow-lg shadow-[#FFD600]/40'
                    : 'bg-[#2C2C2C] text-neutral-600 cursor-not-allowed'
                }`}
              >
                ARA ÖDEME
              </button>

              <button
                onClick={handleFullPayment}
                disabled={paidTotal < finalTotal}
                className={`flex-1 py-4 rounded-lg font-bold tracking-wider transition-all ${
                  paidTotal >= finalTotal
                    ? 'bg-[#00E676] hover:bg-[#00E676]/90 text-[#121212] active:scale-95 shadow-lg shadow-[#00E676]/40'
                    : 'bg-[#2C2C2C] text-neutral-600 cursor-not-allowed'
                }`}
              >
                ÖDEMEYİ AL
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
