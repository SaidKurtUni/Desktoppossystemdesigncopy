import { TrendingUp, Banknote, CreditCard, AlertCircle } from 'lucide-react';

interface SoldProduct {
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  avgPrice: number;
}

const reportData = {
  totalRevenue: 25450.00,
  cashTotal: 10000.00,
  creditCardTotal: 15450.00,
  totalWaste: 450.00,
  date: '2025-11-26',
};

const soldProducts: SoldProduct[] = [
  { name: 'EFES PİLSEN', category: 'Bira', quantitySold: 245, revenue: 11025, avgPrice: 45 },
  { name: 'MOJİTO', category: 'Kokteyl', quantitySold: 128, revenue: 10880, avgPrice: 85 },
  { name: 'BOMONTİ', category: 'Bira', quantitySold: 192, revenue: 9600, avgPrice: 50 },
  { name: 'ÇITIR TAVUK KANAT', category: 'Yemek', quantitySold: 96, revenue: 7200, avgPrice: 75 },
  { name: 'CORONA', category: 'Bira', quantitySold: 103, revenue: 6695, avgPrice: 65 },
  { name: 'MARGARİTA', category: 'Kokteyl', quantitySold: 75, revenue: 6750, avgPrice: 90 },
  { name: 'LONG ISLAND', category: 'Kokteyl', quantitySold: 58, revenue: 6380, avgPrice: 110 },
  { name: 'DANA BURGER', category: 'Yemek', quantitySold: 77, revenue: 6545, avgPrice: 85 },
  { name: 'BBQ KABURGA', category: 'Yemek', quantitySold: 49, revenue: 5880, avgPrice: 120 },
  { name: 'HEINEKEN', category: 'Bira', quantitySold: 91, revenue: 5460, avgPrice: 60 },
  { name: 'MARGHERİTA PİZZA', category: 'Yemek', quantitySold: 61, revenue: 5795, avgPrice: 95 },
  { name: 'NACHOS SUPREME', category: 'Yemek', quantitySold: 72, revenue: 4680, avgPrice: 65 },
  { name: 'COSMOPOLİTAN', category: 'Kokteyl', quantitySold: 47, revenue: 4465, avgPrice: 95 },
  { name: 'TUBORG', category: 'Bira', quantitySold: 94, revenue: 4230, avgPrice: 45 },
  { name: 'PIÑA COLADA', category: 'Kokteyl', quantitySold: 43, revenue: 4300, avgPrice: 100 },
  { name: 'AMSTERDAM', category: 'Bira', quantitySold: 38, revenue: 2660, avgPrice: 70 },
  { name: 'SEZAR SALATA', category: 'Yemek', quantitySold: 35, revenue: 1925, avgPrice: 55 },
  { name: 'OLD FASHIONED', category: 'Kokteyl', quantitySold: 29, revenue: 3045, avgPrice: 105 },
];

