import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Network,
  LayoutGrid,
  ChevronDown,
  HelpCircle,
  Columns,
} from 'lucide-react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { SEED_USERS } from '../../data/seed/users';

interface TopBarProps {
  onOpenActionCenter: () => void;
  onOpenHierarchy: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenActionCenter, onOpenHierarchy }) => {
  const { currentUser, setCurrentUser, notifications } = useKycStore();
  const { navigate } = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('My Pipeline');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query === '00001722') {
      navigate('#/c360/00001722');
    } else if (query === '00001700') {
      navigate('#/c360/00001700');
    } else if (query.toLowerCase().includes('case') || query.includes('0150')) {
      navigate('#/kyc/KYC-2026-0150/initiation');
    } else {
      navigate('#/c360/00001715');
    }
  };

  return (
    <div className="flex flex-col shrink-0 z-30 select-none">
      {/* Top Pink Accent Band from screenshot */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E6007A] via-[#FF2A85] to-[#E6007A] shrink-0" />

      {/* Main Top Header Bar */}
      <header className="h-[52px] bg-[#0D0E12] text-white px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* BUSINESS NEXT' Logo matching reference */}
          <div
            onClick={() => navigate('#/kyc/KYC-2026-0150/initiation')}
            className="flex flex-col leading-none font-sans cursor-pointer group"
            title="BUSINESS NEXT"
          >
            <span className="text-[13px] font-black tracking-[0.14em] text-white uppercase font-sans">
              BUSINESS
            </span>
            <span className="text-[13px] font-black tracking-[0.14em] text-white uppercase font-sans flex items-center">
              NEXT<span className="text-[#FF2A85] font-black text-sm ml-[1px]">'</span>
            </span>
          </div>
        </div>

        {/* Center: Pipeline Dropdown & Advanced Search Capsule */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-8">
          {/* Pipeline Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPipelineOpen(!isPipelineOpen)}
              className="flex items-center gap-2 bg-[#1A1D24] hover:bg-[#232731] text-slate-100 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              <span>{selectedPipeline}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPipelineOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#1A1D24] border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs">
                {['My Pipeline', 'All Leads', 'KYC Review Cases', 'Corporate Portfolios'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedPipeline(opt);
                      setIsPipelineOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-slate-200 hover:bg-white/10 transition-colors ${
                      selectedPipeline === opt ? 'text-[#1877F2] font-semibold' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Search Bar Capsule matching reference */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-[#1A1D24] border border-slate-700/80 rounded-full px-3 py-1 shadow-inner text-xs focus-within:border-slate-500 transition-colors"
          >
            <span className="text-[11px] text-slate-400 font-medium mr-2 pr-2 border-r border-slate-700/80 select-none">
              Advanced
            </span>
            <input
              type="text"
              placeholder="Search leads, cases, UCIC (e.g. 00001715)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-xs"
            />
            <button
              type="submit"
              className="text-slate-400 hover:text-white p-1 rounded-full transition-colors ml-1"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right: Quick Tools & Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell with Red Badge */}
          <button
            onClick={onOpenActionCenter}
            className="relative text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0D0E12]" />
          </button>

          {/* 3x3 App Launcher */}
          <button
            onClick={() => navigate('#/worklist')}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="App Launcher / Worklist"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Org / Hierarchy */}
          <button
            onClick={onOpenHierarchy}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Corporate Hierarchy"
          >
            <Network className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
            title="Help Center"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Layout Toggle */}
          <button
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
            title="Toggle Panel"
          >
            <Columns className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-white/15 mx-1" />

          {/* User Profile Avatar with White Ring */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-white/40 transition-all"
              title={`${currentUser.name} (${currentUser.roles[0]})`}
            >
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/90 shadow-sm"
              />
            </button>

            {/* User Persona Switcher Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-[#1F2329] rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Switch Active Persona
                  </p>
                </div>
                {SEED_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                      currentUser.id === user.id ? 'bg-blue-50/70 font-semibold text-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {user.roles.join(', ')} ({user.teamId})
                        </p>
                      </div>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
