import React, { useState } from 'react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { KycCase } from '../../types/kyc.types';
import { KycStatusChip } from '../../components/common/KycStatusChip';
import { calculateSlaInfo } from '../../domain/slaEngine';
import { diffDays } from '../../domain/dateUtils';
import {
  ListTodo,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const WorklistPage: React.FC = () => {
  const { cases, customers, currentUser, currentDate, profiles } = useKycStore();
  const { navigate } = useRouter();

  const [activeFilter, setActiveFilter] = useState<
    'all' | 'due30' | 'overdue' | 'awaitingMe' | 'returned' | 'closed' | 'escalated'
  >('all');

  const caseList: KycCase[] = Object.values(cases);

  // Filter cases by current user role scope
  const roleFilteredCases = caseList.filter((c) => {
    if (currentUser.roles.includes('UnitHead')) return true;
    if (currentUser.roles.includes('Compliance')) {
      if (activeFilter === 'awaitingMe') return c.status === 'UnderComplianceReview';
      return true;
    }
    if (currentUser.roles.includes('SeniorApprover')) {
      if (activeFilter === 'awaitingMe') return c.status === 'PendingEDDApproval';
      return true;
    }
    if (currentUser.roles.includes('TL')) {
      return true; // Team cases
    }
    // RM
    return c.ownerId === currentUser.id || c.cif === '00001715';
  });

  // KPI Calculations
  const openCasesCount = roleFilteredCases.filter((c) => c.status !== 'Closed' && c.status !== 'Cancelled').length;
  const overdueCasesCount = roleFilteredCases.filter((c) => {
    const sla = calculateSlaInfo(c, currentDate);
    return sla.isOverdue;
  }).length;
  const due30CasesCount = roleFilteredCases.filter((c) => {
    const days = diffDays(c.dueDate, currentDate);
    return days >= 0 && days <= 30 && c.status !== 'Closed';
  }).length;

  // Apply selected filter
  const displayedCases = roleFilteredCases.filter((c) => {
    const sla = calculateSlaInfo(c, currentDate);
    const days = diffDays(c.dueDate, currentDate);

    if (activeFilter === 'overdue') return sla.isOverdue;
    if (activeFilter === 'due30') return days >= 0 && days <= 30 && c.status !== 'Closed';
    if (activeFilter === 'returned') return c.status === 'Returned';
    if (activeFilter === 'closed') return c.status === 'Closed';
    if (activeFilter === 'escalated') return sla.escalatedToTL || sla.escalatedToUnitHead;
    if (activeFilter === 'awaitingMe') {
      if (currentUser.roles.includes('Compliance')) return c.status === 'UnderComplianceReview';
      if (currentUser.roles.includes('SeniorApprover')) return c.status === 'PendingEDDApproval';
      if (currentUser.roles.includes('TL')) return sla.escalatedToTL || c.status === 'UnderTLReview';
      return c.status === 'Open' || c.status === 'InProgress' || c.status === 'Returned';
    }
    return true;
  });

  const getStageRoute = (status: KycCase['status']) => {
    switch (status) {
      case 'Open':
        return 'initiation';
      case 'InProgress':
      case 'Returned':
        return 'documents';
      case 'UnderComplianceReview':
      case 'UnderTLReview':
      case 'Submitted':
        return 'review';
      case 'PendingEDDApproval':
        return 'edd';
      case 'Approved':
      case 'Closed':
        return 'closure';
      default:
        return 'initiation';
    }
  };

  const isTlOrUh = currentUser.roles.includes('TL') || currentUser.roles.includes('UnitHead');

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-[1600px] w-full mx-auto select-none animate-in fade-in duration-150">
      {/* Page Title & Role Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-[#1F2329] tracking-tight">My KYC Reviews</h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Workbench inbox for <strong>{currentUser.name}</strong> ({currentUser.roles.join(', ')}) · Scope: [{currentUser.countryScope.join(', ')}]
          </p>
        </div>
      </div>

      {/* KPI Tiles Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#CFD3D8] shadow-xs">
          <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Open Reviews</span>
          <span className="text-[22px] font-extrabold text-[#1F2329] mt-1 block">
            {openCasesCount}
          </span>
          <span className="text-[11px] text-slate-500">Active workflows</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CFD3D8] shadow-xs">
          <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Due ≤ 30 Days</span>
          <span className="text-[22px] font-extrabold text-amber-700 mt-1 block">
            {due30CasesCount}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Action window active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CFD3D8] shadow-xs">
          <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Overdue</span>
          <span className="text-[22px] font-extrabold text-rose-700 mt-1 block">
            {overdueCasesCount}
          </span>
          <span className="text-[11px] text-rose-700 font-semibold">SLA escalated</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CFD3D8] shadow-xs">
          <span className="text-[11px] font-bold text-[#5B616B] uppercase block">Avg Days to Close</span>
          <span className="text-[22px] font-extrabold text-emerald-700 mt-1 block">8.4 D</span>
          <span className="text-[11px] text-slate-500">Trailing 90 days</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'due30', label: 'Due ≤ 30 Days' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'awaitingMe', label: 'Awaiting My Action' },
          { id: 'returned', label: 'Returned to RM' },
          ...(isTlOrUh ? [{ id: 'escalated', label: 'Escalated to Me (SLA)' }] : []),
          { id: 'closed', label: 'Closed (Historical)' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`h-8 px-4 rounded-full font-semibold transition-all ${
              activeFilter === f.id
                ? 'bg-[#1F2329] text-white shadow-xs'
                : 'bg-white text-[#5B616B] border border-[#CFD3D8] hover:text-[#1F2329]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Worklist Table */}
      <div className="bg-white rounded-xl border border-[#CFD3D8] overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F8FAFC] border-b border-[#E6E8EB] text-[#5B616B] font-semibold">
            <tr>
              <th className="py-3 px-4">Case No.</th>
              <th className="py-3 px-3">Corporate Entity</th>
              <th className="py-3 px-3">Country</th>
              <th className="py-3 px-3">Risk Grade</th>
              <th className="py-3 px-3">Workflow Status</th>
              <th className="py-3 px-3">Due Date</th>
              <th className="py-3 px-3">SLA Status</th>
              <th className="py-3 px-3">Case Owner</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {displayedCases.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#5B616B] text-xs">
                  No review cases matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              displayedCases.map((c) => {
                const customer = customers[c.cif] || {
                  accountName: 'Alpha Logistics Entity',
                  countryOfBooking: 'JO',
                };
                const sla = calculateSlaInfo(c, currentDate);
                const targetTab = getStageRoute(c.status);

                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`#/kyc/${c.id}/${targetTab}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1F5BD8] hover:underline">
                      {c.caseNo}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1F2329] block">{customer.accountName}</span>
                      <span className="text-[10px] text-[#5B616B] font-mono">CIF {c.cif}</span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {customer.countryOfBooking}
                    </td>

                    <td className="py-3 px-3 font-semibold">
                      {c.risk.proposed || profiles[c.cif]?.riskRating || 'Medium'}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Closed'
                              ? 'bg-emerald-500'
                              : c.status === 'Returned'
                              ? 'bg-rose-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-[#1F2329] font-medium">
                      {c.dueDate}
                    </td>

                    <td className="py-3 px-3">
                      {sla.isOverdue ? (
                        <span className="font-bold text-rose-700 text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {sla.overdueDays}d Overdue
                        </span>
                      ) : (
                        <span className="font-mono text-slate-700 text-[11px]">{sla.slaDisplay}</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-[#5B616B] text-[11px]">
                      {c.ownerId === 'U1' ? 'Rania Saleh (RM)' : c.ownerId === 'U6' ? 'Sami Rahal (RM Dubai)' : c.ownerId}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F5BD8] hover:underline">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
