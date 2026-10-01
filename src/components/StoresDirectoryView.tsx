import React, { useState } from 'react';
import {
  Building2,
  Star,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Store, Product } from '../types';

interface StoresDirectoryViewProps {
  stores: Store[];
  products: Product[];
  onSelectStore: (store: Store) => void;
  onOpenVerifiedRegistration?: () => void;
}

export const StoresDirectoryView: React.FC<StoresDirectoryViewProps> = ({
  stores,
  products,
  onSelectStore,
  onOpenVerifiedRegistration,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MANUFACTURER' | 'RESELLER'>('ALL');

  const filteredStores = stores.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'MANUFACTURER' && (s.ownerType === 'MANUFACTURER' || s.ownerType === 'SUPPLIER')) ||
      (filterType === 'RESELLER' && s.ownerType === 'RESELLER');

    return matchesSearch && matchesType;
  });

  return (
    <div id="stores-directory-view" className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                Multi-Store Direct Sourcing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Verified Stores & Manufacturing Hubs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Har store se customer ek hi waqt mein multiple products add kar ke single parcel COD order kar sakta hai. Delivery fee save karein aur direct factory rates par khareedein.
            </p>
          </div>

          {onOpenVerifiedRegistration && (
            <button
              onClick={onOpenVerifiedRegistration}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 text-xs sm:text-sm shadow-lg shadow-indigo-900/40 transition whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-200" />
              <span>Register Your Store (Free)</span>
            </button>
          )}
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by name, city, or specialty..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['ALL', 'MANUFACTURER', 'RESELLER'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {type === 'ALL'
                  ? 'All Stores'
                  : type === 'MANUFACTURER'
                  ? '🏭 Manufacturers'
                  : '🏬 Resellers'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStores.map((store) => {
          const storeProducts = products.filter(
            (p) =>
              p.storeId === store.id ||
              p.supplierId === store.ownerId ||
              p.supplierName === store.name ||
              p.supplierName.toLowerCase().includes(store.name.toLowerCase().split(' ')[0]) ||
              store.name.toLowerCase().includes(p.supplierName.toLowerCase().split(' ')[0])
          );

          return (
            <div
              key={store.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/50 transition group"
            >
              <div className="space-y-4">
                {/* Store Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-700 bg-white"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition">
                          {store.name}
                        </h3>
                        {store.isVerified && (
                          <span
                            className="flex items-center text-emerald-400"
                            title="Fully Verified (CNIC, NTN, Bank Account Verified)"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span>{store.city}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-indigo-300 uppercase text-[10px]">
                          {store.ownerType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-2 py-1 rounded-xl text-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{store.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {store.description}
                </p>

                {/* Performance Metrics Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Delivery Speed</span>
                    <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                      <Truck className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="truncate">{store.deliveryRating}</span>
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Response & Fulfillment</span>
                    <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{store.responseTime}</span>
                    </span>
                  </div>
                </div>

                {/* Catalog Snippet (Mini thumbnails) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">Catalog Preview</span>
                    <span>{storeProducts.length} Items Available</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {storeProducts.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="h-14 w-14 rounded-xl border border-slate-800 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden"
                        title={p.name}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>
                    ))}
                    {storeProducts.length > 4 && (
                      <div className="h-14 w-14 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                        +{storeProducts.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectStore(store)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-xs transition shadow group-hover:shadow-indigo-900/40 cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Open Store & Multi-Order Cart</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
