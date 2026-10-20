import React from 'react';
import {
  Search,
  Link2,
  History,
  Boxes,
  Calendar,
  User,
  Activity,
  Crown,
  FileText,
  BarChart2,
  HandMetal,
  ListTodo,
  Radio,
} from 'lucide-react';
import { useRouter } from '../../router/AppRouter';

export const LeftRail: React.FC = () => {
  const { currentRoute, navigate } = useRouter();

  const isC360Active = currentRoute.route === 'c360';
  const isWorklistActive = currentRoute.route === 'worklist';

  return (
    <aside className="w-[56px] bg-[#2B2E35] border-r border-slate-700/60 flex flex-col items-center py-3 gap-1 shrink-0 z-20 select-none">
      {/* 1. Search */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* 2. Link */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Quick Links"
      >
        <Link2 className="w-4 h-4" />
      </button>

      {/* 3. History */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Recent History"
      >
        <History className="w-4 h-4" />
      </button>

      {/* 4. Modules */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Application Modules"
      >
        <Boxes className="w-4 h-4" />
      </button>

      {/* 5. Calendar */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Calendar & Visits"
      >
        <Calendar className="w-4 h-4" />
      </button>

      {/* 6. Corporate 360 (User Icon - ACTIVE ROUTE) */}
      <button
        onClick={() => navigate('#/c360/00001715')}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative ${
          isC360Active
            ? 'bg-amber-400/20 text-amber-400 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
        }`}
        title="Corporate 360"
      >
        <User className="w-4 h-4" />
        {isC360Active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r" />
        )}
      </button>

      {/* 7. Activity */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Activity Stream"
      >
        <Activity className="w-4 h-4" />
      </button>

      {/* 8. Crown / Deals */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Opportunities & Pipeline"
      >
        <Crown className="w-4 h-4" />
      </button>

      {/* 9. Documents */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Document Management System"
      >
        <FileText className="w-4 h-4" />
      </button>

      {/* 10. Analytics */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Analytics & Profitability"
      >
        <BarChart2 className="w-4 h-4" />
      </button>

      {/* 11. Hand / Engagements */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Client Engagements"
      >
        <HandMetal className="w-4 h-4" />
      </button>

      {/* 12. Worklist (List Icon - ACTIVE ROUTE) */}
      <button
        onClick={() => navigate('#/worklist')}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative ${
          isWorklistActive
            ? 'bg-amber-400/20 text-amber-400 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
        }`}
        title="My KYC Worklist"
      >
        <ListTodo className="w-4 h-4" />
        {isWorklistActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r" />
        )}
      </button>

      {/* 13. Pulse */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
        title="Pulse Feed"
      >
        <Radio className="w-4 h-4" />
      </button>
    </aside>
  );
};
