import React, { useState } from 'react';
import { Customer, KycCase, ScreeningResult } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { KycStatusChip } from '../../../components/common/KycStatusChip';
import { Button } from '../../../components/common/Button';
import { FetchSection } from '../../../components/common/FetchSection';
import { RefreshCw, ShieldCheck, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface S09ScreeningTabProps {
  kycCase: KycCase;
  customer: Customer;
}

export const S09ScreeningTab: React.FC<S09ScreeningTabProps> = ({ kycCase, customer }) => {
  const { screening, rescreenParty } = useKycStore();
  const [screenStatus, setScreenStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');

  const screeningList = screening[customer.cif] || [];
  const latestScreenedAt = screeningList.length > 0 ? screeningList[0].screenedAt : '24/10/2026 09:12 AM';

  const handleFetchScreening = async () => {
    setScreenStatus('loading');
    await rescreenParty(customer.cif);
    setTimeout(() => {
      setScreenStatus('loaded');
    }, 700);
  };

  const getChipVariant = (result: ScreeningResult['result']): 'ok' | 'warn' | 'bad' | 'neutral' => {
    switch (result) {
      case 'Clear':
      case 'ClearedFalsePositive':
        return 'ok';
      case 'ClearedPEPConfirmed':
        return 'warn';
      case 'PotentialMatch':
        return 'warn';
      case 'ConfirmedMatch':
        return 'bad';
      default:
        return 'neutral';
    }
  };

  const formatResultLabel = (result: ScreeningResult['result']): string => {
    switch (result) {
      case 'Clear':
        return 'Clear';
      case 'ClearedFalsePositive':
        return 'Cleared – False Positive';
      case 'ClearedPEPConfirmed':
        return 'Cleared – PEP Confirmed';
      case 'PotentialMatch':
        return 'Potential Match';
      case 'ConfirmedMatch':
        return 'Confirmed Match';
      default:
        return result;
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
      {/* Header with Caption */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E8EB]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#1F2329]">
              Name & Sanctions Screening (Fircosoft Engine)
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              Synced
            </span>
          </div>
          <p className="text-[12px] text-[#5B616B] mt-0.5">
            Last batch execution: <strong className="font-mono text-[#1F2329]">{latestScreenedAt}</strong> ·{' '}
            Potential matches are adjudicated by Compliance in Fircosoft; the CRM shows status only.
          </p>
        </div>
      </div>

      {/* Screening Table inside FetchSection */}
      <FetchSection
        status={screenStatus}
        onFetch={handleFetchScreening}
        fetchLabel="Fetch Screening Results"
        refetchLabel="Re-screen All Parties"
        loadingLabel="Running Fircosoft Sanctions Screening..."
        emptyPrompt="Click below to run and fetch screening results for all parties against sanctions, PEP, and adverse media lists."
      >
        <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
              <tr>
                <th className="py-3 px-4">Subject / Party Name</th>
                <th className="py-3 px-3">Role / Capacity</th>
                <th className="py-3 px-3">Fircosoft Result</th>
                <th className="py-3 px-3">Screened Timestamp</th>
                <th className="py-3 px-3">Case / Alert Reference</th>
                <th className="py-3 px-4 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {screeningList.map((item) => {
                const chipVar = getChipVariant(item.result);
                const label = formatResultLabel(item.result);

                return (
                  <tr key={item.partyId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1F2329]">{item.partyName}</td>
                    <td className="py-3 px-3 text-[#5B616B]">{item.role}</td>
                    <td className="py-3 px-3">
                      <KycStatusChip label={label} variant={chipVar} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#5B616B]">{item.screenedAt}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                      {item.alertRef || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-[#1F5BD8] font-semibold hover:underline cursor-pointer flex items-center justify-end gap-1">
                        Fircosoft UI <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FetchSection>

      {/* Info Callout Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-[#5B616B]">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1F2329]">Presenter Note:</strong> To simulate clearing the potential match on Yousef Barakat (P2), use the toggle{' '}
          <strong>"Simulate: Compliance clears potential match"</strong> in the bottom-left Demo Control Panel. This will immediately update the status to <strong>Cleared – PEP confirmed</strong> and fulfill submit guard requirement #4.
        </div>
      </div>
    </div>
  );
};
