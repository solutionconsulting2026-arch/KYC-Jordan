import { KYC_CONFIG } from '../config/kycConfig';
import { formatDateTime } from '../domain/dateUtils';
import { Party, ScreeningResult, ScreeningStatus } from '../types/kyc.types';

export async function screenPartiesMock(
  parties: Party[],
  entityName: string,
  simulateClearedPep: boolean
): Promise<ScreeningResult[]> {
  await new Promise((resolve) => setTimeout(resolve, KYC_CONFIG.mockLatencyMs.fircosoft));
  const now = formatDateTime(new Date());

  const results: ScreeningResult[] = [
    {
      partyId: 'ENTITY',
      partyName: entityName,
      role: 'Corporate Entity',
      result: 'Clear',
      screenedAt: now,
      alertRef: 'FIRCO-ENT-99182',
    },
  ];

  parties.forEach((p) => {
    let result: ScreeningStatus = 'Clear';
    let alertRef: string | undefined = `FIRCO-${p.id}-001`;

    if (p.id === 'P2') {
      if (simulateClearedPep) {
        result = 'ClearedPEPConfirmed';
        alertRef = 'FIRCO-PEP-44819 (Cleared: PEP confirmed)';
      } else {
        result = 'PotentialMatch';
        alertRef = 'FIRCO-PEP-44819';
      }
    }

    results.push({
      partyId: p.id,
      partyName: p.name,
      role: `${p.kind}${p.role ? ` (${p.role})` : ''}`,
      result,
      screenedAt: now,
      alertRef,
    });
  });

  return results;
}
