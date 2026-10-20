import React from 'react';
import { Customer } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { deriveKycStatus } from '../../domain/kycStatus';
import { KycStatusChip } from '../../components/common/KycStatusChip';
import { useRouter } from '../../router/AppRouter';
import { Sparkles, Activity, Bell, ExternalLink, RefreshCw, X, Layers } from 'lucide-react';

interface HeaderStripProps {
  customer: Customer;
  onOpenHierarchy: () => void;
  onOpenActionCenter: () => void;
}

export const HeaderStrip: React.FC<HeaderStripProps> = ({
  customer,
  onOpenHierarchy,
  onOpenActionCenter,
}) => {
  const { profiles, currentDate, cases } = useKycStore();
  const { navigate } = useRouter();

  const profile = profiles[customer.cif];
  const activeCase = profile?.openCaseId ? cases[profile.openCaseId] : undefined;
  const isCaseOpen = activeCase && activeCase.status !== 'Closed' && activeCase.status !== 'Cancelled';

  const kycStatus = deriveKycStatus(profile, currentDate, Boolean(isCaseOpen));

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* 5-Column Entity Master Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 flex-1 items-center">
        {/* 1. CIF NO. */}
        <div>
          <span className="block text-[11px] font-bold text-[#5B616B] uppercase tracking-wider">
            CIF NO.
          </span>
          <span className="text-[14px] font-semibold text-[#1F2329] font-mono mt-0.5 block">
            {customer.cif}
          </span>
        </div>

        {/* 2. ACCOUNT NAME */}
        <div>
          <span className="block text-[11px] font-bold text-[#5B616B] uppercase tracking-wider">
            ACCOUNT NAME
          </span>
          <span className="text-[14px] font-bold text-[#1F2329] mt-0.5 block truncate">
            {customer.accountName}
          </span>
        </div>

        {/* 3. PARENT ACCOUNT */}
        <div>
          <span className="block text-[11px] font-bold text-[#5B616B] uppercase tracking-wider">
            PARENT ACCOUNT
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[13px] font-medium text-[#1F2329]">
              {customer.parentCif ? 'Alpha Logistics Group' : 'Ultimate Parent'}
            </span>
            <button
              onClick={onOpenHierarchy}
              className="text-[12px] font-semibold text-[#1F5BD8] hover:underline"
            >
              (Show Hierarchy)
            </button>
          </div>
        </div>

        {/* 4. STATUS CODE */}
        <div>
          <span className="block text-[11px] font-bold text-[#5B616B] uppercase tracking-wider">
            STATUS CODE
          </span>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {customer.statusCode}
            </span>
          </div>
        </div>

        {/* 5. KYC STATUS (NEW PER BRD §4.3 & §6.1) */}
        <div>
          <span className="block text-[11px] font-bold text-[#5B616B] uppercase tracking-wider">
            KYC STATUS
          </span>
          <div className="mt-1">
            <KycStatusChip
              label={kycStatus.label}
              variant={kycStatus.variant}
              onClick={() => navigate(`#/c360/${customer.cif}?tab=compliances`)}
              title="Click to view KYC Compliance details"
            />
          </div>
        </div>
      </div>

      {/* Right Quick Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
        <button
          className="h-8 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[12px] font-semibold text-[#1F2329] flex items-center gap-1.5 transition-colors"
          title="Customer Pulse"
        >
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          Pulse
        </button>

        <button
          onClick={onOpenActionCenter}
          className="h-8 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[12px] font-semibold text-[#1F2329] flex items-center gap-1.5 transition-colors"
          title="Action Center"
        >
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          Action Center
        </button>

        <button
          className="h-8 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[12px] font-semibold text-[#1F2329] flex items-center gap-1.5 transition-colors"
          title="Core Banking Links"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          Related Links
        </button>

        {/* WORKNEXT Button (Gradient per Section 4.1) */}
        <button
          className="h-8 px-4 rounded-full bg-gradient-to-r from-[#FF7A45] via-[#EE2B76] to-[#7B3FE4] text-white text-[12px] font-bold tracking-wide flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-opacity"
          title="WORKNEXT Agentic Automation"
        >
          <Sparkles className="w-3.5 h-3.5" />
          WORKNEXT
        </button>

        <button
          onClick={() => window.location.reload()}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Refresh Record"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => navigate('#/worklist')}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Close 360"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
