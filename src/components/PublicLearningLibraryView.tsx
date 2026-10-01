import React, { useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  QrCode,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  MessageCircle,
  Bell,
  User as UserIcon,
  Headphones,
  FileSpreadsheet,
  LayoutDashboard,
  X,
  Sparkles,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Download,
} from 'lucide-react';
import { PlatformHelplinesConfig } from '../types';

interface PublicLearningLibraryViewProps {
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onOpenDropshipperRegister: () => void;
  onOpenSupplierRegister: () => void;
  onOpenWhatsNew: () => void;
  onOpenHelpSupport: () => void;
  onExportProductsCSV: () => void;
  onOpenBusinessDashboard: () => void;
  onOpenLogin: () => void;
  cartCount: number;
  onOpenCart: () => void;
  helplinesConfig?: PlatformHelplinesConfig;
}

export const PublicLearningLibraryView: React.FC<PublicLearningLibraryViewProps> = ({
  onNavigateHome,
  onNavigateProducts,
  onOpenDropshipperRegister,
  onOpenSupplierRegister,
  onOpenWhatsNew,
  onOpenHelpSupport,
  onExportProductsCSV,
  onOpenBusinessDashboard,
  onOpenLogin,
  cartCount,
  onOpenCart,
  helplinesConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  const officialWhatsApp = helplinesConfig?.buyersHelpline?.whatsapp || '+92 300 1122334';

  const courses = [
    {
      id: 'c-1',
      title: 'Getting Started: YourMart Basics & Orientation',
      category: 'ORIENTATION',
      duration: '15 mins',
      modules: '4 Lessons',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      description:
        'A complete introduction to YourMart dropshipping engine. Learn how zero-investment selling works, how orders are routed, and how profits reach your bank account every week.',
      topics: [
        'How YourMart zero-stock dropshipping model works',
        'Navigating your Business Dashboard and profit wallet',
        'Choosing high-margin winning products in Pakistan',
        'Understanding COD, courier tracking and customer delivery',
      ],
    },
    {
      id: 'c-2',
      title: 'Dropshipping Tutorial Videos',
      category: 'DROPSHIPPING',
      duration: '35 mins',
      modules: '8 Lessons',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      description:
        'Deep dive into operational mechanics. Learn how to place manual and bulk orders, download product media kits, and generate customer dispatch labels.',
      topics: [
        'Step-by-step order booking with customer address & phone',
        'Setting your retail markup and calculating net margins',
        'Using Transparent-Window packaging to slash return rates',
        'Live courier dispatch status tracking with TCS, Trax and Leopards',
      ],
    },
    {
      id: 'c-3',
      title: 'Suppliers Tutorial Videos',
      category: 'SUPPLIERS',
      duration: '25 mins',
      modules: '6 Lessons',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      description:
        'Dedicated training for factory owners, manufacturers, and importers. Learn how to upload bulk catalogs, dispatch inventory to hubs, and receive weekly payouts.',
      topics: [
        'Uploading product inventory with wholesale pricing tiers',
        'Consignment dispatch to Karachi, Lahore and Rawalpindi hubs',
        'Inventory reconciliation and automatic re-order triggers',
        'Receiving automated bank transfers and JazzCash/Easypaisa payouts',
      ],
    },
    {
      id: 'c-4',
      title: 'Tools, Features & Updates',
      category: 'FEATURES',
      duration: '20 mins',
      modules: '5 Lessons',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      description:
        'Master the proprietary YourMart toolset: Profit Guard™, Return Control Center, Smart Margin Calculator, and 1-Click CSV export tools.',
      topics: [
        'Configuring Return Control Center to detect problematic pin codes',
        'Using the Smart Margin Calculator to factor courier charges',
        'Exporting CSV ready for Shopify and WooCommerce sync',
        'Automating customer WhatsApp order confirmation messages',
      ],
    },
    {
      id: 'c-5',
      title: 'Dropshipping Pro Tip Series',
      category: 'GROWTH',
      duration: '40 mins',
      modules: '10 Lessons',
      level: 'Pro',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
      description:
        'Advanced e-commerce tactics from top Pakistani dropshippers making over 100+ daily dispatched parcels across Punjab, Sindh, KPK, and Balochistan.',
      topics: [
        'Urdu WhatsApp confirmation script that drops returns by 65%',
        'Managing customer expectations with real product unboxing clips',
        'Handling address corrections before courier attempts delivery',
        'Building a repeatable viral ad strategy on Facebook and TikTok',
      ],
    },
    {
      id: 'c-6',
      title: 'Live Sessions & Insights',
      category: 'COMMUNITY',
      duration: '60 mins',
      modules: 'Live Recordings',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      description:
        'Watch recorded live workshops, weekly merchant Q&As, and discussions with verified wholesale factory suppliers in Faisalabad, Karachi, and Gujranwala.',
      topics: [
        'Monthly e-commerce trends in Pakistan',
        'Direct conversations with factory manufacturers',
        'Logistics updates during Eid and mega-sale events',
        'Q&A on tax, bank accounts, and Raast instant payouts',
      ],
    },
    {
      id: 'c-7',
      title: 'Step-by-Step Daraz Dropshipping with YourMart',
      category: 'DARAZ',
      duration: '45 mins',
      modules: '7 Lessons',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
      description:
        'Sell YourMart catalog products directly on Daraz Seller Center. We generate compliant Daraz shipping labels and drop parcels at Daraz hubs on your behalf.',
      topics: [
        'Creating compliant Daraz product listings with matching SKUs',
        'Uploading Daraz AWB air waybill PDFs to YourMart portal',
        'Same-day hub drop-off policy and Daraz SLA compliance',
        'Daraz commission calculation and profit margin auditing',
      ],
    },
    {
      id: 'c-8',
      title: 'Dropshipping Beginner Course',
      category: 'BEGINNER',
      duration: '50 mins',
      modules: '9 Lessons',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description:
        'Never sold online before? This step-by-step masterclass takes you from opening your first Facebook page or WhatsApp group to shipping your first 50 parcels.',
      topics: [
        'Setting up a high-converting Facebook store & Instagram profile',
        'Posting ready-made product pictures and Urdu product benefits',
        'Answering customer inquiries professionally via WhatsApp',
        'Collecting customer name, phone number, and full delivery address',
      ],
    },
    {
      id: 'c-9',
      title: 'Shopify Training from Beginner to Pro',
      category: 'SHOPIFY',
      duration: '55 mins',
      modules: '8 Lessons',
      level: 'Pro',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
      description:
        'Build a professional branded Shopify store in Pakistan. Use YourMart 1-click product CSV exports to populate hundreds of winning products in minutes.',
      topics: [
        'Installing free Shopify themes customized for Cash on Delivery',
        'Importing YourMart product CSV files with images and descriptions',
        'Setting up Pakistan Cash on Delivery (COD) custom checkout forms',
        'Connecting Facebook Pixel and running targeted conversion ads',
      ],
    },
  ];

  const filteredCourses = courses.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="public-learning-library" className="min-h-screen flex flex-col bg-[#f5f6f8] text-slate-800 font-sans">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-2 text-xs font-medium border-b border-[#214374] select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="font-extrabold tracking-wider uppercase flex items-center gap-2 text-xs sm:text-[13px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <button onClick={onOpenHelpSupport} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold">
              <Headphones className="w-3.5 h-3.5 text-amber-300" />
              <span>Contact Us</span>
            </button>
            <button onClick={onOpenCart || onNavigateProducts} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Cart ({cartCount})</span>
            </button>
            <button onClick={onOpenLogin} className="hover:text-amber-300 transition cursor-pointer font-bold">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-4 border-b border-[#214374]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={onNavigateHome}>
            <div className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center bg-gradient-to-br from-sky-600 to-indigo-800 shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight leading-none text-white">YOURMART</div>
              <div className="text-[10px] tracking-wider text-slate-300 font-bold uppercase mt-1">
                PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="flex items-center bg-white rounded-full p-1 pl-4 shadow-sm text-slate-800">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials, courses, and seller guides..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none pr-2"
              />
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#16325c] hover:bg-sky-800 text-white flex items-center justify-center shrink-0 transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href={`https://wa.me/${officialWhatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-left group hover:opacity-95 transition"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <MessageCircle className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-300 tracking-wider">WHATSAPP</span>
                <span className="text-sm font-extrabold text-white tracking-tight">{officialWhatsApp}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav className="w-full bg-white border-b border-slate-200 shadow-xs select-none sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs font-bold text-slate-700 tracking-wide">
            <button onClick={onNavigateHome} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              HOME
            </button>
            <button onClick={onNavigateProducts} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              PRODUCTS
            </button>
            <button onClick={onOpenDropshipperRegister} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              DROPSHIPPER REGISTRATION
            </button>
            <button onClick={onOpenSupplierRegister} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              SUPPLIER REGISTRATION
            </button>
            <button onClick={onOpenWhatsNew} className="hover:opacity-90 uppercase transition cursor-pointer py-1 flex items-center gap-1">
              <span>WHAT'S</span>
              <span className="text-amber-700 font-black bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                NEW
              </span>
            </button>
            <button className="text-sky-700 uppercase transition cursor-pointer py-1 border-b-2 border-sky-600 font-black">
              LEARNING LIBRARY
            </button>
            <button onClick={onOpenHelpSupport} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              HELP & SUPPORT
            </button>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onExportProductsCSV}
              className="bg-[#16325c] hover:bg-[#122748] text-white font-bold text-xs px-3.5 py-2 rounded-lg tracking-wider flex items-center gap-1.5 uppercase transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT PRODUCTS CSV</span>
            </button>
            <button
              onClick={onOpenBusinessDashboard}
              className="bg-[#16325c] hover:bg-sky-800 text-white font-black text-xs px-4 py-2 rounded-lg tracking-wider uppercase transition shadow-sm cursor-pointer flex items-center gap-1.5 border border-sky-700"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>BUSINESS DASHBOARD</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. LEARNING LIBRARY MAIN CONTENT */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 flex-1">
        {/* HERO BANNER WITH WHATSAPP QR CODE (Exact from video 2:30) */}
        <div className="bg-gradient-to-r from-[#16325c] via-[#1b3d6f] to-[#122748] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FREE E-COMMERCE ACADEMY FOR PAKISTAN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              YourMart Learning Library: <br />
              <span className="text-amber-300">Empowering Growth, Anytime, Anywhere!</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Access comprehensive video tutorials, operational blueprints, marketing scripts, and supplier orientation guides to master Pakistani e-commerce.
            </p>
          </div>

          {/* QR Code Box */}
          <div className="bg-white p-5 rounded-2xl text-slate-900 text-center shadow-xl z-10 shrink-0 border-2 border-amber-400/40">
            <div className="text-[11px] font-black uppercase text-slate-600 tracking-wider mb-2">
              SCAN ME
            </div>
            <QrCode className="w-28 h-28 text-slate-900 mx-auto" />
            <div className="mt-2 text-xs font-black text-sky-900 leading-tight">
              Join to Stay Updated <br />
              <span className="text-emerald-600 font-extrabold text-[10px] uppercase">
                WHATSAPP CHANNEL
              </span>
            </div>
          </div>
        </div>

        {/* 9 TUTORIAL COURSES GRID (Exact from video 2:32 - 2:40) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                All Training Courses & Video Tutorials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredCourses.length} comprehensive video tracks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-sky-700 flex items-center justify-center shadow-lg">
                        <PlayCircle className="w-7 h-7" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-[#16325c] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow">
                      {c.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                      <Clock className="w-3 h-3" />
                      {c.duration}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-700 transition">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    {c.modules} • {c.level}
                  </span>
                  <button
                    onClick={() => setSelectedCourse(c)}
                    className="text-xs font-black text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    <span>READ MORE...</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* COURSE DETAIL MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <PlayCircle className="w-16 h-16 text-amber-400 mb-2 drop-shadow-md cursor-pointer hover:scale-110 transition" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Video Masterclass Ready
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1 max-w-lg">
                  {selectedCourse.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Course Overview</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Key Learning Modules
                </h4>
                <div className="space-y-2">
                  {selectedCourse.topics.map((t: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={onOpenDropshipperRegister}
                  className="px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Apply in Practice: Register Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#16325c] text-white border-t border-[#214374] py-8 px-4 sm:px-8 mt-12 text-center text-xs">
        <p>© {new Date().getFullYear()} YourMart Pakistan. Empowering over 10,000+ local sellers.</p>
      </footer>
    </div>
  );
};
