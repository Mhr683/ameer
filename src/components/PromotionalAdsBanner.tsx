import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  Flame,
  ShieldCheck,
  Truck,
  Bot,
  Wallet,
  ArrowRight,
  Tag
} from 'lucide-react';

export interface PromotionAd {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  highlightText?: string;
  description: string;
  actionText: string;
  actionType: 'policies' | 'catalog' | 'profit-guard' | 'stores' | 'wallet' | 'register';
  icon: React.ElementType;
}

export const PROMOTION_ADS: PromotionAd[] = [
  {
    id: 'ad-fee',
    badge: 'PLATFORM GUARANTEE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    headline: 'Flat 2% Software Commission',
    highlightText: '0% on Returns & RTOs',
    description: 'Pakistan ka sab se transparent B2B rate! Sirf delivered parcel par 2% software fee, return hone par zero charges.',
    actionText: 'View Policies',
    actionType: 'policies',
    icon: Percent,
  },
  {
    id: 'ad-wholesale',
    badge: 'HOT WHOLESALE DEALS',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    headline: 'Karachi & Lahore Factory Sourcing',
    highlightText: 'Up to 40% Margin',
    description: 'Direct factory rates par tracksuits, kitchen tools aur trending gadgets source karein baghair kisi advance payment ke.',
    actionText: 'Explore Sourcing Deals',
    actionType: 'catalog',
    icon: Flame,
  },
  {
    id: 'ad-profit-guard',
    badge: 'ZERO-LOSS COURIER PROTECTION',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    headline: 'Automated Profit Guard™ Active',
    highlightText: 'Automated Risk & OTP Filter',
    description: 'Fake addresses aur non-serious customer verification pehle se check hoti hai taake delivery return loss se bacha ja sake.',
    actionText: 'Profit Guard Config',
    actionType: 'profit-guard',
    icon: ShieldCheck,
  },
  {
    id: 'ad-consolidated',
    badge: 'MULTI-ORDER SAVINGS',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    headline: 'Consolidated Delivery: Flat Rs. 200',
    highlightText: 'Save Delivery Charges',
    description: 'Aik hi factory ya store se multiple items order karein aur poora bundle sirf aik delivery charges mein deliver karwayein.',
    actionText: 'Browse Stores Directory',
    actionType: 'stores',
    icon: Truck,
  },
  {
    id: 'ad-payouts',
    badge: 'FAST COURIER CLEARANCE',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    headline: '24-48 Hours Automated Escrow Payouts',
    highlightText: 'EasyPaisa & Bank Transfer',
    description: 'Trax, PostEx aur Leopard se parcel delivery confirm hotay hi aapka profit seedha aapke wallet mein release hota hai.',
    actionText: 'Open Payout Wallet',
    actionType: 'wallet',
    icon: Wallet,
  },
  {
    id: 'ad-dropship',
    badge: 'START ZERO CAPITAL STORE',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    headline: 'Baghair Kisi Investment Apna Reseller Store Shuru Karein',
    highlightText: '1-Minute Free Signup',
    description: 'Inventory khareedne ki zaroorat nahi — product bechein, packing aur courier delivery hum khud karenge.',
    actionText: 'Register Partner',
    actionType: 'register',
    icon: Sparkles,
  },
];

interface PromotionalAdsBannerProps {
  onActionClick: (actionType: PromotionAd['actionType']) => void;
}

export const PromotionalAdsBanner: React.FC<PromotionalAdsBannerProps> = ({ onActionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swipe every 4.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMOTION_ADS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + PROMOTION_ADS.length) % PROMOTION_ADS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % PROMOTION_ADS.length);
  };

  const activeAd = PROMOTION_ADS[currentIndex];
  const IconComponent = activeAd.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-xs overflow-hidden select-none"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-1.5 sm:px-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          aria-label="Previous promotional ad"
          title="Previous Ad"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Center: Swiping Content Area */}
        <div
          onClick={() => onActionClick(activeAd.actionType)}
          className="flex-1 mx-2 sm:mx-4 flex items-center justify-center cursor-pointer group"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-center transition-all duration-300 animate-fadeIn">
            {/* Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${activeAd.badgeColor}`}
            >
              <IconComponent className="h-3 w-3" />
              <span>{activeAd.badge}</span>
            </span>

            {/* Headline */}
            <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              {activeAd.headline}
            </span>

            {/* Highlight Pill */}
            {activeAd.highlightText && (
              <span className="hidden md:inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-black text-emerald-400 border border-emerald-500/40">
                {activeAd.highlightText}
              </span>
            )}

            {/* Description Preview (hidden on small mobile) */}
            <span className="hidden lg:inline text-slate-400 text-[11px] max-w-md truncate">
              {activeAd.description}
            </span>

            {/* Action CTA Link */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:underline transition-all">
              <span>{activeAd.actionText}</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Right Controls: Dots Indicator & Next Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Progress Indicators */}
          <div className="hidden sm:flex items-center gap-1">
            {PROMOTION_ADS.map((ad, idx) => (
              <button
                key={ad.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-4 bg-emerald-400'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Ad ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            aria-label="Next promotional ad"
            title="Next Ad"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
