import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Package,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Truck,
  ArrowRight,
  Search,
  Upload,
  Camera,
  RefreshCw,
  Building2,
  Coins
} from 'lucide-react';
import { RtoClaim, Order } from '../types';

interface ReverseLogisticsRtoViewProps {
  orders: Order[];
  onRestockOrder?: (orderId: string) => void;
  onFileCourierClaim?: (claimId: string, photos: string[], amountPKR: number) => void;
}

const INITIAL_RTO_CLAIMS: RtoClaim[] = [
  {
    id: 'RTO-8012',
    orderId: 'ord-101',
    orderNumber: 'YM-9481',
    customerName: 'Muhammad Hamza',
    customerPhone: '0300-8491029',
    customerCity: 'Faisalabad',
    trackingNumber: 'TRX-84920194',
    courierName: 'Trax Logistics',
    sellingPricePKR: 3500,
    returnFeePKR: 180,
    returnDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    reason: 'CUSTOMER_REFUSED',
    condition: 'INTACT_RESTOCKABLE',
    status: 'RETURNED_TO_HUB',
    warehouseInspectorName: 'Tariq Mehmood (Hub 1)',
  },
  {
    id: 'RTO-8013',
    orderId: 'ord-102',
    orderNumber: 'YM-9520',
    customerName: 'Kamran Ashraf',
    customerPhone: '0321-4829102',
    customerCity: 'Karachi',
    trackingNumber: 'PEX-98234192',
    courierName: 'PostEx Logistics',
    sellingPricePKR: 5200,
    returnFeePKR: 180,
    returnDate: new Date(Date.now() - 86400000).toISOString(),
    reason: 'DAMAGED_PARCEL',
    condition: 'DAMAGED_TRANSIT',
    status: 'CLAIM_FILED_WITH_COURIER',
    warehouseInspectorName: 'Asim Raza (Hub 2)',
    claimCompensationPKR: 5200,
  },
  {
    id: 'RTO-8014',
    orderId: 'ord-103',
    orderNumber: 'YM-9555',
    customerName: 'Zahid Iqbal',
    customerPhone: '0345-9920192',
    customerCity: 'Peshawar',
    trackingNumber: 'LEO-74892182',
    courierName: 'Leopards Express',
    sellingPricePKR: 2800,
    returnFeePKR: 180,
    returnDate: new Date().toISOString(),
    reason: 'PHONE_UNREACHABLE',
    condition: 'INTACT_RESTOCKABLE',
    status: 'RETURNED_TO_HUB',
  },
];

