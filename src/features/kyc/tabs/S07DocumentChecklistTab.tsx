import React, { useState } from 'react';
import { Customer, DocumentItem, KycCase } from '../../../types/kyc.types';
import { useKycStore } from '../../../store/KycContext';
import { getDocumentEffectiveStatus } from '../../../domain/documentRules';
import { KycStatusChip } from '../../../components/common/KycStatusChip';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Field } from '../../../components/common/Field';
import {
  FileText,
  Upload,
  Mail,
  History,
  Eye,
  Plus,
  Send,
  Calendar,
  AlertCircle,
  Clock,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface S07DocumentChecklistTabProps {
  kycCase: KycCase;
  customer: Customer;
  isEditable: boolean;
}

export const S07DocumentChecklistTab: React.FC<S07DocumentChecklistTabProps> = ({
  kycCase,
  customer,
  isEditable,
}) => {
  const {
    documents,
    currentDate,
    uploadDocument,
    sendDocRequestEmail,
    activities,
    logActivity,
    currentUser,
    logAuditEvent,
  } = useKycStore();

  const [selectedDocForHistory, setSelectedDocForHistory] = useState<DocumentItem | null>(null);
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<DocumentItem | null>(null);

  // Upload modal state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadIssueDate, setUploadIssueDate] = useState(currentDate);
  const [uploadExpiryDate, setUploadExpiryDate] = useState('30/09/2027');
  const [uploadRemarks, setUploadRemarks] = useState('');

  // Log activity modal
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [actType, setActType] = useState<'Call' | 'Meeting' | 'Email' | 'Task'>('Call');
  const [actNotes, setActNotes] = useState('');
  const [actNextStep, setActNextStep] = useState('');

  const docList = documents[customer.cif] || [];

  const needingAction = docList.filter((d) => {
    const { status } = getDocumentEffectiveStatus(d, currentDate);
    return status === 'Missing' || status === 'Expired';
  });

  const handleOpenUpload = (doc: DocumentItem) => {
    setSelectedDocForUpload(doc);
    setUploadFileName(
      doc.typeKey === 'chamber_of_commerce'
        ? 'chamber_of_commerce_certificate_v3.pdf'
        : `${doc.typeKey}_refresh_2026.pdf`
    );
    setUploadIssueDate(currentDate);
    setUploadExpiryDate(doc.typeKey === 'chamber_of_commerce' ? '30/09/2027' : '31/12/2027');
    setUploadRemarks('Statutory annual renewal uploaded for periodic KYC refresh.');
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForUpload) return;
    uploadDocument(
      customer.cif,
      selectedDocForUpload.typeKey,
      { name: uploadFileName || 'uploaded_document.pdf' },
      uploadIssueDate,
      uploadExpiryDate,
      uploadRemarks
    );
    setSelectedDocForUpload(null);
  };

  const handleOpenHistory = (doc: DocumentItem) => {
    setSelectedDocForHistory(doc);
    logAuditEvent(
      'Document',
      doc.typeKey,
      'View',
      `Viewed complete document version history for ${doc.label}`
    );
  };

  const handleEmailRequest = async () => {
    const items = needingAction.map((d) => d.label.split('(')[0]);
    await sendDocRequestEmail(customer.cif, kycCase.id, items);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    logActivity({
      cif: customer.cif,
      caseId: kycCase.id,
      type: actType,
      by: `${currentUser.name} (${currentUser.roles[0]})`,
      notes: actNotes,
      nextStep: actNextStep,
    });
    setIsLogActivityOpen(false);
    setActNotes('');
    setActNextStep('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header Strip with Caption and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E8EB]">
        <div>
          <h3 className="text-[15px] font-bold text-[#1F2329]">
            Document Checklist · {customer.legalForm}
          </h3>
          <p className="text-[12px] text-[#5B616B] mt-0.5">
            Generated from legal form · {docList.length} items ·{' '}
            {needingAction.length > 0 ? (
              <strong className="text-rose-700">{needingAction.length} need action · Submit is blocked until mandatory items are current</strong>
            ) : (
              <strong className="text-emerald-700">All required documents uploaded & current (0 pending actions)</strong>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailRequest}
            className="flex items-center gap-1.5 font-semibold text-[#1F2329]"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            Request Documents by Email
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenUpload(needingAction[0] || docList[0])}
            className="flex items-center gap-1.5 font-bold"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F8FAFC] border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
            <tr>
              <th className="py-3 px-4">Document Description</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3">Version</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {docList.map((doc) => {
              const { status, chipVariant } = getDocumentEffectiveStatus(doc, currentDate);
              const latestVer = doc.versions.length > 0 ? doc.versions[doc.versions.length - 1] : null;

              return (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1F2329]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {doc.label}
                        {doc.mandatory && <span className="text-rose-600 font-bold ml-1">*</span>}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <KycStatusChip label={status} variant={chipVariant} size="sm" />
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-[#1F2329]">
                    {latestVer?.expiryDate || '—'}
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-700 font-mono">
                    {latestVer ? `v${latestVer.v}` : '—'}
                  </td>

                  <td className="py-3 px-3 text-[#5B616B] text-[11px]">
                    {latestVer?.uploadedAt || 'Not uploaded'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {latestVer && (
                        <button
                          onClick={() => {
                            logAuditEvent(
                              'Document',
                              doc.typeKey,
                              'View',
                              `Viewed active file ${latestVer.fileName}`
                            );
                            alert(`Viewing Document: ${latestVer.fileName}\nUploaded: ${latestVer.uploadedAt}\nRemarks: ${latestVer.remarks || 'None'}`);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="View Active Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenUpload(doc)}
                        className="text-xs font-semibold text-[#1F5BD8] hover:underline"
                      >
                        Upload New
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Section: Client Outreach Log (BRD §7.3 S-07) */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] p-5 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
          <div>
            <h4 className="font-bold text-xs text-[#1F2329]">Client Outreach & Communications</h4>
            <p className="text-[11px] text-[#5B616B]">
              Integrated activity tracking, meeting notes, call reports, and automated Outlook logs
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLogActivityOpen(true)}
            className="flex items-center gap-1.5 font-semibold text-[#1F2329]"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Activity
          </Button>
        </div>

        <div className="divide-y divide-[#F1F3F5] max-h-48 overflow-y-auto">
          {activities.length === 0 ? (
            <p className="text-xs text-[#5B616B] py-3 text-center">No outreach activities logged yet.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-100 text-slate-600 mt-0.5">
                    {act.type === 'Email' ? (
                      <Mail className="w-3.5 h-3.5" />
                    ) : act.type === 'Call' ? (
                      <Phone className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2329]">{act.type} Log</span>
                    <span className="text-[#5B616B] ml-2">by {act.by}</span>
                    <p className="text-[#5B616B] mt-0.5 leading-snug">{act.notes}</p>
                    {act.nextStep && (
                      <span className="text-[10px] font-semibold text-[#1F5BD8] block mt-0.5">
                        Next Step: {act.nextStep}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#5B616B] shrink-0">{act.at}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {selectedDocForUpload && (
        <Modal
          isOpen={Boolean(selectedDocForUpload)}
          onClose={() => setSelectedDocForUpload(null)}
          title={`Upload New Version · ${selectedDocForUpload.label.split('(')[0]}`}
          subtitle="A new version will be created (earlier versions archived as Superseded). Deletes are prohibited under BR-21."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveUpload} className="flex flex-col gap-4 py-2">
            <Field label="File Name" mandatory layout="vertical">
              <input
                type="text"
                required
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Issue Date" layout="vertical">
                <div className="relative">
                  <input
                    type="text"
                    value={uploadIssueDate}
                    onChange={(e) => setUploadIssueDate(e.target.value)}
                    className="w-full h-[34px] pl-3 pr-8 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </Field>

              <Field label="Expiry Date" layout="vertical">
                <div className="relative">
                  <input
                    type="text"
                    value={uploadExpiryDate}
                    onChange={(e) => setUploadExpiryDate(e.target.value)}
                    className="w-full h-[34px] pl-3 pr-8 bg-white border border-[#CFD3D8] rounded-md text-xs font-mono text-[#1F2329] outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </Field>
            </div>

            <Field label="Remarks & Verification Memo" layout="vertical">
              <textarea
                rows={2}
                value={uploadRemarks}
                onChange={(e) => setUploadRemarks(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none"
              />
            </Field>

            <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setSelectedDocForUpload(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Upload & Version
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Document History Drawer / Modal */}
      {selectedDocForHistory && (
        <Modal
          isOpen={Boolean(selectedDocForHistory)}
          onClose={() => setSelectedDocForHistory(null)}
          title={`Version History · ${selectedDocForHistory.label.split('(')[0]}`}
          subtitle="Visible to RM, Team Leader and Compliance roles only · every view and change is logged (BR-20)"
          maxWidth="max-w-xl"
        >
          <div className="flex flex-col gap-3 py-2 text-xs">
            {selectedDocForHistory.versions.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">No versions recorded yet.</p>
            ) : (
              selectedDocForHistory.versions
                .slice()
                .reverse()
                .map((ver) => (
                  <div
                    key={ver.v}
                    className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
                      ver.status === 'Superseded'
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-white border-amber-300 shadow-xs text-[#1F2329]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                          v{ver.v}
                        </span>
                        <span>{ver.fileName}</span>
                      </span>
                      <KycStatusChip
                        label={ver.status}
                        variant={ver.status === 'Valid' ? 'ok' : 'neutral'}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5B616B] mt-1">
                      <span>Uploaded by {ver.uploadedBy}</span>
                      <span className="font-mono">{ver.uploadedAt}</span>
                    </div>
                    {ver.expiryDate && (
                      <span className="text-[11px] font-mono text-[#5B616B]">
                        Expiry Date: {ver.expiryDate}
                      </span>
                    )}
                    {ver.remarks && (
                      <p className="text-[11px] text-slate-700 bg-slate-100/60 p-2 rounded mt-1">
                        {ver.remarks}
                      </p>
                    )}
                  </div>
                ))
            )}
          </div>
        </Modal>
      )}

      {/* Log Activity Modal */}
      <Modal
        isOpen={isLogActivityOpen}
        onClose={() => setIsLogActivityOpen(false)}
        title="Log Client Outreach Activity"
        subtitle="Record meetings, calls, tasks, or manual document requests"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveActivity} className="flex flex-col gap-3.5 py-2">
          <Field label="Activity Type" layout="vertical">
            <select
              value={actType}
              onChange={(e) => setActType(e.target.value as any)}
              className="w-full h-[34px] px-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs font-semibold outline-none"
            >
              <option value="Call">Call Report</option>
              <option value="Meeting">Client Meeting</option>
              <option value="Email">Email Communication</option>
              <option value="Task">Internal Follow-up Task</option>
            </select>
          </Field>

          <Field label="Notes & Discussion Points" mandatory layout="vertical">
            <textarea
              required
              rows={3}
              placeholder="Summary of discussion with authorized signatories..."
              value={actNotes}
              onChange={(e) => setActNotes(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none"
            />
          </Field>

          <Field label="Next Step" layout="vertical">
            <input
              type="text"
              placeholder="e.g. Client to submit notarized board declaration by Friday"
              value={actNextStep}
              onChange={(e) => setActNextStep(e.target.value)}
              className="w-full h-[34px] px-3 bg-white border border-[#CFD3D8] rounded-md text-xs text-[#1F2329] outline-none"
            />
          </Field>

          <div className="pt-4 border-t border-[#E6E8EB] flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsLogActivityOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Activity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
