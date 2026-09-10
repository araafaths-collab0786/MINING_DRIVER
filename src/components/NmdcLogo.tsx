import React from 'react';

export const NmdcLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dim} ${className}`}>
      {/* Industrial NMDC Emblem Badge */}
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-neutral-900 p-0.5 shadow-md shadow-amber-950/40 border border-amber-500/30">
        <div className="w-full h-full rounded-[6px] bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle background industrial gear tooth accent */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
          
          <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg">
            {/* Gear ring */}
            <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" className="text-amber-500/70" />
            {/* Mining Pickaxes crossed */}
            <path d="M12 10 L24 26 M24 10 L12 26" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
            {/* Central Mineral Diamond */}
            <polygon points="18,12 23,18 18,24 13,18" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="1" />
            {/* Core dot */}
            <circle cx="18" cy="18" r="2.5" fill="#f8fafc" />
          </svg>
        </div>
      </div>
    </div>
  );
};
