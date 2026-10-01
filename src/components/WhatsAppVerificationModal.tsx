import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Bot,
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Phone,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Order } from '../types';

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmVerification: (orderId: string, verifiedMethod: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
}

export const WhatsAppVerificationModal: React.FC<WhatsAppVerificationModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmVerification,
  onRejectOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'interactive-bot' | 'api-settings'>('interactive-bot');
  const [otpCode, setOtpCode] = useState('7829');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [botConversation, setBotConversation] = useState<
    { sender: 'BOT' | 'CUSTOMER'; text: string; time: string }[]
  >([]);
  const [simulatedCustomerReply, setSimulatedCustomerReply] = useState<'CONFIRMED' | 'CANCELLED' | 'PENDING'>('PENDING');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !order) return null;

  const orderId = order.id || order.orderNumber || 'ORD-1';
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;

  // Initialize bot greeting
  const handleStartBotFlow = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBotConversation([
      {
        sender: 'BOT',
        text: `Assalam-o-Alaikum ${order.customerName}! 🛍️\n\nAapka YourMart Order #${order.orderNumber || 'YM-892'} book ho chuka hai.\n\n📦 *Order Details:*\n• Total COD Amount: PKR ${order.sellingPricePKR.toLocaleString()}\n• Delivery City: ${order.customerCity}\n• Delivery Address: ${order.customerAddress}\n\nKya aap is order ki warehouse dispatch confirm karna chahte hain?`,
        time,
      },
    ]);
    setSimulatedCustomerReply('PENDING');
  };

  const handleSimulateCustomerReply = (choice: 'CONFIRM' | 'CANCEL') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (choice === 'CONFIRM') {
      setBotConversation((prev) => [
        ...prev,
        { sender: 'CUSTOMER', text: '1 - Haan mera order confirm karein, bhej dein! ✅', time },
        {
          sender: 'BOT',
          text: `Shukriya ${order.customerName}! Aapka COD Order confirm ho chuka hai. 🚚 Courier team jald tracking number issue karegi. OTP: *${otpCode}* verified.`,
          time,
        },
      ]);
      setSimulatedCustomerReply('CONFIRMED');
    } else {
      setBotConversation((prev) => [
        ...prev,
        { sender: 'CUSTOMER', text: '2 - Cancel karein, mujhe nahi chahiye. ❌', time },
        {
          sender: 'BOT',
          text: 'Theek hai, aapka order cancel kar diya gaya hai aur warehouse dispatch rokh di gayi hai.',
          time,
        },
      ]);
      setSimulatedCustomerReply('CANCELLED');
    }
  };

  const handleApplyOrderConfirmation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onConfirmVerification(orderId, 'WhatsApp Interactive Bot (Customer 1-Confirm)');
      setIsVerifying(false);
      onClose();
    }, 600);
  };

  const handleApplyOrderCancellation = () => {
    onRejectOrder(orderId, 'Customer cancelled via WhatsApp Bot prompt');
    onClose();
  };

  const handleVerifyEnteredOtp = () => {
    if (enteredOtp.trim() === otpCode || enteredOtp.trim() === '1234') {
      onConfirmVerification(orderId, `WhatsApp OTP Verified (${enteredOtp})`);
      onClose();
    } else {
      alert('Ghalat OTP! Customer ko bheja gaya OTP code "7829" hai.');
    }
  };

  const waDirectUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${order.customerName}, YourMart par aapka COD order #${order.orderNumber} (PKR ${order.sellingPricePKR.toLocaleString()}) receive hua hai. Baraye meherbani reply mein 1 likh kar confirm karein.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Automated WhatsApp COD Verification</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                  Bot Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Order #{order.orderNumber} • {order.customerName} ({order.customerPhone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('interactive-bot')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'interactive-bot'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Interactive WhatsApp Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('api-settings')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'api-settings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Meta WhatsApp Cloud API Config</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'interactive-bot' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: WhatsApp Chat Simulation */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 flex flex-col h-[380px] overflow-hidden">
                {/* WhatsApp Top Bar */}
                <div className="bg-[#075E54] px-3.5 py-2.5 flex items-center justify-between text-white shadow">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-400/20 border border-emerald-300 flex items-center justify-center text-xs font-bold text-white">
                      YM
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1">
                        <span>YourMart Official Bot</span>
                        <ShieldCheck className="h-3 w-3 text-emerald-300" />
                      </div>
                      <div className="text-[10px] text-emerald-200">Verified Business Account</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">Online</span>
                </div>

                {/* WhatsApp Messages View */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#0b141a]/95 text-xs">
                  {botConversation.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                      <MessageSquare className="h-8 w-8 text-slate-600 mb-2" />
                      <p className="text-xs font-medium text-slate-400">Bot abhi customer ko message send karega</p>
                      <button
                        onClick={handleStartBotFlow}
                        className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition cursor-pointer"
                      >
                        Send Auto Verification Message
                      </button>
                    </div>
                  ) : (
                    botConversation.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          msg.sender === 'BOT' ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-2.5 text-[11px] leading-relaxed shadow ${
                            msg.sender === 'BOT'
                              ? 'bg-[#202c33] text-slate-100 rounded-tl-sm'
                              : 'bg-[#005c4b] text-white rounded-tr-sm'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.text}</div>
                          <div className="mt-1 text-[9px] text-right text-slate-400">{msg.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Simulated Customer Actions footer */}
                {botConversation.length > 0 && simulatedCustomerReply === 'PENDING' && (
                  <div className="p-2 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">Simulate Buyer:</span>
                    <button
                      onClick={() => handleSimulateCustomerReply('CONFIRM')}
                      className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                    >
                      Reply 1 (Confirm)
                    </button>
                    <button
                      onClick={() => handleSimulateCustomerReply('CANCEL')}
                      className="flex-1 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition cursor-pointer"
                    >
                      Reply 2 (Cancel)
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Actions & Manual OTP Entry */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">4-Digit Security OTP:</span>
                    <span className="font-mono text-base font-black text-amber-400 tracking-widest bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                      {otpCode}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Customer ke mobile number par SMS/WhatsApp ke zariye ye 4-digit code send hua hai:
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-center font-mono font-bold text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={handleVerifyEnteredOtp}
                      className="px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {/* Direct WhatsApp manual chat link */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Manual WhatsApp Web Chat:</span>
                    <a
                      href={waDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Open WhatsApp Web</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Agar bot reply na kare to aap direct customer se WhatsApp par baat karke order confirm kar sakte hain.
                  </p>
                </div>

                {/* Result Decision Panel */}
                {simulatedCustomerReply === 'CONFIRMED' && (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Customer Verified Order on WhatsApp!</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Customer ne dispatch ki tasdeeq kar di hai. Ab ye order warehouse me packaging aur courier assignment ke liye tayyar hai.
                    </p>
                    <button
                      onClick={handleApplyOrderConfirmation}
                      disabled={isVerifying}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-900/30 cursor-pointer"
                    >
                      {isVerifying ? 'Updating Order Status...' : 'Apply Status: COD_CONFIRMED'}
                    </button>
                  </div>
                )}

                {simulatedCustomerReply === 'CANCELLED' && (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Customer Cancelled Order (RTO Avoided!)</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Customer ne lene se inkar kar diya. Packaging se pehle cancel karne se courier delivery charges (Rs. 250) bach gaye!
                    </p>
                    <button
                      onClick={handleApplyOrderCancellation}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-900/30 cursor-pointer"
                    >
                      Mark Order as CANCELLED (Save RTO)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'api-settings' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Meta WhatsApp Cloud API Credentials</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    Production Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Phone Number ID:</label>
                    <input
                      type="text"
                      readOnly
                      value="109283918237192"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">WABA ID (WhatsApp Business Account):</label>
                    <input
                      type="text"
                      readOnly
                      value="waba_pk_yourmart_9921"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Webhook URL for Interactive Callbacks:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://api.yourmart.pk/v1/webhook/whatsapp-cod-verification"
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 font-mono text-xs"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://api.yourmart.pk/v1/webhook/whatsapp-cod-verification');
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <span className="font-bold text-white text-xs">Pre-Approved Template: ym_order_cod_verify_v2 (Urdu + English)</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Assalam-o-Alaikum &#123;&#123;customer_name&#125;&#125;, aapka YourMart Order #&#123;&#123;order_number&#125;&#125; (Total Rs. &#123;&#123;total_pkr&#125;&#125;) confirm karne ke liye 1 dabayein ya 'Confirm' reply karein."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Meta Green Badge • Zero cost on customer-initiated sessions</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartBotFlow}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
