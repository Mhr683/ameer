import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Store,
  Building2,
  Calculator,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  Headphones,
  Lock,
  Shield,
  ShieldCheck,
  Link,
  Plus,
  FileSpreadsheet,
  FileText,
  Crown,
  Menu,
  X,
  ChevronRight,
  Flame,
  ShieldBan,
  FileCheck2,
  Boxes,
  Truck,
  RotateCcw,
  Tag,
  LifeBuoy,
  Camera,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

interface YourMartSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingOrdersCount?: number;
  cartCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser: User;
  isAdminAuthenticated?: boolean;
  onOpenUpgradeModal: () => void;
  onOpenStoreSyncModal: () => void;
  onOpenWalletModal: () => void;
  onOpenCart: () => void;
  onOpenHelplinesModal: () => void;
  onOpenAdminAuth?: () => void;
  onLockAdmin?: () => void;
  onOpenProfitGuardModal?: () => void;
  onOpenProductListing?: () => void;
  onOpenBulkImport?: () => void;
  onOpenPoliciesModal?: () => void;
  onOpenBatchPrinter?: () => void;
  onOpenWhiteLabelModal?: () => void;
  onOpenShopifySyncModal?: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenResellerTiers?: () => void;
  onOpenAiAssetStudio?: () => void;
}

