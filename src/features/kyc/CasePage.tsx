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
  Key,
  Users2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  LayoutTemplate,
  MoreVertical,
  Mail,
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

  // Stage pill label mirrors the running chevron in StageBar
  const STAGE_BY_TAB: Record<string, string> = {
    initiation: 'New Lead',
    documents: 'Contact Established',
    ownership: 'Contact Established',
    screening: 'Document Collection',
    risk: 'Document Collection',
    review: 'Hand Off To LOS',
    edd: 'LAN Generation',
    closure: 'Won/Lost',
  };

  return (
    <div className="flex-1 flex flex-col px-[14px] pt-[18px] pb-[18px] gap-[22px] select-none animate-in fade-in duration-150">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[20px] leading-[28px] font-semibold text-black">Individual Asset</h1>
        <div className="flex items-center gap-2.5 text-[15px] text-[#4A4A4A]">
          <button
            onClick={() => navigate(`#/c360/${customer.cif}`)}
            className="text-[#1877F2] underline underline-offset-2 hover:text-[#0F5FCC]"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-[#4A4A4A]" />
          <span>New</span>
          <ChevronRight className="w-4 h-4 text-[#4A4A4A]" />
          <span>{kycCase.caseNo}</span>
        </div>
      </div>

      {/* Main White Card */}
      <div className="bg-white rounded-[20px] flex flex-col">
        {/* Stage Bar Chevrons */}
        <div className="px-6 pt-[19px] pb-[20px]">
          <StageBar
            status={kycCase.status}
            eddRequired={kycCase.eddRequired}
            activeTab={activeTab}
          />
        </div>

        {/* Stage header row + key information form */}
        <div className="border-t border-[#E3E3E3] px-6 pt-[19px] pb-[14px] flex flex-col gap-[26px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="h-9 inline-flex items-center bg-[#1877F2] text-white text-[15px] px-[15px] rounded-full">
                {STAGE_BY_TAB[activeTab] || 'New Lead'}
              </span>
              {slaInfo.isOverdue && (
                <span className="h-9 inline-flex items-center text-[13px] font-medium text-[#B42318] bg-[#FEF3F2] px-4 rounded-full border border-[#FECDCA]">
                  {slaInfo.overdueDays} Days Overdue ({slaInfo.escalationStatusText})
                </span>
              )}
            </div>

            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="h-[38px] flex items-center gap-2 text-[15px] text-[#1F1F1F] px-4 rounded-full border border-[#D0D0D0] bg-white hover:bg-[#F5F5F5] transition-colors"
            >
              <StickyNote className="w-4 h-4" />
              Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-[20px] pr-[22px]">
            <Field label="Category" mandatory labelWidth="w-[230px]">
              <input type="text" readOnly value="KYC Review" />
            </Field>
            <Field label="Sub Category" mandatory>
              <input type="text" readOnly value={`${kycCase.type} Review`} />
            </Field>
            <Field label="Customer Name" labelWidth="w-[230px]">
              <input type="text" readOnly value={customer.accountName} />
            </Field>
            <Field label="Case Number">
              <input type="text" readOnly value={kycCase.caseNo} />
            </Field>
            <Field label="Email" labelWidth="w-[230px]">
              <div className="relative">
                <input type="text" readOnly value={customer.email} style={{ paddingRight: 40 }} />
                <Mail className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F] pointer-events-none" />
              </div>
            </Field>
            <Field label="Due Date">
              <div className="relative">
                <input type="text" readOnly value={kycCase.dueDate} style={{ paddingRight: 40 }} />
                <Calendar className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F] pointer-events-none" />
              </div>
            </Field>
            <Field label="Sub Sub Category" labelWidth="w-[230px]">
              <input type="text" readOnly value={`${customer.legalForm} · 24M Cycle`} />
            </Field>
            <Field label="SLA">
              <div className="relative">
                <input type="text" readOnly value={slaInfo.slaDisplay} style={{ paddingRight: 40 }} />
                <Clock className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F] pointer-events-none" />
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-between text-[15px] text-[#6B6B6B] px-3">
            <span>Loan Application v1.0 powered by AutoFlow</span>
            <span
              className="text-[13px] cursor-help flex items-center gap-1.5 hover:text-[#1F1F1F]"
              title="Suspicions are referred to the Reporting Officer through the Bank's channel (BR-22)."
            >
              <Info className="w-4 h-4" /> Confidentiality Governance Applied
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-t border-[#E3E3E3] pl-[19px] pr-6 py-[14px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none">
            {caseTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              let icon = <FileText className="w-[18px] h-[18px]" />;
              if (tab.id === 'initiation') icon = <Key className="w-[18px] h-[18px]" />;
              else if (tab.id === 'documents') icon = <FileText className="w-[18px] h-[18px]" />;
              else if (tab.id === 'ownership') icon = <Users2 className="w-[18px] h-[18px]" />;
              else if (tab.id === 'screening') icon = <Search className="w-[18px] h-[18px]" />;
              else if (tab.id === 'risk') icon = <ShieldAlert className="w-[18px] h-[18px]" />;
              else if (tab.id === 'review') icon = <CheckCircle2 className="w-[18px] h-[18px]" />;
              else if (tab.id === 'edd') icon = <AlertTriangle className="w-[18px] h-[18px]" />;
              else if (tab.id === 'closure') icon = <Award className="w-[18px] h-[18px]" />;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`h-[41px] px-[14px] rounded-[6px] text-[15px] whitespace-nowrap transition-colors border flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-[#1F1F1F] border-[#D9D9D9] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-5 text-[#1F1F1F] shrink-0">
            <button className="hover:text-black/60 transition-colors" title="Layout">
              <LayoutTemplate className="w-5 h-5" />
            </button>
            <button className="hover:text-black/60 transition-colors" title="More Options">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Stage Tab Viewport */}
        <div className="border-t border-[#E3E3E3] px-6 py-6">
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

        {/* Sticky Centered Footer Controls */}
        <div className="sticky bottom-0 z-10 bg-white rounded-b-[20px] border-t border-[#E3E3E3] py-[14px] flex items-center justify-center gap-5">
          <button
            type="button"
            disabled={kycCase.status === 'Closed'}
            onClick={() => showToast({ type: 'info', title: 'Draft Saved', description: 'Work-in-progress state preserved.' })}
            className="h-11 px-5 rounded-full text-[17px] border border-[#DADADA] bg-white text-[#8A8A8A] hover:text-[#1F1F1F] hover:border-[#BDBDBD] transition-colors disabled:cursor-not-allowed"
          >
            Save
          </button>

          <button
            type="button"
            disabled={kycCase.status === 'Closed'}
            onClick={handleSaveAndProceed}
            className="h-11 px-5 rounded-full text-[17px] bg-[#C9DE2A] hover:bg-[#BBD11F] text-[#1F1F1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save and Proceed
          </button>

          <button
            type="button"
            onClick={() => navigate(`#/c360/${customer.cif}`)}
            className="h-11 px-5 rounded-full text-[17px] border border-[#D0D0D0] bg-white text-[#1F1F1F] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
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
