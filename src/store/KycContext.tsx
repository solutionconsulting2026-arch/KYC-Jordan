import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ActivityItem,
  AuditEvent,
  CaseComment,
  Customer,
  DocumentItem,
  DocVersion,
  KycCase,
  KycProfile,
  Notification,
  Party,
  RiskLevel,
  ScreeningResult,
  User,
  WriteBackState,
} from '../types/kyc.types';
import { SEED_USERS } from '../data/seed/users';
import { SEED_CUSTOMERS } from '../data/seed/customers';
import { SEED_PROFILES } from '../data/seed/kycProfiles';
import { SEED_PARTIES } from '../data/seed/parties';
import { SEED_DOCUMENTS } from '../data/seed/documents';
import { SEED_SCREENING } from '../data/seed/screening';
import { DEFAULT_RISK_FACTORS, PRE_STAGED_CASES } from '../data/seed/preStagedCases';
import { addDays, addMonths, diffDays, formatDate, formatDateTime } from '../domain/dateUtils';
import { KYC_CONFIG } from '../config/kycConfig';
import { evaluateDocVersionStatus } from '../domain/documentRules';
import { evaluateEddTriggers } from '../domain/eddRules';
import { calculateProposedRating, updateFactorForPep } from '../domain/riskModel';
import { executeWriteBackMock } from '../integrations/writeBack';
import { sendDocumentRequestMock } from '../integrations/outlook';

const STORAGE_KEY = 'ARAB_BANK_KYC_PROTOTYPE_V2';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warn' | 'error' | 'info';
  title: string;
  description?: string;
}

interface KycContextType {
  currentDate: string;
  currentUser: User;
  customers: Record<string, Customer>;
  profiles: Record<string, KycProfile>;
  parties: Record<string, Party[]>;
  documents: Record<string, DocumentItem[]>;
  screening: Record<string, ScreeningResult[]>;
  cases: Record<string, KycCase>;
  auditEvents: AuditEvent[];
  notifications: Notification[];
  activities: ActivityItem[];
  toasts: ToastMessage[];
  simulateClearedPep: boolean;
  simulateWriteBackFailure: boolean;
  isDemoPanelOpen: boolean;

  // Actions
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  setCurrentUser: (user: User) => void;
  advanceClock: (days: number) => void;
  resetDemoData: () => void;
  jumpToCase: (caseId: string) => void;
  toggleSimulateClearedPep: () => void;
  toggleSimulateWriteBackFailure: () => void;
  toggleDemoPanel: () => void;
  markNotificationRead: (id: string) => void;

  // Business Actions
  createCase: (
    cif: string,
    type: 'Periodic' | 'Event',
    triggerReason?: string,
    triggerDetails?: string,
    dueDate?: string
  ) => KycCase;
  createGroupCases: (cifs: string[]) => void;
  updateCase: (caseId: string, updates: Partial<KycCase>) => void;
  submitCase: (caseId: string, justification: string) => boolean;
  returnCase: (caseId: string, commentText: string) => void;
  acceptCase: (caseId: string, overrideRating?: RiskLevel, overrideComment?: string) => void;
  approveEdd: (caseId: string, commentText?: string) => void;
  declineEdd: (
    caseId: string,
    commentText: string,
    forcedOutcome: 'RecommendRestriction' | 'RecommendExit'
  ) => void;
  closeCase: (caseId: string, outcome: KycCase['outcome']) => Promise<void>;
  uploadDocument: (
    cif: string,
    typeKey: string,
    file: { name: string },
    issueDate?: string,
    expiryDate?: string,
    remarks?: string
  ) => void;
  verifyPartyId: (cif: string, partyId: string) => void;
  rescreenParty: (cif: string) => Promise<void>;
  sendDocRequestEmail: (cif: string, caseId?: string, items?: string[]) => Promise<void>;
  logActivity: (activity: Omit<ActivityItem, 'id' | 'at'>) => void;
  logAuditEvent: (
    entity: AuditEvent['entity'],
    entityId: string,
    action: AuditEvent['action'],
    details: string,
    before?: unknown,
    after?: unknown
  ) => void;
}

const KycContext = createContext<KycContextType | null>(null);