export const YourMartSidebar: React.FC<YourMartSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount = 7,
  cartCount = 1,
  isOpenMobile = false,
  onCloseMobile,
  currentUser,
  isAdminAuthenticated = false,
  onOpenUpgradeModal,
  onOpenStoreSyncModal,
  onOpenWalletModal,
  onOpenCart,
  onOpenHelplinesModal,
  onOpenAdminAuth,
  onLockAdmin,
  onOpenProfitGuardModal,
  onOpenProductListing,
  onOpenBulkImport,
  onOpenPoliciesModal,
  onOpenBatchPrinter,
  onOpenWhiteLabelModal,
  onOpenShopifySyncModal,
  onOpenBarcodeScanner,
  onOpenResellerTiers,
  onOpenAiAssetStudio,
}) => {
  const handleAction = (callback: () => void) => {
    callback();
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#080D1A] text-slate-200 border-r border-slate-800/90 w-64 select-none">
      {/* Scrollable Main Section with all tools flattened into clean categories */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* 1. BRAND LOGO & BADGE (Enterprise Wholesale & B2B) */}
        <div className="flex items-center justify-between pb-1">
          <div
            onClick={() => handleAction(() => onSelectTab('dashboard'))}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-900/30 group-hover:scale-105 transition">
              YM
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Yourmart</span>
                <span className="text-emerald-400">Global</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block rounded bg-emerald-950/90 border border-emerald-500/40 px-1.5 py-0.2 text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                  ENTERPRISE
                </span>
                <span className="text-[9px] text-slate-400 font-medium truncate max-w-[80px]">
                  Wholesale & B2B
                </span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          {isOpenMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ================= CATEGORY 1: MAIN PORTALS ================= */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-2 pb-1">
            Main Portals
          </div>

          {/* Dashboard (Front Page) */}
          <button
            onClick={() => handleAction(() => onSelectTab('dashboard'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`h-4 w-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-emerald-400'}`} />
              <span>Dashboard (Overview)</span>
            </div>
          </button>

          {/* Products Catalog */}
          <button
            onClick={() => handleAction(() => onSelectTab('catalog'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Package className={`h-4 w-4 shrink-0 ${activeTab === 'catalog' ? 'text-white' : 'text-emerald-400'}`} />
              <span className="truncate">Products</span>
            </div>
          </button>

          {/* Winning Products & Ads */}
          <button
            onClick={() => handleAction(() => onSelectTab('winning-products'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'winning-products'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/30'
                : 'text-violet-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Flame className={`h-4 w-4 shrink-0 ${activeTab === 'winning-products' ? 'text-white' : 'text-amber-400'}`} />
              <span className="truncate">Winning Products & Ads</span>
            </div>
            <span className="shrink-0 rounded bg-amber-400 text-[9px] font-black text-slate-950 px-1.5 py-0.5">
              HOT
            </span>
          </button>

          {/* Orders & Verification */}
          <button
            onClick={() => handleAction(() => onSelectTab('orders'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <RefreshCw className={`h-4 w-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-emerald-400'}`} />
              <span className="truncate">Orders & Dispatch</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Supplier Hub & Operations */}
          <button
            onClick={() => handleAction(() => onSelectTab('supplier-hub'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'supplier-hub'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/30'
                : 'text-amber-400 hover:bg-slate-800/80 hover:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Boxes className={`h-4 w-4 shrink-0 ${activeTab === 'supplier-hub' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="truncate">Supplier Hub (Warehouse)</span>
            </div>
            <span className="shrink-0 rounded bg-amber-400/20 border border-amber-400/30 text-[9px] font-black text-amber-300 px-1.5 py-0.5">
              5 Modules
            </span>
          </button>

          {/* Reseller Profit Payouts Desk */}
          <button
            onClick={() => handleAction(() => onSelectTab('payouts'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'payouts'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                : 'text-emerald-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Wallet className={`h-4 w-4 shrink-0 ${activeTab === 'payouts' ? 'text-white' : 'text-emerald-400'}`} />
              <span className="truncate">Profit Payouts (JazzCash/Raast)</span>
            </div>
            <span className="shrink-0 rounded bg-emerald-500/20 text-[9px] font-black text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5">
              PKR
            </span>
          </button>

          {/* Public Parcel Tracking */}
          <button
            onClick={() => handleAction(() => onSelectTab('public-tracking'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'public-tracking'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/30'
                : 'text-indigo-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Truck className={`h-4 w-4 shrink-0 ${activeTab === 'public-tracking' ? 'text-white' : 'text-indigo-400'}`} />
              <span className="truncate">Live Parcel Tracking</span>
            </div>
            <span className="shrink-0 rounded bg-indigo-500/20 text-[9px] font-black text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5">
              Live
            </span>
          </button>
        </div>

        {/* ================= CATEGORY 2: RISK & LOGISTICS ================= */}
        <div className="space-y-1 pt-2 border-t border-slate-800/70">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-2 pb-1">
            Logistics & Risk Engine
          </div>

          {/* RTO & Reverse Logistics Desk */}
          <button
            onClick={() => handleAction(() => onSelectTab('reverse-logistics'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'reverse-logistics'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/30'
                : 'text-rose-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <RotateCcw className={`h-4 w-4 shrink-0 ${activeTab === 'reverse-logistics' ? 'text-white' : 'text-rose-400'}`} />
              <span className="truncate">RTO & Reverse Claims</span>
            </div>
            <span className="shrink-0 rounded bg-rose-500/20 text-[9px] font-bold text-rose-300 border border-rose-500/30 px-1.5 py-0.5">
              RTO
            </span>
          </button>

          {/* RTO Fraud Blacklist */}
          <button
            onClick={() => handleAction(() => onSelectTab('fraud-blacklist'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'fraud-blacklist'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/30'
                : 'text-rose-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldBan className={`h-4 w-4 shrink-0 ${activeTab === 'fraud-blacklist' ? 'text-white' : 'text-rose-400'}`} />
              <span className="truncate">RTO Fraud Blacklist</span>
            </div>
            <span className="shrink-0 rounded bg-rose-500/20 text-[9px] font-bold text-rose-300 border border-rose-500/30 px-1.5 py-0.5">
              Shield
            </span>
          </button>

          {/* Courier Settlement Reconciliation */}
          <button
            onClick={() => handleAction(() => onSelectTab('courier-reconciliation'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'courier-reconciliation'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/30'
                : 'text-teal-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCheck2 className={`h-4 w-4 shrink-0 ${activeTab === 'courier-reconciliation' ? 'text-white' : 'text-teal-400'}`} />
              <span className="truncate">Courier Reconciliation CSV</span>
            </div>
          </button>

          {/* Batch 4x6 Label Printer */}
          {onOpenBatchPrinter && (
            <button
              onClick={() => handleAction(onOpenBatchPrinter)}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="truncate">Batch 4x6 Label Printer</span>
            </button>
          )}

          {/* Barcode Camera Scanner */}
          {onOpenBarcodeScanner && (
            <button
              onClick={() => handleAction(onOpenBarcodeScanner)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Camera className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="truncate">Camera Barcode Scanner</span>
              </div>
              <span className="shrink-0 rounded bg-cyan-400/20 border border-cyan-400/30 text-[9px] font-bold text-cyan-300 px-1.5 py-0.5">
                Scan
              </span>
            </button>
          )}

          {/* Abandoned Cart Recovery Bot */}
          <button
            onClick={() => handleAction(() => onSelectTab('abandoned-carts'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'abandoned-carts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/30'
                : 'text-indigo-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ShoppingCart className={`h-4 w-4 shrink-0 ${activeTab === 'abandoned-carts' ? 'text-white' : 'text-indigo-400'}`} />
              <span className="truncate">Cart Recovery Bot</span>
            </div>
            <span className="shrink-0 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5">
              WhatsApp
            </span>
          </button>

          {/* Support Tickets & Disputes */}
          <button
            onClick={() => handleAction(() => onSelectTab('support-tickets'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'support-tickets'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/30'
                : 'text-sky-300/90 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LifeBuoy className={`h-4 w-4 shrink-0 ${activeTab === 'support-tickets' ? 'text-white' : 'text-sky-400'}`} />
              <span className="truncate">Support Desk & Disputes</span>
            </div>
            <span className="shrink-0 rounded bg-sky-500/20 text-[9px] font-bold text-sky-300 border border-sky-500/30 px-1.5 py-0.5">
              Help
            </span>
          </button>
        </div>

        {/* ================= CATEGORY 3: CATALOG & STORE TOOLS ================= */}
        <div className="space-y-1 pt-2 border-t border-slate-800/70">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-2 pb-1">
            Catalog & Store Tools
          </div>

          {/* White-Label Flyer Branding Modal Trigger */}
          {onOpenWhiteLabelModal && (
            <button
              onClick={() => handleAction(onOpenWhiteLabelModal)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-teal-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Tag className="h-4 w-4 text-teal-400 shrink-0" />
                <span className="truncate">White-Label Flyer Invoices</span>
              </div>
              <span className="shrink-0 rounded bg-teal-400/20 border border-teal-400/30 text-[9px] font-bold text-teal-300 px-1.5 py-0.5">
                Brand
              </span>
            </button>
          )}

          {/* Shopify 1-Click Sync Trigger */}
          {onOpenShopifySyncModal && (
            <button
              onClick={() => handleAction(onOpenShopifySyncModal)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShoppingBag className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">Shopify 1-Click Auto-Sync</span>
              </div>
              <span className="shrink-0 rounded bg-emerald-400/20 border border-emerald-400/30 text-[9px] font-bold text-emerald-300 px-1.5 py-0.5">
                Auto
              </span>
            </button>
          )}

          {/* AI Product Asset Studio Trigger */}
          {onOpenAiAssetStudio && (
            <button
              onClick={() => handleAction(onOpenAiAssetStudio)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-violet-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="truncate">AI Photo & Video Studio</span>
              </div>
              <span className="shrink-0 rounded bg-violet-400/20 border border-violet-400/30 text-[9px] font-black text-violet-300 px-1.5 py-0.5">
                AI Ads
              </span>
            </button>
          )}

          {/* Daraz Fee & Tax Calculator */}
          <button
            onClick={() => handleAction(() => onSelectTab('daraz-calculator'))}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
              activeTab === 'daraz-calculator'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/30'
                : 'text-orange-300/90 hover:bg-slate-800/80 hover:text-orange-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calculator className={`h-4 w-4 shrink-0 ${activeTab === 'daraz-calculator' ? 'text-white' : 'text-orange-400'}`} />
              <span className="truncate">Daraz Fee & Tax Calculator</span>
            </div>
          </button>

          {/* Profit Guard Engine */}
          {onOpenProfitGuardModal && (
            <button
              onClick={() => handleAction(onOpenProfitGuardModal)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">Platform Fee & Profit Guard</span>
              </div>
              <span className="shrink-0 rounded bg-emerald-400/20 border border-emerald-400/30 text-[9px] font-black text-emerald-300 px-1.5 py-0.5">
                Fee %
              </span>
            </button>
          )}

          {/* Store Sync & Shopify Integration */}
          <button
            onClick={() => handleAction(onOpenStoreSyncModal)}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition text-left"
          >
            <Link className="h-4 w-4 text-orange-400 shrink-0" />
            <span className="truncate">Connect Stores & Shopify</span>
          </button>

          {/* Supplier Inventory Listing Tools (Only visible to Manufacturers, Wholesalers & Admins) */}
          {(currentUser?.role === 'SUPPLIER' || currentUser?.role === 'ADMIN') && (
            <>
              {onOpenProductListing && (
                <button
                  onClick={() => handleAction(onOpenProductListing)}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-slate-800/80 hover:text-white transition text-left"
                >
                  <Plus className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">+ List Wholesale Product</span>
                </button>
              )}

              {onOpenBulkImport && (
                <button
                  onClick={() => handleAction(onOpenBulkImport)}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-purple-300 hover:bg-slate-800/80 hover:text-white transition text-left"
                >
                  <FileSpreadsheet className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="truncate">Bulk Excel / CSV Import</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* ================= CATEGORY 4: FINANCE & SUPPORT ================= */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/70">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-2 pb-0.5">
            Finance & Services
          </div>

          {/* Wallet Balance Widget */}
          <button
            onClick={() => handleAction(onOpenWalletModal)}
            className="w-full flex items-center justify-between rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 p-2.5 text-xs font-semibold text-slate-200 transition group cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0 leading-tight">
                <div className="text-[10px] text-slate-400 font-medium">Wallet & Payouts</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  PKR {currentUser.walletBalancePKR ? currentUser.walletBalancePKR.toLocaleString() : '84,500'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              View
            </span>
          </button>

          {/* Cart with count */}
          <button
            onClick={() => handleAction(onOpenCart)}
            className="w-full flex items-center justify-between rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 p-2.5 text-xs font-semibold text-slate-200 transition group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-white">Consolidated Cart</div>
                <div className="text-[10px] text-slate-400">Single Delivery Parcel</div>
              </div>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
              {cartCount > 0 ? cartCount : 1}
            </span>
          </button>

          {/* Helplines Quick Access */}
          <button
            onClick={() => handleAction(onOpenHelplinesModal)}
            className="w-full flex items-center justify-between rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 p-2.5 text-xs font-semibold text-slate-200 transition group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Headphones className="h-4 w-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-white">Helplines & Support</div>
                <div className="text-[10px] text-slate-400">Live Supplier/Buyer Help</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">24/7</span>
          </button>

          {/* Platform Policies */}
          {onOpenPoliciesModal && (
            <button
              onClick={() => handleAction(onOpenPoliciesModal)}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition text-left"
            >
              <FileText className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="truncate">Platform Policies & SOPs</span>
            </button>
          )}

          {/* Admin Gateway Access */}
          {isAdminAuthenticated ? (
            <div className="flex items-center justify-between rounded-xl border border-purple-500/50 bg-purple-950/40 p-2">
              <button
                onClick={() => handleAction(() => onSelectTab('admin-hq'))}
                className="flex items-center gap-2 text-xs font-bold text-purple-200"
              >
                <Shield className="h-4 w-4 text-purple-400" />
                <span>Admin HQ Control</span>
              </button>
              {onLockAdmin && (
                <button
                  onClick={onLockAdmin}
                  className="rounded bg-purple-900/80 hover:bg-rose-600 p-1 text-purple-200 text-xs transition"
                  title="Lock Admin"
                >
                  <Lock className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            onOpenAdminAuth && (
              <button
                onClick={() => handleAction(onOpenAdminAuth)}
                className="w-full flex items-center justify-between rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 p-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Admin Gateway Access</span>
                </div>
                <span className="text-[10px] text-slate-500">Locked</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Bottom Upgrade Your Plan Card (Exact match with screenshot) */}
      <div className="p-3 border-t border-slate-800/90 bg-[#060913]">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 p-3 border border-slate-800/90 shadow-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Upgrade Your Plan</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Get premium access to all downloads & features.
          </p>
          <button
            onClick={() => handleAction(onOpenUpgradeModal)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 shadow-md shadow-emerald-950/30 transition cursor-pointer"
          >
            <span>Upgrade Now</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed on left) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Slide-over drawer) */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-[#080D1A] z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
