import React from 'react';
import { useMining } from '../context/MiningContext';
import { PageView } from '../types';
import {
  LayoutDashboard,
  CloudFog,
  Radio,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, alerts } = useMining();
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fog-detection', label: 'Fog AI', icon: <CloudFog className="w-4 h-4" /> },
    { id: 'sensors', label: 'Sensors', icon: <Radio className="w-4 h-4" /> },
    { id: 'vehicle-location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: unacknowledgedCount },
  ];

  return (
    <nav className="md:hidden sticky bottom-0 z-40 w-full bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-1 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition min-h-[44px] ${
              isActive
                ? 'text-amber-400 font-semibold bg-amber-500/10'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[8px] font-mono font-bold bg-rose-500 text-white shadow-sm">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="mt-0.5 truncate max-w-[64px]">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
