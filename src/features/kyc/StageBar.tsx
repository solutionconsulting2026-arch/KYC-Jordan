import React from 'react';
import { Flag, Lock, CheckCircle2 } from 'lucide-react';
import { CaseStatus } from '../../types/kyc.types';

interface StageBarProps {
  status: CaseStatus;
  eddRequired: boolean;
  activeTab: string;
}

export const StageBar: React.FC<StageBarProps> = ({ status, eddRequired, activeTab }) => {
  // Compute stage states
  const getStageStatus = (stageIdx: number): { state: 'current' | 'done' | 'locked'; subLabel: string } => {
    // 1. Case Information / Initiation tab
    if (activeTab === 'initiation') {
      if (stageIdx === 1) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Locked' };
    }

    // 2. Document Checklist tab (or Entity Ownership)
    if (activeTab === 'documents' || activeTab === 'ownership') {
      if (stageIdx === 1) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 2) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Locked' };
    }

    // 3. Screening / Risk Assessment tab
    if (activeTab === 'screening' || activeTab === 'risk') {
      if (stageIdx === 1 || stageIdx === 2) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 3) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Locked' };
    }

    // 4. Compliance Review tab
    if (activeTab === 'review') {
      if (stageIdx <= 3) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 4) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Locked' };
    }

    // 5. EDD Approval tab
    if (activeTab === 'edd') {
      if (stageIdx <= 4) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 5) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Locked' };
    }

    // 6. Approvals & Audit / Closure tab
    if (activeTab === 'closure') {
      if (stageIdx <= 5) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 6) {
        if (status === 'Closed') return { state: 'done', subLabel: 'Completed' };
        return { state: 'current', subLabel: 'Running' };
      }
    }

    return { state: 'locked', subLabel: 'Locked' };
  };

  const stages = [
    { id: 1, name: 'New Lead', alt: 'Initiation' },
    { id: 2, name: 'Contact Established', alt: 'Document Collection' },
    { id: 3, name: 'Document Collection', alt: 'Risk Assessment' },
    { id: 4, name: 'Hand Off To LOS', alt: 'Compliance Review' },
    { id: 5, name: 'LAN Generation', alt: 'EDD Approval' },
    { id: 6, name: 'Won/Lost', alt: 'Closure' },
  ];

  return (
    <div className="flex flex-col gap-2.5 bg-transparent select-none">
      {/* Chevrons Pipeline matching reference screenshot */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {stages.map((stage, idx) => {
          const { state, subLabel } = getStageStatus(stage.id);
          const isFirst = idx === 0;

          const clipPathStyle = isFirst
            ? 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)'
            : 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)';

          let bgClasses = 'bg-[#ECEFF3] text-[#4A5568]';
          let icon = <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />;

          if (state === 'current') {
            bgClasses = 'bg-[#1877F2] text-white shadow-sm';
            icon = <Flag className="w-3.5 h-3.5 text-white shrink-0 fill-white" />;
          } else if (state === 'done') {
            bgClasses = 'bg-[#1E7E34] text-white shadow-xs';
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />;
          }

          return (
            <div
              key={stage.id}
              style={{ clipPath: clipPathStyle }}
              className={`h-[48px] flex-1 min-w-[155px] flex items-center gap-2.5 transition-all select-none ${
                isFirst ? 'pl-5 pr-6 rounded-l-lg' : 'pl-7 pr-6'
              } ${bgClasses}`}
            >
              <div className="flex items-center justify-center shrink-0">
                {icon}
              </div>

              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[12px] font-semibold truncate tracking-tight">
                  {stage.name}
                </span>
                <span
                  className={`text-[10px] tracking-wide mt-0.5 ${
                    state === 'current'
                      ? 'text-blue-100 font-medium'
                      : state === 'done'
                      ? 'text-emerald-100 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  {subLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Row matching reference screenshot */}
      <div className="flex justify-end items-center gap-4 text-[11px] text-slate-500 font-medium px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1877F2]" /> Current Stage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1E7E34]" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#90CAF9]" /> Unlocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" /> Not Active
        </span>
      </div>
    </div>
  );
};
