import React, { useState } from 'react';
import { KycCase } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { useRouter } from '../../../router/AppRouter';
import { canApproveEdd } from '../../../domain/permissions';
import { Button } from '../../../components/common/Button';
import { Field } from '../../../components/common/Field';
import { ShieldAlert, CheckCircle2, XCircle, UserCheck, Lock } from 'lucide-react';

interface S11bEddApprovalTabProps {
  kycCase: KycCase;
  onApprove: (comment?: string) => void;
  onDecline: (comment: string, outcome: 'RecommendRestriction' | 'RecommendExit') => void;
}

export const S11bEddApprovalTab: React.FC<S11bEddApprovalTabProps> = ({
  kycCase,
  onApprove,
  onDecline,
}) => {
  const { currentUser } = useKycStore();
  const { navigate } = useRouter();

  const [approverComments, setApproverComments] = useState(
    kycCase.edd?.decisionComment || ''
  );
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [forcedOutcome, setForcedOutcome] = useState<'RecommendRestriction' | 'RecommendExit'>(
    'RecommendRestriction'
  );

  const canAct = canApproveEdd(currentUser, kycCase) || currentUser.roles.includes('SeniorApprover');
  const isSeniorApprover = currentUser.roles.includes('SeniorApprover');

  const [eddData, setEddData] = useState(
    kycCase.edd || {
      pepDetails: 'Yousef Barakat (BO 28%) is the brother of the Minister of Transport, Jordan.',
      sourceOfWealth:
        'Commercial real estate holdings and industrial supply equity dividends across the Levant region.',
      sourceOfFunds:
        'Operating payments and treasury distributions from commercial freight contracts.',
      purpose: 'Commercial operating accounts, trade finance letters of credit, and treasury cash management.',
      monitoringPlan: 'Quarterly transaction review against expected monthly credit limit of JOD 2M.',
      seniorApproverId: 'U4',
    }
  );

  const handleConfirmDecline = () => {
    if (!approverComments.trim()) return;
    onDecline(approverComments, forcedOutcome);
    setIsDeclineModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Role Notice */}
      {!isSeniorApprover && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-[#5B616B] flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>
            Senior Executive Approval Required. Switch to <strong>U4 Kareem Mansour (Senior Approver)</strong> in the Demo Control Panel to endorse or decline EDD.
          </span>
        </div>
      )}

      {/* Main EDD Dossier Card */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] p-6 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
          <div>
            <h3 className="text-[15px] font-bold text-[#1F2329]">
              Enhanced Due Diligence (EDD) Dossier & Senior Governance
            </h3>
            <p className="text-[11px] text-[#5B616B]">
              Mandatory senior executive sign-off for PEP associations and heightened risk exposures (CBJ Instruction 51/2010)
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-md">
            EDD Case File Active
          </span>
        </div>

        {/* Triggers Strip */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-xs text-amber-950 block">Active EDD Trigger(s):</span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {(kycCase.eddTriggers.length > 0 ? kycCase.eddTriggers : ['PEP linkage detected on Yousef Barakat (BO)']).map(
                (trig, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-white border border-amber-300 text-amber-900 px-2 py-0.5 rounded shadow-2xs"
                  >
                    {trig}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* EDD Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
          <div className="md:col-span-2">
            <Field label="PEP Nexus & Details" mandatory layout="vertical">
              <textarea
                rows={2}
                disabled={!canAct}
                value={eddData.pepDetails}
                onChange={(e) => setEddData({ ...eddData, pepDetails: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md font-medium text-slate-800 outline-none"
              />
            </Field>
          </div>

          <Field label="Source of Wealth (SOW)" mandatory layout="vertical">
            <textarea
              rows={3}
              disabled={!canAct}
              value={eddData.sourceOfWealth}
              onChange={(e) => setEddData({ ...eddData, sourceOfWealth: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-slate-800 outline-none"
            />
          </Field>

          <Field label="Source of Funds (SOF)" mandatory layout="vertical">
            <textarea
              rows={3}
              disabled={!canAct}
              value={eddData.sourceOfFunds}
              onChange={(e) => setEddData({ ...eddData, sourceOfFunds: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-slate-800 outline-none"
            />
          </Field>

          <Field label="Purpose & Business Rationale" mandatory layout="vertical">
            <textarea
              rows={2}
              disabled={!canAct}
              value={eddData.purpose}
              onChange={(e) => setEddData({ ...eddData, purpose: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-slate-800 outline-none"
            />
          </Field>

          <Field label="Enhanced Monitoring Plan" mandatory layout="vertical">
            <textarea
              rows={2}
              disabled={!canAct}
              value={eddData.monitoringPlan}
              onChange={(e) => setEddData({ ...eddData, monitoringPlan: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-slate-800 outline-none"
            />
          </Field>

          <Field label="Senior Executive Approver" mandatory layout="vertical">
            <input
              type="text"
              readOnly
              value="Kareem Mansour (Regional Manager / Senior Approver)"
              className="w-full h-[34px] px-3 bg-slate-100 border border-[#CFD3D8] rounded-md font-bold text-slate-800"
            />
          </Field>

          <Field label="Approver Comments / Decision Memo" layout="vertical">
            <input
              type="text"
              disabled={!canAct}
              placeholder="Enter senior decision notes or conditions..."
              value={approverComments}
              onChange={(e) => setApproverComments(e.target.value)}
              className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md outline-none"
            />
          </Field>
        </div>

        {/* Senior Approval Action Bar (Only Senior Approver) */}
        {canAct && (
          <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeclineModalOpen(true)}
              className="text-xs font-semibold text-rose-700 hover:bg-rose-50 border-rose-300"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Decline Relationship
            </Button>

            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                onApprove(approverComments);
                navigate(`#/kyc/${kycCase.id}/closure`);
              }}
              className="font-bold text-xs shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Approve Relationship
            </Button>
          </div>
        )}
      </div>

      {/* Decline Confirmation Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-5 flex flex-col gap-4 text-xs">
            <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Decline Senior EDD Approval
            </h4>
            <p className="text-slate-600">
              Declining this EDD assessment will advance the case to final closure with a mandatory restriction or account exit recommendation.
            </p>

            <Field label="Forced Outcome Recommendation" layout="vertical">
              <select
                value={forcedOutcome}
                onChange={(e) => setForcedOutcome(e.target.value as any)}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md font-semibold text-xs"
              >
                <option value="RecommendRestriction">Recommend Restriction (Account Operations Freeze)</option>
                <option value="RecommendExit">Recommend Exit (Orderly Client Offboarding)</option>
              </select>
            </Field>

            <Field label="Decline Rationale (Mandatory)" mandatory layout="vertical">
              <textarea
                required
                rows={3}
                placeholder="Detail senior management rationale for decline..."
                value={approverComments}
                onChange={(e) => setApproverComments(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs"
              />
            </Field>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!approverComments.trim()}
                onClick={handleConfirmDecline}
              >
                Confirm Decline & Advance
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
