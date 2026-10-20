import { KycProfile } from '../../types/kyc.types';

export const SEED_PROFILES: Record<string, KycProfile> = {
  '00001715': {
    cif: '00001715',
    riskRating: 'Medium',
    lastReviewDate: '19/11/2024',
    nextReviewDate: '19/11/2026',
    lastSyncedAt: '25/10/2026 08:30 AM',
    openCaseId: undefined,
    history: [],
  },
  '00001700': {
    cif: '00001700',
    riskRating: 'Medium',
    lastReviewDate: '11/01/2025',
    nextReviewDate: '11/01/2027',
    lastSyncedAt: '25/10/2026 08:30 AM',
    openCaseId: undefined,
    history: [],
  },
  '00001722': {
    cif: '00001722',
    riskRating: 'Medium',
    lastReviewDate: '20/10/2024',
    nextReviewDate: '20/10/2026',
    lastSyncedAt: '25/10/2026 08:30 AM',
    openCaseId: 'KYC-2026-0141',
    history: [],
  },
  '00001731': {
    cif: '00001731',
    riskRating: 'High',
    lastReviewDate: '14/03/2026',
    nextReviewDate: '14/03/2027',
    lastSyncedAt: '25/10/2026 08:30 AM',
    openCaseId: undefined,
    history: ['KYC-2026-0120'],
  },
  '00001740': {
    cif: '00001740',
    riskRating: 'Low',
    lastReviewDate: '30/06/2025',
    nextReviewDate: '30/06/2027',
    lastSyncedAt: '25/10/2026 08:30 AM',
    openCaseId: undefined,
    history: [],
  },
};
