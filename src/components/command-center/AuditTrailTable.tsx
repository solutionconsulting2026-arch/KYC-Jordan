import React, { useState } from 'react';
import { AuditLogEntry } from '../../types/agent.types';
import { ShieldCheck, Download, Filter, Search, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { PNBButton } from '../common/PNBButton';

interface AuditTrailTableProps {
  logs: AuditLogEntry[];
  onExport?: () => void;
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ logs, onExport }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.agentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.decision.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#A21D22] uppercase tracking-wider block">
              Enterprise Governance
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.2 rounded border border-emerald-200">
              Immutable
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
            Real-Time RBI & Regulatory Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every autonomous agent interaction, decision payload, and tool invocation is time-stamped and auditable.
          </p>
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#A21D22]"
            />
          </div>

          <PNBButton
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Log
          </PNBButton>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Agent</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Input Context</th>
              <th className="py-2.5 px-3">Decision Outcome</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">System/API</th>
              <th className="py-2.5 px-3">Human Touch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {entry.timestamp}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                  {entry.agentName}
                </td>
                <td className="py-2.5 px-3 text-slate-800 font-medium">
                  {entry.action}
                </td>
                <td className="py-2.5 px-3 text-slate-500 font-mono text-[10.5px] max-w-[180px] truncate">
                  {entry.inputSummary}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      entry.status === 'ALERT'
                        ? 'text-rose-700'
                        : entry.status === 'WARNING'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {entry.status === 'ALERT' ? (
                      <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    )}
                    <span className="truncate max-w-[200px]">{entry.decision}</span>
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-800 text-[11px]">
                  {entry.confidence}
                </td>
                <td className="py-2.5 px-3 text-[10.5px] text-slate-500 font-mono">
                  {entry.systemApi}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      entry.humanIntervention === 'Required'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {entry.humanIntervention}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Displaying {filtered.length} verifiable governance records</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Cryptographically hashed against CBS General Ledger
        </span>
      </div>
    </div>
  );
};
