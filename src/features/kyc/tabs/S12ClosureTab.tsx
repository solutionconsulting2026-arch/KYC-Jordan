import React, { useState } from 'react';
import { Customer, KycCase } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { canCloseCase } from '../../../domain/permissions';
import { addMonths } from '../../../domain/dateUtils';
import { KYC_CONFIG } from '../../../config/kycConfig';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import {
  CheckCircle2,
  Database,
  Download,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';

interface S12ClosureTabProps {
  kycCase: KycCase;
  customer: Customer;
  onCloseCase: (outcome: KycCase['outcome']) => void;
}

export const S12ClosureTab: React.FC<S12ClosureTabProps> = ({
  kycCase,
  customer,
  onCloseCase,
}) => {
  const { auditEvents, currentDate, profiles, currentUser, logAuditEvent } = useKycStore();

  const [selectedOutcome, setSelectedOutcome] = useState<KycCase['outcome']>(
    kycCase.outcome || (kycCase.eddRequired ? 'RetainEnhanced' : 'Retain')
  );
  const [isClosing, setIsClosing] = useState(false);
  const [isCloseSuccessOpen, setIsCloseSuccessOpen] = useState(false);

  const profile = profiles[customer.cif];
  const effectiveRisk =
    kycCase.risk.overrideByCompliance ||
    kycCase.risk.proposed ||
    profile?.riskRating ||
    'High';

  const nextReviewDate = addMonths(currentDate, KYC_CONFIG.reviewFrequencyMonths[effectiveRisk]);

  const isSeniorApprover = currentUser.roles.includes('SeniorApprover');
  const isComplianceUser = currentUser.roles.includes('Compliance');
  const canClose = canCloseCase(currentUser, kycCase) || (isSeniorApprover && kycCase.status === 'Approved');

  const handleExecuteClose = async () => {
    setIsClosing(true);
    await onCloseCase(selectedOutcome);
    setIsClosing(false);
    setIsCloseSuccessOpen(true);
  };

  const handleExportCsv = () => {
    logAuditEvent('Case', kycCase.id, 'Export', 'Exported comprehensive audit trail to CSV format');

    const headers = ['Event ID', 'Timestamp', 'User', 'Role', 'Entity', 'Entity ID', 'Action', 'Details'];
    const rows = auditEvents.map((e) => [
      e.id,
      e.at,
      e.userName,
      e.role,
      e.entity,
      e.entityId,
      e.action,
      `"${e.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KYC_Audit_Ledger_${kycCase.caseNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const outcomeOptions = [
    {
      id: 'Retain',
      title: 'Retain Account Relationship',
      desc: 'Standard commercial banking relationship retained. Scheduled for next periodic cycle.',
    },
    {
      id: 'RetainEnhanced',
      title: 'Retain with Enhanced Monitoring',
      desc: 'Approved under EDD mandate. Heightened monitoring plan and transaction alerts active.',
    },
    {
      id: 'RecommendRestriction',
      title: 'Recommend Account Restriction',
      desc: 'Operational account limits or blocking recommended pending regulatory clearance.',
    },
    {
      id: 'RecommendExit',
      title: 'Recommend Relationship Exit',
      desc: 'Orderly closure of account facilities initiated in core banking.',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
      {/* Left Column: Outcome Decision & AS400 Sync (~60% / 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-[#CFD3D8] p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-[15px] font-bold text-[#1F2329]">
                Final KYC Outcome & Statutory Sign-off
              </h3>
              <p className="text-[11px] text-[#5B616B]">
                Select authorized relationship decision and trigger AS400 core system synchronization
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-md">
              Stage: Closure
            </span>
          </div>

          {/* Radio Cards for Outcome Decision */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#1F2329]">Statutory Outcome Decision:</span>
            {outcomeOptions.map((opt) => (
              <label
                key={opt.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                  selectedOutcome === opt.id
                    ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="outcomeDecision"
                  value={opt.id}
                  checked={selectedOutcome === opt.id}
                  onChange={() => setSelectedOutcome(opt.id as any)}
                  className="mt-1 text-amber-500 focus:ring-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1F2329]">{opt.title}</p>
                  <p className="text-[11px] text-[#5B616B] mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Read-Only Outcome Attributes Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-[#5B616B] block">Confirmed Risk Rating</span>
              <span className="text-[14px] font-bold text-rose-700">
                {effectiveRisk} (was {profile?.riskRating})
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#5B616B] block">Next Scheduled Review</span>
              <span className="text-[14px] font-bold text-[#1F2329] font-mono">
                {nextReviewDate}
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] text-[#5B616B] block">Core Banking AS400 Status</span>
              <div className="flex items-center gap-2 mt-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">
                  {kycCase.writeBack.status === 'Acknowledged'
                    ? `Acknowledged at ${kycCase.writeBack.at || currentDate}`
                    : kycCase.writeBack.status === 'Sent'
                    ? 'Sent to Core Gateway (Awaiting ACK)'
                    : kycCase.writeBack.status === 'Pending'
                    ? 'Connecting to AS400...'
                    : kycCase.writeBack.status === 'Failed'
                    ? 'Sync Failed: Core Timeout (Retry Available)'
                    : 'Pending Closure Execution'}
                </span>
              </div>
            </div>

            <div className="col-span-2 text-[10px] text-[#5B616B] font-mono">
              Statutory Record Retention: At least 5 years after relationship terminates (BR-21).
            </div>
          </div>

          {/* Info Box per BR-18 & BR-22 */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              On closure, Corporate 360 immediately updates: KYC Status <strong>Current</strong>, Risk Grade{' '}
              <strong>{effectiveRisk}</strong>, Next Review <strong>{nextReviewDate}</strong>, and open review case cleared.
              Any suspicion is referred to the Reporting Officer outside this case and is never recorded here (BR-22).
            </p>
          </div>

          {/* Final Closure Action */}
          <div className="pt-3 border-t border-[#E6E8EB] flex items-center justify-between">
            <span className="text-xs text-[#5B616B]">
              Four-eyes closed by: <strong>{currentUser.name}</strong> ({currentUser.roles[0]})
            </span>

            <Button
              variant="primary"
              size="lg"
              disabled={!canClose || isClosing}
              onClick={handleExecuteClose}
              className="font-bold text-xs shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {isClosing ? 'Synchronizing AS400...' : 'Close Case & Sync to AS400'}
            </Button>
          </div>

          {!canClose && kycCase.status !== 'Closed' && (
            <p className="text-[11px] text-[#5B616B] text-right -mt-2">
              Action restricted: Only authorized Compliance or Senior Approver roles can execute final case closure once Approved.
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Full Audit Trail & CSV Export (~40% / 5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
            <div>
              <h4 className="font-bold text-xs text-[#1F2329]">Immutable Audit Ledger</h4>
              <p className="text-[10px] text-[#5B616B]">
                Full chronological ledger of creates, views, updates, and uploads (BR-20)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs font-semibold flex items-center gap-1.5 text-[#1F2329]"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export CSV
            </Button>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1 text-xs">
            {auditEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1F2329]">
                    {ev.action} · {ev.entity}
                  </span>
                  <span className="text-[#5B616B] font-mono font-normal">{ev.at}</span>
                </div>
                <p className="text-slate-700 leading-snug">{ev.details}</p>
                <div className="flex items-center justify-between text-[10px] text-[#5B616B] mt-1 pt-1 border-t border-slate-200/60">
                  <span>
                    User: {ev.userName} ({ev.role})
                  </span>
                  <span className="font-mono">{ev.entityId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closure Confirmation Modal */}
      <Modal
        isOpen={isCloseSuccessOpen}
        onClose={() => setIsCloseSuccessOpen(false)}
        title="Case Closed & Core Synchronized"
        maxWidth="max-w-md"
      >
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1F2329]">Synchronization Confirmed</h4>
            <p className="text-xs text-[#5B616B] mt-2">
              Case is marked CLOSED and KYC details have been synced to Core System.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCloseSuccessOpen(false)}
            className="w-full mt-2 font-bold text-xs"
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};
