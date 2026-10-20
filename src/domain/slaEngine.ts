import { KycCase } from '../types/kyc.types';
import { diffDays } from './dateUtils';
import { KYC_CONFIG } from '../config/kycConfig';

export interface SlaInfo {
  isOverdue: boolean;
  overdueDays: number;
  daysRemaining: number;
  slaDisplay: string;
  escalatedToTL: boolean;
  escalatedToUnitHead: boolean;
  escalationStatusText: string;
}

export function calculateSlaInfo(kycCase: KycCase, currentDateStr: string): SlaInfo {
  if (kycCase.status === 'Closed' || kycCase.status === 'Cancelled') {
    return {
      isOverdue: false,
      overdueDays: 0,
      daysRemaining: 0,
      slaDisplay: '0 D 0 H 0 M',
      escalatedToTL: false,
      escalatedToUnitHead: false,
      escalationStatusText: 'Completed',
    };
  }

  const daysRemaining = diffDays(kycCase.dueDate, currentDateStr);
  const isOverdue = daysRemaining < 0;
  const overdueDays = isOverdue ? Math.abs(daysRemaining) : 0;

  const escalatedToTL = isOverdue && overdueDays >= KYC_CONFIG.tlEscalationDaysAfterDue;
  const escalatedToUnitHead = isOverdue && overdueDays >= KYC_CONFIG.unitHeadEscalationDaysAfterDue;

  let escalationStatusText = 'On Track';
  if (escalatedToUnitHead) {
    escalationStatusText = `Escalated to Unit Head (${overdueDays}d overdue)`;
  } else if (escalatedToTL) {
    escalationStatusText = `Escalated to Team Leader (${overdueDays}d overdue)`;
  } else if (daysRemaining <= 7) {
    escalationStatusText = `Due in ${daysRemaining} days (Reminder active)`;
  }

  const daysPart = Math.max(0, daysRemaining);
  const slaDisplay = `${daysPart} D 0 H 0 M`;

  return {
    isOverdue,
    overdueDays,
    daysRemaining,
    slaDisplay,
    escalatedToTL,
    escalatedToUnitHead,
    escalationStatusText,
  };
}
