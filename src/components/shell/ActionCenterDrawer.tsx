import React from 'react';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';

interface ActionCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActionCenterDrawer: React.FC<ActionCenterDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useKycStore();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const handleNotificationClick = (id: string, link: string) => {
    markNotificationRead(id);
    navigate(link);
    onClose();
  };

  const getIcon = (type: string) => {
    if (type.includes('escalation')) {
      return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
    }
    if (type.includes('reminder') || type.includes('pending')) {
      return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (type.includes('approved') || type.includes('accepted')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
    return <Bell className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2329]/50 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 border-l border-[#CFD3D8] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2B2E35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-[15px]">Action Center</h3>
            <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
              {notifications.length} alerts
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#5B616B] text-xs">
              No notifications currently in your Action Center.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.link)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:border-slate-400 flex items-start gap-3 ${
                  notif.read
                    ? 'bg-white border-slate-200 text-[#1F2329]'
                    : 'bg-amber-50/50 border-amber-200 text-[#1F2329] shadow-xs'
                }`}
              >
                {getIcon(notif.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-snug font-medium">{notif.text}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-[#5B616B]">
                    <span>{notif.at}</span>
                    <span className="inline-flex items-center gap-1 text-[#1F5BD8] font-semibold hover:underline">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