function buildInitialState() {
  const initialCustomers: Record<string, Customer> = {};
  SEED_CUSTOMERS.forEach((c) => {
    initialCustomers[c.cif] = { ...c };
  });

  return {
    currentDate: '25/10/2026',
    currentUser: SEED_USERS[0], // U1 Rania Saleh
    customers: initialCustomers,
    profiles: { ...SEED_PROFILES },
    parties: JSON.parse(JSON.stringify(SEED_PARTIES)),
    documents: JSON.parse(JSON.stringify(SEED_DOCUMENTS)),
    screening: JSON.parse(JSON.stringify(SEED_SCREENING)),
    cases: JSON.parse(JSON.stringify(PRE_STAGED_CASES)),
    auditEvents: [
      {
        id: 'AUD-001',
        at: '15/09/2026 09:00 AM',
        userId: 'SYS',
        userName: 'System Scheduler',
        role: 'System',
        entity: 'Case',
        entityId: 'KYC-2026-0141',
        action: 'Create',
        details: 'Scheduled periodic review for Alpha Logistics Dubai LLC (due 20/10/2026)',
      },
      {
        id: 'AUD-002',
        at: '20/10/2026 09:00 AM',
        userId: 'SYS',
        userName: 'SLA Watchdog',
        role: 'System',
        entity: 'Case',
        entityId: 'KYC-2026-0141',
        action: 'StatusChange',
        details: 'Due date passed. Automated SLA escalation dispatched to Team Leader Faris Nasser',
      },
      {
        id: 'AUD-003',
        at: '24/10/2026 04:30 PM',
        userId: 'U1',
        userName: 'Rania Saleh',
        role: 'RM',
        entity: 'Case',
        entityId: 'KYC-2026-0150',
        action: 'StatusChange',
        details: 'Case submitted for four-eyes Compliance Review',
      },
    ] as AuditEvent[],
    notifications: [
      {
        id: 'NOTIF-01',
        userId: 'U2',
        at: '20/10/2026 09:00 AM',
        type: 'escalation',
        text: 'Escalation: Case KYC-2026-0141 (Alpha Logistics Dubai LLC) is overdue. Immediate Team Leader action required.',
        link: '#/kyc/KYC-2026-0141/initiation',
        read: false,
      },
      {
        id: 'NOTIF-02',
        userId: 'U1',
        at: '25/10/2026 08:30 AM',
        type: 'reminder',
        text: 'Reminder: KYC periodic review for Alpha Logistics Amman is due in 25 days (19/11/2026).',
        link: '#/c360/00001715?tab=compliances',
        read: false,
      },
      {
        id: 'NOTIF-03',
        userId: 'U3',
        at: '24/10/2026 04:30 PM',
        type: 'case_assigned',
        text: 'New Case for Review: KYC-2026-0150 (Alpha Logistics Amman) awaiting four-eyes compliance review.',
        link: '#/kyc/KYC-2026-0150/review',
        read: false,
      },
    ] as Notification[],
    activities: [
      {
        id: 'ACT-001',
        cif: '00001715',
        caseId: undefined,
        type: 'Email',
        at: '20/10/2026 10:15 AM',
        by: 'Rania Saleh (RM)',
        notes: 'Requested audited annual financial statements and tax filings from corporate treasury.',
        nextStep: 'Awaiting client response',
      },
    ] as ActivityItem[],
    simulateClearedPep: false,
    simulateWriteBackFailure: false,
    isDemoPanelOpen: true,
  };
}

