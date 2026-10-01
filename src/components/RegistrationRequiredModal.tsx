import React, { useState } from 'react';
import {
  X,
  Lock,
  UserCheck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  Building,
  Sparkles,
  KeyRound,
  UserPlus,
  LogIn
} from 'lucide-react';
import { User, UserRole } from '../types';

export interface RegistrationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: (newUser: User) => void;
  onRegistrationSuccess?: (newUser: User) => void;
  onSelectExistingUser?: (user: User) => void;
  onSelectRegisteredUser?: (user: User) => void;
  existingUsers?: User[];
  allUsers?: User[];
  currentUser?: User;
  onOpenFullVerifiedRegistration?: () => void;
  pendingOrderSummary?: {
    productName?: string;
    totalAmountPKR?: number;
    itemsCount?: number;
  };
}

export const RegistrationRequiredModal: React.FC<RegistrationRequiredModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onRegistrationSuccess,
  onSelectExistingUser,
  onSelectRegisteredUser,
  existingUsers,
  allUsers,
  currentUser,
  onOpenFullVerifiedRegistration,
  pendingOrderSummary,
}) => {
  const [activeTab, setActiveTab] = useState<'quick-register' | 'switch-account'>('quick-register');

  // Quick form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'RESELLER' | 'CUSTOMER'>('RESELLER');
  const [businessName, setBusinessName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Baraye meherbani apna mukammal naam darj karein.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setFormError('Baraye meherbani durust WhatsApp ya Mobile number darj karein.');
      return;
    }
    if (!address.trim()) {
      setFormError('Parcel delivery ke liye mukammal pata (address) likhein.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@yourmart.pk`,
      phone: phone.trim(),
      city: city.trim(),
      fullAddress: address.trim(),
      role: role,
      companyName: businessName.trim() || (role === 'RESELLER' ? `${fullName}'s Store` : 'Retail Buyer'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      walletBalancePKR: 0,
      isRegistered: true,
      registeredAt: new Date().toISOString(),
      status: 'VERIFIED',
    };

    const registerFn = onRegistrationSuccess || onRegisterSuccess;
    if (registerFn) {
      registerFn(newUser);
    }
    onClose();
  };

  const usersList = existingUsers || allUsers || [];
  const validUsers = usersList.filter((u): u is User => Boolean(u && u.role && u.role !== 'ADMIN'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Protection Shield */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Order Book Karne Ke Liye Registration Zaroori Hai
                </h3>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-300 border border-amber-500/30">
                  Required
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Baghair register huwe koi bhi order place nahi ho sakta.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notice Info Box */}
        <div className="mx-6 mt-4 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 flex items-start gap-3 text-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            <p className="font-semibold text-emerald-300">
              Aap website par mukammal wholesale rates aur products muft browse kar saktay hain.
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Lekin Cash on Delivery (COD) parcel booking, courier tracking, aur profit payout ke liye aapka account hona lazmi hai taake parcel ghalti se cancel ya zaya na ho.
            </p>
            {pendingOrderSummary && (
              <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-slate-200 text-[11px]">
                <span>Pending Order: <b className="text-white">{pendingOrderSummary.productName || 'Store Order'}</b></span>
                {pendingOrderSummary.totalAmountPKR && (
                  <span className="font-mono font-bold text-emerald-400">
                    COD: PKR {pendingOrderSummary.totalAmountPKR.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Quick Register vs Switch Account */}
        <div className="flex border-b border-slate-800 px-6 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('quick-register')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'quick-register'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>1-Minute Fast Registration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('switch-account')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'switch-account'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Pehle Se Registered Hain? Login / Switch</span>
          </button>
        </div>

        {/* Tab 1: Fast Registration Form */}
        {activeTab === 'quick-register' && (
          <form onSubmit={handleQuickRegisterSubmit} className="p-6 space-y-4">
            {formError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs text-rose-300 font-medium">
                ⚠️ {formError}
              </div>
            )}

            {/* Account Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Aap kis hesiyat se order book kar rahe hain?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('RESELLER')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'RESELLER'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold">Dropshipper / Reseller</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Apne customer ke liye (With Profit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    role === 'CUSTOMER'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold">Direct Retail Buyer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Apne zaati istemal ke liye (COD)</span>
                </button>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Aapka Mukammal Naam *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Asad"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* City & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Shehar (City) *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Other">Other City</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {role === 'RESELLER' ? 'Store / Brand Name (Optional)' : 'Email (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'RESELLER' ? 'e.g. Trendz Hub PK' : 'user@gmail.com'}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Complete Delivery / Billing Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="House #, Street #, Sector / Area, Landmark, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullVerifiedRegistration();
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Factory ya Reseller Full Verified Partner Registration? (Click Here)
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-xs font-bold transition"
                >
                  Cancel (Browse Only)
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2 text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Register & Book Order</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Switch to Existing Account */}
        {activeTab === 'switch-account' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-400">
              Neeche diye gaye registered accounts mein se kisi aik ko select karke foran apna order confirm karein:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {validUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    const selectFn = onSelectRegisteredUser || onSelectExistingUser;
                    if (selectFn) {
                      selectFn(user);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-emerald-500/60 hover:bg-slate-800/80 transition text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || user.logo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={user.name || 'User'}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.companyName} • {user.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-800">
                      {user.role}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white"
              >
                Wapis Product Dekhne Jayein (Keep Browsing)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
