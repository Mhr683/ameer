import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Truck,
  Key,
  Bell,
  CheckCircle,
  Save,
  Clock,
  Phone,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { User as UserType, SupplierLogisticsConfig } from '../../types';

interface SupplierWarehouseSettingsProps {
  currentUser: UserType;
  onSaveConfig?: (config: SupplierLogisticsConfig) => void;
}

export const SupplierWarehouseSettings: React.FC<SupplierWarehouseSettingsProps> = ({
  currentUser,
  onSaveConfig,
}) => {
  // Warehouse Address Form
  const [warehouseName, setWarehouseName] = useState(
    currentUser.companyName || 'Karachi Central Wholesale Warehouse #1'
  );
  const [contactPerson, setContactPerson] = useState(currentUser.name || 'Haji Mohammad Rafiq');
  const [phone, setPhone] = useState(currentUser.phone || '0300-7654321');
  const [address, setAddress] = useState('Plot 42-B, Sector 15, Korangi Industrial Area');
  const [city, setCity] = useState('Karachi');
  const [postalCode, setPostalCode] = useState('74900');
  const [pickupHours, setPickupHours] = useState('10:00 AM - 05:00 PM (Mon - Sat)');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Gate 3 loading bay. Handover parcel manifest to supervisor. Contact warehouse guard on arrival.'
  );

  // Courier API Keys
  const [traxApiKey, setTraxApiKey] = useState('trx_live_98a72b14c9e8832a10');
  const [traxMerchantId, setTraxMerchantId] = useState('TRX-M-48912');
  const [postExApiToken, setPostExApiToken] = useState('pex_sec_83901bca90823');
  const [tcsAccount, setTcsAccount] = useState('TCS-EXP-77491');
  const [tcsSecretKey, setTcsSecretKey] = useState('tcs_live_sec_10924');
  const [leopardApiKey, setLeopardApiKey] = useState('lep_api_449012');
  const [autoCourierBooking, setAutoCourierBooking] = useState(true);

  // Stock Alerts
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config: SupplierLogisticsConfig = {
      warehouseAddress: {
        facilityName: warehouseName,
        contactPerson,
        phone,
        streetAddress: address,
        city,
        postalCode,
        operatingHours: pickupHours,
        specialInstructions,
      },
      courierApiKeys: {
        traxApiKey,
        traxMerchantId,
        postExApiToken,
        tcsAccountNumber: tcsAccount,
        tcsSecretKey,
        leopardApiKey,
      },
      lowStockThreshold,
      autoCourierBookingEnabled: autoCourierBooking,
    };

    if (onSaveConfig) {
      onSaveConfig(config);
    }
    showToast('Warehouse pickup settings & courier API configurations saved successfully!');
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
              <span className="rounded bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 border border-blue-500/30">
                MODULE 5
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Warehouse Settings & Logistics Config (Warehouse ki Setting)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure courier rider pickup address, direct Trax/PostEx/TCS API credentials for auto-booking, and inventory low-stock alert thresholds.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-black shadow-md shadow-emerald-950/40 transition cursor-pointer self-start lg:self-auto"
          >
            <Save className="h-4 w-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Warehouse Pickup Address */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <div>
                <h4 className="text-sm font-black text-white">Courier Rider Pickup Address</h4>
                <p className="text-[11px] text-slate-400">
                  Where Trax, PostEx, Leopard, and TCS van riders will arrive to collect packed dropship orders.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Pickup Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Warehouse / Facility Name *</span>
              </label>
              <input
                type="text"
                required
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Warehouse Supervisor / Contact *</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Rider Pickup Phone Number *</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Physical Street Address / Bay *</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Hub City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Faisalabad</option>
                <option>Rawalpindi / Islamabad</option>
                <option>Sialkot</option>
                <option>Multan</option>
                <option>Gujranwala</option>
                <option>Peshawar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Postal / Zip Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Daily Pickup Hours</span>
              </label>
              <input
                type="text"
                value={pickupHours}
                onChange={(e) => setPickupHours(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Special Gate / Rider Instructions</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Courier API Key Integrations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-black text-white">Courier Direct API Keys (Auto-Booking)</h4>
                <p className="text-[11px] text-slate-400">
                  Connect your Trax, PostEx, TCS, and Leopards merchant accounts to auto-generate tracking CNs in 1-Click.
                </p>
              </div>
            </div>

            {/* Auto Booking Toggle */}
            <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCourierBooking}
                onChange={(e) => setAutoCourierBooking(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
              />
              <span className="font-bold text-white text-xs">Auto-Book on 1-Click Accept</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trax API */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Trax Logistics
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">CONNECTED</span>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Trax API Key</label>
                <input
                  type="password"
                  value={traxApiKey}
                  onChange={(e) => setTraxApiKey(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Trax Merchant ID</label>
                <input
                  type="text"
                  value={traxMerchantId}
                  onChange={(e) => setTraxMerchantId(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            {/* PostEx API */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  PostEx Courier
                </span>
                <span className="text-[10px] text-blue-400 font-mono">CONNECTED</span>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">PostEx API Token</label>
                <input
                  type="password"
                  value={postExApiToken}
                  onChange={(e) => setPostExApiToken(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div className="text-[10px] text-slate-500 pt-3">
                Webhook callback configured for real-time delivery confirmations.
              </div>
            </div>

            {/* TCS Express */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  TCS Express (COD)
                </span>
                <span className="text-[10px] text-amber-400 font-mono">ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400">TCS Account #</label>
                  <input
                    type="text"
                    value={tcsAccount}
                    onChange={(e) => setTcsAccount(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Secret Key</label>
                  <input
                    type="password"
                    value={tcsSecretKey}
                    onChange={(e) => setTcsSecretKey(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Leopards Courier */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Leopards Courier
                </span>
                <span className="text-[10px] text-purple-400 font-mono">ACTIVE</span>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Leopards API Key</label>
                <input
                  type="password"
                  value={leopardApiKey}
                  onChange={(e) => setLeopardApiKey(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div className="text-[10px] text-slate-500 pt-3">
                Bulk pickup manifests auto-synced with station dispatcher.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Low Stock Alerts & Notifications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-black text-white">Low Stock Alerts & Notifications</h4>
              <p className="text-[11px] text-slate-400">
                Receive proactive warnings before popular wholesale SKUs run out of stock to prevent cancellation penalties.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">
                Global Low Stock Threshold (Units)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-amber-400 font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
              />
              <div className="text-[10px] text-slate-500">
                When SKU stock drops below this level, an alert banner will appear and you can 1-click restock.
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-slate-300">Notification Channels</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSoundAlerts}
                  onChange={(e) => setEnableSoundAlerts(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">Dashboard Visual Badge & Sound Notification</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300">SMS / WhatsApp Alert to Warehouse Manager</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition cursor-pointer"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
