import React from 'react';
import { PNBLogo } from './PNBLogo';
import { ShieldCheck, Smartphone, Sliders, Globe, RefreshCw, Layers } from 'lucide-react';
import { PNB_BRAND } from '../../config/theme.config';

interface PNBHeaderProps {
  currentExperience: 'customer' | 'command_center';
  onToggleExperience: (mode: 'customer' | 'command_center') => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: 'stp' | 'doc_exception' | 'aml_exception') => void;
  onReset: () => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
}

export const PNBHeader: React.FC<PNBHeaderProps> = ({
  currentExperience,
  onToggleExperience,
  activeScenarioId,
  onSelectScenario,
  onReset,
  language,
  onToggleLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-[#7B1013] text-white text-[11px] px-4 sm:px-6 py-1 flex items-center justify-between border-b border-[#580A0D]">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-gray-200">
            भारत सरकार का उपक्रम • A Government of India Undertaking
          </span>
          <span className="flex items-center gap-1 text-[#FDB913] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            RBI Authorized Digital Banking Channel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 hover:text-[#FDB913] transition-colors font-medium px-1.5 py-0.5 rounded"
          >
            <Globe className="w-3 h-3 text-[#FDB913]" />
            <span>{language === 'EN' ? 'English | हिंदी' : 'हिंदी | English'}</span>
          </button>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300 hidden md:inline">
            Toll-Free: {PNB_BRAND.supportTollFree}
          </span>
        </div>
      </div>

      {/* Main Bank Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <PNBLogo />

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] border border-[#A21D22]/20 flex items-center justify-center text-[#A21D22]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#A21D22] tracking-wide">PNB ONE</span>
                <span className="text-[10px] bg-[#FDB913]/20 text-[#7B1013] font-semibold px-1 rounded">
                  DIGITAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500">{PNB_BRAND.digitalTagline}</p>
            </div>
          </div>
        </div>

        {/* Experience Switcher & Demo Control Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dual-Lens Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center shadow-inner">
            <button
              onClick={() => onToggleExperience('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentExperience === 'customer'
                  ? 'bg-[#A21D22] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer Journey</span>
            </button>
            <button
              onClick={() => onToggleExperience('command_center')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentExperience === 'command_center'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FDB913]" />
              <span>Agent Command Center</span>
            </button>
          </div>

          {/* Quick Scenario Selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={activeScenarioId}
              onChange={(e) =>
                onSelectScenario(e.target.value as 'stp' | 'doc_exception' | 'aml_exception')
              }
              aria-label="Demo Scenario Selection"
              className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="stp">Scenario 1: Clean STP (100%)</option>
              <option value="doc_exception">Scenario 2: Doc Mismatch Self-Heal</option>
              <option value="aml_exception">Scenario 3: AML Watchlist HITL</option>
            </select>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            title="Reset Demo Journey"
            aria-label="Reset Demo Journey"
            className="p-1.5 text-slate-500 hover:text-[#A21D22] hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
