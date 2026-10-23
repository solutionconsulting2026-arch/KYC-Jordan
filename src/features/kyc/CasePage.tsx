import React, { useState, useEffect } from 'react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { StageBar } from './StageBar';
import { S06InitiationTab } from './tabs/S06InitiationTab';
import { S07DocumentChecklistTab } from './tabs/S07DocumentChecklistTab';
import { S08EntityOwnershipTab } from './tabs/S08EntityOwnershipTab';
import { S09ScreeningTab } from './tabs/S09ScreeningTab';
import { S10RiskAssessmentTab } from './tabs/S10RiskAssessmentTab';
import { S11ComplianceReviewTab } from './tabs/S11ComplianceReviewTab';
import { S11bEddApprovalTab } from './tabs/S11bEddApprovalTab';
import { S12ClosureTab } from './tabs/S12ClosureTab';
import { canEditCaseData, getAllowedTabs } from '../../domain/permissions';
import { calculateSlaInfo } from '../../domain/slaEngine';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Field } from '../../components/common/Field';
import {
  FileText,
  Clock,
  Calendar,
  StickyNote,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const CasePage: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const {
    cases,
    customers,
    currentUser,
    currentDate,
    updateCase,
    submitCase,
    returnCase,
    acceptCase,
    approveEdd,
    declineEdd,
    closeCase,
    logAuditEvent,
    showToast,
  } = useKycStore();

  const caseId = currentRoute.caseId || 'KYC-2026-0150';
  const kycCase = cases[caseId] || cases['KYC-2026-0150'];
  const customer = customers[kycCase?.cif || '00001715'] || customers['00001715'];

  const [activeTab, setActiveTab] = useState<string>(currentRoute.tab || 'initiation');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [caseNote, setCaseNote] = useState('');

  // Sync tab with route
  useEffect(() => {
    if (currentRoute.tab) {
      setActiveTab(currentRoute.tab);
    }
    // Log view audit event per BR-20
    if (kycCase) {
      logAuditEvent('Case', kycCase.id, 'View', `Viewed case ${kycCase.caseNo} (${currentRoute.tab || 'initiation'})`);
    }
  }, [currentRoute.tab, caseId]);

  if (!kycCase || !customer) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Case record not found. Return to{' '}
        <button onClick={() => navigate('#/c360/00001715')} className="text-[#1F5BD8] underline">
          Corporate 360
        </button>
      </div>
    );
  }

  const isEditable = canEditCaseData(currentUser, kycCase);
  const slaInfo = calculateSlaInfo(kycCase, currentDate);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`#/kyc/${caseId}/${tabId}`);
  };

  const [isRiskReadyModalOpen, setIsRiskReadyModalOpen] = useState(false);

  const handleSaveAndProceed = () => {
    if (activeTab === 'risk') {
      setIsRiskReadyModalOpen(true);
      return;
    }

    const sequence = ['initiation', 'documents', 'ownership', 'screening', 'risk', 'review', 'edd', 'closure'];
    const currentIdx = sequence.indexOf(activeTab);
    if (currentIdx >= 0 && currentIdx < sequence.length - 1) {
      handleTabChange(sequence[currentIdx + 1]);
    } else {
      showToast({ type: 'success', title: 'Progress Saved', description: 'All case updates committed.' });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNote.trim()) return;
    updateCase(caseId, {
      comments: [
        ...kycCase.comments,
        {
          id: `NOTE-${Date.now()}`,
          caseId,
          by: currentUser.id,
          byName: currentUser.name,
          role: currentUser.roles[0],
          at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Case Internal Note: ${caseNote}`,
          kind: 'General',
        },
      ],
    });
    setCaseNote('');
    setIsNoteModalOpen(false);
    showToast({ type: 'success', title: 'Note Added', description: 'Internal case memorandum recorded.' });
  };

  const caseTabs = getAllowedTabs(currentUser, kycCase);

  return (
    <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto max-w-[1600px] w-full mx-auto select-none animate-in fade-in duration-150">
      {/* Title & Breadcrumbs per Section 4.4 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-bold text-[#1F2329] tracking-tight">
          Corporate KYC Review
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-[#5B616B]">
          <button
            onClick={() => navigate(`#/c360/${customer.cif}`)}
            className="hover:text-[#1F5BD8] transition-colors"
          >
            Corporate 360
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{customer.accountName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#1F2329] font-bold font-mono">{kycCase.caseNo}</span>
        </div>
      </div>

      {/* Main White Card Container matching reference/service-management.png */}
      <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-6 flex flex-col gap-5">
        {/* Stage Bar Chevrons */}
        <StageBar
          status={kycCase.status}
          eddRequired={kycCase.eddRequired}
          activeTab={activeTab}
        />

        {/* Case Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#1F5BD8] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs font-mono">
              {kycCase.caseNo}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B616B] bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Due: <strong className="text-[#1F2329] font-mono">{kycCase.dueDate}</strong>
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              SLA: <strong className="font-mono text-amber-800">{slaInfo.slaDisplay}</strong>
            </span>

            {slaInfo.isOverdue && (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                {slaInfo.overdueDays} Days Overdue ({slaInfo.escalationStatusText})
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#1F2329]"
          >
            <StickyNote className="w-3.5 h-3.5 text-slate-500" />
            Note
          </Button>
        </div>

        {/* Read-Only Category Classification Grid per Section 4.4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Category</span>
            <span className="font-semibold text-[#1F2329] mt-0.5 block">KYC Review</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Sub Category</span>
            <span className="font-semibold text-[#1F2329] mt-0.5 block">
              {kycCase.type} Review
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Sub Sub Category</span>
            <span className="font-semibold text-[#1F2329] mt-0.5 block">
              {customer.legalForm} · 24M Cycle
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Contact Email</span>
            <span className="font-medium text-[#1F5BD8] mt-0.5 block truncate">
              {customer.email}
            </span>
          </div>
        </div>

        {/* Tagline & Confidentiality Tooltip per BR-22 */}
        <div className="flex items-center justify-between text-[11px] text-[#5B616B] -mt-1">
          <span>KYC Review v1.0 powered by AutoFlow</span>
          <span
            className="text-[11px] text-slate-500 cursor-help flex items-center gap-1 hover:text-slate-800"
            title="Suspicions are referred to the Reporting Officer through the Bank's channel (BR-22)."
          >
            <Info className="w-3.5 h-3.5" /> Confidentiality Governance Applied
          </span>
        </div>

        {/* Main Tabs Group (Outline Rectangles, Active Black #1F2329 per Section 4.1) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#E6E8EB]">
          {caseTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`h-9 px-4 rounded-lg font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#1F2329] text-white border-[#1F2329] shadow-xs'
                    : 'bg-white text-[#1F2329] border-[#CFD3D8] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Stage Tab Viewport */}
        <div className="pt-2">
          {activeTab === 'initiation' && (
            <S06InitiationTab
              kycCase={kycCase}
              customer={customer}
              isEditable={isEditable}
              onUpdateCase={(up) => updateCase(caseId, up)}
            />
          )}

          {activeTab === 'documents' && (
            <S07DocumentChecklistTab
              kycCase={kycCase}
              customer={customer}
              isEditable={isEditable}
            />
          )}

          {activeTab === 'ownership' && (
            <S08EntityOwnershipTab
              kycCase={kycCase}
              customer={customer}
              isEditable={isEditable}
            />
          )}

          {activeTab === 'screening' && (
            <S09ScreeningTab kycCase={kycCase} customer={customer} />
          )}

          {activeTab === 'risk' && (
            <S10RiskAssessmentTab
              kycCase={kycCase}
              customer={customer}
              isEditable={isEditable}
              onUpdateCase={(up) => updateCase(caseId, up)}
              onSubmit={(just) => submitCase(caseId, just)}
              isReadyModalOpen={isRiskReadyModalOpen}
              setIsReadyModalOpen={setIsRiskReadyModalOpen}
            />
          )}

          {activeTab === 'review' && (
            <S11ComplianceReviewTab
              kycCase={kycCase}
              onAccept={(ov, com) => acceptCase(caseId, ov, com)}
              onReturn={(com) => returnCase(caseId, com)}
            />
          )}

          {activeTab === 'edd' && (
            <S11bEddApprovalTab
              kycCase={kycCase}
              onApprove={(com) => approveEdd(caseId, com)}
              onDecline={(com, out) => declineEdd(caseId, com, out)}
            />
          )}

          {activeTab === 'closure' && (
            <S12ClosureTab
              kycCase={kycCase}
              customer={customer}
              onCloseCase={(out) => closeCase(caseId, out)}
            />
          )}
        </div>

        {/* Sticky Centered Footer Controls per Section 4.4 */}
        <div className="pt-6 border-t border-[#E6E8EB] flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={kycCase.status === 'Closed'}
            onClick={() => showToast({ type: 'info', title: 'Draft Saved', description: 'Work-in-progress state preserved.' })}
            className="w-28 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>

          <Button
            variant="primary"
            disabled={kycCase.status === 'Closed'}
            onClick={handleSaveAndProceed}
            className="px-6 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save and Proceed
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`#/c360/${customer.cif}`)}
            className="w-28 text-xs font-semibold"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Internal Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Internal Case Memorandum"
        subtitle={`Confidential internal note for case ${kycCase.caseNo}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddNote} className="flex flex-col gap-3 py-2 text-xs">
          <Field label="Note Details" mandatory layout="vertical">
            <textarea
              required
              rows={4}
              placeholder="Record supervisory notes or operational comments..."
              value={caseNote}
              onChange={(e) => setCaseNote(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md outline-none"
            />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
