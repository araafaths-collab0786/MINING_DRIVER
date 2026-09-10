import React from 'react';
import { useMining } from '../context/MiningContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  CloudFog,
  Eye,
  Radio,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';

export const GraphsAndAiFogPage: React.FC = () => {
  const {
    isSystemOn,
    timeSeriesData,
    fogProbability,
    fogClassification,
    fogRecommendation,
    vehicleSafetyScore,
    safetyScoreStatus,
    safetyActionRecommendation,
    currentVehicle,
    telemetry,
  } = useMining();

  // Color mapping for Fog classification
  const getFogColor = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/50';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'LOW':
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
      case 'CLEAR':
      default:
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
    }
  };

  // Custom Dark Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-700 shadow-xl font-mono text-xs space-y-1">
          <p className="text-neutral-400">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="font-bold">
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
              REAL-TIME TELEMETRY GRAPHS & AI FOG ENGINE
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Dynamically streaming sensor line charts + neural fog dispersion model for Bailadila Iron Ore Mines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Graph Updates:</span>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isSystemOn
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/40'
            }`}
          >
            {isSystemOn ? 'STREAMING ACTIVE' : 'STREAMING PAUSED (SYSTEM OFF)'}
          </span>
        </div>
      </div>

      {/* 2 PROMINENT AI CARDS: AI FOG DETECTION & VEHICLE SAFETY SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. PROMINENT CARD: *AI FOG DETECTION* */}
        {/* Requirements:
            Create a prominent card called: *AI FOG DETECTION*
            Display:
            i. Current fog probability
            ii. Fog classification:
              * CLEAR
              * LOW
              * MODERATE
              * HIGH
              * CRITICAL
            iii. AI recommendation
            Example:
            Fog Probability: 78%
            Status: HIGH FOG
            Recommendation: REDUCE VEHICLE SPEED
        */}
        <div className="bg-neutral-900/95 rounded-2xl border-2 border-cyan-500/40 p-6 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CloudFog className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-mono font-extrabold text-white tracking-widest uppercase">
                  AI FOG DETECTION
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  Multivariate Transmissometer & Dew Point Neural Classifier
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${getFogColor(fogClassification)}`}>
              {fogClassification} FOG
            </span>
          </div>

          <div className="space-y-4">
            {/* i. Current fog probability */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  Fog Probability:
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400">
                  {isSystemOn ? `${fogProbability}%` : '--'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fogProbability >= 85
                      ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                      : fogProbability >= 70
                      ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'
                      : fogProbability >= 45
                      ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${isSystemOn ? fogProbability : 0}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                <span>0% (CLEAR)</span>
                <span>45% (MODERATE)</span>
                <span>70% (HIGH)</span>
                <span>100% (CRITICAL)</span>
              </div>
            </div>

            {/* ii. Fog Classification Scale */}
            <div>
              <span className="text-[11px] font-mono text-neutral-400 block mb-1.5 uppercase">
                Fog Classification Hierarchy:
              </span>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-center">
                {(['CLEAR', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((lvl) => {
                  const isActive = fogClassification === lvl;
                  return (
                    <div
                      key={lvl}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition ${
                        isActive
                          ? getFogColor(lvl) + ' ring-1 ring-white/20'
                          : 'bg-neutral-950 text-neutral-600 border-neutral-850'
                      }`}
                    >
                      {lvl}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* iii. AI recommendation Example layout:
                Fog Probability: 78%
                Status: HIGH FOG
                Recommendation: REDUCE VEHICLE SPEED
            */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-cyan-500/30 space-y-1.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Status:</span>
                <span className="text-amber-400 font-bold uppercase">
                  {fogClassification} FOG
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Recommendation:</span>
                <span className="text-white font-bold text-sm tracking-wide">
                  {fogRecommendation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. VEHICLE SAFETY SCORE (0 - 100) */}
        {/* Requirements:
            Vehicle Safety Score (0 - 100)
            Visibility + Vehicle Speed + Radar Distance + Obstacle Detection + Road/Hazard Zone + Rain + Traffic Density
            If the Vehicle Safety Score is:
            0–30    SAFE
            31–60   CAUTION
            61–80   HIGH RISK
            81–100  CRITICAL

            It should display like:
            Example:
            VEHICLE DMP-104

            RISK SCORE: 87
            STATUS: CRITICAL

            Visibility       25 m
            Speed            43 km/h
            Radar Distance   16 m
            Fog Probability  92%
            Obstacle         DETECTED

            ACTION:
            REDUCE SPEED
            MAINTAIN SAFE DISTANCE
        */}
        <div className="bg-neutral-900/95 rounded-2xl border-2 border-rose-500/40 p-6 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-mono font-extrabold text-white tracking-widest uppercase">
                  VEHICLE SAFETY SCORE (0 - 100)
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  Fused Multi-Factor Real-Time Risk Algorithm
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-neutral-400 block">SCALE MATRIX</span>
              <span className="text-xs font-bold text-rose-400">0-100 INDEX</span>
            </div>
          </div>

          {/* EXACT DISPLAY FORMAT AS REQUESTED */}
          <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-4 font-mono">
            {/* Header: VEHICLE DMP-104 */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-xs text-neutral-400 block">TARGET</span>
                <span className="text-xl font-extrabold text-amber-400">
                  VEHICLE {currentVehicle.number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">RISK SCORE:</span>
                <span className="text-3xl font-extrabold text-rose-400">
                  {isSystemOn ? vehicleSafetyScore : '--'}
                </span>
              </div>
            </div>

            {/* STATUS: CRITICAL */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">STATUS:</span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-extrabold border ${
                  safetyScoreStatus === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/60 animate-pulse'
                    : safetyScoreStatus === 'HIGH RISK'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/60'
                    : safetyScoreStatus === 'CAUTION'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60'
                }`}
              >
                {safetyScoreStatus}
              </span>
            </div>

            {/* Parameter Checklist */}
            <div className="space-y-1.5 text-xs text-neutral-300 pt-1 border-t border-neutral-850">
              <div className="flex justify-between py-0.5 border-b border-neutral-900">
                <span className="text-neutral-400">Visibility</span>
                <span className="font-bold text-cyan-400">{telemetry.visibility} m</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-neutral-900">
                <span className="text-neutral-400">Speed</span>
                <span className="font-bold text-white">{telemetry.vehicleSpeed} km/h</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-neutral-900">
                <span className="text-neutral-400">Radar Distance</span>
                <span className="font-bold text-amber-400">{telemetry.radarDistance} m</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-neutral-900">
                <span className="text-neutral-400">Fog Probability</span>
                <span className="font-bold text-cyan-400">{fogProbability}%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-neutral-400">Obstacle</span>
                <span className={`font-bold ${telemetry.obstacleDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {telemetry.obstacleDetected ? 'DETECTED' : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* ACTION: REDUCE SPEED / MAINTAIN SAFE DISTANCE */}
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs">
              <div className="text-rose-400 font-bold mb-1">ACTION:</div>
              <div className="font-extrabold text-white text-sm tracking-wide whitespace-pre-line">
                {safetyActionRecommendation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. REAL-TIME GRAPHS SECTION */}
      {/* Requirements:
          i. Visibility vs Time line chart
          ii. Fog Level vs Time line chart
          iii. Radar Distance vs Time line chart
          iv. Vehicle Speed vs Time line chart
          Charts should update dynamically when the system is ON and stop when the system is OFF.
      */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              1. REAL-TIME SENSOR TELEMETRY CHARTS
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            Recharts &bull; Continuous 15-Point Sampling Window
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* i. Visibility vs Time line chart */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase">
                  i. Visibility vs Time (meters)
                </span>
              </div>
              <span className="text-cyan-400 font-bold">
                Current: {telemetry.visibility} m
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="time" stroke="#737373" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 150]} stroke="#737373" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="visibility"
                    name="Visibility (m)"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#06b6d4' }}
                    activeDot={{ r: 6, fill: '#67e8f9' }}
                    isAnimationActive={isSystemOn}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span>Threshold Hazard Line: &lt; 35m</span>
              <span className="text-cyan-400">Sensor: Optical Scatter Transmissometer</span>
            </div>
          </div>

          {/* ii. Fog Level vs Time line chart */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <CloudFog className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white uppercase">
                  ii. Fog Level vs Time (%)
                </span>
              </div>
              <span className="text-purple-400 font-bold">
                Current: {fogProbability}%
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="time" stroke="#737373" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#737373" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="fogLevel"
                    name="Fog Density (%)"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#a855f7' }}
                    activeDot={{ r: 6, fill: '#c084fc' }}
                    isAnimationActive={isSystemOn}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span>Critical Fog Limit: &gt; 80%</span>
              <span className="text-purple-400">Bailadila Atmospheric Dew Core</span>
            </div>
          </div>

          {/* iii. Radar Distance vs Time line chart */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase">
                  iii. Radar Distance vs Time (meters)
                </span>
              </div>
              <span className="text-amber-400 font-bold">
                Current: {telemetry.radarDistance} m
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="time" stroke="#737373" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 60]} stroke="#737373" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="radarDistance"
                    name="Radar Range (m)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#f59e0b' }}
                    activeDot={{ r: 6, fill: '#fbbf24' }}
                    isAnimationActive={isSystemOn}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span>Collision Danger Zone: &lt; 20m</span>
              <span className="text-amber-400">77 GHz FMCW Front Beam</span>
            </div>
          </div>

          {/* iv. Vehicle Speed vs Time line chart */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white uppercase">
                  iv. Vehicle Speed vs Time (km/h)
                </span>
              </div>
              <span className="text-emerald-400 font-bold">
                Current: {telemetry.vehicleSpeed} km/h
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="time" stroke="#737373" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 55]} stroke="#737373" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="vehicleSpeed"
                    name="Speed (km/h)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 6, fill: '#34d399' }}
                    isAnimationActive={isSystemOn}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span>Monsoon Governed Limit: 25 km/h</span>
              <span className="text-emerald-400">J1939 CAN Engine Tachometer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
