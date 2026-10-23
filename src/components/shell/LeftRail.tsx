import React from 'react';
import {
  Search,
  Link2,
  History,
  Boxes,
  ClipboardList,
  Calendar,
  CalendarCheck,
  AlertCircle,
  Contact,
  ThumbsUp,
  MessageSquareText,
  Megaphone,
  Mails,
  LucideIcon,
} from 'lucide-react';
import { useRouter } from '../../router/AppRouter';

interface RailItem {
  icon: LucideIcon;
  title: string;
  hash?: string;
  route?: 'kyc' | 'c360' | 'worklist';
}

const RAIL_ITEMS: RailItem[] = [
  { icon: Search, title: 'Quick Search' },
  { icon: Link2, title: 'Quick Links' },
  { icon: History, title: 'Recent Items' },
  { icon: Boxes, title: 'Products', hash: '#/worklist', route: 'worklist' },
  { icon: ClipboardList, title: 'KYC Case Details', hash: '#/kyc/KYC-2026-0150/initiation', route: 'kyc' },
  { icon: Calendar, title: 'Calendar' },
  { icon: CalendarCheck, title: 'Activities' },
  { icon: AlertCircle, title: 'Alerts' },
  { icon: Contact, title: 'Corporate 360 View', hash: '#/c360/00001715', route: 'c360' },
  { icon: ThumbsUp, title: 'Opportunities' },
  { icon: MessageSquareText, title: 'Conversations' },
  { icon: Megaphone, title: 'Campaigns' },
  { icon: Mails, title: 'Mailbox' },
];

export const LeftRail: React.FC = () => {
  const { currentRoute, navigate } = useRouter();

  return (
    <aside className="w-[77px] bg-black flex flex-col items-center pt-1 gap-[13px] shrink-0 z-20 select-none overflow-y-auto scrollbar-none">
      {RAIL_ITEMS.map(({ icon: Icon, title, hash, route }) => {
        const isActive = !!route && currentRoute.route === route;
        return (
          <button
            key={title}
            onClick={hash ? () => navigate(hash) : undefined}
            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white transition-colors ${
              isActive ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
            title={title}
          >
            <Icon className="w-[21px] h-[21px]" strokeWidth={1.75} />
          </button>
        );
      })}
    </aside>
  );
};
