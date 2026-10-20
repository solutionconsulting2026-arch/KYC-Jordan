import React from 'react';
import { DemoScenario } from '../../data/scenarios';
import { ShieldCheck, Clock, User, CheckCircle2, AlertTriangle, ArrowRight, Layers, Bot } from 'lucide-react';

interface SupervisorTimelineProps {
  scenario: DemoScenario;
  onSelectAgent?: (agentId: any) => void;
}

export const SupervisorTimeline: React.FC<SupervisorTimelineProps> = ({ scenario, onSelectAgent }) => {
  const isHighRisk = scenario.id === 'aml_exception';

  const timelineEvents = [
    { time: '12:01:04', agent: 'Customer Intake Agent', text: 'Intake Agent invoked by conversational trigger' },
    { time: '12:01:06', agent: 'Customer Intake Agent', text: 'Customer classified as New-to-PNB (NTB); Scheme PNB Select recommended' },
    { time: '12:01:12', agent: 'Document Intelligence Agent', text: 'Document Intelligence Agent invoked for PAN & Aadhaar OCR' },
    {
      time: '12:01:27',
      agent: 'Document Intelligence Agent',
      text: scenario.id === 'doc_exception'
        ? 'Minor name variation identified. Corroborated with CKYCR database; documents validated'
        : 'PAN & Aadhaar authenticated. UIDAI 8-digit masking applied; documents validated',
    },
    { time: '12:01:31', agent: 'KYC Agent', text: 'KYC Agent invoked for regulatory registry check' },
    { time: '12:01:40', agent: 'KYC Agent', text: 'CERSAI CKYCR active record matched (KIN 400192849201); Digital KYC path selected' },
    { time: '12:01:43', agent: 'AML Screening Agent', text: 'AML Screening Agent invoked for sanctions & watchlist screening' },
    {
      time: '12:01:58',
      agent: 'AML Screening Agent',
      text: isHighRisk
        ? 'ALERT: Potential PEP / Watchlist match (84% score); autonomous threshold exceeded'
        : 'Sanctions, PEP, and adverse media screening completed: CLEAR',
    },
    { time: '12:02:02', agent: 'Risk Assessment Agent', text: 'Risk Assessment Agent invoked for composite scoring' },
    {
      time: '12:02:08',
      agent: 'Risk Assessment Agent',
      text: isHighRisk
        ? 'High-risk assessment triggered; autonomous processing halted. Case routed to Compliance Officer'
        : 'Low-risk profile confirmed (CIBIL 784, Fraud Propensity 0.02); STP Approved',
    },
    ...(isHighRisk
      ? [
          {
            time: '12:02:10',
            agent: 'Agent Supervisor',
            text: 'Autonomous processing STOPPED. Human-in-the-Loop review requested.',
            isAlert: true,
          },
        ]
      : [
          { time: '12:02:10', agent: 'Account Opening Agent', text: 'Account Opening Agent invoked with Finacle 10.x CBS payload' },
          { time: '12:02:18', agent: 'Account Opening Agent', text: 'Finacle CIF PNB774910281 & Account 0182000100829145 created' },
          { time: '12:02:22', agent: 'Welcome & Activation Agent', text: 'Welcome & Activation Agent invoked for credential issuance' },
          { time: '12:02:30', agent: 'Welcome & Activation Agent', text: 'Virtual RuPay Platinum card issued, PNB ONE enabled, onboarding complete' },
        ]),
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header with Case Info & Decision State */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A21D22] text-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#FDB913]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Orchestration Engine
              </span>
              <h3 className="text-sm font-bold text-slate-900">AGENT SUPERVISOR</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Decision State:</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                isHighRisk
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {scenario.supervisorOutcome.state}
            </span>
          </div>
        </div>

        {/* Case Metadata */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Active Applicant</span>
            <span className="font-bold text-slate-800">{scenario.customer.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Target Product</span>
            <span className="font-semibold text-slate-800">PNB Select Savings</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Supervised Agents</span>
            <span className="font-mono font-bold text-slate-800">7 Specialized Units</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Autonomous Policy</span>
            <span className="font-semibold text-emerald-700">Strict PMLA Bounds</span>
          </div>
        </div>

        {/* Scrollable Timeline */}
        <div className="mt-5 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[10px] text-slate-400 flex-shrink-0 pt-0.5">
                {evt.time}
              </span>
              <div className="relative">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    evt.isAlert
                      ? 'bg-rose-600 ring-4 ring-rose-100'
                      : 'bg-[#A21D22]'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-[11px] leading-tight">
                  {evt.agent}
                </div>
                <p
                  className={`text-[11px] leading-relaxed mt-0.5 ${
                    evt.isAlert ? 'text-rose-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  {evt.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Supervisor ensures all actions adhere to RBI autonomous limits</span>
        <span className="font-mono">Latencies: Sub-second</span>
      </div>
    </div>
  );
};
