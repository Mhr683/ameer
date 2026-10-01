import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Sparkles,
  CheckCircle2,
  Gift,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { User, TierLevel } from '../types';

interface ResellerTierGamificationProps {
  currentUser: User;
  deliveredOrdersCount: number;
  onClaimBonus: (bonusAmountPKR: number, tierTitle: string) => void;
}

interface TierDefinition {
  level: TierLevel;
  name: string;
  minOrders: number;
  maxOrders: number;
  bonusAmountPKR: number;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
  perks: string[];
}

const TIERS: TierDefinition[] = [
  {
    level: 'BRONZE',
    name: 'Bronze Starter',
    minOrders: 0,
    maxOrders: 10,
    bonusAmountPKR: 0,
    color: 'from-amber-700 to-amber-900',
    borderColor: 'border-amber-700/60',
    badgeBg: 'bg-amber-800/30',
    badgeText: 'text-amber-400',
    icon: Award,
    perks: ['Standard Wholesale Pricing', 'Standard Courier Dispatch (2-3 Days)', 'Normal Helpline Support'],
  },
  {
    level: 'SILVER',
    name: 'Silver Champion',
    minOrders: 11,
    maxOrders: 50,
    bonusAmountPKR: 500,
    color: 'from-slate-400 to-slate-600',
    borderColor: 'border-slate-400/60',
    badgeBg: 'bg-slate-500/30',
    badgeText: 'text-slate-200',
    icon: Trophy,
    perks: ['PKR 500 Instant Cash Bonus', 'Priority Warehouse Packaging', '50 Free Printed Reseller Flyers'],
  },
  {
    level: 'GOLD',
    name: 'Gold Elite',
    minOrders: 51,
    maxOrders: 200,
    bonusAmountPKR: 2000,
    color: 'from-amber-400 to-yellow-600',
    borderColor: 'border-amber-400/70',
    badgeBg: 'bg-amber-400/30',
    badgeText: 'text-amber-300',
    icon: Crown,
    perks: ['PKR 2,000 Cash Milestone Bonus', '1% Discount on all Wholesale Items', 'Free Custom Logo on Flyers', 'Same-Day Dispatch Guarantee'],
  },
  {
    level: 'DIAMOND',
    name: 'Diamond Mogul',
    minOrders: 201,
    maxOrders: 99999,
    bonusAmountPKR: 5000,
    color: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-400/70',
    badgeBg: 'bg-cyan-500/30',
    badgeText: 'text-cyan-300',
    icon: Sparkles,
    perks: ['PKR 5,000 Super Cash Bonus', '0% Platform Fee (Save 2% on all orders)', 'Dedicated VIP WhatsApp Account Manager', 'Free Factory Sourcing Samples'],
  },
];

export const ResellerTierGamification: React.FC<ResellerTierGamificationProps> = ({
  currentUser,
  deliveredOrdersCount,
  onClaimBonus,
}) => {
  // Saved claimed bonus status
  const [claimedTiers, setClaimedTiers] = useState<string[]>(() => {
    const saved = localStorage.getItem(`ym_claimed_bonuses_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine current tier
  const currentTier =
    TIERS.slice().reverse().find((t) => deliveredOrdersCount >= t.minOrders) || TIERS[0];
  const nextTierIndex = TIERS.findIndex((t) => t.level === currentTier.level) + 1;
  const nextTier = nextTierIndex < TIERS.length ? TIERS[nextTierIndex] : null;

  const ordersNeededForNext = nextTier ? Math.max(0, nextTier.minOrders - deliveredOrdersCount) : 0;
  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.round(
          ((deliveredOrdersCount - currentTier.minOrders) /
            (nextTier.minOrders - currentTier.minOrders)) *
            100
        )
      )
    : 100;

  const handleClaim = (tier: TierDefinition) => {
    if (claimedTiers.includes(tier.level)) return;
    onClaimBonus(tier.bonusAmountPKR, tier.name);
    const updated = [...claimedTiers, tier.level];
    setClaimedTiers(updated);
    localStorage.setItem(`ym_claimed_bonuses_${currentUser.id}`, JSON.stringify(updated));
    setToastMessage(`Mubarak! PKR ${tier.bonusAmountPKR.toLocaleString()} aapke wallet balance mein add ho gaye! 🎉`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Toast */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${currentTier.color} flex items-center justify-center text-white shadow-lg shrink-0`}
          >
            <currentTier.icon className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reseller Club Level:
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase ${currentTier.badgeBg} ${currentTier.badgeText} border ${currentTier.borderColor}`}
              >
                {currentTier.name}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              {currentUser.name} • {deliveredOrdersCount} Successful Deliveries
            </h3>
          </div>
        </div>

        {/* Claim Banner if eligible */}
        {currentTier.bonusAmountPKR > 0 && !claimedTiers.includes(currentTier.level) && (
          <button
            onClick={() => handleClaim(currentTier)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 transition cursor-pointer animate-pulse shrink-0"
          >
            <Gift className="h-4 w-4" />
            <span>Claim PKR {currentTier.bonusAmountPKR.toLocaleString()} Cash Bonus!</span>
          </button>
        )}
      </div>

      {/* Progress to Next Tier */}
      {nextTier ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
              <span>Next Milestone: <strong className="text-white">{nextTier.name}</strong></span>
            </span>
            <span className="text-amber-400 font-bold font-mono">
              Only {ordersNeededForNext} more delivered orders needed!
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>{deliveredOrdersCount} Delivered</span>
            <span>{nextTier.minOrders} Target (Unlock PKR {nextTier.bonusAmountPKR.toLocaleString()} Bonus)</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-center text-xs text-cyan-300 font-bold">
          👑 Highest Diamond Mogul Tier Reached! You enjoy 0% platform fee and dedicated VIP agent.
        </div>
      )}

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {TIERS.map((tier) => {
          const isCurrent = tier.level === currentTier.level;
          const isUnlocked = deliveredOrdersCount >= tier.minOrders;
          const isClaimed = claimedTiers.includes(tier.level);

          return (
            <div
              key={tier.level}
              className={`rounded-2xl border p-4 space-y-2.5 transition flex flex-col justify-between ${
                isCurrent
                  ? 'border-amber-500/80 bg-slate-900 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/40'
                  : isUnlocked
                  ? 'border-slate-800 bg-slate-950/80'
                  : 'border-slate-800/50 bg-slate-950/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${tier.badgeText}`}>{tier.name}</span>
                  {isUnlocked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  {tier.maxOrders >= 9999 ? '200+ orders' : `${tier.minOrders} - ${tier.maxOrders} orders`}
                </div>

                {tier.bonusAmountPKR > 0 && (
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-black text-amber-300 border border-amber-500/20">
                    <Coins className="h-3 w-3" />
                    <span>PKR {tier.bonusAmountPKR.toLocaleString()} Bonus</span>
                  </div>
                )}

                <ul className="mt-2.5 space-y-1 text-[10px] text-slate-400">
                  {tier.perks.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tier.bonusAmountPKR > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  {isUnlocked ? (
                    isClaimed ? (
                      <span className="block text-center text-[10px] text-slate-500 font-bold">
                        ✓ Bonus Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaim(tier)}
                        className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow transition cursor-pointer"
                      >
                        Claim Bonus
                      </button>
                    )
                  ) : (
                    <span className="block text-center text-[10px] text-slate-500 font-mono">
                      Locked
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
