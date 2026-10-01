import React, { useState } from 'react';
import {
  Building2,
  Package,
  ShieldCheck,
  Check,
  ArrowLeft,
  Upload,
  ShoppingBag,
  ChevronUp,
  ExternalLink,
  QrCode,
  AlertCircle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Truck,
  DollarSign,
  Award,
  Boxes,
  PlayCircle,
  ArrowRight,
  Download,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { User, Store } from '../types';
import { PAKISTAN_CITIES, PAKISTAN_BANKS } from './RegisterModal';
import { FrontNavigationBar } from './FrontNavigationBar';

interface SupplierRegistrationViewProps {
  onRegisterSuccess: (newUser: User, newStore: Store) => void;
  onBackToLogin: () => void;
  onOpenDropshipperRegister: () => void;
  onNavigateHome?: () => void;
  onNavigateProducts?: () => void;
  onOpenWhatsNew?: () => void;
  onOpenLearningLibrary?: () => void;
  onOpenHelpSupport?: () => void;
  onExportProductsCSV?: () => void;
  onOpenBusinessDashboard?: () => void;
}

export const SupplierRegistrationView: React.FC<SupplierRegistrationViewProps> = ({
  onRegisterSuccess,
  onBackToLogin,
  onOpenDropshipperRegister,
  onNavigateHome,
  onNavigateProducts,
  onOpenWhatsNew,
  onOpenLearningLibrary,
  onOpenHelpSupport,
  onExportProductsCSV,
  onOpenBusinessDashboard,
}) => {
  // Form State - Basic Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cnic, setCnic] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // File Uploads
  const [profileImageName, setProfileImageName] = useState('');
  const [cnicFrontName, setCnicFrontName] = useState('');
  const [cnicBackName, setCnicBackName] = useState('');

  // Form State - Store & Billing Details
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessUrl, setBusinessUrl] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [aboutProducts, setAboutProducts] = useState('');

  // Product Images
  const [productImageNames, setProductImageNames] = useState<string[]>(['', '', '', '', '']);
  const [remarks, setRemarks] = useState('');

  // Bank & Payment Details
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [iban, setIban] = useState('');
  const [paymentCycle, setPaymentCycle] = useState('');

  // Agreement & Status
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // File Upload Handlers
  const handleFileUpload = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
    }
  };

  const handleProductImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setProductImageNames((prev) => {
        const next = [...prev];
        next[index] = fileName;
        return next;
      });
    }
  };

  // CNIC formatted input
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    setCnic(digits);
  };

  // WhatsApp formatted input
  const handleWhatsappChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setWhatsappNumber(digits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    if (!cnic || cnic.length < 13) {
      setErrorMessage('Please enter a valid 13-digit CNIC number.');
      return;
    }
    if (!whatsappNumber || whatsappNumber.length < 11) {
      setErrorMessage('Please enter a valid 11-digit WhatsApp number.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Physical address is required.');
      return;
    }
    if (!city) {
      setErrorMessage('Please select your city.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMessage('Business / Store Name is required.');
      return;
    }
    if (!bank) {
      setErrorMessage('Please select your settlement bank.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage('Account number is required.');
      return;
    }
    if (!accountName.trim()) {
      setErrorMessage('Account title / name is required.');
      return;
    }
    if (!paymentCycle) {
      setErrorMessage('Please select your preferred payment cycle.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must acknowledge and agree to YourMart Policies and business terms.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newUserId = `usr-${Date.now()}`;
      const newStoreId = `store-${Date.now()}`;

      const newUser: User = {
        id: newUserId,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: 'SUPPLIER',
        companyName: businessName.trim(),
        avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
        walletBalancePKR: 50000,
        phone: whatsappNumber,
        city: city,
        fullAddress: address.trim(),
        isRegistered: true,
      };

      const newStore: Store = {
        id: newStoreId,
        name: businessName.trim(),
        slug: businessName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
        logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
        ownerId: newUserId,
        ownerName: fullName.trim(),
        ownerType: 'SUPPLIER',
        ownerRole: 'SUPPLIER',
        city: city,
        rating: 5.0,
        totalOrders: 0,
        deliveryRating: '⚡ 2-3 Days Factory Dispatch (100% On-Time)',
        responseTime: '< 10 mins',
        description: `${businessType || 'Manufacturer'} - ${aboutBusiness || 'Direct factory supplier on YourMart'}. Settlement via ${bank}.`,
        isVerified: true,
        categories: ['Direct Factory Sourced', 'Bulk Wholesale'],
        warehouseAddress: address.trim(),
      };

      setIsSubmitting(false);
      setSuccessModal(true);

      setTimeout(() => {
        onRegisterSuccess(newUser, newStore);
      }, 1500);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="supplier-registration-page" className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button
              type="button"
              onClick={onNavigateHome || onBackToLogin}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
              title="Return to Website Frontpage"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
                YM
              </div>
              <span className="font-bold text-slate-800 tracking-tight text-sm">YourMart Supplier Portal</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome || onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition cursor-pointer"
            >
              <span>Home (Front Page)</span>
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline">Already registered?</span>
            <button
              onClick={onBackToLogin}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-wider"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Front Navigation Bar (9 Core Platform Buttons) */}
      <FrontNavigationBar
        variant="gateway"
        activeTab="supplier-registration"
        onNavigateHome={onNavigateHome || onBackToLogin}
        onNavigateProducts={onNavigateProducts || (() => {})}
        onOpenDropshipperRegister={onOpenDropshipperRegister}
        onOpenSupplierRegister={scrollToTop}
        onOpenWhatsNew={onOpenWhatsNew || (() => {})}
        onOpenLearningLibrary={onOpenLearningLibrary || (() => {})}
        onOpenHelpSupport={onOpenHelpSupport || (() => {})}
        onExportProductsCSV={onExportProductsCSV || (() => {})}
        onOpenBusinessDashboard={onOpenBusinessDashboard || onNavigateHome || onBackToLogin}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* SUPPLIER LANDING HERO BANNER (Exact from video 2:05) */}
        <section className="bg-gradient-to-r from-[#16325c] via-[#1c3f73] to-[#0f2240] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="text-base">🇵🇰</span>
              <span>FACTORY DIRECT & WHOLESALE SUPPLY NETWORK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Sell your products <br />
              <span className="text-amber-300">across Pakistan</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
              پہلے دوسرے پروڈکٹس پورے پاکستان میں بھیجیں وہ بھی بغیر کسی اضافی خرچ کے — Let thousands of active dropshippers market and sell your inventory nationwide while YourMart manages warehousing, courier delivery, and weekly bank settlements.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#supplier-registration-form"
                className="py-3.5 px-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>REGISTER AS SUPPLIER</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#supplier-orientation-kit"
                className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider transition border border-white/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Orientation Kit (PDF)</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-10 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
              alt="Supplier Logistics Trucks"
              className="w-full h-64 object-cover"
            />
          </div>
        </section>

        {/* 5-STEP SUPPLIER ROADMAP (Exact from video 2:08) */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              5 Simple Steps to Scale with YourMart
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {[
              { step: '01', title: 'Register as Supplier', desc: 'Submit business, CNIC & settlement bank details.' },
              { step: '02', title: 'Send Warehouse Inventory', desc: 'Consign your wholesale goods to our fulfillment hubs.' },
              { step: '03', title: 'Catalog Goes Live', desc: 'Your products are cataloged and made visible to resellers.' },
              { step: '04', title: 'Dropshippers Sell', desc: 'Thousands of sellers generate orders across Pakistan.' },
              { step: '05', title: 'Deliver & Get Paid', desc: 'We handle courier packing, and deposit payouts weekly.' },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-sky-400 hover:bg-sky-50/40 transition"
              >
                <span className="text-3xl font-black text-sky-700/40 font-mono">{s.step}</span>
                <div className="mt-3">
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8 SUPPLIER BENEFITS GRID + ORIENTATION VIDEO (Exact from video 2:12) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
                SUPPLIER ADVANTAGES
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Why Top Pakistani Manufacturers Partner with YourMart
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Nationwide Reach', desc: 'Access 200+ cities & towns across Pakistan' },
                { title: 'Hassle-Free Selling', desc: 'We take care of COD collections & customer inquiries' },
                { title: 'Zero Marketing Cost', desc: 'Resellers run ads for your products at their own cost' },
                { title: 'Weekly Bank Payouts', desc: 'Clear, timely transfers every week without delays' },
                { title: 'Smart Inventory Hub', desc: 'Live visibility into SKU stock levels & velocities' },
                { title: 'Free Registration', desc: 'No monthly subscription fees or upfront listing charges' },
                { title: 'Fast Dispute Resolution', desc: 'Dedicated Supplier Relationship desk via WhatsApp' },
                { title: 'Scalable Growth', desc: 'Expand from 10 orders to 2,000+ daily orders seamlessly' },
              ].map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{b.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#supplier-registration-form"
                className="inline-flex items-center gap-2 text-xs font-black text-sky-700 uppercase tracking-wider hover:text-sky-900"
              >
                <span>Jump to Registration Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#16325c] text-white rounded-3xl p-8 border border-slate-800 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                OFFICIAL VIDEO GUIDE
              </span>
              <h3 className="text-xl font-black mt-1">
                Become a Supplier With YourMart
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Watch our quick 3-minute video overview explaining inventory intake, barcode labels, and payment disbursements.
              </p>
            </div>

            <div className="aspect-video bg-black/40 rounded-2xl border border-white/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-amber-300 transition group">
              <PlayCircle className="w-16 h-16 text-amber-400 group-hover:scale-110 transition drop-shadow-md" />
              <span className="text-xs font-bold text-white mt-2">
                Watch Video Walkthrough
              </span>
              <span className="text-[10px] text-slate-400">Duration: 3 mins</span>
            </div>

            <div id="supplier-orientation-kit" className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-white">Supplier Orientation Kit</div>
                <div className="text-[10px] text-slate-300">PDF Guide & SLA Terms (2.4 MB)</div>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading YourMart Supplier Orientation Kit PDF...')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </section>

        {/* REGISTRATION FORM SECTION HEADER */}
        <div id="supplier-registration-form" className="text-center pt-8 border-t border-slate-200">
          <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
            GET STARTED TODAY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
            Supplier Registration
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            Fill out the form below to register your business and get verified for our wholesale vendor network.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: The Complete Form (70%) */}
            <div className="lg:col-span-8 space-y-12">
              {/* SECTION 1: Basic Information */}
              <section id="section-basic-information" className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Basic Information
                  </h2>
                </div>
                <p className="text-slate-600 text-sm -mt-3">
                  Kindly provide the required information by filling out the form below
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Please Enter your full name"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Please Enter your Email"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                    <p className="text-[11px] text-pink-600 mt-1 font-medium">
                      This will be used for your login
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Password <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Set your password"
                        className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-pink-600 mt-1 font-medium">
                      Please set your login password
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* CNIC with 13 prefix box */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      CNIC <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-bold">
                        13
                      </span>
                      <input
                        type="text"
                        value={cnic}
                        onChange={(e) => handleCnicChange(e.target.value)}
                        placeholder="Enter CNIC"
                        className="w-full px-3.5 py-2.5 rounded-r border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        maxLength={13}
                        required
                      />
                    </div>
                  </div>

                  {/* Whatsapp Number with 11 prefix box */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Whatsapp Number <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-bold">
                        11
                      </span>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => handleWhatsappChange(e.target.value)}
                        placeholder="Enter Whatsapp number"
                        className="w-full px-3.5 py-2.5 rounded-r border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete factory or warehouse address"
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    City <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    required
                  >
                    <option value="">Select from the following</option>
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profile Image, CNIC Front, CNIC Back Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Profile Image <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(setProfileImageName, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                    <p className="text-[11px] text-pink-600 mt-1">
                      Accept Format are .png, .jpg, .jpeg
                    </p>
                  </div>

                  {/* CNIC Front */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      🪪 CNIC Front <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(setCnicFrontName, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                    <p className="text-[11px] text-pink-600 mt-1">
                      Accept Format are .png, .jpg, .jpeg
                    </p>
                  </div>

                  {/* CNIC Back */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      🪪 CNIC Back <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(setCnicBackName, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                    <p className="text-[11px] text-pink-600 mt-1">
                      Accept Format are .png, .jpg, .jpeg
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Store & Billing Details */}
              <section id="section-store-billing" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Store & Billing Details
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Please complete the form with the necessary store and billing details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Business Type <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                      required
                    >
                      <option value="">Select from the following</option>
                      <option value="Manufacturer / Factory">Manufacturer / Factory</option>
                      <option value="Wholesaler / Direct Importer">Wholesaler / Direct Importer</option>
                      <option value="Brand Owner / OEM">Brand Owner / OEM</option>
                      <option value="Master Distributor">Master Distributor</option>
                    </select>
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Business Name <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Please Enter Name"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Business/Store URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Business/Store URL <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessUrl}
                      onChange={(e) => setBusinessUrl(e.target.value)}
                      placeholder="Facebook Page, if available"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Store Social Media Link (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Store Social Media Link <span className="text-rose-500 font-normal">( optional )</span>
                    </label>
                    <input
                      type="text"
                      value={socialMediaLink}
                      onChange={(e) => setSocialMediaLink(e.target.value)}
                      placeholder="Instagram, TikTok, or Website"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Tell us about your business */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tell us about your business <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={aboutBusiness}
                    onChange={(e) => setAboutBusiness(e.target.value)}
                    placeholder="Provide an overview of your manufacturing setup, wholesale operations, or dispatch capacity..."
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>

                {/* Tell us about your products */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tell us about your products <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={aboutProducts}
                    onChange={(e) => setAboutProducts(e.target.value)}
                    placeholder="List main product categories, monthly unit volume, and warranty terms..."
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
              </section>

              {/* SECTION 3: Product Images */}
              <section id="section-product-images" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Product Images
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Please attach pictures of YOUR PRODUCTS that you want us to sell (maximum 5 product images, 2MB size limit per image)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Product Image 1 (Required) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Image 1 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(0, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                  </div>

                  {/* Product Image 2 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Image 2 <span className="text-rose-500 font-normal">( optional )</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(1, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                  </div>

                  {/* Product Image 3 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Image 3 <span className="text-rose-500 font-normal">( optional )</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(2, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                  </div>

                  {/* Product Image 4 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Image 4 <span className="text-rose-500 font-normal">( optional )</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(3, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                  </div>

                  {/* Product Image 5 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Image 5 <span className="text-rose-500 font-normal">( optional )</span>
                    </label>
                    <div className="p-2 border border-slate-300 rounded bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(4, e)}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Comment/Remarks ( optional ) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Comment/Remarks <span className="text-rose-500 font-normal">( optional )</span>
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any special remarks regarding delivery or packaging..."
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </section>

              {/* SECTION 4: Bank & Settlement Details */}
              <section id="section-bank-details" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Bank & Payout Details
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Your sales revenue will be settled into this verified account.
                  </p>
                </div>

                {/* Select Bank */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Bank <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    required
                  >
                    <option value="">Select from the following</option>
                    {PAKISTAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="EasyPaisa Wallet">EasyPaisa Wallet</option>
                    <option value="JazzCash Wallet">JazzCash Wallet</option>
                    <option value="SadaPay">SadaPay</option>
                    <option value="NayaPay">NayaPay</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Account Number <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account or Mobile Number"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                    <p className="text-[11px] text-pink-600 mt-1">
                      In case of micro bank please add your number
                    </p>
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Account Name <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Title of account"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                    <p className="text-[11px] text-pink-600 mt-1">
                      Name which will be displayed on account
                    </p>
                  </div>
                </div>

                {/* IBAN ( optional ) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    IBAN <span className="text-rose-500 font-normal">( optional )</span>
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="PK..."
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                {/* Payment Cycle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Cycle <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={paymentCycle}
                    onChange={(e) => setPaymentCycle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    required
                  >
                    <option value="">Select from the following</option>
                    <option value="Daily Instant Settlement">Daily Instant Settlement</option>
                    <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
                    <option value="Bi-Weekly (15 Days)">Bi-Weekly (15 Days)</option>
                    <option value="Monthly Cycle">Monthly Cycle</option>
                  </select>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Your Information Summary Box (Exact from Screenshot 1 & 3) */}
            <div className="lg:col-span-4">
              <div
                id="supplier-summary-card"
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24 space-y-6"
              >
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Your Information Summary</h3>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    Details
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-100">
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-slate-500 font-medium">Full Name</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {fullName || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Email</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {email || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">CNIC</span>
                    <span className="font-semibold text-slate-900 text-right font-mono">
                      {cnic || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">WhatsApp Number</span>
                    <span className="font-semibold text-slate-900 text-right font-mono">
                      {whatsappNumber || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Address</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {address || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">City</span>
                    <span className="font-semibold text-slate-900 text-right">
                      {city || 'Select from the following'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Store Name</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {businessName || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Store URL</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {businessUrl || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Social Media Link</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {socialMediaLink || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Bank</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {bank || 'Select from the following'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Account Number</span>
                    <span className="font-semibold text-slate-900 text-right font-mono">
                      {accountNumber || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Account Name</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                      {accountName || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Account IBAN</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[150px] font-mono">
                      {iban || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <span className="text-slate-500 font-medium">Payment Cycle</span>
                    <span className="font-semibold text-slate-900 text-right">
                      {paymentCycle || 'Select from the following'}
                    </span>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700 leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span>
                      I acknowledge that I have read and agree to the YourMart Policies and business terms.
                    </span>
                  </label>
                </div>

                {/* CONFIRM AND REGISTER BUTTON (Exact from Screenshot 3) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded bg-[#525b68] hover:bg-[#3f4752] text-white font-bold tracking-wider text-xs uppercase transition shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registering Factory...</span>
                  ) : (
                    <span>CONFIRM AND REGISTER</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-slate-400">
                    Need Dropshipper account instead?{' '}
                    <button
                      type="button"
                      onClick={onOpenDropshipperRegister}
                      className="text-sky-600 font-semibold hover:underline"
                    >
                      Click here
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Welcome to YourMart Global Supplier Network, <strong>{businessName}</strong>. Your factory account has been approved. Redirecting to your Supplier Portal...
            </p>
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      {/* FOOTER (Exact Match from Screenshot 7) */}
      <footer className="bg-[#1b2533] text-slate-300 border-t border-slate-800/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-700/60">
            {/* Col 1 */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-md">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold tracking-wider text-white">YOURMART</div>
                  <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                    Project by EcomStartups
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                YourMart is Pakistan’s Smartest Dropshipping Platform, making online selling easy, simple, and risk-free.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> SECP & FBR Pakistan Certified
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">SELL ON YOURMART</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={onOpenDropshipperRegister}
                    className="hover:text-white transition flex items-center gap-1.5 text-left"
                  >
                    <span className="text-slate-600">▪</span> Dropshipper Registration
                  </button>
                </li>
                <li>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span className="text-emerald-400">▪</span> Supplier Registration (Active)
                  </span>
                </li>
              </ul>
              <div className="pt-3">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-white mb-2">TRACK YOUR SHIPMENT</h5>
                <p className="text-xs text-slate-400 leading-snug">
                  Integrated with TCS, Leopards, Trax, PostEx & Call Courier.
                </p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">RESOURCES</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Learning Library
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> 1-Click Export | Shopify
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> 1-Click Export | WooCommerce
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Dropshipper Orientation Kit
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">SUPPORT</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Guidelines
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> FAQs
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Policies & Profit Guard
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Get in Touch
                </li>
              </ul>
            </div>

            {/* Col 5 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                YOURMART DROPSHIPPING - WHATSAPP CHANNEL
              </h4>
              <p className="text-xs text-slate-400">Join to Stay Updated</p>
              <div className="bg-white p-2.5 rounded-xl inline-block shadow-md">
                <div className="w-24 h-24 bg-white flex flex-col items-center justify-center p-1 border border-slate-200 rounded">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
              </div>
              <div>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <span>Open WhatsApp Channel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} YourMart Global. All Rights Reserved. Built for Pakistan E-Commerce.</p>
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              title="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
