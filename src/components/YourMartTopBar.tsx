import React from 'react';
import {
  Flame,
  Wallet,
  ShoppingBag,
  Menu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Camera,
  Trophy,
  Globe
} from 'lucide-react';
import { User } from '../types';
import { AppLanguage } from '../context/LanguageContext';

interface YourMartTopBarProps {
  currentUser: User;
  cartCount: number;
  language?: AppLanguage;
  onToggleLanguage?: (lang: AppLanguage) => void;
  onOpenCart: () => void;
  onOpenWallet: () => void;
  onOpenPlanDetails: () => void;
  onOpenProfile: () => void;
  onToggleMobileSidebar: () => void;
  onExploreSourcing: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenResellerTiers?: () => void;
}

export const YourMartTopBar: React.FC<YourMartTopBarProps> = ({
  currentUser,
  cartCount,
  language = 'en',
  onToggleLanguage,
  onOpenCart,
  onOpenWallet,
  onOpenPlanDetails,
  onOpenProfile,
  onToggleMobileSidebar,
  onExploreSourcing,
  onOpenBarcodeScanner,
  onOpenResellerTiers,
}) => {
  return (
    <header className="bg-black text-white px-4 sm:px-6 py-2.5 border-b border-slate-900 select-none">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Mobile Toggle + Hot Wholesale Deals Banner */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Deal Ticker */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Orange Hot Deals Pill */}
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-400">
              <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>HOT WHOLESALE DEALS</span>
            </span>

            <span className="text-slate-300 font-medium truncate">
              Kitchen & Living Fast Moving —{' '}
              <span className="text-emerald-400 font-bold">Up to 60% Margin</span>
            </span>

            <button
              onClick={onExploreSourcing}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 hover:underline text-xs ml-1 transition"
            >
              <span>Explore Deals</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* Language Switcher Button */}
          {onToggleLanguage && (
            <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('roman-urdu')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'roman-urdu' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Roman Urdu"
              >
                Roman
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('ur')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'ur' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="اردو Nastaliq"
              >
                اردو
              </button>
            </div>
          )}

          {/* Barcode Scanner Camera button */}
          {onOpenBarcodeScanner && (
            <button
              type="button"
              onClick={onOpenBarcodeScanner}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 px-2.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Open Mobile Camera Barcode Scanner"
            >
              <Camera className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Scan Barcode</span>
            </button>
          )}

          {/* Reseller Tier Club Badge */}
          {onOpenResellerTiers && (
            <button
              type="button"
              onClick={onOpenResellerTiers}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 text-xs font-bold transition hover:border-amber-400 cursor-pointer"
              title="Reseller Tier Bonuses"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Silver Club (Rs. 500 Bonus)</span>
            </button>
          )}

          {/* Pill 2: My Wallet | PKR 98,540 */}
          <div
            onClick={onOpenWallet}
            className="flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-1.5 shadow-xs hover:bg-slate-100 transition cursor-pointer"
            title="Open Wallet & Payouts"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-emerald-600">
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="text-[10px] font-medium text-slate-500">My Wallet</div>
              <div className="font-bold text-slate-900 font-mono">
                PKR {currentUser.walletBalancePKR ? currentUser.walletBalancePKR.toLocaleString() : '18,400'}
              </div>
            </div>
          </div>

          {/* Pill 3: Cart */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-1.5 shadow-xs hover:bg-slate-100 transition cursor-pointer"
            title="View Multi-Product Cart"
          >
            <ShoppingBag className="h-4 w-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
              {cartCount > 0 ? cartCount : 1}
            </span>
          </button>

          {/* Pill 4: User Profile Badge */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl bg-white text-slate-900 px-2.5 py-1.5 shadow-xs hover:bg-slate-100 transition cursor-pointer"
            title="Profile & Settings"
          >
            <span className="text-xs font-bold text-slate-800">{currentUser.name.split(' ')[0]}</span>
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
