import { useState } from 'react';
import { Users } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  type: 'round' | 'square';
  occupied: boolean;
  position: { x: number; y: number };
  guests?: number;
  currentBill?: number;
}

interface Order {
  id: string;
  tableNumber: number;
  items: string;
  status: 'preparing' | 'served';
  time: string;
  timestamp: number;
}

interface DashboardScreenProps {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  onTableClick: (tableId: string) => void;
}

export function DashboardScreen({ tables, setTables, orders, setOrders, onTableClick }: DashboardScreenProps) {
  const [draggedTable, setDraggedTable] = useState<string | null>(null);

  const handleDragStart = (tableId: string) => {
    setDraggedTable(tableId);
  };

  const handleDragEnd = (e: React.DragEvent, tableId: string) => {
    if (draggedTable) {
      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (rect) {
        const tableSize = 100; // Standardized size
        const padding = 20;
        
        let x = e.clientX - rect.left - tableSize / 2;
        let y = e.clientY - rect.top - tableSize / 2;
        
        // Keep tables within bounds
        x = Math.max(padding, Math.min(x, rect.width - tableSize - padding));
        y = Math.max(padding, Math.min(y, rect.height - tableSize - padding));
        
        setTables(tables.map(t => 
          t.id === tableId ? { ...t, position: { x, y } } : t
        ));
      }
    }
    setDraggedTable(null);
  };

  const handleTableClick = (tableId: string, e: React.MouseEvent) => {
    // Sadece sağ tıklama ile durum değişimi
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      setTables(tables.map(t => 
        t.id === tableId ? { ...t, occupied: !t.occupied } : t
      ));
    } else {
      // Sol tıklama ile sipariş ekranına git
      onTableClick(tableId);
    }
  };

  const toggleOrderStatus = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: o.status === 'preparing' ? 'served' : 'preparing' }
        : o
    ));
  };

  const occupiedCount = tables.filter(t => t.occupied).length;
  const emptyCount = tables.filter(t => !t.occupied).length;
  
  // Sort orders: preparing first (by timestamp desc), then served
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === b.status) {
      return b.timestamp - a.timestamp; // Newest first
    }
    return a.status === 'preparing' ? -1 : 1;
  });

  return (
    <div className="h-full flex gap-6 p-6 bg-[#121212]">
      {/* Floor Plan Area - 75% */}
      <div className="w-3/4 bg-[#1E1E1E] rounded-xl p-6 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl tracking-wide text-white">SALON HARİTASI</h2>
            <p className="text-sm text-neutral-500 mt-1">Masaları sürükleyerek düzenleyin</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#121212] px-5 py-3 rounded-lg border-2 border-[#00E676]/40">
              <span className="text-neutral-400 text-sm">Boş: </span>
              <span className="text-[#00E676] font-bold text-lg">{emptyCount}</span>
            </div>
            <div className="bg-[#121212] px-5 py-3 rounded-lg border-2 border-[#FF1744]/40">
              <span className="text-neutral-400 text-sm">Dolu: </span>
              <span className="text-[#FF1744] font-bold text-lg">{occupiedCount}</span>
            </div>
          </div>
        </div>

        {/* Floor Map */}
        <div className="relative bg-[#121212] rounded-xl flex-1 overflow-hidden" style={{
          backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
          {/* Zone Labels */}
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-0">
            <div className="bg-[#1E1E1E]/90 px-4 py-2 rounded-lg border border-[#00E676]/30">
              <span className="text-[#00E676] font-bold text-xs tracking-widest">BAR AREA</span>
            </div>
            <div className="bg-[#1E1E1E]/90 px-4 py-2 rounded-lg border border-[#FFD600]/30">
              <span className="text-[#FFD600] font-bold text-xs tracking-widest">LOUNGE</span>
            </div>
            <div className="bg-[#1E1E1E]/90 px-4 py-2 rounded-lg border border-[#FF9100]/30">
              <span className="text-[#FF9100] font-bold text-xs tracking-widest">ENTRANCE</span>
            </div>
          </div>

          {/* Bar Counter - Top */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-80 h-16 bg-[#2C2C2C] border-2 border-[#00E676] rounded-lg flex items-center justify-center pointer-events-none">
            <span className="text-[#00E676] font-bold tracking-wider">🍸 BAR COUNTER 🍺</span>
          </div>

          {/* Entrance Door - Bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-12 bg-[#2C2C2C] border-2 border-[#FFD600] rounded-lg flex items-center justify-center pointer-events-none">
            <span className="text-[#FFD600] font-bold text-sm">🚪 GİRİŞ</span>
          </div>

          {/* Tables */}
          {tables.map((table) => (
            <div
              key={table.id}
              draggable
              onDragStart={() => handleDragStart(table.id)}
              onDragEnd={(e) => handleDragEnd(e, table.id)}
              onClick={(e) => handleTableClick(table.id, e)}
              onContextMenu={(e) => {
                e.preventDefault();
                setTables(tables.map(t => 
                  t.id === table.id ? { ...t, occupied: !t.occupied } : t
                ));
              }}
              style={{
                left: `${table.position.x}px`,
                top: `${table.position.y}px`,
                width: '100px',
                height: '100px'
              }}
              className={`absolute cursor-move z-10 ${
                table.type === 'round' ? 'rounded-full' : 'rounded-xl'
              } ${
                table.occupied
                  ? 'bg-[#1E1E1E] border-[3px] border-[#FF1744] shadow-[0_0_25px_rgba(255,23,68,0.5)]'
                  : 'bg-[#1E1E1E] border-[3px] border-[#00E676] shadow-[0_0_25px_rgba(0,230,118,0.4)]'
              } flex flex-col items-center justify-center transition-all hover:scale-105 select-none`}
            >
              <span className="font-bold text-white tracking-wider text-lg">{table.name}</span>
              {table.occupied && table.currentBill ? (
                <span className="text-[#FFD600] font-bold text-sm mt-1">₺{table.currentBill}</span>
              ) : (
                <span className="text-neutral-500 text-xs mt-1">Boş</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Feed Sidebar - 25% */}
      <div className="w-1/4 bg-[#1E1E1E] rounded-xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#2C2C2C]">
          <h2 className="font-bold text-xl tracking-widest text-white">SİPARİŞ AKIŞI</h2>
          <p className="text-xs text-neutral-500 mt-1">Bekleyen Siparişler</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedOrders.map((order, index) => {
            const isCompleted = order.status === 'served';
            const isNewest = index === 0 && !isCompleted;
            
            return (
              <div
                key={order.id}
                className={`bg-[#2C2C2C] rounded-lg p-4 border transition-all ${
                  isCompleted 
                    ? 'opacity-50 border-[#00E676]/20' 
                    : isNewest
                    ? 'border-[#FFD600] shadow-lg shadow-[#FFD600]/20'
                    : 'border-[#333333]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">Masa {order.tableNumber}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{order.time}</p>
                  </div>
                  <button
                    onClick={() => toggleOrderStatus(order.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all ${
                      order.status === 'preparing'
                        ? 'bg-[#FFD600] text-[#121212] hover:bg-[#FFD600]/90 shadow-lg shadow-[#FFD600]/30'
                        : 'bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 shadow-lg shadow-[#00E676]/30'
                    }`}
                  >
                    {order.status === 'preparing' ? 'HAZIRLANIYOR' : 'GÖNDERİLDİ'}
                  </button>
                </div>
                <p className="text-sm text-neutral-300 font-medium">{order.items}</p>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-[#2C2C2C] bg-[#121212]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Aktif Siparişler:</span>
            <span className="text-[#FFD600] font-bold">
              {orders.filter(o => o.status === 'preparing').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
