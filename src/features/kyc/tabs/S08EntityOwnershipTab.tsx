import React, { useState } from 'react';
import { Customer, DocumentItem, KycCase, Party } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { diffDays } from '../../../domain/dateUtils';
import { KycStatusChip } from '../../../components/common/KycStatusChip';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Field } from '../../../components/common/Field';
import { FetchSection } from '../../../components/common/FetchSection';
import { getDocumentEffectiveStatus } from '../../../domain/documentRules';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

interface S08EntityOwnershipTabProps {
  kycCase: KycCase;
  customer: Customer;
  isEditable: boolean;
}

export const S08EntityOwnershipTab: React.FC<S08EntityOwnershipTabProps> = ({
  kycCase,
  customer,
  isEditable,
}) => {
  const {
    parties,
    currentDate,
    documents,
    screening,
    verifyPartyId,
    rescreenParty,
    uploadDocument,
  } = useKycStore();

  const [subTab, setSubTab] = useState<'bo' | 'shareholders' | 'signatories'>('bo');
  const [selectedBoDrawer, setSelectedBoDrawer] = useState<Party | null>(null);
  const [isBoUploadOpen, setIsBoUploadOpen] = useState(false);

  const [boStatus, setBoStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [shStatus, setShStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [sigStatus, setSigStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');

  const handleFetchBo = () => {
    setBoStatus('loading');
    setTimeout(() => setBoStatus('loaded'), 700);
  };

  const handleFetchSh = () => {
    setShStatus('loading');
    setTimeout(() => setShStatus('loaded'), 700);
  };

  const handleFetchSig = () => {
    setSigStatus('loading');
    setTimeout(() => setSigStatus('loaded'), 700);
  };

  const partyList = parties[customer.cif] || [];
  const shareholders = partyList.filter((p) => p.kind === 'Shareholder');
  const beneficialOwners = partyList.filter((p) => p.kind === 'BO');
  const signatories = partyList.filter((p) => p.kind === 'Signatory');

  const custDocs = documents[customer.cif] || [];
  const boDeclDoc = custDocs.find((d) => d.typeKey === 'bo_declaration');
  const boDeclStatus = boDeclDoc ? getDocumentEffectiveStatus(boDeclDoc, currentDate).status : 'Missing';
  const isBoDeclMissing = boDeclStatus === 'Missing' || boDeclStatus === 'Expired';

  const pepBo = beneficialOwners.find((b) => b.pep);

  // Shareholders sum
  const totalShareholding = shareholders.reduce((acc, s) => acc + (s.holdingPct || 0), 0);
  const isShareholding100 = Math.abs(totalShareholding - 100) <= 0.5;

  const handleVerifyBo = (partyId: string) => {
    verifyPartyId(customer.cif, partyId);
    if (selectedBoDrawer && selectedBoDrawer.id === partyId) {
      setSelectedBoDrawer({ ...selectedBoDrawer, idVerified: true });
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
      {/* Sub-tab Pills (Yellow Active per Section 4.4) */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EB] pb-3">
        {[
          { id: 'bo', label: 'Beneficial Owners' },
          { id: 'shareholders', label: 'Shareholders' },
          { id: 'signatories', label: 'Signatories' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`h-7 px-3.5 rounded-full text-xs font-bold transition-all ${
              subTab === tab.id
                ? 'bg-[#F5C518] text-[#1F2329] shadow-xs'
                : 'bg-white border border-[#CFD3D8] text-[#5B616B] hover:text-[#1F2329]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mandatory BO Declaration Banner per BRD §7.3 S-08 */}
      {isBoDeclMissing && (
        <div className="bg-[#FFF5F5] border border-rose-300 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-xs text-rose-950">
                BO Declaration Missing or Invalid (BR-08)
              </p>
              <p className="text-[11px] text-rose-800">
                A written declaration signed by authorized corporate signatories is legally mandatory before this review can be submitted.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsBoUploadOpen(true)}
            className="font-bold text-xs"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Upload Declaration
          </Button>
        </div>
      )}

      {/* Sub-Tab 1: Beneficial Owners */}
      {subTab === 'bo' && (
        <FetchSection
          status={boStatus}
          onFetch={handleFetchBo}
          fetchLabel="Fetch Beneficial Owners"
          refetchLabel="Re-fetch"
          loadingLabel="Fetching Beneficial Owners..."
          emptyPrompt="Click below to fetch natural person ultimate beneficial owners (>10% threshold)."
        >
          <div className="flex flex-col gap-6">
            {/* BO Table */}
            <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#E6E8EB] bg-[#F8FAFC] flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F2329]">
                  Natural Person Ultimate Beneficial Owners (UBO Threshold &gt; 10%)
                </span>
                <span className="text-[11px] text-[#5B616B]">CBJ Instructions No. 51/2010</span>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#E6E8EB] text-[#5B616B] font-semibold bg-slate-50/50">
                  <tr>
                    <th className="py-2.5 px-4">Beneficial Owner</th>
                    <th className="py-2.5 px-3">Nationality</th>
                    <th className="py-2.5 px-3">Effective Holding</th>
                    <th className="py-2.5 px-3">Held Via</th>
                    <th className="py-2.5 px-3">ID Verified</th>
                    <th className="py-2.5 px-3">PEP Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {beneficialOwners.map((bo) => {
                    const isIdExpired = bo.idExpiry && diffDays(bo.idExpiry, currentDate) < 0;

                    return (
                      <tr key={bo.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedBoDrawer(bo)}
                            className="font-bold text-[#1F5BD8] hover:underline text-left block"
                          >
                            {bo.name}
                          </button>
                          <span className="text-[10px] text-[#5B616B]">{bo.idType || 'National ID'}: {bo.idNumber || '—'}</span>
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-700">{bo.nationality}</td>

                        <td className="py-3 px-3 font-bold text-[#1F2329] font-mono text-sm">
                          {bo.effectivePct}%
                        </td>

                        <td className="py-3 px-3 text-[#5B616B] text-[11px]">{bo.heldVia}</td>

                        <td className="py-3 px-3">
                          {isIdExpired ? (
                            <KycStatusChip label="ID Expired" variant="bad" size="sm" />
                          ) : bo.idVerified ? (
                            <KycStatusChip label="Verified" variant="ok" size="sm" />
                          ) : (
                            <KycStatusChip label="Not Verified" variant="warn" size="sm" />
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {bo.pep ? (
                            <KycStatusChip label="Yes · PEP Match" variant="warn" size="sm" />
                          ) : (
                            <span className="text-slate-500 font-medium">No</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBoDrawer(bo)}
                            className="text-xs font-semibold text-[#1F5BD8]"
                          >
                            Inspect Drawer
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PEP Linkage Warning Banner per BRD §7.3 S-08 (Displayed below tabular data after Fetch) */}
            {pepBo && (
              <div className="bg-[#FFF9EE] border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-amber-950">
                      PEP Linkage Detected on {pepBo.name} (BR-13)
                    </p>
                    <p className="text-[11px] text-amber-800">
                      {pepBo.pepRelationship}. This review will automatically route to Senior Approver (EDD Approval) after Compliance Review.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-3 py-1 rounded-md border border-amber-300">
                  EDD Approval Required
                </span>
              </div>
            )}

            {/* Horizontal Ownership Chain Diagram per BRD §7.3 S-08 */}
            <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 flex flex-col gap-3 shadow-xs">
              <span className="text-xs font-bold text-[#1F2329] uppercase tracking-wider">
                Legal Entity Ownership Tracing Chain
              </span>

              <div className="flex items-center gap-4 overflow-x-auto py-3">
                {/* Box 1: Omar Haddad */}
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 flex flex-col items-center min-w-[170px] text-center">
                  <span className="text-[11px] font-bold text-[#1F2329]">Omar Haddad</span>
                  <span className="text-[10px] text-[#5B616B]">Natural Person (BO)</span>
                  <span className="text-[13px] font-bold text-[#1F5BD8] font-mono mt-1">42% Direct</span>
                </div>

                <div className="h-0.5 w-6 bg-slate-400 shrink-0" />

                {/* Box 2: Barakat Holding */}
                <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/50 flex flex-col items-center min-w-[190px] text-center">
                  <span className="text-[11px] font-bold text-amber-950">Yousef Barakat (PEP)</span>
                  <span className="text-[10px] text-amber-800">via Barakat Holding Co. (JO)</span>
                  <span className="text-[13px] font-bold text-amber-900 font-mono mt-1">28% Indirect</span>
                </div>

                <div className="h-0.5 w-6 bg-slate-400 shrink-0" />

                {/* Box 3: Gulf Bridge */}
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 flex flex-col items-center min-w-[190px] text-center">
                  <span className="text-[11px] font-bold text-[#1F2329]">Khalid Al-Mazrouei</span>
                  <span className="text-[10px] text-[#5B616B]">via Gulf Bridge Inv. (AE)</span>
                  <span className="text-[13px] font-bold text-slate-800 font-mono mt-1">18% Indirect</span>
                </div>

                <div className="h-0.5 w-6 bg-slate-400 shrink-0" />

                {/* Target Entity Box */}
                <div className="p-3.5 rounded-lg border-2 border-[#1F5BD8] bg-blue-50/70 flex flex-col items-center min-w-[210px] text-center shadow-xs">
                  <Building className="w-4 h-4 text-[#1F5BD8] mb-0.5" />
                  <span className="text-[12px] font-bold text-blue-950">Apollo Tyres Amman</span>
                  <span className="text-[10px] text-blue-800 font-medium">Operating Entity (CIF 00001715)</span>
                  <span className="text-[10px] text-emerald-700 font-bold mt-1">100% Traced to UBOs</span>
                </div>
              </div>
            </div>
          </div>
        </FetchSection>
      )}

      {/* Sub-Tab 2: Shareholders */}
      {subTab === 'shareholders' && (
        <FetchSection
          status={shStatus}
          onFetch={handleFetchSh}
          fetchLabel="Fetch Shareholders"
          refetchLabel="Re-fetch"
          loadingLabel="Fetching Shareholders..."
          emptyPrompt="Click below to load corporate and individual shareholding details."
        >
          <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs flex flex-col">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Shareholder Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Shareholding %</th>
                  <th className="py-2.5 px-3">Identity Verified</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {shareholders.map((sh) => (
                  <tr key={sh.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-[#1F2329]">{sh.name}</td>
                    <td className="py-3 px-3 text-slate-600">{sh.type}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{sh.country}</td>
                    <td className="py-3 px-3 font-bold font-mono text-sm">{sh.holdingPct}%</td>
                    <td className="py-3 px-3">
                      <KycStatusChip label="Verified" variant="ok" size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-slate-400 hover:text-slate-700 mr-2">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-[#E6E8EB] text-xs font-bold">
                <tr>
                  <td colSpan={3} className="py-2.5 px-4 text-right text-[#5B616B]">
                    Total Capital Allocation:
                  </td>
                  <td className="py-2.5 px-3 font-mono text-sm text-[#1F2329]">
                    {totalShareholding}%
                  </td>
                  <td colSpan={2} className="py-2.5 px-3">
                    {isShareholding100 ? (
                      <span className="text-emerald-700 text-xs flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled (100%)
                      </span>
                    ) : (
                      <span className="text-rose-700 text-xs">Sum must equal 100%</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </FetchSection>
      )}

      {/* Sub-Tab 3: Signatories */}
      {subTab === 'signatories' && (
        <FetchSection
          status={sigStatus}
          onFetch={handleFetchSig}
          fetchLabel="Fetch Signatories"
          refetchLabel="Re-fetch"
          loadingLabel="Fetching Signatories..."
          emptyPrompt="Click below to fetch authorized signatories and signing mandates."
        >
          <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Authorized Signatory</th>
                  <th className="py-2.5 px-3">Corporate Role</th>
                  <th className="py-2.5 px-3">Signing Authority</th>
                  <th className="py-2.5 px-3">ID Expiry</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {signatories.map((sig) => {
                  const isIdExpired = sig.idExpiry && diffDays(sig.idExpiry, currentDate) < 0;

                  return (
                    <tr key={sig.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-[#1F2329]">{sig.name}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{sig.role}</td>
                      <td className="py-3 px-3 text-slate-600">{sig.authority} Authority</td>
                      <td className="py-3 px-3 font-mono">{sig.idExpiry || 'N/A'}</td>
                      <td className="py-3 px-3">
                        {isIdExpired ? (
                          <KycStatusChip label="ID Expired" variant="bad" size="sm" />
                        ) : (
                          <KycStatusChip label="Current" variant="ok" size="sm" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isIdExpired && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleVerifyBo(sig.id)}
                            className="text-xs"
                          >
                            Renew ID
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FetchSection>
      )}

      {/* BO Detail Drawer / Modal per BRD §7.3 S-08 */}
      {selectedBoDrawer && (
        <Modal
          isOpen={Boolean(selectedBoDrawer)}
          onClose={() => setSelectedBoDrawer(null)}
          title={`Beneficial Owner Profile · ${selectedBoDrawer.name}`}
          subtitle="Statutory identity verification and source of wealth validation"
          maxWidth="max-w-xl"
        >
          <div className="flex flex-col gap-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Legal Name" layout="vertical">
                <input
                  type="text"
                  readOnly
                  value={selectedBoDrawer.name}
                  className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8] font-bold"
                />
              </Field>

              <Field label="Nationality" layout="vertical">
                <input
                  type="text"
                  readOnly
                  value={selectedBoDrawer.nationality}
                  className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8]"
                />
              </Field>

              <Field label="Identity Document" layout="vertical">
                <input
                  type="text"
                  readOnly
                  value={`${selectedBoDrawer.idType || 'National ID'} (${selectedBoDrawer.idNumber || 'N/A'})`}
                  className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8] font-mono"
                />
              </Field>

              <Field label="ID Expiry Date" layout="vertical">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedBoDrawer.idExpiry || 'N/A'}
                    className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8] font-mono"
                  />
                  {selectedBoDrawer.idExpiry && diffDays(selectedBoDrawer.idExpiry, currentDate) < 0 && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded shrink-0 border border-rose-200">
                      Expired
                    </span>
                  )}
                </div>
              </Field>

              <Field label="Effective Holding" layout="vertical">
                <span className="font-mono font-bold text-base text-[#1F5BD8]">
                  {selectedBoDrawer.effectivePct}%
                </span>
              </Field>

              <Field label="Ownership Path" layout="vertical">
                <span className="font-semibold text-slate-800">{selectedBoDrawer.heldVia}</span>
              </Field>
            </div>

            {selectedBoDrawer.pep && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex flex-col gap-1">
                <span className="font-bold text-amber-950">PEP Linkage Verified</span>
                <p className="text-[#5B616B]">{selectedBoDrawer.pepRelationship}</p>
                <p className="text-[#5B616B] font-medium">Position: {selectedBoDrawer.pepPosition}</p>
              </div>
            )}

            <Field label="Source of Wealth Justification" layout="vertical">
              <textarea
                readOnly
                rows={2}
                value={selectedBoDrawer.sourceOfWealth || 'Documented business profits and commercial distributions.'}
                className="w-full p-2.5 bg-slate-100 rounded border border-[#CFD3D8]"
              />
            </Field>

            <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-between">
              <span className="text-[11px] text-[#5B616B]">
                Fircosoft status: <strong>Clear / Cleared</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => rescreenParty(customer.cif)}>
                  Screen in Fircosoft
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleVerifyBo(selectedBoDrawer.id)}
                  disabled={Boolean(
                    selectedBoDrawer.idVerified &&
                      (!selectedBoDrawer.idExpiry || diffDays(selectedBoDrawer.idExpiry, currentDate) >= 0)
                  )}
                >
                  Verify ID Document
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload BO Declaration Modal */}
      {isBoUploadOpen && (
        <Modal
          isOpen={isBoUploadOpen}
          onClose={() => setIsBoUploadOpen(false)}
          title="Upload Beneficial Owner Written Declaration"
          subtitle="Mandatory written declaration confirming natural person shareholding (BR-08)"
          maxWidth="max-w-md"
        >
          <div className="flex flex-col gap-4 py-2 text-xs">
            <Field label="Document File" layout="vertical">
              <input
                type="text"
                readOnly
                value="signed_beneficial_ownership_declaration_amman.pdf"
                className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8] font-mono"
              />
            </Field>

            <Field label="Issue Date" layout="vertical">
              <input
                type="text"
                readOnly
                value={currentDate}
                className="w-full h-[34px] px-3 bg-slate-100 rounded border border-[#CFD3D8] font-mono"
              />
            </Field>

            <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBoUploadOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  uploadDocument(
                    customer.cif,
                    'bo_declaration',
                    { name: 'signed_beneficial_ownership_declaration_amman.pdf' },
                    currentDate,
                    undefined,
                    'Signed by CEO and Group CFO. Certified by Legal Counsel.'
                  );
                  setIsBoUploadOpen(false);
                }}
              >
                Confirm & Upload
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
