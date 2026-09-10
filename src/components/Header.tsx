import React from 'react';
import { useMining } from '../context/MiningContext';
import { NmdcLogo } from './NmdcLogo';
import { Power, LogOut, ShieldAlert, Radio, User, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isSystemOn,
    setIsSystemOn,
    currentUser,
    logout,
    activePage,
    setActivePage,
  } = useMining();

  const isLanding = activePage === 'landing';
  const isLogin = activePage === 'login';

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-xl shadow-black/40">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: NMDC Logo + Title + Subtitle */}
        <div 
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
          title="Click to visit MININGDRIVER overview"
        >
          <NmdcLogo size="md" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-wider text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400 font-mono">
                MININGDRIVER
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                NMDC LIMITED
              </span>
            </div>
            <p className="hidden xs:block text-[10px] sm:text-xs text-neutral-400 truncate max-w-[180px] sm:max-w-md font-medium tracking-tight">
              Bailadila Iron Ore Mines AI & IoT Low-Visibility Safety System
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Landing / Control Room Navigation shortcut if on landing */}
          {isLanding ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('login')}
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-mono tracking-tight shadow-md shadow-amber-950/40 transition flex items-center gap-1.5"
              >
                <span>Login to App</span>
              </button>
            </div>
          ) : isLogin ? (
            <button
              onClick={() => setActivePage('landing')}
              className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Overview</span>
            </button>
          ) : (
            <>
              {/* LARGE ON/OFF TOGGLE SWITCH */}
              {/* Requirements:
                  - Large ON/OFF toggle switch on right
                  - Don't display the word ONLINE
                  - When ON: Green Indicator, Text: SYSTEM ON, Enable Live Sensor Monitoring
                  - When OFF: Red Indicator, Text: SYSTEM OFF, Show Sensors as inactive
              */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsSystemOn((prev) => !prev)}
                  className={`group relative flex items-center gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border transition-all duration-300 select-none shadow-lg ${
                    isSystemOn
                      ? 'bg-emerald-950/60 border-emerald-500/50 shadow-emerald-950/30 hover:bg-emerald-900/60'
                      : 'bg-rose-950/60 border-rose-500/50 shadow-rose-950/30 hover:bg-rose-900/60'
                  }`}
                  aria-pressed={isSystemOn}
                  title={isSystemOn ? 'Click to deactivate sensor telemetry' : 'Click to activate sensor telemetry'}
                >
                  {/* Glowing Status Indicator Bulb */}
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSystemOn ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        isSystemOn
                          ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                          : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                      }`}
                    />
                  </span>

                  {/* Switch Pill Thumb */}
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                      isSystemOn ? 'bg-emerald-500 justify-end' : 'bg-rose-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>

                  {/* Strictly compliant text: "SYSTEM ON" or "SYSTEM OFF" (NEVER displays "ONLINE") */}
                  <span
                    className={`font-mono text-xs sm:text-sm font-bold tracking-wider ${
                      isSystemOn ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isSystemOn ? 'SYSTEM ON' : 'SYSTEM OFF'}
                  </span>

                  <Power
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isSystemOn ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  />
                </button>
              </div>

              {/* User Role Badge (Desktop) */}
              {currentUser && (
                <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <div className="flex flex-col text-left">
                    <span className="text-neutral-200 font-medium leading-none">{currentUser.name}</span>
                    <span className="text-[10px] text-neutral-400 leading-tight">
                      {currentUser.role} {currentUser.vehicleNumber ? `• ${currentUser.vehicleNumber}` : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* SIGNOUT BUTTON */}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-neutral-600 text-xs sm:text-sm font-medium transition shadow-sm"
                title="Sign out of MININGDRIVER"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-400" />
                <span className="hidden sm:inline">Signout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inactive System Notification Bar when SYSTEM OFF */}
      {!isLanding && !isLogin && !isSystemOn && (
        <div className="w-full bg-rose-950/80 border-t border-rose-800/60 px-4 py-1 text-center text-xs font-mono font-semibold text-rose-300 flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>SENSORS INACTIVE: Live mmWave radar, LiDAR telemetry and AI collision risk inference paused. Toggle SYSTEM ON to resume.</span>
        </div>
      )}
    </header>
  );
};
