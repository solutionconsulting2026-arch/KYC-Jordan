import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Network,
  Grip,
  ChevronDown,
  HelpCircle,
  PanelsTopLeft,
} from 'lucide-react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { SEED_USERS } from '../../data/seed/users';

interface TopBarProps {
  onOpenActionCenter: () => void;
  onOpenHierarchy: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenActionCenter, onOpenHierarchy }) => {
  const { currentUser, setCurrentUser } = useKycStore();
  const { navigate } = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('Leads');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="relative shrink-0 z-30 select-none">
      {/* Magenta accent line across the centre of the header */}
      <div className="absolute top-0 left-[35%] right-[18%] h-[4px] bg-[#E6007A]" />

      {/* Main Top Header Bar */}
      <header className="h-[78px] bg-black text-white flex items-center justify-between pr-5">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center h-full">
          <button
            className="w-[77px] h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>

          {/* BUSINESS NEXT' wordmark */}
          <div
            onClick={() => navigate('#/kyc/KYC-2026-0150/initiation')}
            className="flex flex-col cursor-pointer ml-[13px] font-['Poppins'] font-extrabold text-[25px] leading-[22px] tracking-[-0.02em] text-white"
            title="BUSINESS NEXT"
          >
            <span>BUSINESS</span>
            <span>
              NEXT<span className="text-[18px] align-top leading-none ml-[1px]">&rsquo;</span>
            </span>
          </div>
        </div>

        {/* Center: Module selector + Advanced search capsule */}
        <div className="hidden md:flex items-center h-[44px] w-[480px] shrink-0 rounded-full border border-[#3A3B40] bg-[#2A2B30]">
          <div className="relative h-full">
            <button
              onClick={() => setIsPipelineOpen(!isPipelineOpen)}
              className="h-full w-[168px] flex items-center justify-between pl-5 pr-5 rounded-l-full bg-black text-white text-[15px] border-r border-[#3A3B40]"
            >
              <span>{selectedPipeline}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isPipelineOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-[#1F2329] border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-[14px]">
                {['Leads', 'Cases', 'Accounts', 'Contacts', 'Opportunities'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedPipeline(opt);
                      setIsPipelineOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors ${
                      selectedPipeline === opt ? 'text-[#1877F2] font-medium' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex-1 min-w-0 h-full flex items-center pl-4 pr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-white placeholder-white/50 outline-none text-[14px]"
            />
            <span className="text-[13px] text-white font-medium mr-3 shrink-0">Advanced</span>
            <button type="submit" className="text-white hover:text-white/80 shrink-0" title="Search">
              <Search className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </form>
        </div>

        {/* Right: Quick Tools & Profile */}
        <div className="flex items-center gap-[30px]">
          <button onClick={onOpenActionCenter} className="relative text-white hover:text-white/80" title="Notifications">
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.75} />
            <span className="absolute -top-[2px] right-0 w-[7px] h-[7px] rounded-full bg-[#FF1E3C]" />
          </button>

          <button onClick={() => navigate('#/worklist')} className="text-white hover:text-white/80" title="App Launcher / Worklist">
            <Grip className="w-[26px] h-[26px]" strokeWidth={2} />
          </button>

          <button onClick={onOpenHierarchy} className="text-white hover:text-white/80" title="Corporate Hierarchy">
            <Network className="w-[24px] h-[24px]" strokeWidth={1.75} />
          </button>

          <button className="text-white hover:text-white/80 hidden sm:block" title="Help Center">
            <HelpCircle className="w-[26px] h-[26px]" strokeWidth={1.75} />
          </button>

          <button className="text-white hover:text-white/80 hidden sm:block" title="Toggle Panel">
            <PanelsTopLeft className="w-[26px] h-[26px]" strokeWidth={1.75} />
          </button>

          {/* User Profile Avatar with White Ring */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center rounded-full"
              title={`${currentUser.name} (${currentUser.roles[0]})`}
            >
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-[46px] h-[46px] rounded-full object-cover border-[3px] border-white"
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
