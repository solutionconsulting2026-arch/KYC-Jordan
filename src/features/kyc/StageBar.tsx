import React from 'react';
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
    <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-[#CFD3D8]">
      {/* Chevrons Pipeline with proper spacing */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {stages.map((stage) => {
          const { state, subLabel } = getStageStatus(stage.id);

          const clipPathStyle = 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%)';

          let bgClasses = 'bg-[#E9EBEE] text-[#4A4F57]'; // locked
          if (state === 'current') {
            bgClasses = 'bg-[#1A6BB5] text-white shadow-xs';
          } else if (state === 'done') {
            bgClasses = 'bg-[#2E7D32] text-white';
          }

          return (
            <div
              key={stage.id}
              style={{ clipPath: clipPathStyle }}
              className={`h-12 flex-1 min-w-[130px] flex flex-col justify-center px-5 transition-colors select-none ${bgClasses}`}
            >
              <div className="text-[12px] font-bold leading-tight truncate">{stage.name}</div>
              <div
                className={`text-[10px] font-medium leading-none mt-0.5 tracking-wider ${
                  state === 'current' ? 'text-blue-100' : 'opacity-85'
                }`}
              >
                {subLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Row below ribbon as in reference image */}
      <div className="flex justify-end items-center gap-4 text-[11px] text-[#5B616B] px-1 pt-1 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A6BB5]" /> Current Stage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#90CAF9]" /> Unlocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E0E0E0]" /> Not Active
        </span>
      </div>
    </div>
  );
};
