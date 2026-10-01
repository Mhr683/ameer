import React, { useState } from 'react';
import {
  X,
  Tag,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  Eye,
  Sliders,
  Sparkles,
  Store,
  Phone
} from 'lucide-react';
import { WhiteLabelConfig, User } from '../types';

interface WhiteLabelBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveConfig: (config: WhiteLabelConfig) => void;
}

export const WhiteLabelBrandingModal: React.FC<WhiteLabelBrandingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveConfig,
}) => {
  const [storeName, setStoreName] = useState(
    currentUser.companyName || `${currentUser.name}'s Collection`
  );
  const [brandTagline, setBrandTagline] = useState('Premium Quality Direct to Your Doorstep');
  const [supportPhone, setSupportPhone] = useState(currentUser.phone || '0300-1234567');
  const [returnCity, setReturnCity] = useState(currentUser.city || 'Lahore');
  const [returnHubAddress, setReturnHubAddress] = useState('P.O. Box 54000, GPO Return Center');
  const [hideSupplierCost, setHideSupplierCost] = useState(true);
  const [hideYourMartBranding, setHideYourMartBranding] = useState(true);
  const [customInvoiceNote, setCustomInvoiceNote] = useState(
    'Thank you for shopping with us! For exchanges, please WhatsApp us within 48 hours.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config: WhiteLabelConfig = {
      storeName: storeName.trim(),
      brandTagline: brandTagline.trim(),
      supportPhone: supportPhone.trim(),
      returnCity: returnCity.trim(),
      returnHubAddress: returnHubAddress.trim(),
      hideSupplierCostOnFlyer: hideSupplierCost,
      hideYourMartBranding: hideYourMartBranding,
      customInvoiceNote: customInvoiceNote.trim(),
    };
    onSaveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">White-Label Flyer & Custom Invoice Settings</h3>
                <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-black text-teal-300 border border-teal-500/30">
                  100% Brand Protected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer ko parcel par sirf aapki brand ka naam aur aapka selling price nazar aayega.
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

        {/* Modal Content */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {savedSuccess && (
            <div className="rounded-xl border border-teal-500/40 bg-teal-950/40 p-3 text-teal-300 flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>White-label settings saved successfully! All flyers will use this brand.</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Your Store / Brand Name (Printed on Flyer):
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Zainab Fashion Hub"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Store Tagline / Slogan:</label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                placeholder="e.g. Trendy Pakistani Wear"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Customer Care WhatsApp Number:</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Origin City / Hub:</label>
              <input
                type="text"
                value={returnCity}
                onChange={(e) => setReturnCity(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Return Center Address:</label>
            <input
              type="text"
              value={returnHubAddress}
              onChange={(e) => setReturnHubAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Custom Invoice Footer Message:</label>
            <textarea
              rows={2}
              value={customInvoiceNote}
              onChange={(e) => setCustomInvoiceNote(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Privacy & Anti-Leak Toggles */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <span className="font-bold text-white text-xs block">Anti-Leak & Reseller Protection Safeguards:</span>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Hide Wholesale Cost & Supplier Identity:</span>
                <span className="text-[10px] text-slate-400">
                  Customer will NEVER see what you paid to the factory. Only customer selling price is visible.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideSupplierCost}
                onChange={(e) => setHideSupplierCost(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-900"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-slate-800/80 pt-2">
              <div>
                <span className="font-bold text-slate-200 block">Hide YourMart Platform Brand from Flyer:</span>
                <span className="text-[10px] text-slate-400">
                  Parcel will look 100% like it was shipped directly from your independent brand.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideYourMartBranding}
                onChange={(e) => setHideYourMartBranding(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-900"
              />
            </label>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">
              Customer Package Receipt Preview:
            </span>
            <div className="bg-white text-slate-900 rounded-xl p-3 border border-slate-300 font-sans text-[10px] space-y-2 shadow-inner">
              <div className="flex items-center justify-between border-b pb-1.5">
                <div>
                  <div className="font-black text-xs text-slate-950 uppercase">{storeName || 'YOUR STORE'}</div>
                  <div className="text-[9px] text-slate-600">{brandTagline}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Support: {supportPhone}</div>
                  <div className="text-[9px] text-slate-500">Shipped via Express Courier</div>
                </div>
              </div>

              <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                <span className="font-bold">Total Cash to Pay:</span>
                <span className="font-black font-mono text-xs text-slate-950">PKR 3,500</span>
              </div>

              <div className="text-[9px] text-slate-600 italic">{customInvoiceNote}</div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg transition cursor-pointer"
            >
              Save White-Label Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
