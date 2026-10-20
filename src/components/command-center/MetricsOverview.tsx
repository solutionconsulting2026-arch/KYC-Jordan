import React from 'react';
import { EXECUTIVE_METRICS } from '../../data/metrics';
import { Users, Zap, Clock, UserCheck, AlertTriangle, TrendingUp } from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* Applications Today */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Applications Today
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {EXECUTIVE_METRICS.applicationsToday.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +14% vs avg
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">Pan-India retail pipeline</span>
      </div>

      {/* STP Rate */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Straight-Through (STP)
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
            {EXECUTIVE_METRICS.stpRate}%
          </span>
          <span className="text-[11px] font-semibold text-emerald-600">
            ↑ from 60% traditional
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">Zero manual touchpoint</span>
      </div>

      {/* Average Onboarding Time */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg. Onboarding Time
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {EXECUTIVE_METRICS.avgOnboardingTime}
          </span>
          <span className="text-[11px] font-semibold text-indigo-600">
            ↓ 68% TAT drop
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">Traditional: ~25 minutes</span>
      </div>

      {/* Manual Intervention */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manual Intervention
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-amber-700 tracking-tight">
            {EXECUTIVE_METRICS.manualInterventionRate}%
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            ↓ 38% reduction
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">Underwriter referrals</span>
      </div>

      {/* Exceptions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs col-span-2 md:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Exceptions
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {EXECUTIVE_METRICS.exceptionsRate}%
          </span>
          <span className="text-[11px] font-semibold text-emerald-600">
            Controlled
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">AML / Sanctions / High Risk</span>
      </div>
    </div>
  );
};
