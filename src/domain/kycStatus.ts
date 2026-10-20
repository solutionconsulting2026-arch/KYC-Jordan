import { KycDerivedStatus, KycProfile } from '../types/kyc.types';
import { KYC_CONFIG } from '../config/kycConfig';
import { diffDays } from './dateUtils';

export function deriveKycStatus(
  profile: KycProfile | undefined,
  currentDateStr: string,
  hasOpenCaseOverride?: boolean
): KycDerivedStatus {
  if (!profile) {
    return { status: 'Current', label: 'Current', variant: 'ok' };
  }

  // If there is an open case active, status is In review
  if (hasOpenCaseOverride || profile.openCaseId) {
    return { status: 'InReview', label: 'In review', variant: 'neutral' };
  }

  const daysToReview = diffDays(profile.nextReviewDate, currentDateStr);

  if (daysToReview < 0) {
    const overdueDays = Math.abs(daysToReview);
    return {
      status: 'Overdue',
      label: `Overdue ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
      days: overdueDays,
      variant: 'bad',
    };
  }

  if (daysToReview <= KYC_CONFIG.leadWindowDays) {
    return {
      status: 'Due',
      label: `Due in ${daysToReview} day${daysToReview === 1 ? '' : 's'}`,
      days: daysToReview,
      variant: 'warn',
    };
  }

  return { status: 'Current', label: 'Current', variant: 'ok' };
}
