import React, { useState } from 'react';
import { Customer } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { deriveKycStatus } from '../../domain/kycStatus';
import { KycStatusChip } from '../../components/common/KycStatusChip';
import { Button } from '../../components/common/Button';
import { useRouter } from '../../router/AppRouter';
import { diffDays } from '../../domain/dateUtils';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  ExternalLink,
  History,
  Building,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface CompliancesTabProps {
  customer: Customer;
  onInitiatePeriodic: () => void;
  onTriggerEvent: () => void;
  onStartGroupReview: () => void;
}

export const CompliancesTab: React.FC<CompliancesTabProps> = ({
  customer,
  onInitiatePeriodic,
  onTriggerEvent,
  onStartGroupReview,
}) => {
  const { profiles, currentDate, cases, documents, parties, screening, currentUser } = useKycStore();
  const { navigate } = useRouter();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const profile = profiles[customer.cif];
  const activeCase = profile?.openCaseId ? cases[profile.openCaseId] : undefined;
  const isCaseOpen = activeCase && activeCase.status !== 'Closed' && activeCase.status !== 'Cancelled';

  const kycStatus = deriveKycStatus(profile, currentDate, Boolean(isCaseOpen));

  // Compute metrics
  const custDocs = documents[customer.cif] || [];
  const expiredDocsCount = custDocs.filter((d) => {
    if (d.versions.length === 0) return false;
    const latest = d.versions[d.versions.length - 1];
    return latest.expiryDate && diffDays(latest.expiryDate, currentDate) < 0;
  }).length;
  const missingDocsCount = custDocs.filter((d) => d.mandatory && d.versions.length === 0).length;

  const boCount = (parties[customer.cif] || []).filter((p) => p.kind === 'BO').length;
  const screeningRecord = (screening[customer.cif] || []).find((s) => s.partyId === 'ENTITY');

  // Group entities
  const groupEntities = [
    { cif: '00001715', name: 'Alpha Logistics Amman', country: 'JO' },
    { cif: '00001700', name: 'Alpha Logistics Group', country: 'JO' },
    { cif: '00001722', name: 'Alpha Logistics Dubai LLC', country: 'AE' },
    { cif: '00001731', name: 'Alpha Logistics Egypt', country: 'EG' },
    { cif: '00001740', name: 'Alpha Logistics UK Ltd', country: 'GB' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Row 1: Two Cards (Card A: KYC Status & Card B: Group Roll-up) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: KYC Status (Top border 4px stage-current #2F7BEA per BRD §6.5) */}
        <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] border-t-4 border-t-[#2F7BEA] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1F2329]">KYC Compliance Status</h3>
                <p className="text-[11px] text-[#5B616B] mt-0.5">
                  Periodic review schedule, statutory risk grading, and core sync
                </p>
              </div>
              <KycStatusChip label={kycStatus.label} variant={kycStatus.variant} size="md" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4 text-[13px]">
              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Current Risk Rating</span>
                <span className="font-bold text-[#1F2329]">{profile?.riskRating || 'Medium'}</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Review Frequency</span>
                <span className="font-bold text-[#1F2329]">
                  {profile?.riskRating === 'High' ? '12 months' : '24 months (Reg Max)'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Last Review Completed</span>
                <span className="font-bold text-[#1F2329] font-mono text-[12px]">
                  {profile?.lastReviewDate || '19/11/2024'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Next Review Due</span>
                <span className="font-bold text-[#1F2329] font-mono text-[12px]">
                  {profile?.nextReviewDate || '19/11/2026'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Screening (Fircosoft)</span>
                <span className="font-semibold text-emerald-700">
                  {screeningRecord?.result || 'Clear'} ({screeningRecord?.screenedAt || '24/10/2026'})
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Document Compliance</span>
                <span className="font-semibold text-amber-800">
                  {expiredDocsCount} expired · {missingDocsCount} missing
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Beneficial Owners</span>
                <span className="font-semibold text-[#1F2329]">{boCount} recorded & traced</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B616B] block">Open Review Case</span>
                {isCaseOpen ? (
                  <button
                    onClick={() => navigate(`#/kyc/${activeCase?.id}/initiation`)}
                    className="font-bold text-[#1F5BD8] hover:underline flex items-center gap-1"
                  >
                    {activeCase?.caseNo} <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[#5B616B] font-medium">None</span>
                )}
              </div>
            </div>

            {/* Source Line */}
            <div className="mt-5 pt-3 border-t border-[#E6E8EB] text-[11px] text-[#5B616B] font-mono">
              Source: AS400 KYC (synced {profile?.lastSyncedAt || '25/10/2026 08:30 AM'}) · Fircosoft screening status
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center gap-2 flex-wrap">
            {!isCaseOpen ? (
              <Button
                variant="primary"
                onClick={onInitiatePeriodic}
                className="font-bold text-xs"
              >
                Initiate KYC Review
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate(`#/kyc/${activeCase?.id}/initiation`)}
                className="font-bold text-xs"
              >
                Open KYC Review
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onTriggerEvent}
              className="font-semibold text-xs text-[#1F2329]"
            >
              Trigger Event Review
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-xs text-[#5B616B] flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              View KYC History
            </Button>
          </div>
        </div>

        {/* Card B: Group KYC Roll-Up */}
        <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1F2329]">Group KYC Roll-Up</h3>
                <p className="text-[11px] text-[#5B616B] mt-0.5">
                  Holding group status across Jordan, UAE, Egypt, and UK entities
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-slate-100 text-[#5B616B] px-2.5 py-1 rounded-md">
                Group G1
              </span>
            </div>

            {/* Entity Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
                    <th className="pb-2">Entity</th>
                    <th className="pb-2">Country</th>
                    <th className="pb-2">Risk</th>
                    <th className="pb-2">Next Review</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {groupEntities.map((ent) => {
                    const entProfile = profiles[ent.cif];
                    const entCase = entProfile?.openCaseId ? cases[entProfile.openCaseId] : undefined;
                    const entHasOpen = entCase && entCase.status !== 'Closed' && entCase.status !== 'Cancelled';
                    const entStatus = deriveKycStatus(entProfile, currentDate, Boolean(entHasOpen));

                    return (
                      <tr
                        key={ent.cif}
                        onClick={() => navigate(`#/c360/${ent.cif}`)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 font-bold text-[#1F5BD8] hover:underline">
                          {ent.name}
                        </td>
                        <td className="py-2.5 font-semibold text-slate-700">{ent.country}</td>
                        <td className="py-2.5 font-medium">{entProfile?.riskRating || 'Medium'}</td>
                        <td className="py-2.5 font-mono text-[11px] text-[#5B616B]">
                          {entProfile?.nextReviewDate || '—'}
                        </td>
                        <td className="py-2.5 text-right">
                          <KycStatusChip
                            label={entStatus.label}
                            variant={entStatus.variant}
                            size="sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between">
            <span className="text-[11px] text-[#5B616B]">
              Multi-entity consolidated onboarding & KYC review
            </span>
            <Button
              variant="outline"
              onClick={onStartGroupReview}
              className="text-xs font-bold text-[#1F2329]"
            >
              Start Group Review
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Alerts Strip */}
      <div className="flex flex-col gap-2">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-[#1F2329]">
                KYC Review Due: Regulatory 24-Month Refresh Cycle
              </p>
              <p className="text-[12px] text-[#5B616B]">
                Alpha Logistics Amman review window is open. 2 compliance documents require refresh (Chamber certificate & BO declaration).
              </p>
            </div>
          </div>
          {!isCaseOpen ? (
            <Button variant="primary" size="sm" onClick={onInitiatePeriodic}>
              Initiate Review
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate(`#/kyc/${activeCase?.id}/initiation`)}>
              View Active Case
            </Button>
          )}
        </div>
      </div>

      {/* Past KYC History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="KYC Review Historical Archive"
        subtitle={`Audit records of historical periodic and event-driven reviews for CIF ${customer.cif}`}
      >
        <div className="flex flex-col gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between font-bold">
              <span>KYC-2024-0891 (Periodic Review)</span>
              <span className="text-emerald-700">Closed (19/11/2024)</span>
            </div>
            <p className="text-[#5B616B] mt-1">
              Reviewed by Dana Khalil (Compliance). Rating confirmed: Medium. Core banking AS400 sync acknowledged.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between font-bold">
              <span>KYC-2022-0412 (Initial Corporate Onboarding)</span>
              <span className="text-emerald-700">Closed (15/12/2022)</span>
            </div>
            <p className="text-[#5B616B] mt-1">
              Initial customer identification, ultimate beneficial ownership traced, risk grade assigned: Medium.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
