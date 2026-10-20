import React from 'react';
import { PNBButton } from '../common/PNBButton';
import { GeneratedAccount, CustomerProfile, PnbProduct } from '../../types/banking.types';
import { Send, ArrowDownLeft, QrCode, PlusCircle, CreditCard, Shield, ChevronRight, Sparkles, Smartphone, Download, CheckCircle2 } from 'lucide-react';

interface CustomerDashboardScreenProps {
  customer: CustomerProfile;
  product: PnbProduct;
  account: GeneratedAccount;
  onExploreNextBestAction: () => void;
}

export const CustomerDashboardScreen: React.FC<CustomerDashboardScreenProps> = ({
  customer,
  product,
  account,
  onExploreNextBestAction,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold text-[#A21D22] uppercase tracking-wider block">
            PNB ONE Digital Banking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
            Good morning, {customer.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer ID: <strong className="font-mono text-slate-700">{account.cifNumber}</strong> • Primary Account
          </p>
        </div>

        <button
          onClick={onExploreNextBestAction}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FDF2F2] to-amber-50 border border-[#A21D22]/20 hover:border-[#A21D22]/40 text-[#7B1013] text-xs font-bold shadow-xs hover:shadow transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#FDB913]" />
          <span>View AI Recommendations (Next Best Action)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Account Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#7B1013] via-[#A21D22] to-[#580A0D] text-white p-6 sm:p-8 shadow-pnb-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FDB913] uppercase tracking-wider">
                {product.title}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.2 rounded-full font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Account No: {account.maskedAccountNumber}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 block uppercase">Allocated Branch</span>
            <span className="text-xs font-semibold text-white">{account.branchName}</span>
          </div>
        </div>

        <div className="mt-6 pt-2 relative z-10">
          <span className="text-xs text-slate-300 block">Available Balance</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              ₹0.00
            </span>
            <span className="text-xs text-[#FDB913] font-medium">
              (Initial Deposit Pending)
            </span>
          </div>
        </div>

        {/* Account Quick Actions */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 sm:grid-cols-6 gap-2 relative z-10">
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Pay</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Transfer</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Scan UPI</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-[#FDB913] text-[#7B1013] flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#FDB913]">Add Funds</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Cards</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Statement</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">Virtual RuPay Platinum</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-500 font-mono">6521 88XX XXXX 7109</p>
          <div className="mt-3 flex justify-between items-center text-[11px] text-[#A21D22] font-semibold">
            <span>Manage Limits & PIN</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">UPI / BHIM ID</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-[#A21D22] font-mono font-medium">{account.upiVpa}</p>
          <div className="mt-3 flex justify-between items-center text-[11px] text-[#A21D22] font-semibold">
            <span>Set 6-Digit UPI PIN</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">Branch Banking</span>
            <span className="text-[10px] text-slate-400 font-medium">SolId 0182</span>
          </div>
          <p className="text-xs text-slate-600">{account.branchName}</p>
          <div className="mt-3 flex justify-between items-center text-[11px] text-[#A21D22] font-semibold">
            <span>Request Cheque Book</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
