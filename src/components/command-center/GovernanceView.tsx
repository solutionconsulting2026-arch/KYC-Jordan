import React from 'react';
import { EXECUTIVE_METRICS } from '../../data/metrics';
import { ShieldCheck, CheckCircle2, Lock, FileText, AlertCircle, Scale, Users, Key } from 'lucide-react';

export const GovernanceView: React.FC = () => {
  const governancePoints = [
    { title: 'Role-Based Access Control', desc: 'Agent operations restricted to authenticated banking microservices.' },
    { title: 'Affirmative Consent Management', desc: 'DPDP Act 2023 compliant time-stamped digital consent recorded.' },
    { title: 'Data Minimization Principles', desc: 'UIDAI 8-digit Aadhaar masking applied immediately upon OCR ingest.' },
    { title: 'Human-in-the-Loop Safeguards', desc: 'Autonomous decisions halted when confidence falls below strict threshold.' },
    { title: 'Agent Action Controls', desc: 'No financial transaction or account write occurs without dual consensus.' },
    { title: 'Immutable Audit Trail', desc: 'Every invocation and inference payload logged to regulatory ledger.' },
    { title: 'Explainable Decisioning', desc: 'Every agent outputs human-readable rationale, tools used, and metrics.' },
    { title: 'Policy-Grounded Reasoning', desc: 'Prompt models strictly bounded by RBI Master Directions and PNB manuals.' },
    { title: 'Confidence Thresholds', desc: 'Minimum 90% confidence required for straight-through approval.' },
    { title: 'Automated Escalation Rules', desc: 'Fuzzy sanctions matches (>70%) instantly routed to Compliance Officer.' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#A21D22] uppercase tracking-wider block">
              Enterprise Assurance
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.2 rounded border border-emerald-200">
              RBI & DPDP Aligned
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Responsible AI & Regulatory Governance Framework
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Punjab National Bank AI Governance Architecture ensures complete oversight, control, and zero hallucination risk.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
          <Scale className="w-4 h-4 text-[#A21D22]" />
          <span className="font-bold text-slate-800">10/10 Enterprise Controls Active</span>
        </div>
      </div>

      {/* Reassuring Enterprise AI Anchor Statement */}
      <div className="mt-5 p-4 rounded-xl bg-[#FDF2F2] border border-[#A21D22]/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#A21D22] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-[#7B1013] text-sm block">
            "AI does not independently override bank policy or regulatory controls."
          </span>
          <p className="text-slate-600 mt-1 leading-relaxed">
            All autonomous actions are bounded by predetermined policy thresholds. The system executes deterministic verification rules while utilizing AI for intent classification, document extraction, and fuzzy entity resolution.
          </p>
        </div>
      </div>

      {/* 10-Point Governance Checklist */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {governancePoints.map((pt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900">{pt.title}</h5>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{pt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indian Regulatory Compliance Enforcements */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#A21D22]" />
          <span>Statutory & Regulatory Checkpoints (India BFSI)</span>
        </h4>

        <div className="space-y-2 text-xs">
          {EXECUTIVE_METRICS.regulatoryChecklist.map((chk, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{chk.item}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({chk.complianceStandard})</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{chk.description}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase flex-shrink-0">
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
