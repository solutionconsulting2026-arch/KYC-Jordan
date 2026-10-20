import React, { useState } from 'react';
import { Customer, KycCase, RiskFactor, RiskLevel } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { calculateProposedRating } from '../../../domain/riskModel';
import { evaluateSubmitGuard } from '../../../domain/submitGuard';
import { KycStatusChip } from '../../../components/common/KycStatusChip';
import { Button } from '../../../components/common/Button';
import { Field } from '../../../components/common/Field';
import { Modal } from '../../../components/common/Modal';
import { FetchSection } from '../../../components/common/FetchSection';
import { addMonths } from '../../../domain/dateUtils';
import { KYC_CONFIG } from '../../../config/kycConfig';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Info,
} from 'lucide-react';

interface S10RiskAssessmentTabProps {
  kycCase: KycCase;
  customer: Customer;
  isEditable: boolean;
  onUpdateCase: (updates: Partial<KycCase>) => void;
  onSubmit: (justification: string) => void;
  isReadyModalOpen?: boolean;
  setIsReadyModalOpen?: (open: boolean) => void;
}

export const S10RiskAssessmentTab: React.FC<S10RiskAssessmentTabProps> = ({
  kycCase,
  customer,
  isEditable,
  onUpdateCase,
  onSubmit,
  isReadyModalOpen: externalReadyModalOpen,
  setIsReadyModalOpen: setExternalReadyModalOpen,
}) => {
  const { documents, parties, screening, currentDate, profiles } = useKycStore();
  const [riskFetchStatus, setRiskFetchStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [internalReadyModalOpen, setInternalReadyModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const isReadyModalOpen = externalReadyModalOpen ?? internalReadyModalOpen;
  const setIsReadyModalOpen = setExternalReadyModalOpen ?? setInternalReadyModalOpen;

  const [justification, setJustification] = useState(
    kycCase.risk.justification ||
      'PEP linkage identified on 28% Beneficial Owner Yousef Barakat (first-degree relative of Minister of Transport). Requires EDD and annual review frequency under CBJ AML/CFT instructions.'
  );

  const [overrideModalFactor, setOverrideModalFactor] = useState<RiskFactor | null>(null);
  const [overrideLevel, setOverrideLevel] = useState<RiskLevel>('High');
  const [overrideComment, setOverrideComment] = useState('');

  const handleFetchRisk = () => {
    setRiskFetchStatus('loading');
    setTimeout(() => setRiskFetchStatus('loaded'), 700);
  };

  const factors = kycCase.risk.factors || [];
  const proposedRating = calculateProposedRating(factors);

  const profile = profiles[customer.cif];
  const nextReviewIfApproved = addMonths(
    currentDate,
    KYC_CONFIG.reviewFrequencyMonths[proposedRating]
  );

  const guard = evaluateSubmitGuard(
    kycCase,
    documents[customer.cif] || [],
    parties[customer.cif] || [],
    screening[customer.cif] || [],
    currentDate
  );

  const handleSaveFactorOverride = () => {
    if (!overrideModalFactor) return;
    const nextFactors = factors.map((f) =>
      f.key === overrideModalFactor.key
        ? {
            ...f,
            level: overrideLevel,
            overriddenBy: 'Rania Saleh (RM)',
            overrideComment,
          }
        : f
    );
    const newProposed = calculateProposedRating(nextFactors);
    onUpdateCase({
      risk: {
        ...kycCase.risk,
        factors: nextFactors,
        proposed: newProposed,
      },
    });
    setOverrideModalFactor(null);
  };

  const handleSubmitReview = () => {
    if (!guard.canSubmit) return;
    onSubmit(justification);
    setIsReadyModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      <FetchSection
        status={riskFetchStatus}
        onFetch={handleFetchRisk}
        fetchLabel="Fetch Risk Assessment"
        refetchLabel="Re-fetch"
        loadingLabel="Calculating Risk Assessment Matrix..."
        emptyPrompt="Click below to calculate and fetch the 7-factor regulatory risk assessment matrix."
      >
        <div className="flex flex-col gap-6 w-full">
          {/* Rating Summary Tiles Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#CFD3D8] rounded-xl shadow-xs">
              <span className="text-[11px] font-bold text-[#5B616B] uppercase block">
                Current Risk Grade
              </span>
              <span className="text-[18px] font-bold text-amber-900 mt-1 block">
                {profile?.riskRating || 'Medium'}
              </span>
              <span className="text-[11px] text-[#5B616B]">AS400 core system baseline</span>
            </div>

            <div className="p-4 bg-amber-50/70 border-2 border-amber-400 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold text-amber-900 uppercase block">
                Proposed Risk Grade (BR-10)
              </span>
              <span className="text-[20px] font-extrabold text-amber-950 mt-1 block">
                {proposedRating}
              </span>
              <span className="text-[11px] font-semibold text-amber-800">
                Evaluated from 7 risk dimensions
              </span>
            </div>

            <div className="p-4 bg-white border border-[#CFD3D8] rounded-xl shadow-xs">
              <span className="text-[11px] font-bold text-[#5B616B] uppercase block">
                Next Review if Approved
              </span>
              <span className="text-[16px] font-bold font-mono text-[#1F2329] mt-1 block">
                {nextReviewIfApproved}
              </span>
              <span className="text-[11px] text-[#5B616B]">
                {KYC_CONFIG.reviewFrequencyMonths[proposedRating]} Months Cycle
              </span>
            </div>
          </div>

          {/* 7 Factors Table */}
          <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E6E8EB] bg-[#F8FAFC] flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#1F2329]">
                7-Factor Regulatory Risk Assessment Matrix
              </h4>
              <span className="text-[11px] text-[#5B616B]">BR-10 Scoring Model</span>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="border-b border-[#E6E8EB] bg-slate-50/50 text-[#5B616B] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Risk Dimension</th>
                  <th className="py-2.5 px-3">Last Review</th>
                  <th className="py-2.5 px-3">Current Assessment</th>
                  <th className="py-2.5 px-3">Dimension Level</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {factors.map((f) => (
                  <tr key={f.key} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#1F2329] block">{f.label}</span>
                      <span className="text-[10px] text-[#5B616B]">Source: {f.source}</span>
                    </td>
                    <td className="py-3 px-3 text-[#5B616B]">{f.last}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{f.current}</td>
                    <td className="py-3 px-3">
                      <KycStatusChip
                        label={f.level}
                        variant={f.level === 'High' ? 'bad' : f.level === 'Medium' ? 'warn' : 'ok'}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditable && (
                        <button
                          onClick={() => {
                            setOverrideModalFactor(f);
                            setOverrideLevel(f.level);
                            setOverrideComment(f.overrideComment || '');
                          }}
                          className="text-xs font-semibold text-[#1F5BD8] hover:underline"
                        >
                          Override
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RM Justification Text Area (Editable) */}
          <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1F2329] flex items-center gap-1">
                <span>RM Strategic & Risk Justification</span>
                <span className="text-rose-600 font-bold">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  justification.trim().length >= 30 ? 'text-emerald-700 font-bold' : 'text-rose-600'
                }`}
              >
                {justification.trim().length} / 30 chars min
              </span>
            </div>

            <textarea
              rows={4}
              placeholder="Substantiate the proposed risk rating and review frequency recommendations for Compliance..."
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                onUpdateCase({
                  risk: { ...kycCase.risk, justification: e.target.value },
                });
              }}
              className="w-full p-3 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none font-sans focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReadyModalOpen(true)}
              className="font-bold flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Check Readiness Checklist
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (!guard.canSubmit) {
                  setIsReadyModalOpen(true);
                } else {
                  handleSubmitReview();
                }
              }}
              className="font-bold flex items-center gap-2"
            >
              Submit for Compliance Review
            </Button>
          </div>
        </div>
      </FetchSection>

      {/* Ready to Submit? Modal */}
      <Modal
        isOpen={isReadyModalOpen}
        onClose={() => setIsReadyModalOpen(false)}
        title="Ready to Submit for Compliance Review?"
        subtitle="Verification checklist per CBJ AML/CFT Regulations and Arab Bank CIB Policy (BR-12)"
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="pb-2 border-b border-[#E6E8EB] flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F2329]">Mandatory Pre-Submission Guard</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                guard.canSubmit
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {guard.items.filter((i) => i.done).length} / 6 Complete
            </span>
          </div>

          {/* 6 Checklist Items per BR-12 */}
          <div className="flex flex-col gap-3">
            {guard.items.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 text-xs">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={`font-semibold leading-tight ${item.done ? 'text-slate-800' : 'text-rose-900'}`}>
                    {item.label}
                  </p>
                  {item.reason && (
                    <p className="text-[11px] text-rose-700 mt-0.5 leading-snug">{item.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Routing Notification Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col gap-1.5 mt-2">
            <span className="font-bold text-[#1F2329] flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#1F5BD8]" />
              Downstream Workflow Routing:
            </span>
            <p className="text-[11px] text-[#5B616B] leading-relaxed">
              Compliance Review (Four-Eyes) →{' '}
              {kycCase.eddRequired ? 'Senior Approver (EDD Approval) → ' : ''}
              Final Closure & AS400 Sync
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsReadyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!guard.canSubmit}
              onClick={handleSubmitReview}
              className="font-bold"
            >
              Submit for Compliance Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal upon Submit */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Case Submitted Successfully"
        subtitle="Notification sent to Compliance Operations"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs text-[#1F2329] leading-relaxed">
            The case <strong className="font-mono">{kycCase.caseNo}</strong> has been assigned to the <strong>Compliance Officer</strong> for four-eyes review and verification.
          </p>
          <div className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs text-[#5B616B]">
            <p><strong>Next Step:</strong> Compliance review and document adjudication.</p>
            <p className="mt-1"><strong>Estimated SLA:</strong> 2 business days</p>
          </div>
          <div className="pt-2 w-full flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsSuccessModalOpen(false)} className="w-full">
              OK
            </Button>
          </div>
        </div>
      </Modal>

      {/* Factor Override Modal */}
      {overrideModalFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-5 flex flex-col gap-4 text-xs">
            <h4 className="font-bold text-sm text-[#1F2329]">
              Override Dimension: {overrideModalFactor.label}
            </h4>

            <Field label="Dimension Level" layout="vertical">
              <select
                value={overrideLevel}
                onChange={(e) => setOverrideLevel(e.target.value as any)}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md font-semibold text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </Field>

            <Field label="Override Justification Comment" mandatory layout="vertical">
              <textarea
                required
                rows={3}
                placeholder="Explain reason for manually adjusting this risk dimension..."
                value={overrideComment}
                onChange={(e) => setOverrideComment(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs"
              />
            </Field>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setOverrideModalFactor(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveFactorOverride}>
                Apply Override
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
