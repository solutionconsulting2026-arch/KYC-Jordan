import React from 'react';
import { EXECUTIVE_METRICS } from '../../data/metrics';
import { TrendingUp, ArrowUpRight, CheckCircle2, ShieldAlert, BarChart3, DollarSign, Clock, Users } from 'lucide-react';

export const BusinessImpactView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Title with Illustrative Simulation Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#A21D22] uppercase tracking-wider block">
              Strategic Value Realization
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.2 rounded border border-amber-300">
              Illustrative simulation
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Business Impact: Traditional vs. Agentic Onboarding
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative performance benchmarks demonstrating operational efficiency gains for retail banking.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Annualized Projected Efficiency</span>
          <span className="text-base font-extrabold text-[#A21D22]">
            ₹84.2 Cr Estimated Net Savings
          </span>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXECUTIVE_METRICS.comparison.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 block min-h-[32px]">
                {item.metric}
              </span>

              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Traditional
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {item.traditional}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#A21D22] block">
                    Agentic AI
                  </span>
                  <span className="text-sm font-bold text-[#A21D22]">
                    {item.agentic}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {item.impact}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Illustrative</span>
            </div>
          </div>
        ))}
      </div>

      {/* Executive Takeaway Bar */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#FDF2F2] to-amber-50/70 border border-[#A21D22]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#A21D22] text-[#FDB913] flex items-center justify-center font-bold">
            P
          </div>
          <div>
            <span className="font-bold text-slate-900">
              Core Strategic Outcome: High Straight-Through Processing (82%+) with zero compromise on KYC/AML controls
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Customer friction is eliminated while human underwriters are elevated to manage high-value exceptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
