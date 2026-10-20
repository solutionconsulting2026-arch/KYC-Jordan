import React, { useState } from 'react';
import { KycCase, RiskLevel } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { canReviewCompliance } from '../../../domain/permissions';
import { Button } from '../../../components/common/Button';
import { Field } from '../../../components/common/Field';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

interface S11ComplianceReviewTabProps {
  kycCase: KycCase;
  onAccept: (overrideRating?: RiskLevel, overrideComment?: string) => void;
  onReturn: (comment: string) => void;
}

export const S11ComplianceReviewTab: React.FC<S11ComplianceReviewTabProps> = ({
  kycCase,
  onAccept,
  onReturn,
}) => {
  const { currentUser } = useKycStore();

  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false, false, false]);
  const [overrideRating, setOverrideRating] = useState<RiskLevel | ''>('');
  const [overrideComment, setOverrideComment] = useState('');
  const [returnComment, setReturnComment] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Four-eyes rule: submitter cannot review!
  const isSubmitter = kycCase.submittedBy === currentUser.id && !currentUser.roles.includes('Compliance');
  const isComplianceUser = currentUser.roles.includes('Compliance');
  const canAct = isComplianceUser || canReviewCompliance(currentUser, kycCase);

  const checklistItems = [
    'Documents complete, current, and verified against statutory registers',
    'Ownership traced to natural person ultimate beneficial owners (UBOs > 10%)',
    'BO written declaration received and all BO identity documents valid',
    'Screening outcome reviewed in Fircosoft with zero uncleared sanctions matches',
    'Transaction throughput consistent with declared commercial profile and fleet capacity',
    'Proposed risk rating and periodic review frequency agreed and supported',
  ];

  const allChecked = checklist.every(Boolean);

  const toggleCheck = (idx: number) => {
    if (!canAct) return;
    const next = [...checklist];
    next[idx] = !next[idx];
    setChecklist(next);
  };

  const handleAcceptReview = () => {
    if (!canAct || !allChecked) return;
    onAccept(overrideRating ? overrideRating : undefined, overrideComment);
  };

  const handleConfirmReturn = () => {
    if (!returnComment.trim()) return;
    onReturn(returnComment);
    setIsReturnModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Four-Eyes Guard Banner per BR-16 */}
      {isSubmitter && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-xs text-amber-950">
              Four-Eyes Governance Principle Enforced (BR-16)
            </p>
            <p className="text-[12px] text-amber-800">
              You submitted this case ({currentUser.name}). Under Arab Bank CIB governance and CBJ regulations, another reviewer from the Compliance unit must complete the second-line review.
            </p>
          </div>
        </div>
      )}

      {!isComplianceUser && !isSubmitter && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-[#5B616B] flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>
            You are logged in as <strong>{currentUser.name}</strong> ({currentUser.roles[0]}). Switch to <strong>U3 Dana Khalil (Compliance)</strong> in the Demo Control Panel to take action on this stage.
          </span>
        </div>
      )}

      {/* Reviewer 6-Point Checklist */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
          <div>
            <h4 className="font-bold text-xs text-[#1F2329]">
              Compliance Officer Four-Eyes Verification Checklist
            </h4>
            <p className="text-[11px] text-[#5B616B]">
              Every mandatory verification gate must be confirmed prior to endorsement
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
            {checklist.filter(Boolean).length} / 6 Verified
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {checklistItems.map((item, idx) => (
            <label
              key={idx}
              className={`p-3 rounded-lg border flex items-center gap-3 text-xs transition-colors ${
                checklist[idx]
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-slate-50/50 border-slate-200 text-slate-700'
              } ${canAct ? 'cursor-pointer hover:bg-slate-100' : 'cursor-not-allowed opacity-80'}`}
            >
              <input
                type="checkbox"
                disabled={!canAct}
                checked={checklist[idx]}
                onChange={() => toggleCheck(idx)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="flex-1">{item}</span>
              {checklist[idx] && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            </label>
          ))}
        </div>

        {/* Rating Override (Optional) */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#1F2329]">
              Optional Second-Line Rating Override
            </span>
            <span className="text-[11px] text-[#5B616B]">
              Proposed: <strong>{kycCase.risk.proposed || 'High'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Override Rating" layout="vertical">
              <select
                disabled={!canAct}
                value={overrideRating}
                onChange={(e) => setOverrideRating(e.target.value as any)}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs font-semibold"
              >
                <option value="">Keep Proposed Rating ({kycCase.risk.proposed})</option>
                <option value="Low">Override to Low</option>
                <option value="Medium">Override to Medium</option>
                <option value="High">Override to High</option>
              </select>
            </Field>

            {overrideRating && (
              <Field label="Override Justification" mandatory layout="vertical">
                <input
                  type="text"
                  placeholder="Compliance rationale for rating override..."
                  value={overrideComment}
                  onChange={(e) => setOverrideComment(e.target.value)}
                  className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs"
                />
              </Field>
            )}
          </div>
        </div>

        {/* Action Controls (Hidden if current user submitted the case!) */}
        {canAct && (
          <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsReturnModalOpen(true)}
              className="text-xs font-semibold text-rose-700 hover:bg-rose-50 border-rose-300"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Return to RM
            </Button>

            <Button
              variant="primary"
              disabled={!allChecked}
              onClick={handleAcceptReview}
              className="font-bold text-xs shadow-xs"
              title={!allChecked ? 'All 6 checklist items must be verified' : 'Accept review'}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {kycCase.eddRequired ? 'Endorse & Route to EDD Approval' : 'Accept & Approve Review'}
            </Button>
          </div>
        )}
      </div>

      {/* Case Comments Thread */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E6E8EB]">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <h4 className="font-bold text-xs text-[#1F2329]">Review Notes & Dialogue Thread</h4>
        </div>

        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
          {kycCase.comments.map((com) => (
            <div
              key={com.id}
              className={`p-3 rounded-lg border text-xs flex flex-col gap-1 ${
                com.kind === 'Return'
                  ? 'bg-rose-50/60 border-rose-200'
                  : com.kind === 'Accept'
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#1F2329]">
                  {com.byName} ({com.role})
                </span>
                <span className="text-[#5B616B] font-mono font-normal">{com.at}</span>
              </div>
              <p className="text-[#1F2329] leading-snug">{com.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-5 flex flex-col gap-4 text-xs">
            <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Return Case to Relationship Manager
            </h4>
            <p className="text-slate-600">
              The case status will revert to <strong>Returned</strong>, unlocking all document and data fields for the RM. Please specify deficiencies:
            </p>

            <Field label="Deficiency Memo (Mandatory)" mandatory layout="vertical">
              <textarea
                required
                rows={3}
                placeholder="Detail required document renewals, beneficial ownership clarifications..."
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs outline-none focus:border-amber-400"
              />
            </Field>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsReturnModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!returnComment.trim()}
                onClick={handleConfirmReturn}
              >
                Confirm Return
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
