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
  LucideIcon,
} from 'lucide-react';
import { useRouter } from '../../router/AppRouter';

interface RailItem {
  icon: LucideIcon;
  title: string;
  hash?: string;
  route?: 'kyc' | 'c360';
}

const RAIL_ITEMS: RailItem[] = [
  { icon: Search, title: 'Quick Search' },
  { icon: Phone, title: 'Telephony & Communication' },
  { icon: Link2, title: 'Quick Links' },
  { icon: FileText, title: 'KYC Case Details', hash: '#/kyc/KYC-2026-0150/initiation', route: 'kyc' },
  { icon: Filter, title: 'Filter Records' },
  { icon: User, title: 'Corporate 360 View', hash: '#/c360/00001715', route: 'c360' },
  { icon: Crown, title: 'Key Opportunities' },
  { icon: Calendar, title: 'Calendar & Visits' },
  { icon: CreditCard, title: 'Identity & Verifications' },
  { icon: PieChart, title: 'Analytics & Reports' },
];

const railButtonClass = (isActive: boolean) =>
  `w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white transition-colors ${
    isActive ? 'bg-white/15' : 'hover:bg-white/10'
  }`;

export const LeftRail: React.FC = () => {
  const { currentRoute, navigate } = useRouter();

  return (
    <aside className="w-[77px] bg-black flex flex-col items-center pt-1 pb-3 gap-[13px] shrink-0 z-20 select-none overflow-y-auto scrollbar-none">
      {RAIL_ITEMS.map(({ icon: Icon, title, hash, route }) => (
        <button
          key={title}
          onClick={hash ? () => navigate(hash) : undefined}
          className={railButtonClass(!!route && currentRoute.route === route)}
          title={title}
        >
          <Icon className="w-[21px] h-[21px]" strokeWidth={1.75} />
        </button>
      ))}

      <div className="flex-1" />

      <button className={railButtonClass(false)} title="Settings & Administration">
        <Settings className="w-[21px] h-[21px]" strokeWidth={1.75} />
      </button>
    </aside>
  );
};
