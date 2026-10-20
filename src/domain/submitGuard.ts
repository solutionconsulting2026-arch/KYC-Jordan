import { DocumentItem, KycCase, Party, ScreeningResult } from '../types/kyc.types';
import { getDocumentEffectiveStatus } from './documentRules';
import { diffDays } from './dateUtils';

export interface SubmitCheckItem {
  id: string;
  label: string;
  done: boolean;
  reason?: string;
}

export interface SubmitGuardResult {
  canSubmit: boolean;
  items: SubmitCheckItem[];
  missingReasons: string[];
}

export function evaluateSubmitGuard(
  kycCase: KycCase,
  documents: DocumentItem[],
  parties: Party[],
  screeningResults: ScreeningResult[],
  currentDateStr: string
): SubmitGuardResult {
  // 1. Mandatory documents current
  const mandatoryDocs = documents.filter((d) => d.mandatory);
  const badDocs = mandatoryDocs.filter((d) => {
    const { status } = getDocumentEffectiveStatus(d, currentDateStr);
    return status === 'Missing' || status === 'Expired';
  });
  const docsCurrent = badDocs.length === 0;

  // 2. BO declaration received
  const boDeclDoc = documents.find((d) => d.typeKey === 'bo_declaration');
  const boDeclStatus = boDeclDoc
    ? getDocumentEffectiveStatus(boDeclDoc, currentDateStr).status
    : 'Missing';
  const boDeclReceived = boDeclStatus === 'Valid' || boDeclStatus === 'Expiring';

  // 3. All BO identities verified
  const boParties = parties.filter((p) => p.kind === 'BO');
  const unverifiedBo = boParties.find((bo) => {
    if (!bo.idVerified) return true;
    if (bo.idExpiry) {
      const days = diffDays(bo.idExpiry, currentDateStr);
      if (days < 0) return true; // Expired ID
    }
    return false;
  });
  const boIdentitiesVerified = !unverifiedBo && boParties.length > 0;

  // 4. Screening complete with no uncleared potential match
  const unclearedMatch = screeningResults.find(
    (s) => s.result === 'PotentialMatch' || s.result === 'ConfirmedMatch'
  );
  const screeningClean = !unclearedMatch && screeningResults.length > 0;

  // 5. Activity vs profile attested
  const activityAttested =
    kycCase.activity.attested === true ||
    (kycCase.activity.attested === false &&
      (kycCase.activity.explanation || '').trim().length >= 20);

  // 6. Rating proposed with justification
  const justification = (kycCase.risk.justification || '').trim();
  const ratingDone = Boolean(kycCase.risk.proposed) && justification.length >= 30;

  const items: SubmitCheckItem[] = [
    {
      id: 'docs',
      label: 'Mandatory documents current',
      done: docsCurrent,
      reason: docsCurrent ? undefined : `${badDocs.length} mandatory document(s) need renewal or upload`,
    },
    {
      id: 'bo_decl',
      label: 'BO declaration received',
      done: boDeclReceived,
      reason: boDeclReceived ? undefined : 'BO written declaration document is missing or invalid',
    },
    {
      id: 'bo_id',
      label: 'All BO identities verified',
      done: boIdentitiesVerified,
      reason: boIdentitiesVerified
        ? undefined
        : unverifiedBo
        ? `${unverifiedBo.name} ID is unverified or expired`
        : 'BO records require verification',
    },
    {
      id: 'screening',
      label: 'Screening complete with no uncleared potential match',
      done: screeningClean,
      reason: screeningClean
        ? undefined
        : unclearedMatch
        ? `Pending match review on ${unclearedMatch.partyName}`
        : 'Screening incomplete',
    },
    {
      id: 'activity',
      label: 'Activity vs profile attested',
      done: Boolean(activityAttested),
      reason: activityAttested ? undefined : 'RM attestation on transaction activity required',
    },
    {
      id: 'rating',
      label: 'Rating proposed with justification',
      done: ratingDone,
      reason: ratingDone ? undefined : 'Proposed rating and justification (min 30 chars) required',
    },
  ];

  const missingReasons = items.filter((i) => !i.done).map((i) => i.reason || i.label);
  const canSubmit = items.every((i) => i.done);

  return {
    canSubmit,
    items,
    missingReasons,
  };
}
