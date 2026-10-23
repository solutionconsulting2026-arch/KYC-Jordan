import React from 'react';
import {
  Search,
  Phone,
  Link2,
  FileText,
  Filter,
  User,
  Crown,
  Calendar,
  CreditCard,
  PieChart,
  Settings,
} from 'lucide-react';
import { useRouter } from '../../router/AppRouter';

export const LeftRail: React.FC = () => {
  const { currentRoute, navigate } = useRouter();

  const isC360Active = currentRoute.route === 'c360';
  const isKycActive = currentRoute.route === 'kyc';

  return (
    <aside className="w-[50px] bg-[#0D0E12] border-r border-white/10 flex flex-col items-center py-2.5 gap-1 shrink-0 z-20 select-none">
      {/* 1. Search */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Quick Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* 2. Phone / Calls */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Telephony & Communication"
      >
        <Phone className="w-4 h-4" />
      </button>

      {/* 3. Link */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Quick Links"
      >
        <Link2 className="w-4 h-4" />
      </button>

      {/* 4. Document / Cases */}
      <button
        onClick={() => navigate('#/kyc/KYC-2026-0150/initiation')}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative ${
          isKycActive
            ? 'text-white bg-white/15'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        title="KYC Case Details"
      >
        <FileText className="w-4 h-4" />
        {isKycActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#1877F2] rounded-r" />
        )}
      </button>

      {/* 5. Filter / Funnel */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Filter Records"
      >
        <Filter className="w-4 h-4" />
      </button>

      {/* 6. Corporate 360 / User */}
      <button
        onClick={() => navigate('#/c360/00001715')}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative ${
          isC360Active
            ? 'text-white bg-white/15'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        title="Corporate 360 View"
      >
        <User className="w-4 h-4" />
        {isC360Active && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#1877F2] rounded-r" />
        )}
      </button>

      {/* 7. Crown / Opportunities */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Key Opportunities"
      >
        <Crown className="w-4 h-4" />
      </button>

      {/* 8. Calendar */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Calendar & Visits"
      >
        <Calendar className="w-4 h-4" />
      </button>

      {/* 9. Badge / Identity */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Identity & Verifications"
      >
        <CreditCard className="w-4 h-4" />
      </button>

      {/* 10. Analytics / Pie Chart */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Analytics & Reports"
      >
        <PieChart className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      {/* 11. Settings at bottom */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors mb-1"
        title="Settings & Administration"
      >
        <Settings className="w-4 h-4" />
      </button>
    </aside>
  );
};
