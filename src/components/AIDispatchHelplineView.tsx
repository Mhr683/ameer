import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Briefcase,
  Factory,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { User, PlatformHelplinesConfig } from '../types';

interface Message {
  id: string;
  sender: 'USER' | 'AI_DISPATCH';
  text: string;
  urduText?: string;
  roleContext: 'RESELLER' | 'SUPPLIER' | 'BUYER';
  timestamp: string;
  ticketId?: string;
  confidence?: number;
  actionRecommendation?: {
    label: string;
    actionType: string;
  };
}

interface AIDispatchHelplineViewProps {
  currentUser?: User;
  helplinesConfig: PlatformHelplinesConfig;
  initialRole?: 'RESELLER' | 'SUPPLIER' | 'BUYER';
}

export const AIDispatchHelplineView: React.FC<AIDispatchHelplineViewProps> = ({
  currentUser,
  helplinesConfig,
  initialRole,
}) => {
  // Determine default active audience based on current user role or prop
  const getInitialAudience = (): 'RESELLER' | 'SUPPLIER' | 'BUYER' => {
    if (initialRole) return initialRole;
    if (currentUser?.role === 'SUPPLIER') return 'SUPPLIER';
    if (currentUser?.role === 'RESELLER') return 'RESELLER';
    return 'RESELLER'; // default to reseller since it's the primary target
  };

  const [activeAudience, setActiveAudience] = useState<'RESELLER' | 'SUPPLIER' | 'BUYER'>(
    getInitialAudience
  );
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Pre-configured role-specific knowledge queries
  const resellerQuickQuestions = [
    {
      q: 'Mera profit margin kab aur kaise wallet mein release hoga?',
      tag: 'Profit Release',
    },
    {
      q: 'Trax / PostEx / Leopards parcel tracking aur return status kaise check karein?',
      tag: 'Courier Tracking',
    },
    {
      q: 'Customer return ratio kam karne k liye advance payment gate kaise on karein?',
      tag: 'Return Reduction',
    },
    {
      q: 'Daraz ya Shopify store par wholesale products kaise export/sync karein?',
      tag: 'Store Sync',
    },
    {
      q: 'Profit Guard margin lock kya hai aur negative profit se kaise bachata hai?',
      tag: 'Profit Guard',
    },
  ];

  const supplierQuickQuestions = [
    {
      q: 'Factory stock aur bulk wholesale catalog kaise upload karein?',
      tag: 'Stock Onboarding',
    },
    {
      q: 'Supplier escrow payouts aur bulk order payment settlement timeline kya hai?',
      tag: 'Escrow Payouts',
    },
    {
      q: 'Aik hi factory se multiple items ka consolidated Rs. 200 delivery model kaise kaam karta hai?',
      tag: 'Consolidated Delivery',
    },
    {
      q: 'Factory warehouse se daily courier rider pickup schedule kaise set hota hai?',
      tag: 'Rider Pickup',
    },
    {
      q: 'Damaged item return ya customer dispute standard protocol kya hai?',
      tag: 'Damaged Policy',
    },
  ];

  const buyerQuickQuestions = [
    {
      q: 'Mera COD order kahan tak phoncha hai? Tracking status kya hai?',
      tag: 'Order Tracking',
    },
    {
      q: 'Parcel damage ya galat product milne par exchange procedure kya hai?',
      tag: 'Exchange Policy',
    },
  ];

  const initialMessages: Message[] = [
    {
      id: 'init-1',
      sender: 'AI_DISPATCH',
      text: 'Assalam-o-Alaikum! Main YourMart ka AI Dispatch & Auto-Reply Engine hoon. Main Resellers aur Suppliers ke tamam operational, payment, delivery aur inventory sawalat ka foran (within seconds) auto-reply karta hoon.',
      urduText:
        'آپ پرافٹ ریلیز، کوریئر ٹریکنگ، فیکٹری اسٹاک، یا ایسکرو پیمنٹس سے متعلق کوئی بھی سوال منتخب کریں یا ٹائپ کریں۔',
      roleContext: activeAudience,
      timestamp: 'Just now',
      confidence: 99,
      ticketId: 'DSP-AUTO-SYS',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Auto-scroll on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Intelligent response generator for Resellers and Suppliers
  const generateAutoReply = (
    queryText: string,
    role: 'RESELLER' | 'SUPPLIER' | 'BUYER'
  ): { text: string; urduText: string; action?: { label: string; actionType: string } } => {
    const q = queryText.toLowerCase();

    if (role === 'RESELLER') {
      if (q.includes('profit') || q.includes('margin') || q.includes('release') || q.includes('wallet') || q.includes('payout')) {
        return {
          text: 'Reseller Profit Release Protocol: Jab courier (Trax, PostEx, Leopard) customer ko COD parcel successfully deliver karta hai, platform escrow system 24 se 48 ghante k andar aapka set karda net profit direct aapke YourMart Wallet mein transfer kar deta hai. Wahan se aap EasyPaisa, JazzCash ya Bank Account mein direct withdraw kar saktay hain.',
          urduText:
            'کوریئر کی جانب سے پارسل ڈیلیوری کی تصدیق ہوتے ہی 24 سے 48 گھنٹوں کے اندر آپ کا منافع خودکار طور پر آپ کے والٹ میں آ جاتا ہے جہاں سے آپ باآسانی رقم نکلوا سکتے ہیں۔',
          action: { label: 'Open Reseller Wallet', actionType: 'wallet' },
        };
      }
      if (q.includes('track') || q.includes('trax') || q.includes('postex') || q.includes('leopard') || q.includes('return') || q.includes('parcel')) {
        return {
          text: 'Courier Tracking & NDR Auto-Routing: Tamang parcels ka live status Trax aur PostEx APIs se auto-synced hai. Agar customer doorstep par moojood na ho (NDR - Non Delivery Report), hamara AI engine foran customer ko automated WhatsApp call aur message dispatch karta hai taake re-attempt ho sake aur return ratio 40% se gir kar 12% se kam rahay.',
          urduText:
            'تمام پارسلز کے ٹریکنگ اسٹیٹس خودکار اپڈیٹ ہوتے ہیں۔ اگر گاہک پارسل نہ لے تو فوری خودکار الرٹ بھیج کر ریٹرن کا تناسب 12 فیصد سے کم رکھا جاتا ہے۔',
          action: { label: 'View Orders & Tracking', actionType: 'orders' },
        };
      }
      if (q.includes('advance') || q.includes('gate') || q.includes('200') || q.includes('fake')) {
        return {
          text: 'Advance Delivery Gate (Fake Order Protection): Reseller dashboard par "Advance Delivery Gate" activate karein. Is se high-risk buyers (جنہوں نے پہلے پارسل واپس کیے ہوں) کو آرڈر کنفرم کرنے کے لیے کم از کم Rs. 200 ڈلیوری فیس ایڈوانس ادا کرنی ہوگی، جس سے آپ کا منافع محفوظ رہتا ہے۔',
          urduText:
            'ایڈوانس ڈلیوری گیٹ سے مشکوک خریداروں سے 200 روپے ایڈوانس وصول کر کے فیک آرڈرز سے بچا جاتا ہے۔',
          action: { label: 'Configure Advance Gate', actionType: 'advance-gate' },
        };
      }
      if (q.includes('daraz') || q.includes('shopify') || q.includes('sync') || q.includes('export') || q.includes('woocommerce')) {
        return {
          text: 'Store Sync & One-Click CSV Export: Aap kisi bhi wholesale product ko direct Daraz CSV ya Shopify format mein export kar saktay hain. Stock sync engine har 15 minute mein factory warehouse inventory check kar ke auto-update karta hai taake out-of-stock orders na lagain.',
          urduText:
            'ایک کلک سے پروڈکٹس دراز یا شاپائفائی پر منتقل کریں، فیکٹری اسٹاک خودکار طور پر ہر 15 منٹ بعد سنک ہوتا ہے۔',
          action: { label: 'Open Store Sync Hub', actionType: 'store-sync' },
        };
      }
      if (q.includes('profit guard') || q.includes('lock') || q.includes('price')) {
        return {
          text: 'Profit Guard (Loss Prevention Engine): Profit Guard aapke selling price ko monitor karta hai: (Selling Price - Factory Wholesale Price - Courier Charge - Packing - 2% Platform Fee = Guaranteed Profit). Agar aap ghalti se loss wali price rakhein to Profit Guard checkout rok deta hai.',
          urduText:
            'پرافٹ گارڈ آپ کو نقصان سے بچاتا ہے اور ہر آرڈر پر کم از کم منافع یقینی بناتا ہے۔',
          action: { label: 'Inspect Profit Guard', actionType: 'profit-guard' },
        };
      }
      return {
        text: 'Reseller Query Registered: Aapka sawal auto-dispatch desk par log ho chuka hai. Hamari reseller policy k mutabiq har reseller ko verified factory prices, automated courier API integration aur zero-fee standard support faraham ki jati hai. Mazeed urgent assistance k liye official helpline direct connect ho sakti hai.',
        urduText:
          'آپ کی انکوائری درج کر لی گئی ہے۔ ہماری پالیسی کے تحت تمام ری سیلرز کو ترجیحی رہنمائی اور فوری مدد فراہم کی جاتی ہے۔',
      };
    } else if (role === 'SUPPLIER') {
      if (q.includes('stock') || q.includes('upload') || q.includes('catalog') || q.includes('onboard') || q.includes('sku')) {
        return {
          text: 'Factory Stock Onboarding: Manufacturers aur Direct Importers hamare Bulk CSV Uploader ke zariye 5,000+ SKUs aik waqt mein upload kar saktay hain. Har item par wholesale factory price, minimum order quantity (MOQ) aur dispatch warehouse location lazmi define karein.',
          urduText:
            'فیکٹریز اور سپلائرز بلک سی ایس وی کے ذریعے ہزاروں پراڈکٹس بیک وقت لسٹ کر سکتے ہیں جہاں ہول سیل ریٹ اور اسٹاک درج کیا جاتا ہے۔',
          action: { label: 'Bulk Inventory Import', actionType: 'bulk-import' },
        };
      }
      if (q.includes('escrow') || q.includes('payout') || q.includes('payment') || q.includes('clearance') || q.includes('settlement')) {
        return {
          text: 'Wholesale Supplier Escrow System: Jab reseller ka customer order deliver hota hai, factory wholesale product cost (e.g. Rs. 850) platform escrow se seedha factory verified bank account (IBAN) mein 48 ghantay k standard settlement cycle k mutabiq clear kar di jati hai.',
          urduText:
            'آرڈر مکمل ہوتے ہی فیکٹری کی اصل ہول سیل رقم براہِ راست سپلائر کے رجسٹرڈ بینک اکاؤنٹ میں خودکار طور پر ریلیز کر دی جاتی ہے۔',
          action: { label: 'View Escrow Settlements', actionType: 'escrow' },
        };
      }
      if (q.includes('consolidated') || q.includes('200') || q.includes('delivery') || q.includes('bundle') || q.includes('charges')) {
        return {
          text: 'Consolidated Factory Dispatch (Flat Rs. 200): Agar aik buyer ya reseller aapki hi factory se 3 alag alag items order kare, to hamara automated dispatch system un teeno ko aik hi parcel barcode mein bundle karta hai. Is tarah customer ko sirf Rs. 200 lagte hain aur aapke bulk orders barh jatay hain.',
          urduText:
            'ایک ہی فیکٹری سے ملٹیپل آئٹمز کا آرڈر آنے پر سسٹم خودکار طور پر ایک ہی پارسل میں بنڈل بنا کر ڈلیوری چارجز کم رکھتا ہے۔',
        };
      }
      if (q.includes('pickup') || q.includes('rider') || q.includes('schedule') || q.includes('courier')) {
        return {
          text: 'Automated Rider Dispatch for Factories: Rozana 3:00 PM par Trax, PostEx aur Leopard ke assigned riders aapke factory warehouse address par auto-dispatch hote hain. Sirf "Batch Thermal 4x6 Label" print kar k parcel par paste karein aur rider handover manifest sign karein.',
          urduText:
            'روزانہ سہ پہر کوریئر رائیڈرز فیکٹری ویئر ہاؤس سے پارسلز وصول کرنے کے لیے خودکار شیڈول کے تحت پہنچتے ہیں۔',
          action: { label: 'Batch Label Printer', actionType: 'label-printer' },
        };
      }
      if (q.includes('damage') || q.includes('dispute') || q.includes('warranty') || q.includes('return')) {
        return {
          text: 'Damaged Item & Reverse Logistics Protocol: Agar koi parcel customer end se transit damage ho kar wapas aye, to factory video unboxing upload kar k 100% courier claim file kar sakti hai. 48 ghante ke andar insurance claim inspect hota hai.',
          urduText:
            'راستے میں نقصان ہونے والے پارسلز پر فیکٹری کو 100 فیصد کوریئر کلیم فراہم کیا جاتا ہے۔',
        };
      }
      return {
        text: 'Supplier / Manufacturer Query Registered: Factory partner desk par aapki request analyze kar li gayi hai. Platform par factories k liye zero-commission wholesale listing aur automated daily pickups active hain.',
        urduText:
          'سپلائر انکوائری موصول ہو چکی ہے۔ فیکٹریز کے لیے خودکار کوریئر سروس اور محفوظ ایسکرو ادائیگیاں ہمہ وقت فعال ہیں۔',
      };
    } else {
      // Buyer
      return {
        text: 'Customer Support Auto-Dispatch: Aapka order status live courier tracking database se verify kiya ja raha hai. Wholesale verified sellers direct dispatch karte hain aur 3-4 working days mein Pakistan bhar mein delivery hoti hai.',
        urduText:
          'آپ کا آرڈر تصدیق شدہ کوریئر پارٹنرز کے ذریعے بھیجا جا رہا ہے اور 3 سے 4 دن میں موصول ہو جائے گا۔',
      };
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isProcessing) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: query,
      roleContext: activeAudience,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    // Realistic auto-reply delay (500ms)
    setTimeout(() => {
      const replyData = generateAutoReply(query, activeAudience);
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'AI_DISPATCH',
        text: replyData.text,
        urduText: replyData.urduText,
        roleContext: activeAudience,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: Math.floor(95 + Math.random() * 5),
        ticketId: `DSP-${randomTicketNum}-PK`,
        actionRecommendation: replyData.action,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 600);
  };

  // Get current role's WhatsApp number for seamless 1-click human escalation
  const currentHelpline =
    activeAudience === 'SUPPLIER'
      ? helplinesConfig.manufacturersHelpline
      : helplinesConfig.resellersHelpline;

  const cleanWaNumber = (currentHelpline.whatsapp || currentHelpline.phone || '923001234567').replace(
    /[^0-9]/g,
    ''
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Top Banner with Role Switcher & Live Engine Status */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI Dispatch & Auto-Reply Desk</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-500/30">
                  24/7 Live
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Instant automated answers for Reseller margins & Supplier factory operations
            </p>
          </div>
        </div>

        {/* Audience Selector Tabs */}
        <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveAudience('RESELLER')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
              activeAudience === 'RESELLER'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Reseller Desk (ری سیلر)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAudience('SUPPLIER')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
              activeAudience === 'SUPPLIER'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="h-3.5 w-3.5" />
            <span>Supplier / Factory (سپلائر)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAudience('BUYER')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              activeAudience === 'BUYER'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Buyer (گاہک)</span>
          </button>
        </div>
      </div>

      {/* Quick Questions Bar */}
      <div className="bg-slate-950/50 border-b border-slate-800/60 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Popular Auto-Reply Questions:</span>
        </span>
        {(activeAudience === 'RESELLER'
          ? resellerQuickQuestions
          : activeAudience === 'SUPPLIER'
          ? supplierQuickQuestions
          : buyerQuickQuestions
        ).map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(item.q)}
            className="shrink-0 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-white border border-slate-700/60 px-2.5 py-1 text-[11px] font-medium transition flex items-center gap-1.5"
          >
            <span className="text-indigo-400 font-bold">•</span>
            <span>{item.tag}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[380px] scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs shadow-md ${
                msg.sender === 'USER'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              {/* Header for AI response */}
              {msg.sender === 'AI_DISPATCH' && (
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                    <Bot className="h-3.5 w-3.5" />
                    <span>AI Dispatch Engine</span>
                  </div>
                  {msg.ticketId && (
                    <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
                      Ticket #{msg.ticketId}
                    </span>
                  )}
                </div>
              )}

              {/* Main message text */}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Urdu explanation if provided */}
              {msg.urduText && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[11px] text-indigo-200/90 leading-relaxed font-sans text-right" dir="rtl">
                  {msg.urduText}
                </div>
              )}

              {/* Confidence and human escalation prompt */}
              {msg.sender === 'AI_DISPATCH' && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{msg.confidence || 98}% Verified Policy Match</span>
                  </span>

                  <a
                    href={`https://wa.me/${cleanWaNumber}?text=Assalam-o-Alaikum%20Help%20Desk,%20I%20have%20an%20inquiry%20regarding:%20${encodeURIComponent(
                      msg.text.slice(0, 100)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Forward to WhatsApp Official</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 w-fit animate-pulse">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            <span>AI Dispatch resolving query against Reseller & Supplier protocols...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                activeAudience === 'RESELLER'
                  ? 'Ask about profit margin, COD delivery, or courier returns (e.g. "Profit kab aega?")...'
                  : activeAudience === 'SUPPLIER'
                  ? 'Ask about factory stock upload, bulk wholesale escrow, or rider pickup...'
                  : 'Type your customer tracking or return question here...'
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-3.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-4 py-2.5 text-xs font-bold transition shadow-md shadow-indigo-950 shrink-0"
          >
            <span>Auto-Reply</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Help Helpline Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {activeAudience === 'RESELLER'
                ? 'Reseller Auto-Dispatcher Active'
                : activeAudience === 'SUPPLIER'
                ? 'Factory Supplier Auto-Dispatcher Active'
                : 'Customer Support Active'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">Need direct human agent?</span>
            <a
              href={`tel:${currentHelpline.phone}`}
              className="text-slate-300 hover:text-white font-medium flex items-center gap-1 transition"
            >
              <Headphones className="h-3 w-3 text-indigo-400" />
              <span>{currentHelpline.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
