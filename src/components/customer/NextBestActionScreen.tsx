import React from 'react';
import { PNBButton } from '../common/PNBButton';
import { CustomerProfile } from '../../types/banking.types';
import { Sparkles, CreditCard, PiggyBank, Briefcase, ArrowRight, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

interface NextBestActionScreenProps {
  customer: CustomerProfile;
  onBackToDashboard: () => void;
  onExploreProduct: (prodName: string) => void;
}

export const NextBestActionScreen: React.FC<NextBestActionScreenProps> = ({
  customer,
  onBackToDashboard,
  onExploreProduct,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Back button */}
      <button
        onClick={onBackToDashboard}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#A21D22] mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account Dashboard</span>
      </button>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] border border-[#A21D22]/20 flex items-center justify-center text-[#A21D22] flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#FDB913]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#A21D22] uppercase tracking-wider">
                Relationship Intelligence
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mt-0.5">
                How PNB can help you next
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                PNB AI Assistant analyses your newly established relationship, bureau profile, and cash flow preferences to present relevant next steps.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            "These suggestions are based on your verified credit profile (CIBIL {customer.cibilScore}), salaried occupation, and current relationship with PNB."
          </p>

          {/* Cards Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Recommendation 1: Pre-approved Credit Card (Primary) */}
            <div className="p-5 rounded-2xl border-2 border-[#A21D22] bg-white shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A21D22] text-[#FDB913] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                Pre-Approved Offer
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 mt-1">
                  <div className="w-7 h-7 rounded-lg bg-[#FDF2F2] text-[#A21D22] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">PNB RuPay Select Credit Card</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mt-3">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Pre-Approved Credit Limit
                  </span>
                  <span className="text-lg font-bold text-[#A21D22]">₹1,50,000</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Instant zero-paper issuance</span>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Linkable to UPI for merchant QR payments</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Complimentary domestic airport lounge access</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>First year fee waived for PNB Select account</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2">
                <PNBButton
                  variant="primary"
                  size="sm"
                  onClick={() => onExploreProduct('PNB RuPay Select Credit Card')}
                  className="w-full"
                >
                  Explore Offer
                </PNBButton>
              </div>
            </div>

            {/* Recommendation 2: Auto-Sweep Recurring Deposit */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">PNB Auto-Sweep FD</span>
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  Earn higher interest (up to 7.25% p.a.) on surplus savings above ₹25,000 with instant reverse sweep liquidity whenever you spend.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                  <span className="text-emerald-800 font-semibold block">Maximum Yield Strategy</span>
                  <span className="text-[11px] text-emerald-700">Zero penalty on automated reverse sweeps</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <PNBButton
                  variant="outline"
                  size="sm"
                  onClick={() => onExploreProduct('PNB Auto-Sweep FD')}
                  className="w-full"
                >
                  Configure Auto-Sweep
                </PNBButton>
              </div>
            </div>

            {/* Recommendation 3: Digital Personal Loan Check */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Pre-Qualified Retail Loan</span>
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  Concession of 0.25% on PNB Home and Personal Loans exclusive to PNB Select salaried account holders.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                  <span className="text-blue-900 font-semibold block">CIBIL 784 Concession</span>
                  <span className="text-[11px] text-blue-700">Zero processing fee on online applications</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <PNBButton
                  variant="outline"
                  size="sm"
                  onClick={() => onExploreProduct('PNB Pre-Qualified Retail Loan')}
                  className="w-full"
                >
                  Check Eligibility
                </PNBButton>
              </div>
            </div>
          </div>

          {/* Dismiss CTA */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-400">You can always review these offers under PNB ONE &gt; Offers</span>
            <button
              onClick={onBackToDashboard}
              className="font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
