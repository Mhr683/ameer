import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  Building,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Sparkles,
  Info,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Product, ProfitGuardConfig, User } from '../types';
import { calculateWeightDelivery } from '../utils/weightDelivery';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  customSellingPrice?: number;
}

interface MultiProductCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  profitGuardConfig: ProfitGuardConfig;
  currentUser: User;
  onCheckoutOrder: (orderPayload: {
    items: { product: Product; quantity: number }[];
    totalAmount: number;
    customerDetails: {
      customerName: string;
      customerPhone: string;
      customerCity: string;
      customerAddress: string;
    };
    deliveryCharges: number;
    totalWeightKg: number;
  }) => void;
}

export const MultiProductCartDrawer: React.FC<MultiProductCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  profitGuardConfig,
  currentUser,
  onCheckoutOrder,
}) => {
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '');
  const [customerCity, setCustomerCity] = useState(currentUser.city || 'Lahore');
  const [customerAddress, setCustomerAddress] = useState(currentUser.fullAddress || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Identify supplier / store of items
  const storeName = cartItems[0]?.product.supplierName || 'Verified Wholesale Store';
  const storeId = cartItems[0]?.product.supplierId || 'supplier-1';

  // Calculate items total, supplier cost, and total weight
  const itemsSubtotalPKR = cartItems.reduce(
    (sum, item) => sum + (item.customSellingPrice || item.product.recSellingPricePKR) * item.quantity,
    0
  );

  const totalSupplierCostPKR = cartItems.reduce(
    (sum, item) => sum + item.product.supplierCostPKR * item.quantity,
    0
  );

  // Total parcel weight: sum of each product's weightKg * quantity
  const totalWeightKg = cartItems.reduce(
    (sum, item) => sum + (item.product.weightKg || 0.3) * item.quantity,
    0
  );

  // Weight-based delivery calculation
  const weightDelivery = calculateWeightDelivery(
    totalWeightKg,
    profitGuardConfig.defaultShippingCostPKR || 200,
    60 // Rs. 60 per additional kg in standard Pakistan logistics
  );

  const processingFeePKR = profitGuardConfig.processingFeePKR ?? 30;
  const platformFeePct = profitGuardConfig.platformFeePct ?? 2.0;
  const platformFeePKR = Math.round((itemsSubtotalPKR * platformFeePct) / 100);

  // Total payable by customer via COD
  const grandTotalCOD = itemsSubtotalPKR + weightDelivery.totalDeliveryPKR;

  // Gross profit for reseller
  const netProfitPKR = Math.max(0, itemsSubtotalPKR - totalSupplierCostPKR - processingFeePKR - platformFeePKR);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill customer name, phone number, and address');
      return;
    }

    setIsSubmitting(true);
    try {
      onCheckoutOrder({
        items: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
        totalAmount: grandTotalCOD,
        customerDetails: {
          customerName,
          customerPhone,
          customerCity,
          customerAddress,
        },
        deliveryCharges: weightDelivery.totalDeliveryPKR,
        totalWeightKg: weightDelivery.totalWeightKg,
      });
      onClearCart();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Store Cart & Single Delivery</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{storeName}</span>
                  <span className="text-slate-300">•</span>
                  <span>{cartItems.length} items</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse products from the same vendor and click "Add to Cart" to bundle them into one single parcel!
                </p>
              </div>
            ) : (
              <>
                {/* Same-Store Weight Courier Savings Banner */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs text-indigo-950 flex items-start gap-3 shadow-sm">
                  <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-900">Single Courier Delivery by Weight</span>
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Same Store
                      </span>
                    </div>
                    <p className="text-indigo-800 text-[11px] leading-relaxed">
                      Multiple cheezyn aik hi store se khreedne par alag delivery nahi lagti. Delivery charges wazan (weight) k hisaab se calculate hotay hain: 
                      <strong> 1st kg Rs. 200</strong>, aur mazeed har kg par sirf <strong>+Rs. 60</strong>.
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Products in this parcel ({cartItems.length})</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-rose-600 hover:text-rose-700 text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  {cartItems.map((item) => {
                    const unitPrice = item.customSellingPrice || item.product.recSellingPricePKR;
                    const itemWeight = item.product.weightKg || 0.3;
                    const itemTotalWeight = itemWeight * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-sm"
                      >
                        <img
                          src={item.product.image || item.product.images?.[0]}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-bold text-indigo-600">PKR {unitPrice.toLocaleString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-600">
                              <Scale className="w-3 h-3 text-slate-400" />
                              <span>{itemWeight} kg each</span>
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Subtotal weight: {itemTotalWeight.toFixed(2)} kg
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Weight & Delivery Fee Card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      <span>Total Parcel Weight:</span>
                    </span>
                    <span className="font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {weightDelivery.totalWeightKg} kg
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                    <div className="flex justify-between">
                      <span>Base Delivery (first 1.0 kg):</span>
                      <span className="font-semibold text-slate-800">PKR {weightDelivery.baseDeliveryPKR}</span>
                    </div>
                    {weightDelivery.extraWeightKg > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Extra Weight ({weightDelivery.extraWeightKg} kg / {weightDelivery.extraKgUnits} slab):</span>
                        <span className="font-semibold">+PKR {weightDelivery.extraDeliveryPKR}</span>
                      </div>
                    )}
                    <div className="pt-1 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                      <span>Consolidated Delivery Fee:</span>
                      <span className="text-indigo-600">PKR {weightDelivery.totalDeliveryPKR}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal:</span>
                      <span className="font-bold text-slate-900">PKR {itemsSubtotalPKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Order Fee:</span>
                      <span className="font-semibold text-emerald-600">PKR {processingFeePKR} (2% on Delivery)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">Total COD to Collect:</span>
                      <span className="text-lg font-black text-slate-900">
                        PKR {grandTotalCOD.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Checkout Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Customer Delivery Details</span>
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Bilal"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="0300-1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">City *</label>
                      <select
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Sialkot">Sialkot</option>
                        <option value="Gujranwala">Gujranwala</option>
                        <option value="Other">Other City</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Complete Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House #, Street #, Sector/Mohalla, Landmark"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Dispatching Parcel...'
                        : `Place Consolidated COD Order (PKR ${grandTotalCOD.toLocaleString()})`}
                    </span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Protected by Profit Guard™ & Trax/TCS Courier Weight Verification</span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
