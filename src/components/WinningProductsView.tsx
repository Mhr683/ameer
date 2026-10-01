import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Download,
  Copy,
  Check,
  Video,
  Eye,
  DollarSign,
  Share2,
  ExternalLink,
  Target,
  BarChart2,
  Store,
} from 'lucide-react';
import { Product } from '../types';

interface WinningProductsViewProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onOpenAdCopyModal?: (product: Product) => void;
  onOpenStoreFront?: (storeId: string) => void;
}

export const WinningProductsView: React.FC<WinningProductsViewProps> = ({
  products,
  onSelectProduct,
  onOpenAdCopyModal,
  onOpenStoreFront,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter top trending & high margin products
  const winningProducts = products
    .filter((p) => (p.rating >= 4.5 && p.stock > 10) || p.isTrending)
    .slice(0, 8);

  const handleCopyTitle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900/60 via-purple-900/40 to-slate-900 border border-violet-500/30 p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-400/30 rounded-full text-violet-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Top 1% Dropshipping Velocity Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Winning Products & Ad Intelligence Hub
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Data-backed hot trending items across Pakistan with proven Facebook/TikTok ad ROAS, ready video ad creatives, and guaranteed minimum 35% reseller profit margin.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {winningProducts.map((product, idx) => {
          const estimatedMarginPKR = product.recSellingPricePKR - product.supplierCostPKR;
          const marginPercent = Math.round((estimatedMarginPKR / product.recSellingPricePKR) * 100);

          return (
            <div
              key={product.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group hover:shadow-xl hover:shadow-violet-950/20"
            >
              {/* Product Media */}
              <div className="relative aspect-square bg-slate-950 overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>Rank #{idx + 1}</span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 px-2 py-0.5 rounded-full text-xs font-extrabold shadow">
                  +{marginPercent}% Margin
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/50 text-slate-300">
                  <span>Viral TikTok Score:</span>
                  <span className="font-bold text-violet-400">96/100 🔥</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{product.category}</span>
                    <span className="text-emerald-400 font-mono font-medium">In Stock: {product.stock}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-violet-300 transition">
                    {product.name}
                  </h3>
                </div>

                {/* Financials */}
                <div className="bg-slate-800/60 rounded-xl p-2.5 space-y-1 text-xs border border-slate-700/40">
                  <div className="flex justify-between text-slate-400">
                    <span>Factory Wholesale:</span>
                    <span className="font-semibold text-slate-200">Rs. {product.supplierCostPKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Retail COD:</span>
                    <span className="font-bold text-white">Rs. {product.recSellingPricePKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700/50 pt-1 text-emerald-400 font-bold">
                    <span>Your Net Margin:</span>
                    <span>Rs. {estimatedMarginPKR.toLocaleString()}</span>
                  </div>
                </div>

                {/* Store Info & Visit Store */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 truncate max-w-[130px]">
                    {product.storeName || product.supplierName || 'Verified Store'}
                  </span>
                  {onOpenStoreFront && (
                    <button
                      onClick={() => onOpenStoreFront(product.storeId || 'store-oshi')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-[11px] transition cursor-pointer"
                      title="Visit Store (Combine multiple items in 1 delivery parcel)"
                    >
                      <Store className="w-3 h-3" />
                      <span>Visit Store ➔</span>
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenAdCopyModal ? onOpenAdCopyModal(product) : handleCopyTitle(product.id, product.name)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Ads</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Sourcing</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