export const KycProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.currentUser && parsed.cases) {
          // Ensure currentUser has at least valid properties
          if (!parsed.currentUser.roles || !parsed.currentUser.name) {
            parsed.currentUser = SEED_USERS[0];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    return buildInitialState();
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Mirror to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [state]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logAuditEvent = useCallback(
    (
      entity: AuditEvent['entity'],
      entityId: string,
      action: AuditEvent['action'],
      details: string,
      before?: unknown,
      after?: unknown
    ) => {
      const event: AuditEvent = {
        id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        at: formatDateTime(new Date()),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        role: state.currentUser.roles[0],
        entity,
        entityId,
        action,
        details,
        before,
        after,
      };
      setState((prev: any) => ({
        ...prev,
        auditEvents: [event, ...prev.auditEvents],
      }));
    },
    [state.currentUser]
  );

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(buildInitialState());
    showToast({
      type: 'success',
      title: 'Demo Data Reset',
      description: 'All demo accounts, documents, and cases restored to baseline state.',
    });
  }, [showToast]);

  const setCurrentUser = useCallback((user: User) => {
    setState((prev: any) => ({ ...prev, currentUser: user }));
  }, []);

  const advanceClock = useCallback(
    (days: number) => {
      setState((prev: any) => {
        const newDate = addDays(prev.currentDate, days);
        const newNotifications: Notification[] = [...prev.notifications];

        // Re-evaluate escalations for all open cases
        Object.values(prev.cases as Record<string, KycCase>).forEach((c) => {
          if (c.status !== 'Closed' && c.status !== 'Cancelled') {
            const overdueDays = diffDays(newDate, c.dueDate);
            if (overdueDays > 0) {
              // Escalation to Unit Head check (overdue >= 7 days)
              if (overdueDays >= 7) {
                const notifExists = newNotifications.some(
                  (n) => n.userId === 'U5' && n.link.includes(c.id) && n.type === 'unit_head_escalation'
                );
                if (!notifExists) {
                  newNotifications.unshift({
                    id: `NOTIF-UH-${Date.now()}-${c.id}`,
                    userId: 'U5', // Hala Odeh, Unit Head
                    at: `${newDate} 09:00 AM`,
                    type: 'unit_head_escalation',
                    text: `CRITICAL ESCALATION (Unit Head): Case ${c.caseNo} is ${overdueDays} days overdue. Immediate intervention required.`,
                    link: `#/kyc/${c.id}/initiation`,
                    read: false,
                  });
                }
              }
            }
          }
        });

        return {
          ...prev,
          currentDate: newDate,
          notifications: newNotifications,
        };
      });

      showToast({
        type: 'info',
        title: `Clock Advanced +${days} Day${days === 1 ? '' : 's'}`,
        description: `Current simulated bank system date is now ${addDays(state.currentDate, days)}.`,
      });
    },
    [showToast, state.currentDate]
  );

  const jumpToCase = useCallback(
    (caseId: string) => {
      const targetCase = PRE_STAGED_CASES[caseId];
      if (!targetCase) return;

      setState((prev: any) => {
        const nextCases = { ...prev.cases, [caseId]: { ...targetCase } };
        const nextProfiles = { ...prev.profiles };

        // For cases linked to 00001715, ensure one-open-case rule holds
        if (targetCase.cif === '00001715') {
          nextProfiles['00001715'] = {
            ...nextProfiles['00001715'],
            openCaseId: caseId,
          };
        }

        return {
          ...prev,
          cases: nextCases,
          profiles: nextProfiles,
        };
      });

      showToast({
        type: 'info',
        title: `Jumped to Case ${targetCase.caseNo}`,
        description: `Loaded status: ${targetCase.status} for ${targetCase.cif}`,
      });

      window.location.hash = `#/kyc/${caseId}/initiation`;
    },
    [showToast]
  );

  const toggleSimulateClearedPep = useCallback(() => {
    setState((prev: any) => {
      const nextSim = !prev.simulateClearedPep;
      const nextScreening = { ...prev.screening };
      if (nextScreening['00001715']) {
        nextScreening['00001715'] = nextScreening['00001715'].map((s: ScreeningResult) => {
          if (s.partyId === 'P2') {
            return {
              ...s,
              result: nextSim ? 'ClearedPEPConfirmed' : 'PotentialMatch',
              alertRef: nextSim
                ? 'FIRCO-PEP-44819 (Cleared: PEP confirmed)'
                : 'FIRCO-PEP-44819',
            };
          }
          return s;
        });
      }
      return {
        ...prev,
        simulateClearedPep: nextSim,
        screening: nextScreening,
      };
    });

    showToast({
      type: 'info',
      title: 'Fircosoft Screening Simulation',
      description: state.simulateClearedPep
        ? 'Simulated match returned to Potential Match'
        : 'Simulated compliance clearance: Cleared – PEP confirmed',
    });
  }, [showToast, state.simulateClearedPep]);

  const toggleSimulateWriteBackFailure = useCallback(() => {
    setState((prev: any) => ({
      ...prev,
      simulateWriteBackFailure: !prev.simulateWriteBackFailure,
    }));
    showToast({
      type: 'warn',
      title: 'AS400 Write-Back Simulation',
      description: state.simulateWriteBackFailure
        ? 'Simulated write-back will succeed normally'
        : 'Simulated write-back will trigger Failure & Retry',
    });
  }, [showToast, state.simulateWriteBackFailure]);

  const toggleDemoPanel = useCallback(() => {
    setState((prev: any) => ({ ...prev, isDemoPanelOpen: !prev.isDemoPanelOpen }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev: any) => ({
      ...prev,
      notifications: prev.notifications.map((n: Notification) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const createCase = useCallback(
    (
      cif: string,
      type: 'Periodic' | 'Event',
      triggerReason?: string,
      triggerDetails?: string,
      dueDateOverride?: string
    ): KycCase => {
      const customer = state.customers[cif];
      const profile = state.profiles[cif];
      const parties = state.parties[cif] || [];

      const caseId = `KYC-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
      const dueDate =
        dueDateOverride ||
        (type === 'Periodic'
          ? profile?.nextReviewDate || addMonths(state.currentDate, 24)
          : addDays(state.currentDate, KYC_CONFIG.eventSlaDays));

      const eddEval = evaluateEddTriggers(customer, parties);
      let initialFactors = DEFAULT_RISK_FACTORS;
      initialFactors = updateFactorForPep(initialFactors, parties.some((p: Party) => p.pep));
      const proposedRating = calculateProposedRating(initialFactors);

      const newCase: KycCase = {
        id: caseId,
        caseNo: caseId,
        cif,
        type,
        triggerReason,
        triggerDetails,
        status: 'Open',
        createdAt: formatDateTime(new Date()),
        createdBy: `${state.currentUser.name} (${state.currentUser.roles[0]})`,
        dueDate,
        priority: type === 'Event' ? 'High' : 'Normal',
        ownerId: state.currentUser.id,
        activity: { attested: true },
        risk: {
          factors: initialFactors,
          proposed: proposedRating,
          justification:
            type === 'Event'
              ? `Event-driven review triggered: ${triggerReason || 'Material corporate change'}.`
              : `Periodic KYC review for ${customer.accountName}. Baseline risk assessed.`,
        },
        eddRequired: eddEval.eddRequired,
        eddTriggers: eddEval.triggers,
        reviewerChecklist: [false, false, false, false, false, false],
        writeBack: { status: 'NotStarted' },
        comments: [
          {
            id: `COM-${Date.now()}`,
            caseId,
            by: state.currentUser.id,
            byName: state.currentUser.name,
            role: state.currentUser.roles[0],
            at: formatDateTime(new Date()),
            text: `KYC Review initiated (${type}) by ${state.currentUser.name}.`,
            kind: 'General',
          },
        ],
        activityIds: [],
      };

      setState((prev: any) => ({
        ...prev,
        cases: { ...prev.cases, [caseId]: newCase },
        profiles: {
          ...prev.profiles,
          [cif]: { ...prev.profiles[cif], openCaseId: caseId },
        },
      }));

      logAuditEvent(
        'Case',
        caseId,
        'Create',
        `Created ${type} KYC review case ${caseId} for ${customer.accountName}`
      );

      showToast({
        type: 'success',
        title: `KYC Review Case Created`,
        description: `Case ${caseId} generated and scheduled with due date ${dueDate}.`,
      });

      return newCase;
    },
    [logAuditEvent, showToast, state.currentDate, state.currentUser, state.customers, state.parties, state.profiles]
  );

  const createGroupCases = useCallback(
    (cifs: string[]) => {
      let createdCount = 0;
      cifs.forEach((cif) => {
        if (!state.profiles[cif]?.openCaseId) {
          createCase(cif, 'Periodic');
          createdCount++;
        }
      });
      showToast({
        type: 'success',
        title: 'Group KYC Reviews Initiated',
        description: `${createdCount} case${createdCount === 1 ? '' : 's'} created across group entities.`,
      });
    },
    [createCase, showToast, state.profiles]
  );

  const updateCase = useCallback(
    (caseId: string, updates: Partial<KycCase>) => {
      setState((prev: any) => {
        const existing = prev.cases[caseId];
        if (!existing) return prev;
        const nextCase = {
          ...existing,
          ...updates,
          status: existing.status === 'Open' ? 'InProgress' : existing.status,
        };
        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: nextCase },
        };
      });
      logAuditEvent('Case', caseId, 'Update', 'Updated case fields and data attributes');
    },
    [logAuditEvent]
  );

  const submitCase = useCallback(
    (caseId: string, justification: string): boolean => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return false;

      const nextStatus = KYC_CONFIG.tlReviewEnabled ? 'UnderTLReview' : 'UnderComplianceReview';

      setState((prev: any) => {
        const updatedCase: KycCase = {
          ...currentCase,
          status: nextStatus,
          submittedBy: prev.currentUser.id,
          risk: {
            ...currentCase.risk,
            justification,
          },
          comments: [
            ...currentCase.comments,
            {
              id: `COM-${Date.now()}`,
              caseId,
              by: prev.currentUser.id,
              byName: prev.currentUser.name,
              role: prev.currentUser.roles[0],
              at: formatDateTime(new Date()),
              text: `Submitted for compliance review. Justification: ${justification}`,
              kind: 'General',
            },
          ],
        };

        const newNotif: Notification = {
          id: `NOTIF-${Date.now()}`,
          userId: 'U3', // Dana Khalil (Compliance)
          at: formatDateTime(new Date()),
          type: 'case_submitted',
          text: `Case ${currentCase.caseNo} (${state.customers[currentCase.cif]?.accountName}) submitted for four-eyes compliance review.`,
          link: `#/kyc/${caseId}/review`,
          read: false,
        };

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: updatedCase },
          notifications: [newNotif, ...prev.notifications],
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `Case submitted by ${state.currentUser.name}. Status advanced to ${nextStatus}`
      );

      showToast({
        type: 'success',
        title: 'Case Submitted for Review',
        description: `Case ${currentCase.caseNo} routed to Compliance for four-eyes verification.`,
      });

      return true;
    },
    [logAuditEvent, showToast, state.cases, state.customers, state.currentUser]
  );

  const returnCase = useCallback(
    (caseId: string, commentText: string) => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return;

      setState((prev: any) => {
        const updatedCase: KycCase = {
          ...currentCase,
          status: 'Returned',
          reviewerChecklist: [false, false, false, false, false, false],
          comments: [
            ...currentCase.comments,
            {
              id: `COM-${Date.now()}`,
              caseId,
              by: prev.currentUser.id,
              byName: prev.currentUser.name,
              role: prev.currentUser.roles[0],
              at: formatDateTime(new Date()),
              text: `Returned to RM: ${commentText}`,
              kind: 'Return',
            },
          ],
        };

        const notif: Notification = {
          id: `NOTIF-${Date.now()}`,
          userId: currentCase.ownerId || 'U1',
          at: formatDateTime(new Date()),
          type: 'case_returned',
          text: `Case ${currentCase.caseNo} returned by Compliance: "${commentText}"`,
          link: `#/kyc/${caseId}/documents`,
          read: false,
        };

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: updatedCase },
          notifications: [notif, ...prev.notifications],
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `Case returned to RM by ${state.currentUser.name}. Reason: ${commentText}`
      );

      showToast({
        type: 'warn',
        title: 'Case Returned to RM',
        description: `Case ${currentCase.caseNo} unlocked for RM modifications.`,
      });
    },
    [logAuditEvent, showToast, state.cases, state.currentUser]
  );

  const acceptCase = useCallback(
    (caseId: string, overrideRating?: RiskLevel, overrideComment?: string) => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return;

      const nextStatus = currentCase.eddRequired ? 'PendingEDDApproval' : 'Approved';

      setState((prev: any) => {
        const updatedCase: KycCase = {
          ...currentCase,
          status: nextStatus,
          reviewerId: prev.currentUser.id,
          risk: {
            ...currentCase.risk,
            overrideByCompliance: overrideRating || currentCase.risk.overrideByCompliance,
            overrideComment: overrideComment || currentCase.risk.overrideComment,
          },
          comments: [
            ...currentCase.comments,
            {
              id: `COM-${Date.now()}`,
              caseId,
              by: prev.currentUser.id,
              byName: prev.currentUser.name,
              role: prev.currentUser.roles[0],
              at: formatDateTime(new Date()),
              text: `Compliance review completed and four-eyes verification endorsed. ${
                overrideRating ? `Rating overridden to ${overrideRating}. ` : ''
              }Routed to ${nextStatus}.`,
              kind: 'Accept',
            },
          ],
        };

        const newNotifications = [...prev.notifications];
        if (currentCase.eddRequired) {
          newNotifications.unshift({
            id: `NOTIF-EDD-${Date.now()}`,
            userId: 'U4', // Kareem Mansour (Senior Approver)
            at: formatDateTime(new Date()),
            type: 'edd_pending',
            text: `Action Required: Case ${currentCase.caseNo} requires Senior Management EDD approval.`,
            link: `#/kyc/${caseId}/edd`,
            read: false,
          });
        }

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: updatedCase },
          notifications: newNotifications,
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `Case endorsed by Compliance (${state.currentUser.name}). Status: ${nextStatus}`
      );

      showToast({
        type: 'success',
        title: currentCase.eddRequired ? 'Endorsed for EDD Approval' : 'Compliance Review Accepted',
        description: currentCase.eddRequired
          ? `Routed to Senior Approver for PEP/EDD sign-off.`
          : `Case approved and ready for formal closure.`,
      });
    },
    [logAuditEvent, showToast, state.cases, state.currentUser]
  );

  const approveEdd = useCallback(
    (caseId: string, commentText?: string) => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return;

      setState((prev: any) => {
        const updatedCase: KycCase = {
          ...currentCase,
          status: 'Approved',
          approverId: prev.currentUser.id,
          outcome: 'RetainEnhanced',
          edd: {
            ...(currentCase.edd || {
              sourceOfWealth: 'Verified',
              sourceOfFunds: 'Verified',
              purpose: 'Operating',
              monitoringPlan: 'Quarterly review',
            }),
            decision: 'Approved',
            decisionBy: prev.currentUser.name,
            decisionAt: formatDateTime(new Date()),
            decisionComment: commentText || 'Relationship retained with enhanced monitoring controls.',
          },
          comments: [
            ...currentCase.comments,
            {
              id: `COM-${Date.now()}`,
              caseId,
              by: prev.currentUser.id,
              byName: prev.currentUser.name,
              role: prev.currentUser.roles[0],
              at: formatDateTime(new Date()),
              text: `Senior Approver Decision: Relationship Approved (Retain with enhanced monitoring). ${
                commentText || ''
              }`,
              kind: 'Accept',
            },
          ],
        };

        const notif: Notification = {
          id: `NOTIF-${Date.now()}`,
          userId: 'U3', // Compliance
          at: formatDateTime(new Date()),
          type: 'edd_approved',
          text: `Senior Approval Granted: Case ${currentCase.caseNo} approved by ${prev.currentUser.name}. Ready for closure.`,
          link: `#/kyc/${caseId}/closure`,
          read: false,
        };

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: updatedCase },
          notifications: [notif, ...prev.notifications],
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `EDD Approved by Senior Approver ${state.currentUser.name}. Outcome: Retain with enhanced monitoring`
      );

      showToast({
        type: 'success',
        title: 'EDD Approved',
        description: 'Relationship authorized by Senior Management. Case ready to close.',
      });
    },
    [logAuditEvent, showToast, state.cases, state.currentUser]
  );

  const declineEdd = useCallback(
    (
      caseId: string,
      commentText: string,
      forcedOutcome: 'RecommendRestriction' | 'RecommendExit'
    ) => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return;

      setState((prev: any) => {
        const updatedCase: KycCase = {
          ...currentCase,
          status: 'Approved', // Proceed to closure with restriction/exit outcome
          approverId: prev.currentUser.id,
          outcome: forcedOutcome,
          edd: {
            ...(currentCase.edd || {
              sourceOfWealth: '',
              sourceOfFunds: '',
              purpose: '',
              monitoringPlan: '',
            }),
            decision: 'Declined',
            decisionBy: prev.currentUser.name,
            decisionAt: formatDateTime(new Date()),
            decisionComment: commentText,
          },
          comments: [
            ...currentCase.comments,
            {
              id: `COM-${Date.now()}`,
              caseId,
              by: prev.currentUser.id,
              byName: prev.currentUser.name,
              role: prev.currentUser.roles[0],
              at: formatDateTime(new Date()),
              text: `Senior Approver Decision: Declined. Outcome forced to ${forcedOutcome}. Remarks: ${commentText}`,
              kind: 'Decline',
            },
          ],
        };

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: updatedCase },
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `EDD Declined by ${state.currentUser.name}. Outcome forced to ${forcedOutcome}`
      );

      showToast({
        type: 'warn',
        title: 'EDD Declined',
        description: `Case marked for ${forcedOutcome}.`,
      });
    },
    [logAuditEvent, showToast, state.cases, state.currentUser]
  );

  const closeCase = useCallback(
    async (caseId: string, outcome: KycCase['outcome']) => {
      const currentCase = state.cases[caseId];
      if (!currentCase) return;

      // Execute AS400 write-back
      await executeWriteBackMock(
        caseId,
        state.simulateWriteBackFailure,
        (wbState: WriteBackState) => {
          setState((prev: any) => ({
            ...prev,
            cases: {
              ...prev.cases,
              [caseId]: {
                ...prev.cases[caseId],
                writeBack: wbState,
              },
            },
          }));
        }
      );

      if (state.simulateWriteBackFailure) {
        showToast({
          type: 'error',
          title: 'AS400 Write-Back Failed',
          description: 'Core banking integration timed out. Use the Retry button to re-attempt.',
        });
        logAuditEvent(
          'Case',
          caseId,
          'WriteBack',
          'AS400 core system synchronization failed (Simulated failure)'
        );
        return;
      }

      // Successful write-back: finalize closure
      const effectiveRisk =
        currentCase.risk.overrideByCompliance ||
        currentCase.risk.proposed ||
        state.profiles[currentCase.cif]?.riskRating ||
        'Medium';

      const monthsToAdd = KYC_CONFIG.reviewFrequencyMonths[effectiveRisk as RiskLevel] || 24;
      const nextReviewDate = addMonths(state.currentDate, monthsToAdd);

      setState((prev: any) => {
        const nextCase: KycCase = {
          ...currentCase,
          status: 'Closed',
          outcome,
          closedAt: formatDateTime(new Date()),
          writeBack: { status: 'Acknowledged', at: formatDateTime(new Date()) },
        };

        const nextProfiles = {
          ...prev.profiles,
          [currentCase.cif]: {
            ...prev.profiles[currentCase.cif],
            riskRating: effectiveRisk,
            lastReviewDate: prev.currentDate,
            nextReviewDate,
            openCaseId: undefined,
            history: [caseId, ...(prev.profiles[currentCase.cif]?.history || [])],
          },
        };

        return {
          ...prev,
          cases: { ...prev.cases, [caseId]: nextCase },
          profiles: nextProfiles,
        };
      });

      logAuditEvent(
        'Case',
        caseId,
        'StatusChange',
        `Case closed by ${state.currentUser.name}. Outcome: ${outcome}. AS400 sync confirmed.`
      );

      showToast({
        type: 'success',
        title: 'Case Closed & Synced to AS400',
        description: `Customer profile updated to Risk ${effectiveRisk}. Next review scheduled for ${nextReviewDate}.`,
      });
    },
    [logAuditEvent, showToast, state.cases, state.currentDate, state.currentUser, state.profiles, state.simulateWriteBackFailure]
  );

  const uploadDocument = useCallback(
    (
      cif: string,
      typeKey: string,
      file: { name: string },
      issueDate?: string,
      expiryDate?: string,
      remarks?: string
    ) => {
      setState((prev: any) => {
        const customerDocs: DocumentItem[] = prev.documents[cif] || [];
        const docIndex = customerDocs.findIndex((d) => d.typeKey === typeKey);

        const newVersionNumber =
          docIndex >= 0 && customerDocs[docIndex].versions.length > 0
            ? customerDocs[docIndex].versions[customerDocs[docIndex].versions.length - 1].v + 1
            : 1;

        const newVersion: DocVersion = {
          v: newVersionNumber,
          fileName: file.name,
          issueDate: issueDate || prev.currentDate,
          expiryDate,
          uploadedBy: `${prev.currentUser.name} (${prev.currentUser.roles[0]})`,
          uploadedAt: formatDateTime(new Date()),
          status: evaluateDocVersionStatus(expiryDate, prev.currentDate),
          remarks: remarks || 'Uploaded during KYC periodic refresh.',
        };

        let updatedDocs: DocumentItem[];
        if (docIndex >= 0) {
          const existing = customerDocs[docIndex];
          const markedSuperseded = existing.versions.map((v) => ({
            ...v,
            status: 'Superseded' as const,
          }));
          updatedDocs = [
            ...customerDocs.slice(0, docIndex),
            {
              ...existing,
              versions: [...markedSuperseded, newVersion],
            },
            ...customerDocs.slice(docIndex + 1),
          ];
        } else {
          updatedDocs = [
            ...customerDocs,
            {
              id: `DOC-${Date.now()}`,
              cif,
              typeKey,
              label: file.name,
              mandatory: true,
              versions: [newVersion],
            },
          ];
        }

        return {
          ...prev,
          documents: { ...prev.documents, [cif]: updatedDocs },
        };
      });

      logAuditEvent(
        'Document',
        typeKey,
        'Upload',
        `Uploaded version for ${typeKey}: ${file.name} (Expiry: ${expiryDate || 'N/A'})`
      );

      showToast({
        type: 'success',
        title: 'Document Uploaded',
        description: `New version uploaded for ${typeKey}. Previous versions archived as Superseded.`,
      });
    },
    [logAuditEvent, showToast]
  );

  const verifyPartyId = useCallback(
    (cif: string, partyId: string) => {
      setState((prev: any) => {
        const partyList = prev.parties[cif] || [];
        const nextParties = partyList.map((p: Party) => {
          if (p.id === partyId) {
            return {
              ...p,
              idVerified: true,
              idExpiry: p.idExpiry ? (diffDays(p.idExpiry, prev.currentDate) < 0 ? addMonths(prev.currentDate, 24) : p.idExpiry) : undefined,
            };
          }
          return p;
        });
        return {
          ...prev,
          parties: { ...prev.parties, [cif]: nextParties },
        };
      });

      logAuditEvent(
        'Party',
        partyId,
        'Update',
        `Identity verification validated and endorsed for party ${partyId}`
      );

      showToast({
        type: 'success',
        title: 'Identity Verified',
        description: `Beneficial Owner / Signatory ${partyId} marked as verified.`,
      });
    },
    [logAuditEvent, showToast]
  );

  const rescreenParty = useCallback(
    async (cif: string) => {
      const parties = state.parties[cif] || [];
      const customer = state.customers[cif];
      const now = formatDateTime(new Date());

      setState((prev: any) => {
        const nextScreening = (prev.screening[cif] || []).map((s: ScreeningResult) => ({
          ...s,
          screenedAt: now,
          result:
            s.partyId === 'P2' && prev.simulateClearedPep
              ? 'ClearedPEPConfirmed'
              : s.result,
        }));
        return {
          ...prev,
          screening: { ...prev.screening, [cif]: nextScreening },
        };
      });

      logAuditEvent(
        'Party',
        cif,
        'Update',
        `Executed real-time batch re-screening via Fircosoft engine`
      );

      showToast({
        type: 'info',
        title: 'Screening Refreshed',
        description: 'All entity parties successfully re-screened against global sanctions & PEP lists.',
      });
    },
    [logAuditEvent, showToast, state.customers, state.parties]
  );

  const sendDocRequestEmail = useCallback(
    async (cif: string, caseId?: string, items?: string[]) => {
      const customer = state.customers[cif];
      const toEmail = customer?.email || 'treasury@alpha-logistics.example';
      const docLabels = items && items.length > 0 ? items : ['Chamber of commerce certificate', 'Beneficial owner declaration'];

      const activity = await sendDocumentRequestMock(
        cif,
        caseId,
        docLabels,
        toEmail,
        state.currentUser.name
      );

      setState((prev: any) => ({
        ...prev,
        activities: [activity, ...prev.activities],
      }));

      logAuditEvent(
        'Document',
        cif,
        'Comment',
        `Dispatched formal document request email via Outlook to ${toEmail}`
      );

      showToast({
        type: 'success',
        title: 'Email Sent via Outlook',
        description: `Dispatched document request for ${docLabels.length} items to ${toEmail}.`,
      });
    },
    [logAuditEvent, showToast, state.customers, state.currentUser]
  );

  const logActivity = useCallback(
    (activity: Omit<ActivityItem, 'id' | 'at'>) => {
      const newAct: ActivityItem = {
        ...activity,
        id: `ACT-${Date.now()}`,
        at: formatDateTime(new Date()),
      };
      setState((prev: any) => ({
        ...prev,
        activities: [newAct, ...prev.activities],
      }));
      showToast({
        type: 'success',
        title: 'Activity Logged',
        description: `${activity.type} recorded in client interaction timeline.`,
      });
    },
    [showToast]
  );

  return (
    <KycContext.Provider
      value={{
        ...state,
        toasts,
        dismissToast,
        showToast,
        setCurrentUser,
        advanceClock,
        resetDemoData,
        jumpToCase,
        toggleSimulateClearedPep,
        toggleSimulateWriteBackFailure,
        toggleDemoPanel,
        markNotificationRead,
        createCase,
        createGroupCases,
        updateCase,
        submitCase,
        returnCase,
        acceptCase,
        approveEdd,
        declineEdd,
        closeCase,
        uploadDocument,
        verifyPartyId,
        rescreenParty,
        sendDocRequestEmail,
        logActivity,
        logAuditEvent,
      }}
    >
      {children}
    </KycContext.Provider>
  );
};

export function useKycStore() {
  const ctx = useContext(KycContext);
  if (!ctx) {
    throw new Error('useKycStore must be used within a KycProvider');
  }
  return ctx;
}
