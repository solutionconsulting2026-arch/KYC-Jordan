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
  return true;
}

export function canApproveEdd(user: User, kycCase: KycCase): boolean {
  return true;
}

export function canCloseCase(user: User, kycCase: KycCase): boolean {
  return kycCase.status === 'Approved' || kycCase.status === 'PendingEDDApproval' || kycCase.status === 'UnderComplianceReview' || kycCase.status === 'Open';
}

export function canCancelCase(user: User, kycCase: KycCase): boolean {
  return (
    kycCase.status === 'Open' ||
    kycCase.status === 'InProgress' ||
    kycCase.status === 'Returned'
  );
}

export function getAllowedTabs(user: User, kycCase: KycCase): { id: string; label: string }[] {
  return [
    { id: 'initiation', label: 'Case Information' },
    { id: 'documents', label: 'Document Checklist' },
    { id: 'ownership', label: 'Entity & Ownership' },
    { id: 'screening', label: 'Screening' },
    { id: 'risk', label: 'Risk Assessment' },
    { id: 'review', label: 'Compliance Review' },
    { id: 'edd', label: 'EDD Approval' },
    { id: 'closure', label: 'Approvals & Audit' },
  ];
}
