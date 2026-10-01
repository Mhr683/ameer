import React from 'react';
import {
  Menu,
  ShieldCheck,
  Wallet,
  Package,
  Store,
  Sliders,
  RefreshCw,
  Bell,
  CheckCircle2,
  Lock,
  Shield,
  Headphones,
  Calculator,
  Building2,
  UserPlus,
  Settings,
  Sparkles,
  Layers,
  UserCheck,
  ShoppingBag,
  LayoutDashboard,
} from 'lucide-react';
import { User, UserRole, ProfitGuardConfig, StoreIntegration } from '../types';
import { PromotionalAdsBanner, PromotionAd } from './PromotionalAdsBanner';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  profitGuardConfig: ProfitGuardConfig;
  onOpenProfitGuardModal: () => void;
  onOpenStoreSyncModal: () => void;
  onOpenWalletModal: () => void;
  onOpenHelplinesModal: () => void;
  onOpenProfileSettings?: () => void;
  onOpenPoliciesModal?: () => void;
  stores: StoreIntegration[];
  pendingOrdersCount: number;
  isAdminAuthenticated: boolean;
  onOpenAdminAuth: () => void;
  onLockAdmin: () => void;
  onOpenVerifiedRegistration?: () => void;
  onOpenProductListing?: () => void;
  onOpenBulkImport?: () => void;
  onOpenFunctionsDrawer?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeTab,
  onSelectTab,
  profitGuardConfig,
  onOpenProfitGuardModal,
  onOpenStoreSyncModal,
  onOpenWalletModal,
  onOpenHelplinesModal,
  onOpenProfileSettings,
  onOpenPoliciesModal,
  stores,
  pendingOrdersCount,
  isAdminAuthenticated,
  onOpenAdminAuth,
  onLockAdmin,
  onOpenVerifiedRegistration,
  onOpenProductListing,
  onOpenBulkImport,
  onOpenFunctionsDrawer,
  cartCount = 0,
  onOpenCart,
}) => {
  const connectedStoresCount = stores.filter((s) => s.connected).length;

  // Filter regular personas (Exclude admin from casual click list)
  const regularUsers = (allUsers || []).filter((u) => u && u.role && u.role !== 'ADMIN');

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SUPPLIER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'RESELLER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'CUSTOMER':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'GUEST':
        return 'bg-slate-700 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  // Handle CTA clicks from the top swiping ads banner
  const handlePromotionAction = (actionType: PromotionAd['actionType']) => {
    switch (actionType) {
      case 'policies':
        onOpenPoliciesModal?.();
        break;
      case 'catalog':
        onSelectTab('catalog');
        break;
      case 'profit-guard':
        onOpenProfitGuardModal();
        break;
      case 'stores':
        onSelectTab('stores-directory');
        break;
      case 'wallet':
        onOpenWalletModal();
        break;
      case 'register':
        onOpenVerifiedRegistration?.();
        break;
    }
  };

  const isGuest = !currentUser || currentUser.role === 'GUEST' || currentUser.isRegistered === false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* 1. TOP BAR: Continuous Swiping Promotional Ads Ticker */}
      <PromotionalAdsBanner onActionClick={handlePromotionAction} />

      {/* 2. MAIN NAV BAR */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Left: Brand Logo & The 3-Line Dashboard Menu Button */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-md shadow-emerald-950/60">
              <span className="text-base font-black tracking-tight font-mono">YM</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  YourMart<span className="text-emerald-400">Global</span>
                </span>
                <span className="rounded bg-emerald-950 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-800/60 hidden sm:inline">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Wholesale, Reseller & COD Payout Engine</p>
            </div>
          </div>

          {/* =========================================================================
              THREE-LINE DASHBOARD & FUNCTIONS BUTTON (Requested by user)
              Consolidates all tools, settings, AI dispatch, policies, calculators, etc.
             ========================================================================= */}
          {onOpenFunctionsDrawer && (
            <button
              onClick={onOpenFunctionsDrawer}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white px-3 sm:px-3.5 py-2 font-bold text-xs shadow-md shadow-emerald-950/50 border border-emerald-400/40 hover:scale-[1.02] transition-all cursor-pointer group"
              title="Click to open Dashboard with all tools and functions"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20 text-white group-hover:rotate-90 transition-transform duration-300">
                <Menu className="h-3.5 w-3.5" />
              </div>
              <span className="font-extrabold tracking-wide">Dashboard & Functions</span>
              <span className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.2 text-[9px] font-black uppercase text-emerald-100">
                All Tools
              </span>
            </button>
          )}
        </div>

        {/* Right Side: Account, Verification Status, Wallet, & Gateway */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Guest Visitor Notice or Registered Profile Pill */}
          {isGuest ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Guest Visitor (Free Browsing)</span>
              </span>

              {onOpenVerifiedRegistration && (
                <button
                  onClick={onOpenVerifiedRegistration}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition shadow"
                  title="Register account to place orders"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register to Order</span>
                </button>
              )}
            </div>
          ) : (
            /* Registered User Profile & Settings Button */
            onOpenProfileSettings && (
              <button
                onClick={onOpenProfileSettings}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-800/90 px-2.5 sm:px-3 py-1.5 transition text-left cursor-pointer group shadow-sm"
                title="Open Profile & Account Settings (Logo, CNIC, Bank Account, NTN)"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar || currentUser.logo}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-emerald-500/50 group-hover:ring-emerald-400"
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 text-slate-950">
                    <Settings className="h-2 w-2" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-[9px] uppercase font-bold text-slate-400 leading-tight">
                    {currentUser?.role === 'SUPPLIER'
                      ? 'Factory Profile'
                      : currentUser?.role === 'RESELLER'
                      ? 'Reseller Store'
                      : 'Registered User'}
                  </div>
                  <div className="text-xs font-black text-white leading-tight flex items-center gap-1">
                    <span className="max-w-[85px] truncate">{(currentUser?.name || 'User').split(' ')[0]}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold">(Settings)</span>
                  </div>
                </div>
              </button>
            )
          )}

          {/* Quick Wallet Balance for Registered Partners */}
          {!isGuest && currentUser?.role !== 'CUSTOMER' && (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-2.5 sm:px-3 py-1.5 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 cursor-pointer"
              title="Click to view Payout Wallet"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Wallet</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  PKR {currentUser.walletBalancePKR.toLocaleString()}
                </div>
              </div>
            </button>
          )}

          {/* Consolidated Cart (Single Store Parcel & Weight Calculation) */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:border-emerald-500/50 hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 transition text-xs font-bold text-slate-200 cursor-pointer"
              title="Open Consolidated Cart (Single Store, Weight Delivery)"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Helplines Quick Access */}
          <button
            onClick={onOpenHelplinesModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:border-emerald-500/40 px-2.5 py-1.5 transition text-xs font-bold text-emerald-400"
            title="Helplines for Buyers, Resellers & Manufacturers"
          >
            <Headphones className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Helplines</span>
          </button>

          {/* Admin HQ Gateway */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-950/40 p-1">
              <button
                onClick={() => onSelectTab('admin-hq')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition shadow ${
                  activeTab === 'admin-hq'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-purple-900/40'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-purple-300" />
                <span>Admin HQ</span>
              </button>
              <button
                onClick={onLockAdmin}
                className="rounded-lg bg-purple-900/60 hover:bg-rose-600 hover:text-white p-1 text-purple-300 transition"
                title="Lock Admin Session"
              >
                <Lock className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="p-1.5 text-slate-600 hover:text-slate-400 transition rounded-lg"
              title="System Gateway"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. NAVIGATION TABS (Primary workflow views only, no clutter) */}
      <div className="border-t border-slate-800 bg-slate-900/60 px-3 sm:px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto py-2 scrollbar-none gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dashboard Front Page (Matching User Screenshot Look) */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dashboard (Front Page)</span>
            </button>

            {/* Products Catalog */}
            <button
              onClick={() => onSelectTab('catalog')}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'catalog'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Products</span>
            </button>

            {/* Stores Directory */}
            <button
              onClick={() => onSelectTab('stores-directory')}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'stores-directory'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Stores Directory (Multi-Order Cart)</span>
            </button>

            {/* Daraz Calculator */}
            <button
              onClick={() => onSelectTab('daraz-calculator')}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'daraz-calculator'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-orange-400/90 hover:bg-orange-950/40 hover:text-orange-300'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Daraz Fee & Tax Calculator</span>
            </button>

            {/* Orders & Verification */}
            <button
              onClick={() => onSelectTab('orders')}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Orders & Verification</span>
              {pendingOrdersCount > 0 && (
                <span className="rounded-full bg-amber-500/30 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/50">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Side: Quick Launcher for Drawer with 3-line icon */}
          {onOpenFunctionsDrawer && (
            <button
              onClick={onOpenFunctionsDrawer}
              className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 text-xs font-bold whitespace-nowrap border border-slate-700 transition"
              title="Open all tools & functions"
            >
              <Menu className="h-3.5 w-3.5 text-emerald-400" />
              <span>More Tools & Configs</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