export function ReportScreen() {
  const cashPercentage = (reportData.cashTotal / reportData.totalRevenue) * 100;
  const cardPercentage = (reportData.creditCardTotal / reportData.totalRevenue) * 100;

  return (
    <div className="h-full bg-[#1E1E1E] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-3xl tracking-wider mb-1">GÜN SONU RAPORU</h1>
          <p className="text-neutral-500 text-sm">
            {new Date(reportData.date).toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Summary Cards - 4 Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/10 rounded-lg p-5 border-2 border-[#00E676]/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#00E676] p-2.5 rounded-lg shadow-lg shadow-[#00E676]/50">
                <TrendingUp className="w-5 h-5 text-[#121212]" />
              </div>
              <span className="text-neutral-400 text-sm">Toplam Ciro</span>
            </div>
            <div className="font-bold text-3xl text-[#00E676]">
              {reportData.totalRevenue.toFixed(0)} TL
            </div>
          </div>

          {/* Cash Total */}
          <div className="bg-gradient-to-br from-[#FF9100]/20 to-[#FF9100]/10 rounded-lg p-5 border-2 border-[#FF9100]/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#FF9100] p-2.5 rounded-lg shadow-lg shadow-[#FF9100]/50">
                <Banknote className="w-5 h-5 text-[#121212]" />
              </div>
              <span className="text-neutral-400 text-sm">Nakit</span>
            </div>
            <div className="font-bold text-3xl text-[#FF9100]">
              {reportData.cashTotal.toFixed(0)} TL
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              {cashPercentage.toFixed(1)}% toplam
            </div>
          </div>

          {/* Credit Card Total */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg p-5 border-2 border-blue-500/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 p-2.5 rounded-lg shadow-lg shadow-blue-500/50">
                <CreditCard className="w-5 h-5 text-[#121212]" />
              </div>
              <span className="text-neutral-400 text-sm">Kredi Kartı</span>
            </div>
            <div className="font-bold text-3xl text-blue-400">
              {reportData.creditCardTotal.toFixed(0)} TL
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              {cardPercentage.toFixed(1)}% toplam
            </div>
          </div>

          {/* Total Waste/Loss */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-lg p-5 border-2 border-red-500/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-500 p-2.5 rounded-lg shadow-lg shadow-red-500/50">
                <AlertCircle className="w-5 h-5 text-[#121212]" />
              </div>
              <span className="text-neutral-400 text-sm">Zayi / Fire</span>
            </div>
            <div className="font-bold text-3xl text-red-500">
              {reportData.totalWaste.toFixed(0)} TL
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              {((reportData.totalWaste / reportData.totalRevenue) * 100).toFixed(2)}% zarar
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#121212] rounded-lg border-2 border-[#2C2C2C] overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#2C2C2C] bg-[#1E1E1E]">
            <h2 className="font-bold text-xl tracking-wide">SATILAN ÜRÜNLER</h2>
            <p className="text-neutral-500 text-xs mt-1">En çok satılandan aza doğru sıralanmış</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2C2C2C]">
                <tr>
                  <th className="text-left p-4 text-neutral-400 font-bold text-sm tracking-wide">SIRA</th>
                  <th className="text-left p-4 text-neutral-400 font-bold text-sm tracking-wide">ÜRÜN ADI</th>
                  <th className="text-left p-4 text-neutral-400 font-bold text-sm tracking-wide">KATEGORİ</th>
                  <th className="text-right p-4 text-neutral-400 font-bold text-sm tracking-wide">SATILAN ADET</th>
                  <th className="text-right p-4 text-neutral-400 font-bold text-sm tracking-wide">TOPLAM TUTAR</th>
                </tr>
              </thead>
              <tbody>
                {soldProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className={`border-t border-[#2C2C2C] transition-colors hover:bg-[#1E1E1E] ${
                      index % 2 === 0 ? 'bg-[#121212]' : 'bg-[#1A1A1A]'
                    }`}
                  >
                    <td className="p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg ${
                        index === 0 ? 'bg-[#FFC400] text-[#121212] shadow-[#FFC400]/50' :
                        index === 1 ? 'bg-neutral-400 text-[#121212] shadow-neutral-400/50' :
                        index === 2 ? 'bg-[#FF9100] text-[#121212] shadow-[#FF9100]/50' :
                        'bg-[#2C2C2C] text-neutral-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white">{product.name}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        product.category === 'Bira' ? 'bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/30' :
                        product.category === 'Kokteyl' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-[#FF9100]/20 text-[#FF9100] border border-[#FF9100]/30'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-[#00E676]">{product.quantitySold}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-white">{product.revenue.toFixed(0)} TL</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-5 border-t-2 border-[#2C2C2C] bg-[#1E1E1E]">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-bold">Toplam Satılan Ürün:</span>
              <span className="font-bold text-2xl text-[#00E676]">
                {soldProducts.reduce((sum, p) => sum + p.quantitySold, 0)} Adet
              </span>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-5 flex gap-3 justify-end">
          <button className="px-6 py-3 bg-[#2C2C2C] hover:bg-[#333333] text-white rounded-lg font-bold tracking-wide transition-colors shadow-lg">
            PDF Dışa Aktar
          </button>
          <button className="px-6 py-3 bg-[#00E676] hover:bg-[#00E676]/90 text-[#121212] rounded-lg font-bold tracking-wide transition-colors shadow-lg shadow-[#00E676]/40">
            Excel Dışa Aktar
          </button>
        </div>
      </div>
    </div>
  );
}
