import { KYC_CONFIG } from '../config/kycConfig';
import { formatDateTime } from '../domain/dateUtils';
import { ActivityItem } from '../types/kyc.types';

export async function sendDocumentRequestMock(
  cif: string,
  caseId: string | undefined,
  docLabels: string[],
  toEmail: string,
  senderName: string
): Promise<ActivityItem> {
  await new Promise((resolve) => setTimeout(resolve, KYC_CONFIG.mockLatencyMs.outlook));

  return {
    id: `ACT-${Date.now()}`,
    cif,
    caseId,
    type: 'Email',
    at: formatDateTime(new Date()),
    by: senderName,
    notes: `Document request (${docLabels.length} items) dispatched to ${toEmail}: ${docLabels.join(', ')}`,
    nextStep: 'Awaiting client document uploads via secure corporate portal',
  };
}
