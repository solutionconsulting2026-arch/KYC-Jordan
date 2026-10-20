import React from 'react';
import { Modal } from '../../components/common/Modal';
import { useKycStore } from '../../store/KycContext';
import { deriveKycStatus } from '../../domain/kycStatus';
import { KycStatusChip } from '../../components/common/KycStatusChip';
import { useRouter } from '../../router/AppRouter';
import { Network, Lock, Building, ArrowRight } from 'lucide-react';

interface ShowHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowHierarchyModal: React.FC<ShowHierarchyModalProps> = ({ isOpen, onClose }) => {
  const { customers, profiles, currentDate, cases, currentUser } = useKycStore();
  const { navigate } = useRouter();

  // Group structure definition
  const parent = customers['00001700'];
  const subsidiaries = [
    customers['00001715'], // Amman
    customers['00001722'], // Dubai LLC
    customers['00001731'], // Egypt
    customers['00001740'], // UK Ltd
  ].filter(Boolean);

  const canViewEntity = (countryOfBooking: string) => {
    if (currentUser.countryScope.includes('ALL')) return true;
    return currentUser.countryScope.includes(countryOfBooking);
  };

  const handleEntityClick = (cif: string, countryOfBooking: string) => {
    if (!canViewEntity(countryOfBooking)) {
      alert(`Access Restricted: User ${currentUser.name} (${currentUser.roles[0]}) is restricted to [${currentUser.countryScope.join(', ')}] booked accounts.`);
      return;
    }
    navigate(`#/c360/${cif}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Corporate Group Hierarchy & KYC Roll-Up"
      subtitle="Group G1: Alpha Logistics Group — Legal Entity Ownership Tree & Review Status"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Parent Node */}
        {parent && (
          <div className="flex flex-col items-center">
            <div
              onClick={() => handleEntityClick(parent.cif, parent.countryOfBooking)}
              className={`p-4 rounded-xl border max-w-md w-full shadow-xs transition-all flex items-center justify-between ${
                canViewEntity(parent.countryOfBooking)
                  ? 'bg-slate-900 text-white border-slate-700 cursor-pointer hover:scale-[1.01]'
                  : 'bg-slate-100 text-slate-500 border-slate-300 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 border border-slate-700">
                  JO
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px]">{parent.accountName}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Parent (Holding)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">CIF {parent.cif}</span>
                </div>
              </div>

              <div>
                {canViewEntity(parent.countryOfBooking) ? (
                  <KycStatusChip
                    label={deriveKycStatus(profiles[parent.cif], currentDate).label}
                    variant={deriveKycStatus(profiles[parent.cif], currentDate).variant}
                    size="sm"
                  />
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Restricted
                  </span>
                )}
              </div>
            </div>

            {/* Tree Branch Line */}
            <div className="w-0.5 h-6 bg-slate-300 my-1" />
            <div className="w-3/4 h-0.5 bg-slate-300 relative">
              <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-slate-400" />
              <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-400" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-400" />
            </div>
          </div>
        )}

        {/* Subsidiaries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {subsidiaries.map((sub) => {
            const allowed = canViewEntity(sub.countryOfBooking);
            const subProfile = profiles[sub.cif];
            const subCase = subProfile?.openCaseId ? cases[subProfile.openCaseId] : undefined;
            const subHasOpen = subCase && subCase.status !== 'Closed' && subCase.status !== 'Cancelled';
            const status = deriveKycStatus(subProfile, currentDate, Boolean(subHasOpen));

            return (
              <div
                key={sub.cif}
                onClick={() => handleEntityClick(sub.cif, sub.countryOfBooking)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  allowed
                    ? 'bg-white border-[#CFD3D8] hover:border-slate-400 hover:shadow-xs cursor-pointer'
                    : 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 border border-slate-200 shrink-0 text-xs">
                    {sub.countryOfBooking}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-[13px] text-[#1F2329] truncate">{sub.accountName}</p>
                    </div>
                    <span className="text-[11px] text-[#5B616B] font-mono">CIF {sub.cif}</span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {allowed ? (
                    <KycStatusChip label={status.label} variant={status.variant} size="sm" />
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      <Lock className="w-3 h-3" /> Restricted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend / Access Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#5B616B] flex items-center justify-between">
          <span>
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.roles[0]}) · Scope: [
            {currentUser.countryScope.join(', ')}]
          </span>
          <span className="text-[11px] text-[#1F5BD8] font-medium">BR-24 Country Access Rules Applied</span>
        </div>
      </div>
    </Modal>
  );
};
