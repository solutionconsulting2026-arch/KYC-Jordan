import React, { useState } from 'react';
import { Customer, KycCase } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { Field } from '../../../components/common/Field';
import { FetchSection } from '../../../components/common/FetchSection';
import { calculateSlaInfo } from '../../../domain/slaEngine';
import { Calendar, Clock, Database, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface S06InitiationTabProps {
  kycCase: KycCase;
  customer: Customer;
  isEditable: boolean;
  onUpdateCase: (updates: Partial<KycCase>) => void;
}

export const S06InitiationTab: React.FC<S06InitiationTabProps> = ({
  kycCase,
  customer,
  isEditable,
  onUpdateCase,
}) => {
  const { currentDate, profiles, currentUser } = useKycStore();
  const [subTab, setSubTab] = useState<'customer' | 'review' | 'as400' | 'activity'>('customer');
  const [snapshotStatus, setSnapshotStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [activityStatus, setActivityStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');

  const profile = profiles[customer.cif];
  const slaInfo = calculateSlaInfo(kycCase, currentDate);

  const canEditDueDate = currentUser.roles.includes('TL');

  const handleFetchSnapshot = () => {
    setSnapshotStatus('loading');
    setTimeout(() => setSnapshotStatus('loaded'), 700);
  };

  const handleFetchActivity = () => {
    setActivityStatus('loading');
    setTimeout(() => setActivityStatus('loaded'), 700);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-tab Pills (Yellow Active per Section 4.4) */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EB] pb-3">
        {[
          { id: 'customer', label: 'Customer Details' },
          { id: 'review', label: 'Review Details' },
          { id: 'as400', label: 'KYC Snapshot (AS400)' },
          { id: 'activity', label: 'Activity Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`h-7 px-3.5 rounded-full text-xs font-semibold transition-all ${
              subTab === tab.id
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: Customer Details */}
      {subTab === 'customer' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-end pb-2">
            <span className="text-xs text-[#5B616B]">Legal Entity Master Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <Field label="Customer (Entity) Name" mandatory>
              <input
                type="text"
                readOnly
                value={customer.accountName}
                className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-bold outline-none"
              />
            </Field>

            <Field label="CIF No." mandatory>
              <input
                type="text"
                readOnly
                value={customer.cif}
                className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-mono font-bold outline-none"
              />
            </Field>

            <Field label="Group / Parent Account">
              <input
                type="text"
                readOnly
                value={customer.parentCif ? 'Apollo Tyres Global (CIF 00001700)' : 'Ultimate Holding'}
                className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-medium outline-none"
              />
            </Field>

            <Field label="Legal Form" mandatory>
              <select
                disabled={!isEditable}
                value={customer.legalForm}
                className="w-full h-[34px] px-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none font-medium"
              >
                <option value="PrivateShareholding">Private Shareholding Company</option>
                <option value="PublicShareholding">Public Shareholding Company</option>
                <option value="LLC">LLC</option>
                <option value="GeneralPartnership">General Partnership</option>
                <option value="Foreign">Foreign Branch / Entity</option>
              </select>
            </Field>

            <Field label="Country of Booking" mandatory>
              <input
                type="text"
                readOnly
                value={customer.countryOfBooking === 'JO' ? 'Jordan (JO)' : customer.countryOfBooking}
                className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-medium outline-none"
              />
            </Field>

            <Field label="Commercial Registration" mandatory>
              <input
                type="text"
                readOnly={!isEditable}
                value={customer.registrationNo}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
              />
            </Field>

            <Field label="Tax Number" mandatory>
              <input
                type="text"
                readOnly={!isEditable}
                value={customer.taxNo}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
              />
            </Field>

            <Field label="Business Activity / Industry" mandatory>
              <input
                type="text"
                readOnly={!isEditable}
                value={customer.industry}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none font-medium"
              />
            </Field>

            <Field label="Relationship Manager" mandatory>
              <input
                type="text"
                readOnly
                value="Rania Saleh (RM, Amman CIB)"
                className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-medium outline-none"
              />
            </Field>

            <Field label="Client Email">
              <input
                type="email"
                readOnly={!isEditable}
                value={customer.email}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none"
              />
            </Field>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Review Details */}
      {subTab === 'review' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
          <Field label="Review Type">
            <span className="font-bold text-xs text-[#1F2329] bg-slate-100 px-3 py-1 rounded border border-slate-200 inline-block">
              {kycCase.type} Review
            </span>
          </Field>

          <Field label="Priority">
            <span
              className={`font-bold text-xs px-2.5 py-0.5 rounded border inline-block ${
                kycCase.priority === 'High'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {kycCase.priority}
            </span>
          </Field>

          {kycCase.type === 'Event' && (
            <>
              <Field label="Trigger Reason">
                <input
                  type="text"
                  readOnly
                  value={kycCase.triggerReason || 'Material corporate update'}
                  className="w-full h-[34px] px-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-bold outline-none"
                />
              </Field>

              <Field label="Trigger Details">
                <textarea
                  readOnly
                  rows={2}
                  value={kycCase.triggerDetails || 'N/A'}
                  className="w-full p-2 bg-slate-50 text-slate-700 border border-[#CFD3D8] rounded-md text-xs outline-none"
                />
              </Field>
            </>
          )}

          <Field label="Current Risk Rating">
            <span className="font-bold text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded inline-block">
              {profile?.riskRating || 'Medium'}
            </span>
          </Field>

          <Field label="Last Review Date">
            <span className="font-mono text-xs text-[#1F2329]">
              {profile?.lastReviewDate || '19/11/2024'}
            </span>
          </Field>

          <Field label="Review Due Date">
            <div className="relative">
              <input
                type="text"
                readOnly={!canEditDueDate}
                value={kycCase.dueDate}
                onChange={(e) => onUpdateCase({ dueDate: e.target.value })}
                className={`w-full h-[34px] pl-3 pr-8 rounded-md text-xs font-mono font-bold border ${
                  canEditDueDate ? 'bg-white border-amber-400' : 'bg-slate-100 border-[#CFD3D8]'
                }`}
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </Field>

          <Field label="SLA Remaining">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-slate-900 text-amber-300 px-3 py-1 rounded">
                {slaInfo.slaDisplay}
              </span>
              {slaInfo.isOverdue && (
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {slaInfo.overdueDays}d Overdue
                </span>
              )}
            </div>
          </Field>

          <Field label="Assigned Case Owner">
            <input
              type="text"
              readOnly
              value="Rania Saleh (Corporate RM)"
              className="w-full h-[34px] px-3 bg-slate-100 text-slate-800 border border-[#CFD3D8] rounded-md text-xs font-medium"
            />
          </Field>

          <Field label="Escalation Path">
            <span className="text-xs text-[#5B616B] leading-tight block">
              Team Leader at due date → Unit Head after 7 days overdue
            </span>
          </Field>

          <Field label="Created Timestamp">
            <span className="text-xs text-[#5B616B] font-mono">
              {kycCase.createdAt} by {kycCase.createdBy}
            </span>
          </Field>
        </div>
      )}

      {/* Sub-Tab 3: KYC Snapshot (AS400) */}
      {subTab === 'as400' && (
        <FetchSection
          status={snapshotStatus}
          onFetch={handleFetchSnapshot}
          fetchLabel="Fetch KYC Snapshot"
          refetchLabel="Re-fetch"
          loadingLabel="Fetching KYC Snapshot from AS400..."
          emptyPrompt="Click below to fetch the latest KYC Snapshot from the core banking system."
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
              <h4 className="font-bold text-xs text-[#1F2329]">
                Baseline AS400 Core Banking Snapshot
              </h4>
              <span className="text-xs font-mono text-[#5B616B]">
                Ref: AS400-CIF-00001715-REV24
              </span>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
                  <th className="pb-2">Field Description</th>
                  <th className="pb-2">AS400 System Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                <tr>
                  <td className="py-2.5 font-medium">Legal Form</td>
                  <td className="py-2.5">Private Shareholding Company</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Commercial Registration</td>
                  <td className="py-2.5 font-mono">{customer.registrationNo}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Authorized Signatories Count</td>
                  <td className="py-2.5">3 Joint Signatories</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Beneficial Owners Count</td>
                  <td className="py-2.5">3 Beneficial Owners</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">PEP Linkage Identification</td>
                  <td className="py-2.5">No PEP Registered</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Risk Grade</td>
                  <td className="py-2.5">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FetchSection>
      )}

      {/* Sub-Tab 4: Activity Profile & RM Attestation */}
      {subTab === 'activity' && (
        <FetchSection
          status={activityStatus}
          onFetch={handleFetchActivity}
          fetchLabel="Fetch Activity Profile"
          refetchLabel="Re-fetch"
          loadingLabel="Fetching Activity Profile..."
          emptyPrompt="Click below to load the customer's transaction and relationship activity profile."
        >
          <div className="flex flex-col gap-5">
            {/* 4 Read-only Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-medium text-[#5B616B] block">Credit Turnover (L12M)</span>
                <span className="text-[16px] font-bold text-[#1F2329] mt-1 block">JOD 18.4M</span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Consistent with fleet capacity</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-medium text-[#5B616B] block">Debit Turnover (L12M)</span>
                <span className="text-[16px] font-bold text-[#1F2329] mt-1 block">JOD 17.9M</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Operational outflows</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-medium text-[#5B616B] block">Average Monthly Balance</span>
                <span className="text-[16px] font-bold text-[#1F2329] mt-1 block">JOD 2.1M</span>
                <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">Excess liquidity detected</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-medium text-[#5B616B] block">Trade Transactions</span>
                <span className="text-[16px] font-bold text-[#1F2329] mt-1 block">48 Transactions</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Import LCs & Shipping Guarantees</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-2">
              <span className="font-bold text-[#1F2329]">Declared Relationship Purpose & Profile</span>
              <p className="text-[#5B616B] leading-relaxed">
                Operating current accounts and trade facilities for commercial sea and land freight operations across Jordan, the GCC, Egypt, and the UK. Expected monthly turnover between JOD 1.2M and 1.8M.
              </p>
            </div>

            {/* RM Attestation per BR-11 */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  RM Statutory Attestation: Activity vs Declared Profile (BR-11)
                </span>
                <span className="text-[11px] font-semibold text-rose-700">* Mandatory</span>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1F2329]">
                  <input
                    type="radio"
                    name="activityAttested"
                    checked={kycCase.activity.attested === true}
                    onChange={() =>
                      onUpdateCase({
                        activity: { ...kycCase.activity, attested: true, explanation: '' },
                      })
                    }
                    className="text-amber-500"
                  />
                  Activity is consistent with the declared profile (Yes)
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1F2329]">
                  <input
                    type="radio"
                    name="activityAttested"
                    checked={kycCase.activity.attested === false}
                    onChange={() =>
                      onUpdateCase({
                        activity: { ...kycCase.activity, attested: false },
                      })
                    }
                    className="text-amber-500"
                  />
                  Inconsistency noted (No)
                </label>
              </div>

              {kycCase.activity.attested === false && (
                <div className="flex flex-col gap-1.5 mt-1 animate-in fade-in">
                  <label className="text-xs font-semibold text-rose-900">
                    Explanation Required (Min 20 characters):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detail transaction variances against declared throughput..."
                    value={kycCase.activity.explanation || ''}
                    onChange={(e) =>
                      onUpdateCase({
                        activity: { ...kycCase.activity, explanation: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-md text-xs text-[#1F2329] outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </FetchSection>
      )}
    </div>
  );
};
