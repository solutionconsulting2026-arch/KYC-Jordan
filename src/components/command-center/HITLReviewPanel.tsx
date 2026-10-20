import React, { useState } from 'react';
import { DemoScenario } from '../../data/scenarios';
import { PNBButton } from '../common/PNBButton';
import { ShieldAlert, CheckCircle2, XCircle, HelpCircle, FileText, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface HITLReviewPanelProps {
  scenario: DemoScenario;
  onApproveOverride: () => void;
  onRejectApplication: () => void;
  onRequestMoreInfo: () => void;
  onClose?: () => void;
}

export const HITLReviewPanel: React.FC<HITLReviewPanelProps> = ({
  scenario,
  onApproveOverride,
  onRejectApplication,
  onRequestMoreInfo,
  onClose,
}) => {
  const [officerNotes, setOfficerNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (type: 'APPROVE' | 'REJECT' | 'RFI') => {
    if (type === 'APPROVE') {
      setActionSuccess('Application manual override APPROVED. Routing to Finacle CBS...');
      setTimeout(() => {
        onApproveOverride();
      }, 1000);
    } else if (type === 'REJECT') {
      setActionSuccess('Application REJECTED. Drafting Suspicious Transaction Report (STR)...');
      setTimeout(() => {
        onRejectApplication();
      }, 1000);
    } else {
      setActionSuccess('Request for Information dispatched to customer mobile/email.');
      setTimeout(() => {
        onRequestMoreInfo();
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-xl overflow-hidden p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-100 bg-rose-50/50 -mx-6 -mt-6 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                HUMAN-IN-THE-LOOP (HITL) COMPLIANCE DESK
              </span>
              <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold">
                HIGH RISK ESCALATION
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Case ID: PNB-ONB-2026-001278
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Assigned Role</span>
          <span className="text-xs font-bold text-slate-800">
            Principal Compliance Officer (Retail Banking)
          </span>
        </div>
      </div>

      {/* Escalation Reason */}
      <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-900">
              Reason for Escalation: Potential Sanctions / Watchlist Fuzzy Match
            </span>
            <p className="text-rose-800 mt-0.5 leading-relaxed">
              "Decision exceeds autonomous processing authority. PMLA / RBI AML Master Circular requires verified officer determination before CIF creation."
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Dossier */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Applicant Identity Profile */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            1. Applicant Identity Evidence
          </span>
          <div className="flex justify-between">
            <span className="text-slate-500">Applicant Name:</span>
            <span className="font-bold text-slate-800">{scenario.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">DOB & Age:</span>
            <span className="font-semibold text-slate-800">{scenario.customer.dob} (Age 32)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">PAN & Aadhaar:</span>
            <span className="font-mono font-bold text-slate-800">{scenario.customer.pan} / {scenario.customer.aadhaarMasked}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Occupation & Income:</span>
            <span className="font-medium text-slate-800">{scenario.customer.occupation} (₹1.2L/mo)</span>
          </div>
        </div>

        {/* Watchlist Screening Match Result */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            2. Screening Collision Data
          </span>
          <div className="flex justify-between">
            <span className="text-slate-500">Flagged Entity:</span>
            <span className="font-bold text-rose-700">"Rahul R. Mehta"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fuzzy Similarity Score:</span>
            <span className="font-bold text-rose-700">84% Match (Threshold &gt; 70%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Registry Source:</span>
            <span className="font-medium text-slate-800">MHA / SEBI Debarred Entities</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">CIBIL Bureau Standing:</span>
            <span className="font-bold text-emerald-700">784 (Prime Customer)</span>
          </div>
        </div>
      </div>

      {/* Underwriter Officer Notes */}
      <div className="mt-5">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Compliance Officer Determination Notes & Override Rationale
        </label>
        <textarea
          rows={2}
          value={officerNotes}
          onChange={(e) => setOfficerNotes(e.target.value)}
          placeholder="e.g. Verified applicant PAN ABCDE1234F vs watchlist entity DOB (1971 vs 1994). Confirmed false positive name collision..."
          className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#A21D22]"
        />
      </div>

      {actionSuccess && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-pulse">
          {actionSuccess}
        </div>
      )}

      {/* 3 Executive Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Responsible AI: All human overrides are cryptographically logged in the audit ledger.
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('REJECT')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Reject Application
          </button>

          <button
            onClick={() => handleAction('RFI')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            Request More Info
          </button>

          <button
            onClick={() => handleAction('APPROVE')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Proceed to Finacle
          </button>
        </div>
      </div>
    </div>
  );
};