export const ReverseLogisticsRtoView: React.FC<ReverseLogisticsRtoViewProps> = () => {
  const [claims, setClaims] = useState<RtoClaim[]>(INITIAL_RTO_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<RtoClaim | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCondition, setFilterCondition] = useState<'ALL' | 'INTACT' | 'DAMAGED'>('ALL');
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  const totalReversePenalties = claims.reduce((sum, c) => sum + c.returnFeePKR, 0);
  const intactRestockableCount = claims.filter((c) => c.condition === 'INTACT_RESTOCKABLE').length;
  const damagedTransitCount = claims.filter((c) => c.condition === 'DAMAGED_TRANSIT').length;

  const handleRestock = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'RESTOCKED' as const } : c))
    );
    setClaimSuccessMessage(`Parcel #${claimId} inventory mein successfully restock ho gaya hai!`);
    setTimeout(() => setClaimSuccessMessage(null), 3000);
  };

  const handleFileClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'CLAIM_FILED_WITH_COURIER' as const,
              claimCompensationPKR: c.sellingPricePKR,
            }
          : c
      )
    );
    setSelectedClaim(null);
    setClaimSuccessMessage(`Courier damage compensation claim PKR filed for #${claimId}!`);
    setTimeout(() => setClaimSuccessMessage(null), 3000);
  };

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition =
      filterCondition === 'ALL'
        ? true
        : filterCondition === 'INTACT'
        ? c.condition === 'INTACT_RESTOCKABLE'
        : c.condition === 'DAMAGED_TRANSIT';
    return matchesSearch && matchesCondition;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RTO & REVERSE LOGISTICS CONTROL DESK</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Return to Origin (RTO) & Damage Claims
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Undelivered parcels ki warehouse inspection, restock workflows, aur courier company ke khilaf broken/damaged parcel insurance claims ka hisab.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Reverse Return Charges</span>
            <div className="mt-1 text-2xl font-black font-mono text-rose-400">
              PKR {totalReversePenalties.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Standard PKR 180/parcel courier penalty</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Intact / Restockable Parcels</span>
            <div className="mt-1 text-2xl font-black font-mono text-emerald-400">
              {intactRestockableCount} Units
            </div>
            <span className="text-[10px] text-slate-500">Box seal verified, ready to sell</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Damaged Transit Claims</span>
            <div className="mt-1 text-2xl font-black font-mono text-amber-400">
              {damagedTransitCount} Cases
            </div>
            <span className="text-[10px] text-slate-500">Filed for courier compensation</span>
          </div>
        </div>
      </div>

      {claimSuccessMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{claimSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Order #, CN Tracking, or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'INTACT', 'DAMAGED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterCondition(mode)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filterCondition === mode
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* RTO Claims List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white">Returned Parcels Receiving Inspection</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{filteredClaims.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Order & CN Number</th>
                <th className="px-4 py-3.5">Customer & City</th>
                <th className="px-4 py-3.5">RTO Return Reason</th>
                <th className="px-4 py-3.5">Warehouse Condition</th>
                <th className="px-4 py-3.5 text-right">Reverse Fee (PKR)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-white">{claim.orderNumber}</div>
                    <div className="font-mono text-xs text-rose-400">{claim.trackingNumber}</div>
                    <div className="text-[10px] text-slate-500">{claim.courierName}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-200">{claim.customerName}</div>
                    <div className="text-[10px] text-slate-400">{claim.customerPhone}</div>
                    <div className="text-[10px] text-slate-500">{claim.customerCity}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded bg-rose-950/60 text-rose-300 border border-rose-800 px-2 py-0.5 text-[10px] font-bold">
                      {claim.reason.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(claim.returnDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        claim.condition === 'INTACT_RESTOCKABLE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {claim.condition === 'INTACT_RESTOCKABLE' ? 'Intact (Seal OK)' : 'Damaged in Courier'}
                    </span>
                    {claim.warehouseInspectorName && (
                      <div className="text-[10px] text-slate-500 mt-0.5">By {claim.warehouseInspectorName}</div>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">
                    - PKR {claim.returnFeePKR}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300 border border-slate-700">
                      {claim.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    {claim.status === 'RETURNED_TO_HUB' && (
                      <div className="flex items-center justify-end gap-1.5">
                        {claim.condition === 'INTACT_RESTOCKABLE' ? (
                          <button
                            onClick={() => handleRestock(claim.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition cursor-pointer"
                          >
                            Restock
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow transition cursor-pointer"
                          >
                            File Claim
                          </button>
                        )}
                      </div>
                    )}
                    {claim.status === 'RESTOCKED' && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Restocked</span>
                      </span>
                    )}
                    {claim.status === 'CLAIM_FILED_WITH_COURIER' && (
                      <span className="text-[10px] text-amber-400 font-bold">Claim Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Camera className="h-5 w-5 text-amber-400" />
              <span>File Courier Damage Compensation</span>
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Ref:</span>
                <span className="font-bold text-white">{selectedClaim.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Courier Partner:</span>
                <span className="font-bold text-slate-200">{selectedClaim.courierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claim Amount:</span>
                <span className="font-bold font-mono text-emerald-400">
                  PKR {selectedClaim.sellingPricePKR.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-bold block">Attach Broken Package Inspection Photo:</label>
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 text-center bg-slate-950/50 cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                <span className="text-xs text-slate-300 block font-semibold">Click to attach photo evidence</span>
                <span className="text-[10px] text-slate-500">JPG, PNG (Max 5MB)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleFileClaim(selectedClaim.id)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition cursor-pointer"
              >
                Submit Claim to Courier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
