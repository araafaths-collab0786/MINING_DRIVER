import React from 'react';
import { useMining } from '../context/MiningContext';
import { PageView } from '../types';
import {
  LayoutDashboard,
  CloudFog,
  Radio,
  MapPin,
  AlertTriangle,
  Truck,
  TrendingUp,
} from 'lucide-react';

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    alerts,
    isSystemOn,
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
  } = useMining();

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fog-detection', label: 'Fog Detection', icon: <CloudFog className="w-4 h-4" /> },
    { id: 'sensors', label: 'Sensors', icon: <Radio className="w-4 h-4" /> },
    { id: 'vehicle-location', label: 'Vehicle Location', icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-neutral-900/90 border-r border-neutral-800 hidden md:flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Active Monitored Vehicle Quick Switcher */}
        <div className="bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800/80 shadow-inner">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1.5 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              Target Vehicle
            </span>
            <span className="text-amber-400 font-semibold">{selectedVehicleId}</span>
          </div>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition cursor-pointer"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} - {v.name} ({v.driverName})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Navigation Control
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-amber-400' : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Industrial Footer Status Card */}
      <div className="space-y-2 pt-3 border-t border-neutral-800/80">
        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-[11px] font-mono space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span>TELEMETRY:</span>
            <span className={isSystemOn ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {isSystemOn ? 'STREAMING' : 'SUSPENDED'}
            </span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>SECTOR:</span>
            <span className="text-cyan-400">KIRANDUL BENCH 6</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>ELEVATION:</span>
            <span className="text-neutral-300">1,142 m MSL</span>
          </div>
        </div>

        <button
          onClick={() => setActivePage('landing')}
          className="w-full py-1.5 px-2 rounded-lg bg-neutral-800/40 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-[11px] font-medium transition text-center flex items-center justify-center gap-1"
        >
          <TrendingUp className="w-3 h-3 text-amber-500" />
          <span>View Landing Overview</span>
        </button>
      </div>
    </aside>
  );
};
