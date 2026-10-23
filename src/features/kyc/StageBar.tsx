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
    <div className="flex flex-col gap-[14px] select-none">
      {/* Chevron pipeline */}
      <div className="flex items-center overflow-x-auto scrollbar-none">
        {stages.map((stage, idx) => {
          const { state, subLabel } = getStageStatus(stage.id);
          const isFirst = idx === 0;

          const clipPathStyle = isFirst
            ? 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)'
            : 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%, 24px 50%)';

          let bgClasses = 'bg-[#EDEDED] text-[#4D4D4D]';
          let icon = <Lock className="w-[22px] h-[22px] text-white fill-black shrink-0" strokeWidth={2.25} />;

          if (state === 'current') {
            bgClasses = 'bg-[#1877F2] text-white';
            icon = <Flag className="w-[22px] h-[22px] text-white shrink-0" strokeWidth={2} />;
          } else if (state === 'done') {
            bgClasses = 'bg-[#2E9E4F] text-white';
            icon = <CheckCircle2 className="w-[22px] h-[22px] text-white shrink-0" strokeWidth={2} />;
          }

          return (
            <div
              key={stage.id}
              style={{ clipPath: clipPathStyle, marginLeft: isFirst ? 0 : -16 }}
              className={`h-[48px] flex-1 min-w-[180px] flex items-center gap-[14px] pr-8 ${
                isFirst ? 'pl-[64px] rounded-l-full' : 'pl-[58px]'
              } ${bgClasses}`}
            >
              {icon}
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[15px] truncate">{stage.name}</span>
                <span className={`text-[12px] ${state === 'locked' ? 'text-[#4D4D4D]' : 'text-white/90'}`}>
                  {subLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-[14px] text-[12px] text-[#4D4D4D] pr-[14px]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1877F2]" /> Current Stage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2E9E4F]" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#BBD7FB]" /> Unlocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#DADADA]" /> Not Active
        </span>
      </div>
    </div>
  );
};
