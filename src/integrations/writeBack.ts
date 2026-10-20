import { formatDateTime } from '../domain/dateUtils';
import { WriteBackState } from '../types/kyc.types';

export async function executeWriteBackMock(
  caseId: string,
  simulateFailure: boolean,
  onUpdate: (state: WriteBackState) => void
): Promise<WriteBackState> {
  // Step 1: Pending
  onUpdate({ status: 'Pending', at: formatDateTime(new Date()) });
  await new Promise((r) => setTimeout(r, 800));

  if (simulateFailure) {
    const failedState: WriteBackState = {
      status: 'Failed',
      at: formatDateTime(new Date()),
    };
    onUpdate(failedState);
    return failedState;
  }

  // Step 2: Sent
  onUpdate({ status: 'Sent', at: formatDateTime(new Date()) });
  await new Promise((r) => setTimeout(r, 1200));

  // Step 3: Acknowledged
  const ackState: WriteBackState = {
    status: 'Acknowledged',
    at: formatDateTime(new Date()),
  };
  onUpdate(ackState);
  return ackState;
}
