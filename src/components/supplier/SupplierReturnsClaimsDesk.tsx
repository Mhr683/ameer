import React, { useState } from 'react';
import {
  RotateCcw,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  Video,
  FileText,
  Truck,
  Box,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Order, ReturnClaim } from '../../types';

interface SupplierReturnsClaimsDeskProps {
  orders: Order[];
  onRestockItem?: (productId: string, newStock: number) => void;
}

export const SupplierReturnsClaimsDesk: React.FC<SupplierReturnsClaimsDeskProps> = ({
  orders,
  onRestockItem,
}) => {
  const [activeTab, setActiveTab] = useState<'RTO_PARCELS' | 'RMA_DISPUTES'>('RTO_PARCELS');
  const [selectedProofClaim, setSelectedProofClaim] = useState<ReturnClaim | null>(null);
  const [rejectReasonModalClaim, setRejectReasonModalClaim] = useState<ReturnClaim | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Seeded Returned RTO Parcels
  const [rtoParcels, setRtoParcels] = useState([
    {
      id: 'rto-1',
      orderNumber: 'ORD-749214',
      productName: 'Pack of 2 Dog Bath Brush Pet Massager',
      sku: 'PET-BATH-BRUSH-2PK',
      customerCity: 'Faisalabad',
      courier: 'Trax Logistics',
      returnTracking: 'TRX-RTO-994821',
      returnReason: 'Customer Refused at Doorstep (Did not order)',
      returnDate: 'Yesterday 3:45 PM',
      isRestocked: false,
    },
    {
      id: 'rto-2',
      orderNumber: 'ORD-810239',
      productName: 'Vintage T9 Professional Hair & Beard Trimmer',
      sku: 'T9-TRIMMER-01',
      customerCity: 'Peshawar',
      courier: 'PostEx Courier',
      returnTracking: 'PEX-RTO-381023',
      returnReason: 'Customer Phone Unattended (3 Delivery Attempts)',
      returnDate: '2 Days Ago',
      isRestocked: true,
    },
    {
      id: 'rto-3',
      orderNumber: 'ORD-930412',
      productName: 'Pro 2 Wireless Earbuds ANC Bluetooth 5.3',
      sku: 'EARBUD-PRO2-ANC',
      customerCity: 'Multan',
      courier: 'TCS Express',
      returnTracking: 'TCS-RTO-184920',
      returnReason: 'Address Incomplete / Unlocatable by Rider',
      returnDate: '3 Days Ago',
      isRestocked: false,
    },
  ]);

  // Seeded RMA / Disputes submitted by Dropshippers with photo/video evidence
  const [claims, setClaims] = useState<ReturnClaim[]>([
    {
      id: 'rma-101',
      orderNumber: 'ORD-552109',
      resellerName: 'SuperDeals PK (Usman Ali)',
      customerName: 'Khurram Shehzad',
      customerCity: 'Lahore',
      productName: 'Vintage T9 Professional Hair & Beard Trimmer',
      productSku: 'T9-TRIMMER-01',
      reason: 'Defective Power Motor - Blade vibrating erratically on arrival.',
      proofImages: [
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&auto=format&fit=crop&q=80',
      ],
      proofVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      claimDate: 'Today, 11:20 AM',
      status: 'PENDING_SUPPLIER_REVIEW',
      refundAmountPKR: 490,
    },
    {
      id: 'rma-102',
      orderNumber: 'ORD-619284',
      resellerName: 'TrendVibe Online (Fatima Noor)',
      customerName: 'Ayesha Bibi',
      customerCity: 'Rawalpindi',
      productName: 'Girls Blue Floral Co Ord Set (Lawn 2026)',
      productSku: 'COORD-GIRLS-BLU',
      reason: 'Wrong Color Variant Received - Customer ordered Blue, received Cream Floral.',
      proofImages: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
      ],
      claimDate: 'Yesterday, 04:15 PM',
      status: 'PENDING_SUPPLIER_REVIEW',
      refundAmountPKR: 1050,
    },
  ]);

  // Restock handler
  const handleRestock = (id: string, sku: string) => {
    setRtoParcels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isRestocked: true } : p))
    );
    showToast(`Parcel ${sku} confirmed returned to warehouse & inventory count restored (+1)!`);
  };

  // Accept Claim
  const handleAcceptClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'ACCEPTED_REFUNDED',
              supplierResponse: 'Claim accepted. Reseller wallet reimbursed and replacement dispatched.',
            }
          : c
      )
    );
    showToast('Claim accepted! Reseller reimbursement released from wholesale escrow.');
  };

  // Reject Claim
  const handleRejectClaim = () => {
    if (!rejectReasonModalClaim) return;
    const reason = rejectReasonText.trim() || 'Physical inspection showed damage caused by misuse after unboxing.';

    setClaims((prev) =>
      prev.map((c) =>
        c.id === rejectReasonModalClaim.id
          ? {
              ...c,
              status: 'REJECTED_DISPUTED',
              supplierResponse: reason,
            }
          : c
      )
    );
    setRejectReasonModalClaim(null);
    setRejectReasonText('');
    showToast('Claim rejected with supplier evidence report.');
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 text-white px-5 py-3 shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold text-sm">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5 border border-rose-500/30">
                MODULE 4
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Returns & Damage Claims Desk (RTO aur Claims)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Track undelivered returned parcels (RTO) from couriers and resolve dropshipper RMA damage claims with video/photo evidence.
            </p>
          </div>

          {/* Subtabs Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('RTO_PARCELS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'RTO_PARCELS'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5 text-blue-400" />
              <span>Returned Parcels (RTO Tracker)</span>
              <span className="rounded-full bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2">
                {rtoParcels.filter((p) => !p.isRestocked).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('RMA_DISPUTES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'RMA_DISPUTES'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
              <span>RMA / Damage Disputes Desk</span>
              <span className="rounded-full bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.2">
                {claims.filter((c) => c.status === 'PENDING_SUPPLIER_REVIEW').length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Returned Parcels (RTO Tracker) */}
      {activeTab === 'RTO_PARCELS' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl space-y-3">
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-400" />
              <span className="font-bold text-sm text-white">
                Live Courier Undelivered Returns (RTO Warehouse Handover)
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Courier Delivery Attempts Exceeded • Auto Restock Enabled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Return CN & Courier</th>
                  <th className="p-3.5">Original Order #</th>
                  <th className="p-3.5">Product SKU</th>
                  <th className="p-3.5">Customer City</th>
                  <th className="p-3.5">Undelivered Return Reason</th>
                  <th className="p-3.5">Warehouse Restock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rtoParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{parcel.returnTracking}</div>
                      <div className="text-[10px] text-blue-400 mt-0.5 flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        <span>{parcel.courier}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-semibold text-slate-300">
                      {parcel.orderNumber}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-200 truncate max-w-[180px]" title={parcel.productName}>
                        {parcel.productName}
                      </div>
                      <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-1 rounded">
                        {parcel.sku}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-semibold">
                      {parcel.customerCity}
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-300 text-xs block font-medium">
                        {parcel.returnReason}
                      </span>
                      <span className="text-[10px] text-slate-500">{parcel.returnDate}</span>
                    </td>

                    <td className="p-3.5">
                      {parcel.isRestocked ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Restocked in Warehouse</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRestock(parcel.id, parcel.sku)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Box className="h-3.5 w-3.5" />
                          <span>Confirm Received & Restock (+1)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: RMA / Damage Claims Desk */}
      {activeTab === 'RMA_DISPUTES' && (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2 py-0.5 rounded">
                      Claim #{claim.id}
                    </span>
                    <span className="text-xs text-slate-400">Order: <strong className="text-white font-mono">{claim.orderNumber}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      claim.status === 'PENDING_SUPPLIER_REVIEW'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : claim.status === 'ACCEPTED_REFUNDED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {claim.status === 'PENDING_SUPPLIER_REVIEW' ? 'Action Required' : claim.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Submitted by Reseller: <strong className="text-slate-200">{claim.resellerName}</strong> for customer <strong className="text-slate-200">{claim.customerName}</strong> ({claim.customerCity})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Disputed Wholesale Value</div>
                  <div className="text-base font-black font-mono text-emerald-400">
                    PKR {claim.refundAmountPKR.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Issue Description & Proof Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <div className="font-bold text-slate-300">
                    Product: <span className="text-white">{claim.productName}</span> ({claim.productSku})
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                      Dropshipper / Customer Claim Statement
                    </div>
                    {claim.reason}
                  </div>

                  {claim.supplierResponse && (
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-200">
                      <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">
                        Supplier Decision & Evidence
                      </div>
                      {claim.supplierResponse}
                    </div>
                  )}
                </div>

                {/* Proof Media Preview */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 text-xs">Inspection Proof (Photos & Video)</div>
                  <div className="flex gap-2">
                    {claim.proofImages?.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedProofClaim(claim)}
                        className="relative rounded-lg overflow-hidden h-16 w-16 border border-slate-700 hover:border-amber-400 cursor-pointer transition group"
                      >
                        <img src={img} alt="Proof" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    ))}
                    {claim.proofVideo && (
                      <div
                        onClick={() => setSelectedProofClaim(claim)}
                        className="rounded-lg h-16 w-16 border border-slate-700 bg-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 text-purple-400 transition"
                      >
                        <Video className="h-5 w-5" />
                        <span className="text-[9px] mt-0.5">Video</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProofClaim(claim)}
                    className="text-amber-400 hover:underline text-[11px] font-semibold"
                  >
                    View Full Evidence & Video Proof &rarr;
                  </button>
                </div>
              </div>

              {/* Action Buttons if Pending Review */}
              {claim.status === 'PENDING_SUPPLIER_REVIEW' && (
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setRejectReasonModalClaim(claim)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-rose-400 border border-slate-700 hover:border-rose-500/50 font-bold text-xs transition cursor-pointer"
                  >
                    Reject Claim (Dispute with Evidence)
                  </button>

                  <button
                    onClick={() => handleAcceptClaim(claim.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition cursor-pointer"
                  >
                    Accept Claim & Approve Replacement / Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Proof Media Lightbox Modal */}
      {selectedProofClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white">Inspection Evidence Proof</h3>
                <p className="text-xs text-slate-400">Claim #{selectedProofClaim.id} for Order {selectedProofClaim.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedProofClaim(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {selectedProofClaim.proofImages?.map((url, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-48 object-cover" />
                    <div className="p-2 text-[11px] text-slate-400 text-center font-mono">Photo Proof #{idx + 1}</div>
                  </div>
                ))}
              </div>

              {selectedProofClaim.proofVideo && (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
                  <div className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                    <Video className="h-4 w-4" />
                    <span>Customer Unboxing Video Inspection</span>
                  </div>
                  <video
                    src={selectedProofClaim.proofVideo}
                    controls
                    className="w-full h-48 rounded-lg bg-black"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProofClaim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
              >
                Close Evidence Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Explanation Modal */}
      {rejectReasonModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Dispute Claim Explanation</h3>
              <button
                onClick={() => setRejectReasonModalClaim(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Please enter the inspection finding justifying the claim rejection. This explanation will be shared with the dropshipper and admin mediation team.
            </p>

            <textarea
              rows={4}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="e.g. Physical inspection of submitted video shows warranty seal was forcefully peeled off after unboxing. Item does not qualify under check warranty."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-rose-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectReasonModalClaim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectClaim}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
              >
                Confirm Rejection & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
