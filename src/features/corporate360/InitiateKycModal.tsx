import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Field } from '../../components/common/Field';
import { Customer } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { addDays } from '../../domain/dateUtils';
import { KYC_CONFIG } from '../../config/kycConfig';
import { AlertCircle, Calendar, ArrowRight } from 'lucide-react';

interface InitiateKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  defaultType?: 'Periodic' | 'Event';
  isGroupMode?: boolean;
}

export const InitiateKycModal: React.FC<InitiateKycModalProps> = ({
  isOpen,
  onClose,
  customer,
  defaultType = 'Periodic',
  isGroupMode = false,
}) => {
  const { profiles, currentDate, cases, createCase, createGroupCases, currentUser, customers } = useKycStore();
  const { navigate } = useRouter();

  const [reviewType, setReviewType] = useState<'Periodic' | 'Event'>(defaultType);
  const [triggerReason, setTriggerReason] = useState('Material change in account management');
  const [triggerDetails, setTriggerDetails] = useState('');
  const [selectedGroupCifs, setSelectedGroupCifs] = useState<string[]>(['00001722', '00001731']);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setReviewType(defaultType);
  }, [defaultType, isOpen]);

  const profile = profiles[customer.cif];
  const activeCase = profile?.openCaseId ? cases[profile.openCaseId] : undefined;
  const isAlreadyOpen = activeCase && activeCase.status !== 'Closed' && activeCase.status !== 'Cancelled';

  const defaultDueDate =
    reviewType === 'Periodic'
      ? profile?.nextReviewDate || addDays(currentDate, 25)
      : addDays(currentDate, KYC_CONFIG.eventSlaDays);

  const [dueDate, setDueDate] = useState(defaultDueDate);

  useEffect(() => {
    setDueDate(defaultDueDate);
  }, [reviewType, currentDate, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (isGroupMode) {
      if (selectedGroupCifs.length === 0) {
        setFormError('Please select at least one subsidiary entity for the group review.');
        return;
      }
      createGroupCases(selectedGroupCifs);
      onClose();
      return;
    }

    if (isAlreadyOpen) {
      setFormError(`A review case is already open: ${activeCase?.caseNo}`);
      return;
    }

    if (reviewType === 'Event') {
      if (!triggerReason) {
        setFormError('Trigger reason is required for event-driven reviews.');
        return;
      }
      if (triggerDetails.trim().length < 20) {
        setFormError('Trigger details must be at least 20 characters in length.');
        return;
      }
    }

    const newCase = createCase(
      customer.cif,
      reviewType,
      reviewType === 'Event' ? triggerReason : undefined,
      reviewType === 'Event' ? triggerDetails : undefined,
      dueDate
    );

    onClose();
    navigate(`#/kyc/${newCase.id}/initiation`);
  };

  const eventReasons = [
    'Material change in account management',
    'Doubt about data held',
    'Significant or unusual transactions',
    'Significant change in documents',
    'Insufficient information',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGroupMode ? 'Start Group KYC Review' : 'Initiate KYC Review'}
      subtitle={
        isGroupMode
          ? 'Consolidated multi-entity periodic review launch for Alpha Logistics Group'
          : `Launch formal KYC review workflow for ${customer.accountName} (CIF ${customer.cif})`
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        {/* Guard Banner if case already open */}
        {isAlreadyOpen && !isGroupMode && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>A review is already open: <strong>{activeCase?.caseNo}</strong> ({activeCase?.status})</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`#/kyc/${activeCase?.id}/initiation`);
              }}
              className="text-xs font-bold text-[#1F5BD8] hover:underline flex items-center gap-1"
            >
              Open Case <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {formError && (
          <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-800">
            {formError}
          </div>
        )}

        {/* Entity Selector (Single vs Group) */}
        {!isGroupMode ? (
          <Field label="Entity" layout="horizontal">
            <input
              type="text"
              readOnly
              value={`${customer.accountName} (${customer.cif})`}
              className="w-full h-[34px] px-3 bg-slate-100 text-slate-700 border border-[#CFD3D8] rounded-md text-xs font-semibold outline-none"
            />
          </Field>
        ) : (
          <Field label="Entities for Review" layout="vertical">
            <div className="flex flex-col gap-2 p-2 border border-[#CFD3D8] rounded-md bg-slate-50 text-xs">
              {['00001722', '00001731', '00001740'].map((cif) => {
                const ent = customers[cif];
                return (
                  <label key={cif} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGroupCifs.includes(cif)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGroupCifs([...selectedGroupCifs, cif]);
                        } else {
                          setSelectedGroupCifs(selectedGroupCifs.filter((c) => c !== cif));
                        }
                      }}
                      className="rounded text-amber-500"
                    />
                    <span className="font-medium text-[#1F2329]">
                      {ent.accountName} ({ent.countryOfBooking}) — CIF {cif}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>
        )}

        {/* Review Type (Radio) */}
        {!isGroupMode && (
          <Field label="Review Type" layout="horizontal">
            <div className="flex items-center gap-6 text-xs h-[34px]">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1F2329]">
                <input
                  type="radio"
                  name="reviewType"
                  value="Periodic"
                  checked={reviewType === 'Periodic'}
                  onChange={() => setReviewType('Periodic')}
                  className="text-amber-500"
                />
                Periodic Review
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1F2329]">
                <input
                  type="radio"
                  name="reviewType"
                  value="Event"
                  checked={reviewType === 'Event'}
                  onChange={() => setReviewType('Event')}
                  className="text-amber-500"
                />
                Event-driven Review
              </label>
            </div>
          </Field>
        )}

        {/* Event-driven Trigger Reason (BR-02 Dropdown) */}
        {reviewType === 'Event' && !isGroupMode && (
          <>
            <Field label="Trigger Reason" mandatory layout="horizontal">
              <select
                value={triggerReason}
                onChange={(e) => setTriggerReason(e.target.value)}
                className="w-full h-[34px] px-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none focus:border-amber-400 font-medium"
              >
                {eventReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Trigger Details" mandatory layout="horizontal">
              <textarea
                rows={3}
                placeholder="Provide detailed justification for the event-driven review (min 20 characters)..."
                value={triggerDetails}
                onChange={(e) => setTriggerDetails(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none focus:border-amber-400 font-sans"
              />
            </Field>
          </>
        )}

        {/* Due Date */}
        <Field label="Due Date" mandatory layout="horizontal">
          <div className="relative">
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-[34px] pl-3 pr-8 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </Field>

        {/* Assigned Owner */}
        <Field label="Assign To" layout="horizontal">
          <input
            type="text"
            readOnly
            value={`${currentUser.name} (${currentUser.roles[0]})`}
            className="w-full h-[34px] px-3 bg-slate-100 text-slate-700 border border-[#CFD3D8] rounded-md text-xs font-medium outline-none"
          />
        </Field>

        {/* Actions */}
        <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={Boolean(isAlreadyOpen && !isGroupMode)}>
            {isGroupMode ? 'Create Group Cases' : 'Create Case'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
