import { KYC_CONFIG } from '../config/kycConfig';
import { formatDateTime } from '../domain/dateUtils';

export interface As400Snapshot {
  cif: string;
  legalForm: string;
  registrationNo: string;
  taxNo: string;
  signatoriesCount: number;
  shareholdersCount: number;
  boCount: number;
  riskRating: string;
  lastReviewDate: string;
  syncedAt: string;
}

export async function fetchKycSnapshot(cif: string): Promise<As400Snapshot> {
  await new Promise((resolve) => setTimeout(resolve, KYC_CONFIG.mockLatencyMs.as400Read));

  return {
    cif,
    legalForm: 'PrivateShareholding',
    registrationNo: 'JO-COMM-2015-88491',
    taxNo: '100928374',
    signatoriesCount: 3,
    shareholdersCount: 4,
    boCount: 3,
    riskRating: 'Medium',
    lastReviewDate: '19/11/2024',
    syncedAt: formatDateTime(new Date()),
  };
}
