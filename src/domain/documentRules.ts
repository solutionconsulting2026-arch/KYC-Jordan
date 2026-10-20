import { DocumentItem, DocVersionStatus, LegalForm } from '../types/kyc.types';
import { diffDays } from './dateUtils';

export function isDocumentMandatory(typeKey: string, legalForm: LegalForm): boolean {
  if (typeKey === 'audited_financials') {
    return false;
  }
  if (typeKey === 'tax_certificate' || typeKey === 'chamber_of_commerce') {
    return legalForm !== 'Foreign';
  }
  return true;
}

export function evaluateDocVersionStatus(
  expiryDateStr: string | undefined,
  currentDateStr: string
): DocVersionStatus {
  if (!expiryDateStr) {
    return 'Valid';
  }

  const daysUntilExpiry = diffDays(expiryDateStr, currentDateStr);

  if (daysUntilExpiry < 0) {
    return 'Expired';
  }
  if (daysUntilExpiry <= 30) {
    return 'Expiring';
  }
  return 'Valid';
}

export function getDocumentEffectiveStatus(
  item: DocumentItem,
  currentDateStr: string
): { status: DocVersionStatus | 'Missing' | 'Requested'; chipVariant: 'ok' | 'warn' | 'bad' | 'neutral' } {
  if (item.versions.length === 0) {
    if (item.requestedAt) {
      return { status: 'Requested', chipVariant: 'neutral' };
    }
    return { status: 'Missing', chipVariant: item.mandatory ? 'bad' : 'neutral' };
  }

  const latest = item.versions[item.versions.length - 1];
  const calculatedStatus = evaluateDocVersionStatus(latest.expiryDate, currentDateStr);

  switch (calculatedStatus) {
    case 'Valid':
      return { status: 'Valid', chipVariant: 'ok' };
    case 'Expiring':
      return { status: 'Expiring', chipVariant: 'warn' };
    case 'Expired':
      return { status: 'Expired', chipVariant: 'warn' };
    case 'PendingReview':
      return { status: 'PendingReview', chipVariant: 'neutral' };
    default:
      return { status: calculatedStatus, chipVariant: 'neutral' };
  }
}
