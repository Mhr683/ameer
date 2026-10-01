import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Receipt,
  X,
} from 'lucide-react';
import { User, PayoutRequest, PayoutMethod } from '../types';

interface ResellerPayoutsDeskViewProps {
  currentUser: User;
  allUsers: User[];
  payoutRequests: PayoutRequest[];
  onRequestPayout: (payout: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => void;
  onApprovePayout?: (payoutId: string, transactionId: string, notes?: string) => void;
  onRejectPayout?: (payoutId: string, reason: string) => void;
  onLogAudit?: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

const PAKISTAN_PAYOUT_METHODS: { id: PayoutMethod; name: string; icon: any; fee: string; note: string }[] = [
  {
    id: 'RAAST',
    name: 'Raast Instant Pay (State Bank of Pakistan)',
    icon: Smartphone,
    fee: '0% Free',
    note: 'Instant settlement directly via Mobile Number or IBAN',
  },
  {
    id: 'JAZZCASH',
    name: 'JazzCash Mobile Account',
    icon: Smartphone,
    fee: '0% Free',
    note: 'Transferred directly to 11-digit JazzCash mobile wallet',
  },
  {
    id: 'EASYPAISA',
    name: 'EasyPaisa Wallet',
    icon: Smartphone,
    fee: '0% Free',
    note: 'Instant credit to Telenor EasyPaisa mobile account',
  },
  {
    id: 'BANK_TRANSFER',
    name: 'Commercial Bank IBAN (Meezan, HBL, Alfalah, UBL)',
    icon: Building2,
    fee: '0% Free',
    note: 'Same-day 1-Link clearing to 24-digit PK IBAN',
  },
];

export const ResellerPayoutsDeskView: React.FC<ResellerPayoutsDeskViewProps> = ({
  currentUser,
  allUsers,
  payoutRequests,
  onRequestPayout,
  onApprovePayout,
  onRejectPayout,
}) => {
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';

  // Request form state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>('RAAST');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [accountTitle, setAccountTitle] = useState(currentUser.name || 'Ali Raza');
  const [accountNumber, setAccountNumber] = useState(currentUser.phone || '03001234567');
  const [bankName, setBankName] = useState('Meezan Bank Ltd');
  const [formError, setFormError] = useState<string | null>(null);

  // Admin approval modal
  const [approvingPayout, setApprovingPayout] = useState<PayoutRequest | null>(null);
  const [adminTid, setAdminTid] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Filtering
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests based on role
  const filteredRequests = payoutRequests
    .filter((req) => (isAdmin ? true : req.resellerId === currentUser.id))
    .filter((req) => filterStatus === 'ALL' || req.status === filterStatus)
    .filter(
      (req) =>
        req.accountTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.accountNumber.includes(searchQuery) ||
        req.resellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const availableBalance = currentUser.walletBalancePKR || 0;
  const totalWithdrawn = payoutRequests
    .filter((r) => (isAdmin ? true : r.resellerId === currentUser.id) && r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amountPKR, 0);

  const pendingAmount = payoutRequests
    .filter((r) => (isAdmin ? true : r.resellerId === currentUser.id) && r.status === 'PENDING')
    .reduce((sum, r) => sum + r.amountPKR, 0);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (withdrawAmount < 1000) {
      setFormError('Kam az kam withdrawal limit PKR 1,000 hai.');
      return;
    }

    if (withdrawAmount > availableBalance) {
      setFormError(`Aapke wallet mein sirf PKR ${availableBalance.toLocaleString()} mojood hain.`);
      return;
    }

    if (!accountTitle.trim() || !accountNumber.trim()) {
      setFormError('Account title aur number darj karein.');
      return;
    }

    onRequestPayout({
      resellerId: currentUser.id,
      resellerName: currentUser.name,
      resellerEmail: currentUser.email,
      amountPKR: withdrawAmount,
      method: selectedMethod,
      accountTitle: accountTitle.trim(),
      accountNumber: accountNumber.trim(),
      bankName: selectedMethod === 'BANK_TRANSFER' ? bankName : undefined,
    });

    setIsRequestModalOpen(false);
  };

  const handleConfirmAdminApproval = () => {
    if (!approvingPayout || !onApprovePayout) return;
    const tid = adminTid.trim() || `TID-${Date.now().toString().slice(-8)}`;
    onApprovePayout(approvingPayout.id, tid, adminNotes.trim());
    setApprovingPayout(null);
    setAdminTid('');
    setAdminNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                <span>PAKISTAN PROFIT DISBURSEMENT DESK</span>
              </span>
              {isAdmin && (
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                  Master Finance Console
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAdmin ? 'Reseller Payout Approvals & Bank Clearing' : 'Reseller Profit Payout Desk'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              JazzCash, EasyPaisa, Raast aur Pakistani Commercial Banks (1-Link) ke zariye apne dropshipping profits ka foran withdrawal karein.
            </p>
          </div>

          {!isAdmin && (
            <button
              onClick={() => {
                setFormError(null);
                setIsRequestModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-950/50 transition cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Request Profit Payout</span>
            </button>
          )}
        </div>

        {/* Financial Stat Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Available Wallet Balance</span>
            <div className="mt-1 text-2xl font-black font-mono text-emerald-400">
              PKR {availableBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Ready for instant withdrawal</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Pending Clearances</span>
            <div className="mt-1 text-2xl font-black font-mono text-amber-400">
              PKR {pendingAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Awaiting Finance Desk approval</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Settled Profits</span>
            <div className="mt-1 text-2xl font-black font-mono text-white">
              PKR {totalWithdrawn.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Transferred successfully</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Title, Phone, IBAN or Request ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Payout Requests & Remittance History</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{filteredRequests.length} records</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Receipt className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <p className="text-sm font-bold text-slate-300">No payout requests found</p>
            <p className="text-xs text-slate-500 mt-1">
              {!isAdmin
                ? 'Jab aap customer orders complete karenge, apna kamaya hua profit yahan se withdraw kar sakte hain.'
                : 'There are currently no pending payout requests.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">Request ID & Date</th>
                  <th className="px-4 py-3.5">Reseller</th>
                  <th className="px-4 py-3.5">Payment Channel</th>
                  <th className="px-4 py-3.5">Account Info</th>
                  <th className="px-4 py-3.5 text-right">Amount (PKR)</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  {isAdmin && <th className="px-4 py-3.5 text-right">Admin Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-white">{req.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(req.requestedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-200">{req.resellerName}</div>
                      <div className="text-[10px] text-slate-500">{req.resellerEmail}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 font-bold text-slate-300 border border-slate-700">
                        {req.method}
                      </span>
                      {req.bankName && <div className="text-[10px] text-slate-400 mt-0.5">{req.bankName}</div>}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{req.accountTitle}</div>
                      <div className="font-mono text-slate-400 text-[11px]">{req.accountNumber}</div>
                      {req.transactionId && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          TID: {req.transactionId}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-black text-sm text-emerald-400">
                      PKR {req.amountPKR.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : req.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {req.status === 'APPROVED' && <CheckCircle2 className="h-3 w-3" />}
                        {req.status === 'PENDING' && <Clock className="h-3 w-3" />}
                        {req.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-3.5 text-right">
                        {req.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setApprovingPayout(req);
                                setAdminTid(`TID-${Math.floor(10000000 + Math.random() * 90000000)}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (onRejectPayout) onRejectPayout(req.id, 'Account mismatch or verification issue');
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Request Payout (Reseller) */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Request Profit Payout</h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              {formError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Amount input */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Withdrawal Amount (PKR) - Available: PKR {availableBalance.toLocaleString()}:
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-base font-bold text-white focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum limit: PKR 1,000</span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-2">Select Payout Channel:</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAKISTAN_PAYOUT_METHODS.map((m) => {
                    const isSelected = selectedMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/40 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <m.icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <div className="truncate">
                          <div className="font-bold text-[11px] truncate">{m.name.split(' ')[0]}</div>
                          <div className="text-[9px] text-emerald-400 font-semibold">{m.fee}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Name (if commercial bank selected) */}
              {selectedMethod === 'BANK_TRANSFER' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bank Name:</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Meezan Bank Ltd">Meezan Bank Ltd</option>
                    <option value="Habib Bank Ltd (HBL)">Habib Bank Ltd (HBL)</option>
                    <option value="Bank Alfalah">Bank Alfalah</option>
                    <option value="United Bank Ltd (UBL)">United Bank Ltd (UBL)</option>
                    <option value="Standard Chartered Pakistan">Standard Chartered Pakistan</option>
                    <option value="MCB Bank">MCB Bank</option>
                    <option value="Faysal Bank">Faysal Bank</option>
                  </select>
                </div>
              )}

              {/* Account Title & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Account Title (Name):</label>
                  <input
                    type="text"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {selectedMethod === 'BANK_TRANSFER' ? 'IBAN (24 digits)' : 'Mobile Account Number:'}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={selectedMethod === 'BANK_TRANSFER' ? 'PK36MEZN00...' : '03001234567'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg transition cursor-pointer"
                >
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Approval */}
      {approvingPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Confirm Reseller Payout Disbursement</span>
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Reseller:</span>
                <span className="font-bold text-white">{approvingPayout.resellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">
                  PKR {approvingPayout.amountPKR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel:</span>
                <span className="text-slate-200">{approvingPayout.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To Account:</span>
                <span className="font-mono text-slate-300">{approvingPayout.accountNumber}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  1-Link / JazzCash Bank Transaction ID (TID):
                </label>
                <input
                  type="text"
                  value={adminTid}
                  onChange={(e) => setAdminTid(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Internal Note (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Paid via Meezan Corporate Portal"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApprovingPayout(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdminApproval}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow transition cursor-pointer"
              >
                Disburse & Deduct Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
