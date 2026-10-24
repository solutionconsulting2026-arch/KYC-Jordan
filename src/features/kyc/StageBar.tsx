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
  // Stages: 1. Initiation, 2. Data & Documents, 3. Risk Assessment, 4. Compliance Review, 5. EDD Approval, 6. Closure
  const getStageStatus = (stageIdx: number): { state: 'current' | 'done' | 'locked'; subLabel: string } => {
    // 1. Case Information / Initiation tab
    if (activeTab === 'initiation') {
      if (stageIdx === 1) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 2. Document Checklist tab (or Entity Ownership)
    // "Upon click of Document checklist tab:
    //  a. Initiation stage should be marked completed with green color.
    //  b. Only 'Data & Documents' stage should get highlighted in blue, on ribbon.
    //  c. 'Risk assessment' and 'Compliance review' and further stages should be greyed out."
    if (activeTab === 'documents' || activeTab === 'ownership') {
      if (stageIdx === 1) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 2) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 3. Screening tab
    // "Upon click of Screening tab:
    //  a. 'Initiation' & 'Data & Documents' stages should be marked completed with green color.
    //  b. 'Risk assessment' stage should be highlighted in blue color, as running.
    //  c. 'Compliance review' & further stages should be greyed out."
    if (activeTab === 'screening') {
      if (stageIdx === 1 || stageIdx === 2) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 3) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 4. Risk Assessment tab
    // "Upon click of Risk Assessment tab:
    //  a. 'Initiation' & 'Data & Documents' stages should be marked completed with green color.
    //  b. 'Risk assessment' stage should be highlighted in blue color, as running.
    //  c. 'Compliance review' & further stages should be greyed out."
    if (activeTab === 'risk') {
      if (stageIdx === 1 || stageIdx === 2) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 3) return { state: 'current', subLabel: 'Running' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 5. Compliance Review tab
    if (activeTab === 'review') {
      if (stageIdx <= 3) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 4) return { state: 'current', subLabel: 'Under Review' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 6. EDD Approval tab
    if (activeTab === 'edd') {
      if (stageIdx <= 4) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 5) return { state: 'current', subLabel: 'Required' };
      return { state: 'locked', subLabel: 'Not Active' };
    }

    // 7. Approvals & Audit / Closure tab
    if (activeTab === 'closure') {
      if (stageIdx <= 5) return { state: 'done', subLabel: 'Completed' };
      if (stageIdx === 6) {
        if (status === 'Closed') return { state: 'done', subLabel: 'Completed' };
        return { state: 'current', subLabel: 'Approved' };
      }
    }

    return { state: 'locked', subLabel: 'Not Active' };
  };

  const stages = [
    { id: 1, name: 'Initiation' },
    { id: 2, name: 'Data & Documents' },
    { id: 3, name: 'Risk Assessment' },
    { id: 4, name: 'Compliance Review' },
    { id: 5, name: 'EDD Approval' },
    { id: 6, name: 'Closure' },
  ];

  return (
    <div className="flex flex-col gap-2.5 select-none">
      {/* Chevron pipeline */}
      <div className="flex items-center overflow-x-auto scrollbar-none">
        {stages.map((stage, idx) => {
          const { state, subLabel } = getStageStatus(stage.id);
          const isFirst = idx === 0;

          const clipPathStyle = isFirst
            ? 'polygon(0% 0%, calc(100% - 18px) 0%, 100% 50%, calc(100% - 18px) 100%, 0% 100%)'
            : 'polygon(0% 0%, calc(100% - 18px) 0%, 100% 50%, calc(100% - 18px) 100%, 0% 100%, 18px 50%)';

          let bgClasses = 'bg-[#EDEDED] text-[#4D4D4D]';
          let icon = <Lock className="w-[18px] h-[18px] text-white fill-black shrink-0" strokeWidth={2.25} />;

          if (state === 'current') {
            bgClasses = 'bg-[#1877F2] text-white';
            icon = <Flag className="w-[18px] h-[18px] text-white shrink-0" strokeWidth={2} />;
          } else if (state === 'done') {
            bgClasses = 'bg-[#2E9E4F] text-white';
            icon = <CheckCircle2 className="w-[18px] h-[18px] text-white shrink-0" strokeWidth={2} />;
          }

          return (
            <div
              key={stage.id}
              style={{ clipPath: clipPathStyle, marginLeft: isFirst ? 0 : -12 }}
              className={`h-10 flex-1 min-w-[140px] flex items-center gap-2 pr-6 ${
                isFirst ? 'pl-5 rounded-l-full' : 'pl-8'
              } ${bgClasses}`}
            >
              {icon}
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-[13px] truncate" title={stage.name}>{stage.name}</span>
                <span className={`text-[11px] ${state === 'locked' ? 'text-[#4D4D4D]' : 'text-white/90'}`}>
                  {subLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-3 text-[11px] text-[#4D4D4D] pr-2">
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
