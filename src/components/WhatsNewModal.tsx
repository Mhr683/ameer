import React from 'react';
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Calculator,
  UserCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Calendar,
  BadgePercent,
  TrendingUp,
} from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLearningLibrary: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenLearningLibrary,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      id: 'feature-1',
      badge: 'Major Update',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-50',
      title: '24-Hour Express COD Payouts',
      description:
        'Get your dropshipping profit automatically credited to your Bank Account, JazzCash, or EasyPaisa within 24 hours of successful customer delivery.',
      highlight: 'Direct integration with TCS, Leopards, and Trax Courier APIs.',
    },
    {
      id: 'feature-2',
      badge: 'New Tool',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      icon: FileSpreadsheet,
      iconColor: 'text-blue-500 bg-blue-50',
      title: 'Instant Bulk Products CSV Export',
      description:
        'Download the complete catalog of verified wholesale items with wholesale costs, recommended retail prices, profit margins, and SKUs with one click.',
      highlight: 'Export formatted CSV ready for Shopify, WooCommerce, or Excel analysis.',
    },
    {
      id: 'feature-3',
      badge: 'Seller Engine',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      icon: UserCheck,
      iconColor: 'text-purple-500 bg-purple-50',
      title: '100% Free Dropshipper Registration Portal',
      description:
        'Multi-step verified dropshipper onboarding with real-time CNIC verification, store branding setup, and instant Rs. 2,500 demo wallet balance.',
      highlight: 'Zero upfront fees, zero inventory risk, and 100% verified Pakistani suppliers.',
    },
    {
      id: 'feature-4',
      badge: 'Risk Protection',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      icon: ShieldCheck,
      iconColor: 'text-emerald-500 bg-emerald-50',
      title: 'Profit Guard Anti-Return Protection v2.5',
      description:
        'Automated AI detection scans customer addresses and contact numbers against Pakistan-wide courier blacklist records to protect you from courier return costs.',
      highlight: 'Cuts courier return penalties (RTO) by up to 38%.',
    },
    {
      id: 'feature-5',
      badge: 'Calculator',
      badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
      icon: Calculator,
      iconColor: 'text-orange-500 bg-orange-50',
      title: 'Daraz Fee & Tax Calculator 2025/2026',
      description:
        'Accurately calculate Daraz category commissions, payment processing charges, VAT/GST taxes, and net in-hand profit before listing any product.',
      highlight: 'Supports all 18 major Daraz product categories.',
    },
    {
      id: 'feature-6',
      badge: 'Education',
      badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
      icon: BookOpen,
      iconColor: 'text-sky-500 bg-sky-50',
      title: 'Integrated Learning Library',
      description:
        'Comprehensive step-by-step guides, masterclass videos, and strategies on scaling your dropshipping business on Shopify, Daraz, and TikTok Shop.',
      highlight: 'Available for all registered resellers and suppliers.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">What's NEW on YourMart</h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  v3.2 Live
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Discover the latest tools, improvements, and enhancements built for Pakistani sellers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Latest Release Notes
            </span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              6 New Features Active
            </span>
          </div>

          <div className="space-y-3.5">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${item.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{item.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenLearningLibrary();
              }}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Explore Learning Library</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateTab('catalog');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
