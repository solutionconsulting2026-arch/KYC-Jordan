import React, { useState } from 'react';
import { Customer, Party } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { diffDays } from '../../domain/dateUtils';
import { RefreshCw, Plus, MoreVertical, Phone, Mail, AlertCircle, ShieldAlert } from 'lucide-react';

interface AssignedSignatoriesCardProps {
  customer: Customer;
}

export const AssignedSignatoriesCard: React.FC<AssignedSignatoriesCardProps> = ({ customer }) => {
  const { parties, currentDate, sendDocRequestEmail, profiles } = useKycStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const signatoryParties = (parties[customer.cif] || []).filter(
    (p) => p.kind === 'Signatory' || customer.signatoryIds.includes(p.id)
  );

  const handleRequestUpdatedId = async (party: Party) => {
    setActiveMenuId(null);
    const profile = profiles[customer.cif];
    await sendDocRequestEmail(
      customer.cif,
      profile?.openCaseId,
      [`Updated identity document for ${party.name} (${party.role || 'Signatory'})`]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-5 flex flex-col justify-between">
      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
          <h3 className="text-[15px] font-bold text-[#1F2329]">Assigned Signatories</h3>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Refresh Signatories"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Add Authorized Signatory"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Signatory List Rows */}
        <div className="flex flex-col divide-y divide-[#F1F3F5] mt-2 max-h-[420px] overflow-y-auto">
          {signatoryParties.map((sig) => {
            const isIdExpired = sig.idExpiry && diffDays(sig.idExpiry, currentDate) < 0;

            const avatarUrls: Record<string, string> = {
              P4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
              P5: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              P6: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            };

            return (
              <div
                key={sig.id}
                className="py-3 flex items-start justify-between gap-3 relative hover:bg-slate-50/60 px-1 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={
                      avatarUrls[sig.id] ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={sig.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1F5BD8] hover:underline cursor-pointer truncate">
                      {sig.name}
                    </p>

                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-[#5B616B]">{sig.role || 'Signatory'}</span>

                      {/* NEW IN BRD §6.4: ID-expiry chip */}
                      {isIdExpired && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FEE4E2] text-[#A01C12] px-1.5 py-0.5 rounded border border-rose-200">
                          <AlertCircle className="w-2.5 h-2.5" />
                          ID expired
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#5B616B]">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {sig.phone || '+962 7xx xxx xxx'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">{sig.sentiment || 'Neutral'}</span>
                    </div>
                  </div>
                </div>

                {/* Row Action Menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === sig.id ? null : sig.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Context Menu with "Request updated ID" */}
                  {activeMenuId === sig.id && (
                    <div className="absolute right-0 top-7 w-48 bg-white rounded-lg shadow-xl border border-[#CFD3D8] py-1.5 z-30 animate-in fade-in duration-100 text-xs">
                      <button
                        onClick={() => handleRequestUpdatedId(sig)}
                        className="w-full text-left px-3 py-1.5 text-rose-700 hover:bg-rose-50 font-semibold flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        Request updated ID
                      </button>
                      <button
                        onClick={() => setActiveMenuId(null)}
                        className="w-full text-left px-3 py-1.5 text-[#1F2329] hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Log Call
                      </button>
                      <button
                        onClick={() => setActiveMenuId(null)}
                        className="w-full text-left px-3 py-1.5 text-[#1F2329] hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        Send Direct Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-[#E6E8EB] text-center">
        <span className="text-[11px] text-[#5B616B] font-medium">
          Dual-Authorization Mandate: 2 Joint Signatures Required
        </span>
      </div>
    </div>
  );
};
