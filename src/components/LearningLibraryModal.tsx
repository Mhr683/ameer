import React, { useState } from 'react';
import {
  X,
  BookOpen,
  PlayCircle,
  FileText,
  CheckCircle,
  Download,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Search,
} from 'lucide-react';

interface LearningLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenDarazCalc?: () => void;
}

export const LearningLibraryModal: React.FC<LearningLibraryModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenDarazCalc,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  if (!isOpen) return null;

  const guides = [
    {
      id: 'guide-1',
      category: 'DROPSHIPPING',
      categoryLabel: 'Dropshipping 101',
      title: 'How to Start Dropshipping in Pakistan Without Investment',
      readTime: '6 min read',
      level: 'Beginner',
      summary:
        'A comprehensive roadmap to starting your e-commerce journey with zero warehouse cost, using YourMart verified suppliers and express COD.',
      keyPoints: [
        'Select high-demand products with at least Rs. 500-1,200 profit margin.',
        'Use high-quality product images and Urdu descriptive bullet points.',
        'Always confirm customer orders via WhatsApp call before shipping.',
        'Track cash payouts daily in your YourMart wallet.',
      ],
      urduTip: 'Order confirmation WhatsApp call karne se customer return rate 60% tak kam ho jata hai.',
    },
    {
      id: 'guide-2',
      category: 'DARAZ',
      categoryLabel: 'Daraz Selling',
      title: 'Daraz Seller Mastery: Listing, SEO & Commission Breakdown',
      readTime: '8 min read',
      level: 'Intermediate',
      summary:
        'Master the Daraz marketplace algorithm, calculate exact commission deductions, and rank in the top search results in Pakistan.',
      keyPoints: [
        'Calculate Daraz Commission + VAT using the YourMart Daraz Calculator.',
        'Include primary search keywords in your Daraz product title.',
        'Maintain a 4.5+ star seller rating to win the Daraz Buy Box.',
        'Sync inventory regularly to prevent out-of-stock cancellation penalties.',
      ],
      urduTip: 'Daraz calculator use karke har item ka net profit pehle se calculate karen taake koi hidden loss na ho.',
    },
    {
      id: 'guide-3',
      category: 'MARKETING',
      categoryLabel: 'Shopify & Ads',
      title: 'Running High-Converting TikTok & Meta Ads for Pakistan',
      readTime: '7 min read',
      level: 'Advanced',
      summary:
        'Learn how to shoot engaging 15-second product demonstration videos and set up low-cost Meta & TikTok lead conversion campaigns.',
      keyPoints: [
        'Focus on "Problem Solving" or "Aesthetic" viral gadgets.',
        'Keep video hooks under 3 seconds with native Urdu voiceovers.',
        'Target major urban hubs: Karachi, Lahore, Rawalpindi/Islamabad, Faisalabad, Multan.',
        'Include "Cash on Delivery Available Across Pakistan" banner prominently.',
      ],
      urduTip: 'Video ads mein "Free Home Delivery" ya "Cash on Delivery" clear show karne se conversion 2x ho jati hai.',
    },
    {
      id: 'guide-4',
      category: 'LOGISTICS',
      categoryLabel: 'Logistics & COD',
      title: 'Managing Cash on Delivery & Reducing Return Rates (RTO)',
      readTime: '5 min read',
      level: 'Essential',
      summary:
        'Step-by-step framework to eliminate fake orders, avoid courier return charges, and ensure 85%+ delivery success.',
      keyPoints: [
        'Verify address completeness: House/Shop #, Street, Area, landmark, and City.',
        'Never dispatch orders with incomplete or invalid 11-digit phone numbers.',
        'Leverage YourMart Profit Guard automated blacklist risk check.',
        'Provide tracking link to customers via WhatsApp immediately upon dispatch.',
      ],
      urduTip: 'Courier dispatch ke waqt tracking ID customer ko WhatsApp par bhejain taake wo parcel receive karne ke liye cash ready rakhe.',
    },
    {
      id: 'guide-5',
      category: 'SOURCING',
      categoryLabel: 'Product Sourcing',
      title: 'Winning Product Sourcing: Evaluating Wholesale Quality',
      readTime: '6 min read',
      level: 'All Sellers',
      summary:
        'How to identify top-performing wholesale products, verify factory quality control, and negotiate bulk volumes.',
      keyPoints: [
        'Review supplier badges and fulfillment speed scores on YourMart.',
        'Order a sample piece to test functionality before launching ads.',
        'Check seasonal trends (Summer coolers, Winter warmers, Eid gifts).',
        'Export product catalogs into CSV for offline inventory forecasting.',
      ],
      urduTip: 'Export Products CSV tool use karke pure catalog ko Excel mein download kar ke pricing compare karen.',
    },
  ];

  const categories = [
    { id: 'ALL', label: 'All Guides' },
    { id: 'DROPSHIPPING', label: 'Dropshipping 101' },
    { id: 'DARAZ', label: 'Daraz Selling' },
    { id: 'MARKETING', label: 'Shopify & Ads' },
    { id: 'LOGISTICS', label: 'Logistics & COD' },
    { id: 'SOURCING', label: 'Product Sourcing' },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'ALL' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Learning Library</h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Free Access
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pakistan e-commerce, dropshipping masterclasses, and seller success guides.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Guides List / Article Detail */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeArticle ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <button
                onClick={() => setActiveArticle(null)}
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mb-2"
              >
                ← Back to All Guides
              </button>

              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {activeArticle.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500">{activeArticle.readTime}</span>
                  <span className="text-xs text-slate-500">• Level: {activeArticle.level}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{activeArticle.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{activeArticle.summary}</p>

                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Core Action Steps:
                  </h4>
                  <ul className="space-y-2">
                    {activeArticle.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeArticle.urduTip && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                    <span className="font-bold shrink-0 bg-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                      PRO TIP
                    </span>
                    <span>{activeArticle.urduTip}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setActiveArticle(guide)}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition bg-white cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        {guide.categoryLabel}
                      </span>
                      <span className="text-slate-400">{guide.readTime}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {guide.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenDarazCalc && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDarazCalc();
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Calculator className="h-3.5 w-3.5 text-emerald-600" />
                <span>Daraz Calculator</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateTab('catalog');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Explore Wholesale Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
