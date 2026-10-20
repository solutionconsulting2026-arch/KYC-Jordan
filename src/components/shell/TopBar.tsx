import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Network,
  LayoutGrid,
  ChevronDown,
  User as UserIcon,
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

  const [ucicQuery, setUcicQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ucicQuery.trim() === '00001722') {
      navigate('#/c360/00001722');
    } else if (ucicQuery.trim() === '00001700') {
      navigate('#/c360/00001700');
    } else {
      navigate('#/c360/00001715');
    }
  };

  return (
    <header className="h-[60px] bg-[#2B2E35] text-white px-4 flex items-center justify-between border-b border-slate-700/60 shrink-0 z-30 select-none">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-4">
        <button
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700/40 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate('#/c360/00001715')}
          className="flex items-center gap-2 cursor-pointer group"
          title="BUSINESSNEXT RM Workbench"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center font-bold text-xs text-white shadow-xs group-hover:opacity-90">
            BN
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold tracking-wider text-slate-100 flex items-center gap-1">
              BUSINESS<span className="text-pink-400">NEXT</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">
              Arab Bank CIB
            </span>
          </div>
        </div>
      </div>

      {/* Center: Segmented Global Search Pill (UCIC | Email | Mobile) */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center bg-[#1E2127] rounded-full border border-slate-600/80 px-2 py-1 max-w-xl w-full mx-6 shadow-inner text-xs"
      >
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="UCIC (e.g. 00001715)"
            value={ucicQuery}
            onChange={(e) => setUcicQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-3 py-1 outline-none text-[12px]"
          />
        </div>
        <div className="h-4 w-px bg-slate-600 shrink-0" />
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="Email"
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-3 py-1 outline-none text-[12px]"
          />
        </div>
        <div className="h-4 w-px bg-slate-600 shrink-0" />
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="Mobile"
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-3 py-1 outline-none text-[12px]"
          />
        </div>
        <button
          type="submit"
          className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-700/50 transition-colors shrink-0 ml-1"
          title="Search Corporate Registry"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Right: Notification Bell, Org Chart, Layout, User Profile */}
      <div className="flex items-center gap-3">
        {/* Action Center Bell */}
        <button
          onClick={onOpenActionCenter}
          className="relative text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/40 transition-colors"
          title="Action Center Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#2B2E35]" />
          )}
        </button>

        {/* Hierarchy Tree */}
        <button
          onClick={onOpenHierarchy}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/40 transition-colors"
          title="Corporate Group Hierarchy"
        >
          <Network className="w-4 h-4" />
        </button>

        {/* View Grid */}
        <button
          onClick={() => navigate('#/worklist')}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/40 transition-colors"
          title="My KYC Worklist"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-700 mx-1" />

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
          >
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-600"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-slate-100">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400">
                {currentUser.roles[0]} · {currentUser.countryScope.join(', ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Switching Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-[#1F2329] rounded-xl shadow-xl border border-[#CFD3D8] py-2 z-50 animate-in fade-in duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-[#5B616B] uppercase tracking-wider">
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
                    currentUser.id === user.id ? 'bg-amber-50/70 font-semibold text-amber-900' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-[10px] text-[#5B616B]">
                        {user.roles.join(', ')} ({user.teamId})
                      </p>
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
