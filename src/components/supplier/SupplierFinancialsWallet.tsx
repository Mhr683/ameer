import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  Building2,
  Smartphone,
  Download,
  DollarSign,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { User, Order, WalletTransaction } from '../../types';

interface SupplierFinancialsWalletProps {
  currentUser: User;
  orders: Order[];
  onWithdrawFunds?: (amount: number, bankDetails: string) => void;
}

export const SupplierFinancialsWallet: React.FC<SupplierFinancialsWalletProps> = ({
  currentUser,
  orders,
  onWithdrawFunds,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(25000);
  const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'JAZZCASH' | 'EASYPAISA'>('BANK');
  const [bankName, setBankName] = useState('Meezan Bank Ltd');
  const [accountTitle, setAccountTitle] = useState(currentUser.companyName || currentUser.name || 'Prime Wholesale Hub');
  const [accountNumber, setAccountNumber] = useState('02010103492817');
  const [iban, setIban] = useState('PK36MEZN0002010103492817');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const walletBalance = currentUser.walletBalancePKR || 84500;

  // Delivered Orders (Revenue Released)
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + (o.supplierCostPKR || 1200), 0);

  // In-Transit / Dispatched (Pending Holding Balance / Escrow)
  const inTransitOrders = orders.filter(
    (o) => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT' || o.status === 'PROCESSING' || o.status === 'COD_CONFIRMED'
  );
  const holdingBalance = inTransitOrders.reduce((sum, o) => sum + (o.supplierCostPKR || 1200), 0) || 42600;

  // Total Sales Volume
  const totalVolume = deliveredRevenue + holdingBalance + 840000;

  // Statement & Ledger List (Calculated with Wholesale Price - Platform Fee (2%) = Net Credit)
  const ledgerEntries = orders.slice(0, 15).map((order) => {
    const wholesalePrice = order.supplierCostPKR || 1200;
    const platformFee = Math.round(wholesalePrice * 0.02); // 2% Platform Fee
    const netCredit = wholesalePrice - platformFee;
    const isReleased = order.status === 'DELIVERED';

    return {
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today',
      sku: order.items?.[0]?.sku || 'SKU-GEN',
      productName: order.items?.[0]?.name || 'Wholesale Inventory Item',
      city: order.customerCity || 'Karachi',
      wholesalePrice,
      platformFee,
      netCredit,
      status: isReleased ? 'CREDITED_TO_WALLET' : 'HELD_IN_ESCROW',
      rawStatus: order.status,
    };
  });

  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }
    if (withdrawAmount > walletBalance) {
      alert(`Amount exceeds your available balance of PKR ${walletBalance.toLocaleString()}`);
      return;
    }

    const destination =
      payoutMethod === 'BANK'
        ? `${bankName} (${accountNumber}) - Title: ${accountTitle}`
        : `${payoutMethod} (${accountNumber}) - Title: ${accountTitle}`;

    if (onWithdrawFunds) {
      onWithdrawFunds(withdrawAmount, destination);
    }

    setShowWithdrawModal(false);
    showToast(`Withdrawal of PKR ${withdrawAmount.toLocaleString()} submitted to ${destination}!`);
  };

  // Export Ledger CSV
  const handleExportLedgerCSV = () => {
    const headers = 'OrderNumber,Date,SKU,City,WholesalePricePKR,PlatformFee2Pct,NetCreditPKR,EscrowStatus\n';
    const rows = ledgerEntries
      .map(
        (l) =>
          `"${l.orderNumber}","${l.date}","${l.sku}","${l.city}",${l.wholesalePrice},${l.platformFee},${l.netCredit},"${l.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Supplier_Ledger_Statement_${Date.now()}.csv`;
    link.click();
    showToast('Ledger statement CSV exported successfully!');
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

      {/* Module Title & Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-0.5 border border-purple-500/30">
                MODULE 3
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Financials & Payout Wallet (Paisa aur Ledger)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Transparent escrow accounting, automated weekly bank/EasyPaisa payouts, and complete ledger history breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportLedgerCSV}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span>Export Ledger CSV</span>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-black shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Withdraw Profits (Payout)</span>
            </button>
          </div>
        </div>

        {/* 4 Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Card 1: Total Sales Volume */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Total Wholesale Volume</span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">
              PKR {totalVolume.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Cumulative lifetime wholesale orders
            </div>
          </div>

          {/* Card 2: Delivered Orders Revenue (Withdrawable) */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Available Wallet Balance</span>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
              PKR {walletBalance.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-300 font-medium">
              Ready for Instant Bank Withdrawal
            </div>
          </div>

          {/* Card 3: Pending Holding Balance (Escrow in Transit) */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4">
            <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>Pending Escrow Balance</span>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">
              PKR {holdingBalance.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-blue-300 font-medium">
              In-Transit; Released upon Delivery
            </div>
          </div>

          {/* Card 4: Total Settled Payouts */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Settled Bank Payouts</span>
              <CheckCircle className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">
              PKR 480,000
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Transferred to verified IBAN
            </div>
          </div>
        </div>

        {/* Financial Transparency Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-amber-400 font-bold">Transparent Ledger Formula:</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-white">
              Wholesale Base Price <strong className="text-rose-400">- Platform Fee (2%)</strong> = <strong className="text-emerald-400">Net Credit to Supplier Wallet</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Escrow Settlement Guarantee • No Hidden Charges</span>
          </div>
        </div>
      </div>

      {/* Statement & Ledger History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-sm text-white">Statement & Order Ledger Breakdown</span>
          </div>
          <span className="text-xs text-slate-400">Showing last {ledgerEntries.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Order & Date</th>
                <th className="p-3.5">Item & Destination</th>
                <th className="p-3.5">Wholesale Base Price</th>
                <th className="p-3.5">Platform Fee (2%)</th>
                <th className="p-3.5">Net Credit</th>
                <th className="p-3.5">Escrow / Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                  {/* Order & Date */}
                  <td className="p-3.5">
                    <div className="font-bold text-white">{entry.orderNumber}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{entry.date}</div>
                  </td>

                  {/* Item & City */}
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-slate-200 truncate max-w-[200px]" title={entry.productName}>
                      {entry.productName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      City: <strong className="text-slate-300">{entry.city}</strong> • SKU: {entry.sku}
                    </div>
                  </td>

                  {/* Wholesale Base Price */}
                  <td className="p-3.5 font-bold text-slate-200">
                    PKR {entry.wholesalePrice.toLocaleString()}
                  </td>

                  {/* Platform Fee (2%) */}
                  <td className="p-3.5 text-rose-400">
                    - PKR {entry.platformFee.toLocaleString()}
                  </td>

                  {/* Net Credit */}
                  <td className="p-3.5 font-black text-emerald-400 text-sm">
                    + PKR {entry.netCredit.toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 font-sans">
                    {entry.status === 'CREDITED_TO_WALLET' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Released to Wallet</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                        <Clock className="h-3 w-3" />
                        <span>Holding in Escrow</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout / Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white">Withdraw Wholesale Profits</h3>
                <p className="text-xs text-slate-400">Direct settlement to your verified Pakistan bank account or mobile wallet.</p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteWithdraw} className="space-y-4 text-xs">
              {/* Available Balance Reminder */}
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Available Withdrawable Balance:</span>
                <span className="text-emerald-400 font-bold font-mono text-base">
                  PKR {walletBalance.toLocaleString()}
                </span>
              </div>

              {/* Amount Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Withdrawal Amount (PKR) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                />
                <div className="flex gap-2 pt-1">
                  {[10000, 25000, 50000, walletBalance].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setWithdrawAmount(val)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700"
                    >
                      PKR {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout Channel Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Payout Destination</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                      payoutMethod === 'BANK'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                    Bank Account
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('JAZZCASH')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                      payoutMethod === 'JAZZCASH'
                        ? 'border-amber-500 bg-amber-500/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                    JazzCash
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('EASYPAISA')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                      payoutMethod === 'EASYPAISA'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                    EasyPaisa
                  </button>
                </div>
              </div>

              {/* Account Details */}
              {payoutMethod === 'BANK' ? (
                <div className="space-y-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <label className="text-slate-400">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400">Account Title</label>
                      <input
                        type="text"
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">IBAN (24 Characters)</label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <label className="text-slate-400">{payoutMethod} Mobile Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="03001234567"
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Registered CNIC / Account Title</label>
                    <input
                      type="text"
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black"
                >
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
