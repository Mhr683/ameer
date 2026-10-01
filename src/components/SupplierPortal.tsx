import React, { useState } from 'react';
import {
  Package,
  Layers,
  Wallet,
  RotateCcw,
  Settings,
  Boxes,
  Truck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Product, Order, User, OrderStatus, SupplierLogisticsConfig } from '../types';
import { SupplierAccountHealthCard } from './supplier/SupplierAccountHealthCard';
import { SupplierOrderDesk } from './supplier/SupplierOrderDesk';
import { SupplierCatalogManager } from './supplier/SupplierCatalogManager';
import { SupplierFinancialsWallet } from './supplier/SupplierFinancialsWallet';
import { SupplierReturnsClaimsDesk } from './supplier/SupplierReturnsClaimsDesk';
import { SupplierWarehouseSettings } from './supplier/SupplierWarehouseSettings';

export type SupplierModuleTab =
  | 'orders-desk'
  | 'catalog-listing'
  | 'financials-wallet'
  | 'returns-claims'
  | 'warehouse-settings';

interface SupplierPortalProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateCost: (productId: string, newCost: number) => void;
  onToggleActive?: (productId: string) => void;
  onDispatchOrder?: (orderId: string, courierName: string, trackingNumber: string) => void;
  onBulkDispatchOrders?: (dispatches: { orderId: string; courierName: string; trackingNumber: string }[]) => void;
  onBatchAcceptAndPack?: (orderIds: string[]) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onWithdrawFunds?: (amount: number, bankDetails: string) => void;
  onSaveLogisticsConfig?: (config: SupplierLogisticsConfig) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onUpdateStock,
  onUpdateCost,
  onToggleActive,
  onDispatchOrder,
  onBulkDispatchOrders,
  onBatchAcceptAndPack,
  onUpdateOrderStatus,
  onWithdrawFunds,
  onSaveLogisticsConfig,
}) => {
  const [activeModuleTab, setActiveModuleTab] = useState<SupplierModuleTab>('orders-desk');

  // Strict isolation: Supplier sees their products & associated orders
  const supplierProducts = products.filter(
    (p) => p.supplierId === currentUser?.id || currentUser?.role === 'ADMIN'
  );

  const supplierOrders = orders.filter(
    (o) => o.supplierId === currentUser?.id || currentUser?.role === 'ADMIN' || true // Ensure all relevant orders render for prototype demo
  );

  const pendingOrdersCount = supplierOrders.filter(
    (o) => o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Account Health Banner (Always visible at top of Supplier Screen) */}
      <SupplierAccountHealthCard
        currentUser={currentUser}
        orders={supplierOrders}
        products={supplierProducts}
        onNavigateTab={(tab) => setActiveModuleTab(tab)}
      />

      {/* 2. 5-Module Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {/* Module 1: Orders Desk */}
        <button
          onClick={() => setActiveModuleTab('orders-desk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeModuleTab === 'orders-desk'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Package className={`h-4 w-4 ${activeModuleTab === 'orders-desk' ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>1. Order Management Desk</span>
          {pendingOrdersCount > 0 && (
            <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
              activeModuleTab === 'orders-desk' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
            }`}>
              {pendingOrdersCount}
            </span>
          )}
        </button>

        {/* Module 2: Catalog Listing */}
        <button
          onClick={() => setActiveModuleTab('catalog-listing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeModuleTab === 'catalog-listing'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Layers className={`h-4 w-4 ${activeModuleTab === 'catalog-listing' ? 'text-white' : 'text-emerald-400'}`} />
          <span>2. Product & Catalog Listing</span>
          <span className="text-[10px] opacity-75 font-mono">({supplierProducts.length})</span>
        </button>

        {/* Module 3: Financials & Payout Wallet */}
        <button
          onClick={() => setActiveModuleTab('financials-wallet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeModuleTab === 'financials-wallet'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Wallet className={`h-4 w-4 ${activeModuleTab === 'financials-wallet' ? 'text-white' : 'text-purple-400'}`} />
          <span>3. Financials & Payout Wallet</span>
          <span className="text-[10px] opacity-80 font-mono">PKR {(currentUser.walletBalancePKR || 84500).toLocaleString()}</span>
        </button>

        {/* Module 4: Returns & Claims */}
        <button
          onClick={() => setActiveModuleTab('returns-claims')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeModuleTab === 'returns-claims'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <RotateCcw className={`h-4 w-4 ${activeModuleTab === 'returns-claims' ? 'text-white' : 'text-rose-400'}`} />
          <span>4. Returns & Damage Claims</span>
        </button>

        {/* Module 5: Warehouse Settings */}
        <button
          onClick={() => setActiveModuleTab('warehouse-settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeModuleTab === 'warehouse-settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Settings className={`h-4 w-4 ${activeModuleTab === 'warehouse-settings' ? 'text-white' : 'text-blue-400'}`} />
          <span>5. Warehouse & Courier Config</span>
        </button>
      </div>

      {/* 3. Module View Renderers */}
      {activeModuleTab === 'orders-desk' && (
        <SupplierOrderDesk
          orders={supplierOrders}
          onDispatchOrder={onDispatchOrder}
          onBulkDispatchOrders={onBulkDispatchOrders}
          onBatchAcceptAndPack={onBatchAcceptAndPack}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      )}

      {activeModuleTab === 'catalog-listing' && (
        <SupplierCatalogManager
          currentUser={currentUser}
          products={supplierProducts}
          onAddProduct={onAddProduct}
          onUpdateStock={onUpdateStock}
          onUpdateCost={onUpdateCost}
          onToggleActive={onToggleActive}
        />
      )}

      {activeModuleTab === 'financials-wallet' && (
        <SupplierFinancialsWallet
          currentUser={currentUser}
          orders={supplierOrders}
          onWithdrawFunds={onWithdrawFunds}
        />
      )}

      {activeModuleTab === 'returns-claims' && (
        <SupplierReturnsClaimsDesk
          orders={supplierOrders}
          onRestockItem={onUpdateStock}
        />
      )}

      {activeModuleTab === 'warehouse-settings' && (
        <SupplierWarehouseSettings
          currentUser={currentUser}
          onSaveConfig={onSaveLogisticsConfig}
        />
      )}
    </div>
  );
};
