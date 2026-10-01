import React, { useState } from 'react';
import {
  Package,
  Printer,
  UploadCloud,
  CheckCircle,
  Clock,
  Truck,
  Search,
  Filter,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { SupplierTrackingUploadModal } from '../SupplierTrackingUploadModal';
import { BulkLabelPrinterModal } from '../BulkLabelPrinterModal';

interface SupplierOrderDeskProps {
  orders: Order[];
  onDispatchOrder?: (orderId: string, courierName: string, trackingNumber: string) => void;
  onBulkDispatchOrders?: (dispatches: { orderId: string; courierName: string; trackingNumber: string }[]) => void;
  onBatchAcceptAndPack?: (orderIds: string[]) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const SupplierOrderDesk: React.FC<SupplierOrderDeskProps> = ({
  orders,
  onDispatchOrder,
  onBulkDispatchOrders,
  onBatchAcceptAndPack,
  onUpdateOrderStatus,
}) => {
  const [activeSubFilter, setActiveSubFilter] = useState<'ALL' | 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showLabelPrinter, setShowLabelPrinter] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber && o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerCity && o.customerCity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.items && o.items.some((i) => i.name?.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku?.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeSubFilter === 'PENDING') {
      return o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION';
    }
    if (activeSubFilter === 'PROCESSING') {
      return o.status === 'PROCESSING' || o.status === 'PACKED';
    }
    if (activeSubFilter === 'DISPATCHED') {
      return o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY';
    }
    if (activeSubFilter === 'DELIVERED') {
      return o.status === 'DELIVERED';
    }
    return true;
  });

  // Pending queue count
  const pendingOrders = orders.filter(
    (o) => o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION'
  );
  const processingOrders = orders.filter(
    (o) => o.status === 'PROCESSING' || o.status === 'PACKED'
  );
  const dispatchedOrders = orders.filter(
    (o) => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY'
  );

  // Toggle selection
  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id || ''));
    }
  };

  // 1-Click Bulk Accept & Pack
  const handleBulkAccept = () => {
    const targetIds = selectedOrderIds.length > 0 
      ? selectedOrderIds 
      : pendingOrders.map((o) => o.id || '');
    
    if (targetIds.length === 0) {
      showToast('No pending orders to accept and pack.');
      return;
    }

    if (onBatchAcceptAndPack) {
      onBatchAcceptAndPack(targetIds);
    } else if (onUpdateOrderStatus) {
      targetIds.forEach((id) => onUpdateOrderStatus(id, 'PROCESSING'));
    }
    setSelectedOrderIds([]);
    showToast(`⚡ ${targetIds.length} orders shifted to "In-Processing & Packed" status!`);
  };

  // Copy tracking number
  const handleCopy = (cn: string) => {
    navigator.clipboard.writeText(cn);
    setCopiedTracking(cn);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 text-white px-5 py-3 shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold text-sm animate-bounce">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action & Controls Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 border border-amber-500/30">
                MODULE 1
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Order Management Desk (Orders ki Processing)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Process customer dropshipping orders, 1-Click Bulk Accept, print 4x6 thermal shipping barcodes, and upload courier tracking IDs.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1-Click Bulk Accept & Pack */}
            <button
              onClick={handleBulkAccept}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md transition cursor-pointer"
              title="1-Click Bulk Accept & Pack: Shift orders to In-Processing"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>1-Click Bulk Accept & Pack ({pendingOrders.length})</span>
            </button>

            {/* 4x6 Thermal Label Printer */}
            <button
              onClick={() => setShowLabelPrinter(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
              title="Print Courier Shipping Labels with Barcodes & QR codes"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>Bulk 4x6 Thermal Labels</span>
            </button>

            {/* Courier Booking & Tracking CN Upload */}
            <button
              onClick={() => setShowTrackingModal(true)}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
              title="Upload Tracking ID (Manual, Direct API Booking, or Bulk CSV)"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Courier Booking & CN Upload</span>
            </button>
          </div>
        </div>

        {/* Operational Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div 
            onClick={() => setActiveSubFilter('PENDING')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              activeSubFilter === 'PENDING' 
                ? 'bg-amber-500/15 border-amber-500/50' 
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-semibold">Pending Orders Queue</div>
            <div className="text-xl font-black font-mono text-amber-400 mt-1">{pendingOrders.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Needs Accept & Pack</div>
          </div>

          <div 
            onClick={() => setActiveSubFilter('PROCESSING')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              activeSubFilter === 'PROCESSING' 
                ? 'bg-blue-500/15 border-blue-500/50' 
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-semibold">In-Processing & Packed</div>
            <div className="text-xl font-black font-mono text-blue-400 mt-1">{processingOrders.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ready for Courier Handover</div>
          </div>

          <div 
            onClick={() => setActiveSubFilter('DISPATCHED')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              activeSubFilter === 'DISPATCHED' 
                ? 'bg-purple-500/15 border-purple-500/50' 
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-semibold">Dispatched / In-Transit</div>
            <div className="text-xl font-black font-mono text-purple-400 mt-1">{dispatchedOrders.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Courier CN Active</div>
          </div>

          <div 
            onClick={() => setActiveSubFilter('DELIVERED')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              activeSubFilter === 'DELIVERED' 
                ? 'bg-emerald-500/15 border-emerald-500/50' 
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] text-slate-400 font-semibold">Successfully Delivered</div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-1">
              {orders.filter((o) => o.status === 'DELIVERED').length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Payment Settled to Wallet</div>
          </div>
        </div>

        {/* Filter and Search Sub-bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Subfilter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {(['ALL', 'PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveSubFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeSubFilter === filter
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All Orders' : filter}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search Order #, SKU, City, CN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={selectAllFiltered}
                    className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Order Details</th>
                <th className="p-3.5">Destination</th>
                <th className="p-3.5">Items & SKUs</th>
                <th className="p-3.5">Wholesale Cost Total</th>
                <th className="p-3.5">Courier & Tracking CN</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-500">
                    <Package className="h-10 w-10 mx-auto mb-2 text-slate-600 opacity-50" />
                    <p className="text-sm font-semibold">No orders match the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id || '');
                  const itemsCount = order.items?.reduce((sum, item) => sum + item.qty, 0) || 1;

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-800/50 transition ${isSelected ? 'bg-amber-500/5' : ''}`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id || '')}
                          className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white font-mono">{order.orderNumber || order.id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{order.customerCity || 'Karachi'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={order.customerAddress}>
                          {order.customerAddress || 'Direct Dropship Consignment'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-1 rounded">
                                {item.sku || 'SKU-GEN'}
                              </span>
                              <span className="text-slate-300 truncate max-w-[160px]" title={item.name}>
                                {item.name || 'Wholesale Product'}
                              </span>
                              <span className="text-slate-400 font-bold">x{item.qty}</span>
                            </div>
                          ))}
                          {(order.items?.length || 0) > 2 && (
                            <div className="text-[10px] text-slate-400 italic">
                              +{(order.items?.length || 0) - 2} more items
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-emerald-400 text-sm">
                          PKR {(order.supplierCostPKR || 1200).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">Escrow Protected</div>
                      </td>

                      <td className="p-3.5">
                        {order.trackingNumber ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                {order.trackingNumber}
                              </span>
                              <button
                                onClick={() => handleCopy(order.trackingNumber || '')}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                                title="Copy Consignment Number"
                              >
                                {copiedTracking === order.trackingNumber ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-purple-300 font-medium flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>{order.courierName || 'Trax Courier'}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                            Awaiting Courier CN
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'DISPATCHED' || order.status === 'IN_TRANSIT'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : order.status === 'PROCESSING' || order.status === 'PACKED'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.status === 'COD_CONFIRMED' || order.status === 'PENDING_VERIFICATION' ? 'PENDING PACK' : order.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If pending pack, show Accept & Pack */}
                          {(order.status === 'COD_CONFIRMED' || order.status === 'PENDING_VERIFICATION') && (
                            <button
                              onClick={() => {
                                if (onUpdateOrderStatus) onUpdateOrderStatus(order.id || '', 'PROCESSING');
                                showToast(`Order ${order.orderNumber} accepted & packed!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition cursor-pointer"
                            >
                              Accept & Pack
                            </button>
                          )}

                          {/* Quick Courier CN Upload */}
                          {!order.trackingNumber && (
                            <button
                              onClick={() => setShowTrackingModal(true)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition cursor-pointer"
                              title="Book Courier or Enter CN"
                            >
                              + Add CN
                            </button>
                          )}

                          {/* Live Track if dispatched */}
                          {order.trackingNumber && (
                            <button
                              onClick={() => {
                                window.open(`https://sonic.pk/tracking?cn=${order.trackingNumber}`, '_blank');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] inline-flex items-center gap-1 transition"
                            >
                              <span>Track</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Modals */}
      <SupplierTrackingUploadModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        orders={orders}
        onDispatchOrder={(orderId, courierName, trackingNumber) => {
          if (onDispatchOrder) onDispatchOrder(orderId, courierName, trackingNumber);
          showToast(`Order ${orderId} dispatched via ${courierName}! CN: ${trackingNumber}`);
        }}
        onBulkDispatchOrders={(dispatches) => {
          if (onBulkDispatchOrders) onBulkDispatchOrders(dispatches);
          showToast(`Batch dispatched ${dispatches.length} orders successfully!`);
        }}
      />

      <BulkLabelPrinterModal
        isOpen={showLabelPrinter}
        onClose={() => setShowLabelPrinter(false)}
        orders={filteredOrders}
      />
    </div>
  );
};
