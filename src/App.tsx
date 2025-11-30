import { useState } from 'react';
import { DashboardScreen } from './components/DashboardScreen';
import { OrderEntryScreen } from './components/OrderEntryScreen';
import { ReportScreen } from './components/ReportScreen';
import { Menu, LayoutDashboard, FileText } from 'lucide-react';

type Screen = 'dashboard' | 'order' | 'report';

export interface Table {
  id: string;
  name: string;
  type: 'round' | 'square';
  occupied: boolean;
  position: { x: number; y: number };
  guests?: number;
  currentBill?: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: string;
  status: 'preparing' | 'served';
  time: string;
  timestamp: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([
    // Bar Area - Top Zone (Circular tables)
    { id: '1', name: 'M-1', type: 'round', occupied: true, position: { x: 50, y: 140 }, guests: 2, currentBill: 450 },
    { id: '2', name: 'M-2', type: 'round', occupied: false, position: { x: 190, y: 140 } },
    { id: '3', name: 'M-3', type: 'round', occupied: true, position: { x: 330, y: 140 }, guests: 3, currentBill: 780 },
    { id: '4', name: 'M-4', type: 'round', occupied: false, position: { x: 470, y: 140 } },
    
    // Lounge Area - Center Zone (Mix of tables)
    { id: '5', name: 'M-5', type: 'square', occupied: true, position: { x: 80, y: 280 }, guests: 4, currentBill: 1250 },
    { id: '6', name: 'M-6', type: 'square', occupied: false, position: { x: 260, y: 280 } },
    { id: '7', name: 'M-7', type: 'round', occupied: true, position: { x: 450, y: 280 }, guests: 2, currentBill: 320 },
    { id: '8', name: 'M-8', type: 'square', occupied: false, position: { x: 640, y: 280 } },
    
    { id: '9', name: 'M-9', type: 'round', occupied: true, position: { x: 80, y: 420 }, guests: 2, currentBill: 890 },
    { id: '10', name: 'M-10', type: 'square', occupied: true, position: { x: 260, y: 420 }, guests: 6, currentBill: 2100 },
    { id: '11', name: 'M-11', type: 'round', occupied: false, position: { x: 450, y: 420 } },
    { id: '12', name: 'M-12', type: 'square', occupied: false, position: { x: 640, y: 420 } },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', tableNumber: 5, items: '3x Bira', status: 'preparing', time: '21:45', timestamp: Date.now() - 60000 },
    { id: '2', tableNumber: 2, items: '1x Kokteyl', status: 'preparing', time: '21:42', timestamp: Date.now() - 240000 },
    { id: '3', tableNumber: 8, items: 'Çerez', status: 'served', time: '21:38', timestamp: Date.now() - 480000 },
    { id: '4', tableNumber: 1, items: '2x Bira, 1x Pizza', status: 'preparing', time: '21:40', timestamp: Date.now() - 360000 },
    { id: '5', tableNumber: 10, items: '4x Kokteyl', status: 'preparing', time: '21:41', timestamp: Date.now() - 300000 },
  ]);

  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentScreen('order');
  };

  const handleAddOrder = (tableNumber: number, items: string, totalAmount: number) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableNumber,
      items,
      status: 'preparing',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    setOrders([...orders, newOrder]);

    // Update table bill
    setTables(tables.map(t => 
      t.id === selectedTableId 
        ? { ...t, occupied: true, currentBill: (t.currentBill || 0) + totalAmount }
        : t
    ));
  };

  const handlePartialPayment = (tableId: string, paidAmount: number) => {
    setTables(tables.map(t => {
      if (t.id === tableId && t.currentBill) {
        const remaining = t.currentBill - paidAmount;
        return { ...t, currentBill: remaining > 0 ? remaining : 0 };
      }
      return t;
    }));
  };

  const handleFullPayment = (tableId: string) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, occupied: false, currentBill: 0, guests: undefined }
        : t
    ));
  };

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const tableNumber = selectedTable ? parseInt(selectedTable.name.split('-')[1]) : 1;

  return (
    <div className="h-screen w-screen bg-[#121212] text-white overflow-hidden flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-[#1E1E1E] border-b border-[#333333] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00E676] to-[#00C853] rounded-lg flex items-center justify-center">
            <span className="font-bold text-[#121212]">GP</span>
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide">GOA PUB POS</h1>
            <p className="text-xs text-neutral-400">Profesyonel Kasa Sistemi</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
              currentScreen === 'dashboard'
                ? 'bg-[#00E676] text-[#121212] font-bold shadow-lg shadow-[#00E676]/30'
                : 'bg-[#2C2C2C] text-neutral-300 hover:bg-[#333333]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('order')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
              currentScreen === 'order'
                ? 'bg-[#FF9100] text-[#121212] font-bold shadow-lg shadow-[#FF9100]/30'
                : 'bg-[#2C2C2C] text-neutral-300 hover:bg-[#333333]'
            }`}
          >
            <Menu className="w-4 h-4" />
            Sipariş
          </button>
          <button
            onClick={() => setCurrentScreen('report')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
              currentScreen === 'report'
                ? 'bg-[#00E676] text-[#121212] font-bold shadow-lg shadow-[#00E676]/30'
                : 'bg-[#2C2C2C] text-neutral-300 hover:bg-[#333333]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Raporlar
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {currentScreen === 'dashboard' && (
          <DashboardScreen 
            tables={tables}
            setTables={setTables}
            orders={orders}
            setOrders={setOrders}
            onTableClick={handleTableClick}
          />
        )}
        {currentScreen === 'order' && (
          <OrderEntryScreen 
            tableNumber={tableNumber}
            tableId={selectedTableId || '1'}
            currentBill={selectedTable?.currentBill || 0}
            onAddOrder={handleAddOrder}
            onPartialPayment={handlePartialPayment}
            onFullPayment={handleFullPayment}
          />
        )}
        {currentScreen === 'report' && <ReportScreen />}
      </main>
    </div>
  );
}