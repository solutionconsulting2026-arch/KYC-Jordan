import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface FetchSectionProps {
  status: 'idle' | 'loading' | 'loaded';
  onFetch: () => void;
  fetchLabel?: string;
  refetchLabel?: string;
  loadingLabel?: string;
  children: React.ReactNode;
  emptyPrompt?: string;
}

export const FetchSection: React.FC<FetchSectionProps> = ({
  status,
  onFetch,
  fetchLabel = 'Fetch Data',
  refetchLabel = 'Re-fetch',
  loadingLabel = 'Fetching…',
  children,
  emptyPrompt = 'Click the button below to load data from the system.',
}) => {
  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white rounded-xl border border-[#CFD3D8] shadow-xs">
        <Download className="w-8 h-8 text-slate-300" />
        <p className="text-sm text-[#5B616B] text-center max-w-xs">{emptyPrompt}</p>
        <button
          onClick={onFetch}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A6BB5] text-white text-xs font-bold rounded-lg hover:bg-[#155a9a] transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          {fetchLabel}
        </button>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 bg-white rounded-xl border border-[#CFD3D8] shadow-xs">
        <RefreshCw className="w-6 h-6 text-[#1A6BB5] animate-spin" />
        <p className="text-sm font-semibold text-[#1A6BB5]">{loadingLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={onFetch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#CFD3D8] bg-white text-xs font-semibold text-[#5B616B] rounded-lg hover:text-[#1F2329] hover:border-[#1A6BB5] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {refetchLabel}
        </button>
      </div>
      {children}
    </div>
  );
};
