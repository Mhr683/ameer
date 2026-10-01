import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Zap,
  Globe,
  ArrowRight,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { Product, StoreIntegration } from '../types';

interface ShopifySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  stores: StoreIntegration[];
  onPushProductToStore: (productId: string, storeId: string, customMarkup: number) => void;
  onSimulateIncomingShopifyOrder: () => void;
}

export const ShopifySyncModal: React.FC<ShopifySyncModalProps> = ({
  isOpen,
  onClose,
  products,
  stores,
  onPushProductToStore,
  onSimulateIncomingShopifyOrder,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [storeType, setStoreType] = useState<'SHOPIFY' | 'WOOCOMMERCE'>('SHOPIFY');
  const [storeUrl, setStoreUrl] = useState('zainab-boutique.myshopify.com');
  const [accessToken, setAccessToken] = useState('shpat_8492019482910482019');
  const [markupMultiplier, setMarkupMultiplier] = useState(2.2);
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'push-catalog' | 'webhook-auto'>('push-catalog');

  if (!isOpen) return null;

  const targetProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const calculatedSellingPrice = targetProduct
    ? Math.round(targetProduct.supplierCostPKR * markupMultiplier)
    : 2500;
  const estimatedProfit = targetProduct
    ? calculatedSellingPrice - targetProduct.supplierCostPKR - 250 - 30
    : 1000;

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true);
    setPushSuccess(null);

    setTimeout(() => {
      onPushProductToStore(selectedProductId, 'store-shopify', calculatedSellingPrice);
      setIsPushing(false);
      setPushSuccess(`"${targetProduct?.name}" successfully pushed to ${storeUrl}! Live on your store.`);
      setTimeout(() => setPushSuccess(null), 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Shopify & WooCommerce 1-Click Sync</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                  Auto-Inventory & Orders
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-Click me products push karein aur online store se aane wale orders YourMart me auto-import karein.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('push-catalog')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'push-catalog'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>1-Click Product Push</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook-auto')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'webhook-auto'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Auto Order Ingestion Webhook</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {pushSuccess && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{pushSuccess}</span>
            </div>
          )}

          {activeTab === 'push-catalog' && (
            <form onSubmit={handlePush} className="space-y-4">
              {/* Select Product to Push */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Select Product from Wholesale Sourcing Catalog:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Wholesale Cost: PKR {p.supplierCostPKR.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Preview Card */}
              {targetProduct && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex items-center gap-4">
                  <img
                    src={targetProduct.image}
                    alt={targetProduct.name}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{targetProduct.name}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      SKU: <span className="font-mono text-slate-300">{targetProduct.sku}</span> • Factory Stock:{' '}
                      <span className="text-emerald-400 font-bold">{targetProduct.stock} units</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-slate-400">
                        Base Cost: <strong className="text-amber-400 font-mono">PKR {targetProduct.supplierCostPKR.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Store & Pricing Slabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Online Store URL:</label>
                  <input
                    type="text"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Selling Price Markup: <span className="text-emerald-400 font-bold">({markupMultiplier}x multiplier)</span>
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="4.0"
                    step="0.1"
                    value={markupMultiplier}
                    onChange={(e) => setMarkupMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Live Financial Projection Box */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Store Price:</span>
                  <span className="text-base font-black font-mono text-white">
                    PKR {calculatedSellingPrice.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Wholesale Cost:</span>
                  <span className="text-base font-black font-mono text-amber-400">
                    PKR {targetProduct?.supplierCostPKR.toLocaleString() || '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Net Margin / Sale:</span>
                  <span className="text-base font-black font-mono text-emerald-400">
                    +PKR {estimatedProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPushing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPushing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Pushing High-Res Media & Copy to Shopify...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Push Product to Shopify Store (PKR {calculatedSellingPrice.toLocaleString()})</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'webhook-auto' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <span className="font-bold text-white text-xs block">
                  Automated Shopify Webhook Order Ingestion:
                </span>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Jab bhi aapke Shopify store par koi customer COD order place karega, YourMart ka webhook system foran wo order fetch karke "Orders & Dispatch" pipeline me le aayega.
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 break-all">
                  https://api.yourmart.pk/v1/shopify/orders-webhook?key=ym_live_sec_9941
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Test webhook pipeline with a sample order:</span>
                  <button
                    onClick={() => {
                      onSimulateIncomingShopifyOrder();
                      setPushSuccess('Sample Shopify order successfully imported into YourMart pipeline!');
                      setTimeout(() => setPushSuccess(null), 3000);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition cursor-pointer"
                  >
                    Simulate Incoming Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
