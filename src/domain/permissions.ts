import { CaseStatus, Customer, KycCase, User } from '../types/kyc.types';

export function hasCountryAccess(user: User, customer: Customer): boolean {
  if (user.countryScope.includes('ALL')) return true;
  return user.countryScope.includes(customer.countryOfBooking);
}

export function canInitiateReview(user: User): boolean {
  return user.roles.some((r) => r === 'RM' || r === 'TL' || r === 'Compliance');
}

export function canEditCaseData(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('RM') && !user.roles.includes('TL')) return false;
  return kycCase.status === 'Open' || kycCase.status === 'InProgress' || kycCase.status === 'Returned';
}

export function canSubmitCase(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('RM') && !user.roles.includes('TL')) return false;
  return kycCase.status === 'Open' || kycCase.status === 'InProgress' || kycCase.status === 'Returned';
}

export function canReviewCompliance(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('Compliance')) return false;
  // Four-eyes rule: submitter cannot review their own case!
  if (kycCase.submittedBy === user.id) return false;
  return kycCase.status === 'UnderComplianceReview';
}

export function canApproveEdd(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('SeniorApprover')) return false;
  // Approver cannot be the submitter or compliance reviewer
  if (kycCase.submittedBy === user.id || kycCase.reviewerId === user.id) return false;
  return kycCase.status === 'PendingEDDApproval';
}

export function canCloseCase(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('Compliance') && !user.roles.includes('SeniorApprover')) return false;
  return kycCase.status === 'Approved';
}

export function canCancelCase(user: User, kycCase: KycCase): boolean {
  if (!user.roles.includes('TL') && !user.roles.includes('UnitHead')) return false;
  return (
    kycCase.status === 'Open' ||
    kycCase.status === 'InProgress' ||
    kycCase.status === 'Returned'
  );
}

export function getAllowedTabs(user: User, kycCase: KycCase): { id: string; label: string }[] {
  const isRmJo = user.roles.includes('RM') && !user.roles.includes('TL') && !user.roles.includes('Compliance') && !user.roles.includes('SeniorApprover') && !user.roles.includes('UnitHead');
  const isCompliance = user.roles.includes('Compliance');
  const isSeniorApprover = user.roles.includes('SeniorApprover');

  const baseTabs = [
    { id: 'initiation', label: 'Case Information' },
    { id: 'documents', label: 'Document Checklist' },
    { id: 'ownership', label: 'Entity & Ownership' },
    { id: 'screening', label: 'Screening' },
    { id: 'risk', label: 'Risk Assessment' },
  ];

  if (isRmJo) {
    return baseTabs;
  }

  if (isCompliance) {
    // For Compliance persona, strictly show tabs up to Compliance Review (EDD Approval and Closure hidden)
    return [
      ...baseTabs,
      { id: 'review', label: 'Compliance Review' },
    ];
  }

  if (isSeniorApprover) {
    // For Senior Approver persona, show base tabs, EDD Approval, and Approvals & Audit (Closure)
    return [
      ...baseTabs,
      { id: 'edd', label: 'EDD Approval' },
      { id: 'closure', label: 'Approvals & Audit' },
    ];
  }

  return [
    ...baseTabs,
    { id: 'review', label: 'Compliance Review' },
    ...(kycCase.eddRequired || kycCase.status === 'PendingEDDApproval'
      ? [{ id: 'edd', label: 'EDD Approval' }]
      : []),
    { id: 'closure', label: 'Approvals & Audit' },
  ];
}
