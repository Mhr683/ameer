import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Search,
  Filter,
  Paperclip,
  DollarSign,
  ShieldCheck,
  Building2,
  UserCheck
} from 'lucide-react';
import { SupportTicket, User, Order } from '../types';

interface SupportDisputeDeskViewProps {
  currentUser: User;
  orders: Order[];
  onRefundDispute?: (resellerId: string, amountPKR: number, reason: string) => void;
  onLogAudit?: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-7801',
    ticketNumber: 'YM-TCK-7801',
    userId: 'usr-2',
    userName: 'Ali Raza (Reseller)',
    userEmail: 'ali.raza@yourmart.pk',
    category: 'Delayed Parcel Investigation',
    subject: 'Order YM-98215 delivery delayed by 4 days in Karachi hub',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'Ali Raza',
        senderRole: 'RESELLER',
        text: 'Customer keh raha hai ke 4 din ho gaye parcel Karachi transit station par ruka hua hai. Please courier team se escalation karwayein.',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'Asad Malik (Support Staff)',
        senderRole: 'ADMIN',
        text: 'Trax logistics ke Karachi zonal manager ko ticket escalate kar di gayi hai. Rider aaj shaam 5 baje tak customer ko deliver karega.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'TCK-7802',
    ticketNumber: 'YM-TCK-7802',
    userId: 'usr-2',
    userName: 'Ali Raza (Reseller)',
    userEmail: 'ali.raza@yourmart.pk',
    category: 'Wrong Item Shipped by Supplier',
    subject: 'Customer received Black color instead of Gold Hair Trimmer',
    status: 'OPEN',
    priority: 'URGENT',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    messages: [
      {
        id: 'msg-3',
        sender: 'Ali Raza',
        senderRole: 'RESELLER',
        text: 'Mene Gold variant book kia tha lekin factory ne Black bhej diya. Customer exchange maang raha hai. Supplier se free return pickup karwayein.',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  },
  {
    id: 'TCK-7798',
    ticketNumber: 'YM-TCK-7798',
    userId: 'usr-1',
    userName: 'Haji Aslam (Factory Supplier)',
    category: 'Payment Reconciliation',
    subject: 'Weekly wholesale remittance credited successfully',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      {
        id: 'msg-4',
        sender: 'Haji Aslam',
        senderRole: 'SUPPLIER',
        text: 'Hamare 12 delivered orders ki wholesale payment reconcile ho gayi hai. Shukriya.',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'msg-5',
        sender: 'Platform Finance Desk',
        senderRole: 'ADMIN',
        text: 'Ticket resolved and closed.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  },
];

export const SupportDisputeDeskView: React.FC<SupportDisputeDeskViewProps> = ({
  currentUser,
  orders,
  onRefundDispute,
  onLogAudit,
}) => {
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [activeTicket, setActiveTicket] = useState<SupportTicket>(tickets[0]);
  const [newReplyText, setNewReplyText] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New Ticket Form state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Delayed Parcel Investigation');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [newDescription, setNewDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      senderRole: currentUser.role,
      text: newReplyText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedTickets = tickets.map((t) =>
      t.id === activeTicket.id
        ? {
            ...t,
            messages: [...t.messages, newMsg],
            updatedAt: new Date().toISOString(),
          }
        : t
    );

    setTickets(updatedTickets);
    setActiveTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      updatedAt: new Date().toISOString(),
    }));
    setNewReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketNumber: `YM-TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      category: newCategory,
      subject: newSubject.trim(),
      priority: newPriority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: currentUser.name,
          senderRole: currentUser.role,
          text: newDescription.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setActiveTicket(newTicket);
    setIsNewTicketModalOpen(false);
    setNewSubject('');
    setNewDescription('');
    setToastMessage(`Dispute ticket ${newTicket.ticketNumber} opened! Admin team will review within 24 hours.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' as const } : t))
    );
    if (activeTicket.id === ticketId) {
      setActiveTicket((prev) => ({ ...prev, status: 'RESOLVED' }));
    }
    setToastMessage('Ticket resolved and closed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTickets = tickets
    .filter((t) => (isAdmin ? true : t.userId === currentUser.id))
    .filter((t) => filterStatus === 'ALL' || t.status === filterStatus)
    .filter(
      (t) =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-3.5 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-black text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>FORMAL DISPUTE & ESCALATION DESK</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Support Tickets & Dispute Resolution
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Ghalat color/size, delayed parcels, supplier exchange requests, aur wallet refund disputes ke hal ke liye formal ticket open karein.
            </p>
          </div>

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-xl shadow-sky-950/50 transition cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Open Dispute Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col h-[600px]">
          <div className="p-3 border-b border-slate-800 bg-slate-950/70 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[10px]">
              {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-3 rounded-2xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-sky-950/50 border border-sky-500/50 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-sky-400">{ticket.ticketNumber || ticket.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        ticket.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : ticket.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold truncate text-white">{ticket.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{ticket.category}</span>
                    <span>{ticket.messages.length} msgs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col h-[600px]">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-sky-400">
                      {activeTicket.ticketNumber || activeTicket.id}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-bold border border-slate-700">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{activeTicket.subject}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {activeTicket.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolveTicket(activeTicket.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0f18]/60 text-xs">
                {activeTicket.messages.map((msg, idx) => {
                  const isCurrent = msg.sender === currentUser.name;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isCurrent ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1">
                        <strong className="text-slate-300">{msg.sender}</strong>
                        {msg.senderRole && (
                          <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] font-bold text-sky-400">
                            {msg.senderRole}
                          </span>
                        )}
                        <span>•</span>
                        <span>
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>

                      <div
                        className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                          isCurrent
                            ? 'bg-sky-600 text-white rounded-tr-sm'
                            : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 bg-slate-950/70 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your response or update..."
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a ticket to view dispute details
            </div>
          )}
        </div>
      </div>

      {/* Modal: Open New Dispute Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-sky-400" />
              <span>Open Dispute & Investigation Ticket</span>
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Issue Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-medium focus:border-sky-500 focus:outline-none"
                >
                  <option value="Delayed Parcel Investigation">Delayed Parcel Investigation (Courier Hub)</option>
                  <option value="Wrong Item Shipped by Supplier">Wrong Item / Color Shipped by Supplier</option>
                  <option value="Damaged Goods Claim">Damaged Goods on Delivery</option>
                  <option value="Wallet Payout & Remittance Dispute">Wallet Payout & Remittance Dispute</option>
                  <option value="Other Account Inquiries">Other Inquiries</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Ticket Subject / Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Order YM-98214 customer received damaged packaging"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Priority Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MEDIUM', 'HIGH', 'URGENT'] as const).map((pri) => (
                    <button
                      type="button"
                      key={pri}
                      onClick={() => setNewPriority(pri)}
                      className={`py-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newPriority === pri
                          ? 'border-sky-500 bg-sky-950/40 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Detailed Explanation & Order Reference:</label>
                <textarea
                  rows={3}
                  placeholder="Detail likhein: Customer ka number, order ID, aur masala..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg transition cursor-pointer"
                >
                  Submit Dispute Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
