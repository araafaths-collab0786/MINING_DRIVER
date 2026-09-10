import React from 'react';
import { useMining } from '../context/MiningContext';
import {
  Eye,
  Truck,
  AlertOctagon,
  Clock,
  Radio,
  Thermometer,
  Droplets,
  CloudRain,
  MapPin,
  Gauge,
  ShieldAlert,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    isSystemOn,
    telemetry,
    vehicles,
    currentVehicle,
    alerts,
    setActivePage,
    fogProbability,
    fogClassification,
    vehicleSafetyScore,
    safetyScoreStatus,
    simFogIntensity,
    setSimFogIntensity,
    simRainActive,
    setSimRainActive,
    simObstacleActive,
    setSimObstacleActive,
    simVehicleSpeed,
    setSimVehicleSpeed,
  } = useMining();

  // Fleet stats
  const totalFleet = vehicles.length + 19; // 24 total HEMM across Kirandul complex
  const movingCount = vehicles.filter((v) => v.status === 'HAULING').length + 14;
  const stoppedCount = totalFleet - movingCount;

  // Collision risk vehicles
  const criticalRiskVehicles = vehicles.filter((v) => v.safetyStatus === 'CRITICAL').length;
  const highRiskVehicles = vehicles.filter((v) => v.safetyStatus === 'HIGH RISK').length;
  const totalElevatedRisk = criticalRiskVehicles + highRiskVehicles;

  // Visibility condition styling:
  // (green dot) GOOD (> 80m) / (yellow dot) MODERATE (35 - 80m) / (red dot) POOR (< 35m)
  const getVisibilityBadge = (vis: number) => {
    if (vis > 80) {
      return {
        label: 'GOOD',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        dotColor: 'bg-emerald-500',
        severity: 'Nominal Visibility',
      };
    } else if (vis >= 35) {
      return {
        label: 'MODERATE',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        dotColor: 'bg-amber-500',
        severity: 'Cautious Low-Vis',
      };
    } else {
      return {
        label: 'POOR',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        dotColor: 'bg-rose-500',
        severity: 'CRITICAL FOG (< 35m)',
      };
    }
  };

  const visCondition = getVisibilityBadge(telemetry.visibility);

  return (
    <div className="space-y-6">
      {/* Top Banner / Tactical State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-mono text-white">
                Bailadila Terracotta Haul Corridor
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-cyan-400 border border-neutral-700">
                PIT 14 BENCH 6
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              FMCW 77GHz mmWave + Optical LiDAR Multi-Sensor Telemetry Active
            </p>
          </div>
        </div>

        {/* Quick Target Vehicle badge */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right font-mono text-xs hidden sm:block">
            <span className="text-neutral-400 block text-[10px]">MONITORED UNIT</span>
            <span className="text-amber-400 font-bold">{currentVehicle.number} • {currentVehicle.name}</span>
          </div>
          <button
            onClick={() => setActivePage('vehicle-location')}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 hover:border-amber-500/40 text-xs font-mono transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track on GPS</span>
          </button>
        </div>
      </div>

      {/* 4 DASHBOARD OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: VISIBILITY */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 relative overflow-hidden shadow-lg shadow-black/30">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              Visibility
            </span>
            <span className="text-[10px] font-mono text-neutral-400">OPTICAL SCATTER</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              {isSystemOn ? `${telemetry.visibility}` : '--'}
            </span>
            <span className="text-sm font-mono text-neutral-400">meters</span>
          </div>

          {/* Visibility condition with green / yellow / red dot */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${visCondition.dotColor} ${isSystemOn && telemetry.visibility < 35 ? 'animate-ping' : ''}`} />
              <span className={`text-xs font-mono font-bold ${visCondition.color}`}>
                {isSystemOn ? visCondition.label : 'STANDBY'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {isSystemOn ? visCondition.severity : 'Sensor Inactive'}
            </span>
          </div>
        </div>

        {/* CARD 2: ACTIVE FLEET */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              Active Fleet
            </span>
            <span className="text-[10px] font-mono text-neutral-400">HEMM UNITS</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
              {totalFleet}
            </span>
            <span className="text-xs font-mono text-neutral-400">Dumpers & Shovels</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {movingCount} Moving
            </span>
            <span className="text-neutral-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-600" />
              {stoppedCount} Stopped/Loading
            </span>
          </div>
        </div>

        {/* CARD 3: COLLISION RISK */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Collision Risk
            </span>
            <span className="text-[10px] font-mono text-neutral-400">ELEVATED VECTORS</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400">
              {isSystemOn ? totalElevatedRisk : 0}
            </span>
            <span className="text-xs font-mono text-neutral-400">vehicles at risk</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs font-mono">
            {/* For critical alerts: mark it with red dot */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-bold">
                {criticalRiskVehicles} Critical Alerts
              </span>
            </div>
            <span className="text-amber-400">
              {highRiskVehicles} High Risk
            </span>
          </div>
        </div>

        {/* CARD 4: HAULAGE EFFICIENCY */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              Haulage Efficiency
            </span>
            <span className="text-[10px] font-mono text-neutral-400">DISPATCH SCADA</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              21.4
            </span>
            <span className="text-xs font-mono text-neutral-400">min cycle time</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs font-mono">
            <span className="text-neutral-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              94.8% Availability
            </span>
            <span className="text-cyan-400 font-semibold">ON SCHEDULE</span>
          </div>
        </div>
      </div>

      {/* LIVE SENSOR DATA SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h3 className="text-lg font-bold font-mono text-white tracking-wider uppercase">
                LIVE SENSOR DATA
              </h3>
            </div>
            <p className="text-xs font-mono text-neutral-400">
              Real-time in-cab telemetry bus from {currentVehicle.number} ({currentVehicle.name})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('fog-detection')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>View AI Fog Analysis & Risk Score</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 Sensor Grid Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Radar Distance */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" />
                1. Radar Distance
              </span>
              <span className="text-[10px] text-amber-500">77 GHz FMCW</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                !isSystemOn ? 'text-neutral-500' : telemetry.radarDistance < 20 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {isSystemOn ? `${telemetry.radarDistance} m` : 'INACTIVE'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              {isSystemOn
                ? telemetry.radarDistance < 20
                  ? '⚠️ CLOSING DISTANCE HAZARD'
                  : 'Safe following envelope'
                : 'Sensor disabled'}
            </p>
          </div>

          {/* 2. Visibility */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                2. Visibility
              </span>
              <span className="text-[10px] text-cyan-400">Transmissometer</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                !isSystemOn ? 'text-neutral-500' : telemetry.visibility < 35 ? 'text-rose-400' : 'text-cyan-400'
              }`}>
                {isSystemOn ? `${telemetry.visibility} m` : 'INACTIVE'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              {isSystemOn
                ? telemetry.visibility < 35
                  ? 'CRITICAL MONSOON FOG'
                  : 'Adequate haul road visual'
                : 'Sensor disabled'}
            </p>
          </div>

          {/* 3. Temperature */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-neutral-700 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-orange-400" />
                3. Temperature
              </span>
              <span className="text-[10px] text-neutral-400">SHT35 Probe</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-neutral-200">
                {isSystemOn ? `${telemetry.temperature} °C` : '--'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Ambient bench atmospheric reading
            </p>
          </div>

          {/* 4. Humidity */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" />
                4. Humidity
              </span>
              <span className="text-[10px] text-blue-400">Capacitive</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-400">
                {isSystemOn ? `${telemetry.humidity} %` : '--'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              {isSystemOn && telemetry.humidity > 90
                ? 'Dew point saturation reached'
                : 'Normal ambient humidity'}
            </p>
          </div>

          {/* 5. Rain probability with rain detection */}
          {/* Requirement:
              "Show possibilities and if rain is detected through weather then measure it and display the measurement first and then possibilities like 'LOW', 'MODERATE', 'HIGH'. if not display as 'LOW' based on Humidity Sensor and Google Weather"
          */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                5. Rain Probability & Detection
              </span>
              <span className="text-[10px] text-neutral-400">Weather API + IoT</span>
            </div>

            <div className="flex flex-col">
              {isSystemOn ? (
                telemetry.rainMmPerHour > 0 ? (
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">
                      {telemetry.rainMmPerHour} mm/hr
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400">Probability:</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        telemetry.rainProbability === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : telemetry.rainProbability === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {telemetry.rainProbability}
                      </span>
                      <span className="text-cyan-300 text-[10px]">• RAIN DETECTED</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-400">
                      0.0 mm/hr
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400">Probability:</span>
                      <span className="font-bold px-1.5 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        LOW
                      </span>
                      <span className="text-neutral-400 text-[10px]">• NO RAIN</span>
                    </div>
                  </div>
                )
              ) : (
                <span className="text-2xl font-mono font-bold text-neutral-500">INACTIVE</span>
              )}
            </div>
            <p className="text-[10px] font-mono text-neutral-400 truncate">
              Fused from capacitive rain sensor + Google Weather
            </p>
          </div>

          {/* 6. GPS Coordinates */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                6. GPS Coordinates
              </span>
              <span className="text-[10px] text-amber-400">RTK GNSS</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-mono font-bold text-amber-400">
                18°42′00″N 81°13′10″E
              </div>
              <div className="text-xs font-mono text-neutral-300">
                {isSystemOn ? `${telemetry.latitude.toFixed(4)}°N, ${telemetry.longitude.toFixed(4)}°E` : '--'}
              </div>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Bailadila Mine Bench 6 (Elev. 1,142m)
            </p>
          </div>

          {/* 7. Vehicle Speed */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                7. Vehicle Speed
              </span>
              <span className="text-[10px] text-neutral-400">CAN-Bus J1939</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                !isSystemOn ? 'text-neutral-500' : telemetry.vehicleSpeed > 35 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {isSystemOn ? `${telemetry.vehicleSpeed} km/h` : 'INACTIVE'}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                (Limit: 25 km/h)
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              {isSystemOn && telemetry.vehicleSpeed > 25
                ? '⚠️ EXCEEDING MONSOON GOVERNOR'
                : 'Within safe haul speed'}
            </p>
          </div>

          {/* 8. Obstacle Detection */}
          <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4 space-y-2 hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                8. Obstacle Detection
              </span>
              <span className="text-[10px] text-rose-400">mmWave + LiDAR</span>
            </div>
            <div>
              {isSystemOn ? (
                telemetry.obstacleDetected ? (
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      DETECTED
                    </span>
                    <p className="text-xs font-mono text-neutral-200 truncate">
                      {telemetry.obstacleType} [{telemetry.obstacleDistance}m]
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                      CLEAR PATH
                    </span>
                    <p className="text-xs font-mono text-neutral-400">No hazard in 60m cone</p>
                  </div>
                )
              ) : (
                <span className="text-2xl font-mono font-bold text-neutral-500">INACTIVE</span>
              )}
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Active forward collision envelope
            </p>
          </div>
        </div>
      </section>

      {/* QUICK GLANCE: AI FOG STATUS & VEHICLE SAFETY SCORE CARD */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI FOG SUMMARY */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="font-mono font-bold text-base text-white">
                AI FOG CLASSIFICATION
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${
              fogClassification === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : fogClassification === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
            }`}>
              {fogClassification} FOG ({fogProbability}%)
            </span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>FOG PROBABILITY</span>
              <span className="text-cyan-400 font-bold">{fogProbability}%</span>
            </div>
            {/* Progress meter */}
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fogProbability > 75 ? 'bg-rose-500' : fogProbability > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${fogProbability}%` }}
              />
            </div>
            <p className="text-xs font-mono text-neutral-300 pt-1 leading-relaxed">
              <span className="text-amber-400 font-semibold">AI ADVISORY: </span>
              Visibility is currently {telemetry.visibility}m on hilltop ramps. Low-visibility fog strobes & mmWave radar hazard alerts active.
            </p>
          </div>

          <button
            onClick={() => setActivePage('fog-detection')}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-mono font-medium border border-neutral-700 transition flex items-center justify-center gap-1.5"
          >
            <span>Open Dedicated AI Fog & Real-Time Graphs Page</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* VEHICLE SAFETY SCORE PREVIEW */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <h3 className="font-mono font-bold text-base text-white">
                VEHICLE SAFETY SCORE (0 - 100)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {currentVehicle.number}
            </span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-neutral-400">CURRENT RISK SCORE</span>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-rose-400">
                {isSystemOn ? vehicleSafetyScore : '--'}
              </div>
              <span className={`inline-block text-xs font-mono font-bold px-2 py-0.5 rounded ${
                safetyScoreStatus === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : safetyScoreStatus === 'HIGH RISK'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                STATUS: {safetyScoreStatus}
              </span>
            </div>

            <div className="text-right space-y-1 text-xs font-mono">
              <div className="text-neutral-400">Visibility: <span className="text-white font-bold">{telemetry.visibility} m</span></div>
              <div className="text-neutral-400">Speed: <span className="text-white font-bold">{telemetry.vehicleSpeed} km/h</span></div>
              <div className="text-neutral-400">Radar: <span className="text-white font-bold">{telemetry.radarDistance} m</span></div>
              <div className="text-neutral-400">Obstacle: <span className="text-rose-400 font-bold">{telemetry.obstacleDetected ? 'DETECTED' : 'CLEAR'}</span></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
            <span className="font-bold">RECOMMENDED ACTION:</span> REDUCE SPEED • MAINTAIN SAFE DISTANCE &gt; 45M
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMONSTRATION & SIH EVALUATION CONTROLS */}
      <section className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              Smart India Hackathon (SIH) Live Simulation Knobs
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
            Tweak conditions to test real-time warning alerts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Knob 1: Fog Density */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs font-mono text-neutral-300">
              <span>Fog Density</span>
              <span className="text-amber-400 font-bold">{simFogIntensity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={98}
              value={simFogIntensity}
              onChange={(e) => setSimFogIntensity(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>Clear Sky</span>
              <span>Dense Monsoon Fog</span>
            </div>
          </div>

          {/* Knob 2: Vehicle Speed */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs font-mono text-neutral-300">
              <span>Vehicle Speed</span>
              <span className="text-emerald-400 font-bold">{simVehicleSpeed} km/h</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={simVehicleSpeed}
              onChange={(e) => setSimVehicleSpeed(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>Stationary (0)</span>
              <span>Unsafe Fast (50 km/h)</span>
            </div>
          </div>

          {/* Knob 3: Rain Toggle */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div className="flex justify-between text-xs font-mono text-neutral-300">
              <span>Monsoon Cloudburst</span>
              <span className={simRainActive ? 'text-cyan-400 font-bold' : 'text-neutral-400'}>
                {simRainActive ? 'ACTIVE (6.4 mm/h)' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => setSimRainActive((prev) => !prev)}
              className={`w-full py-2 rounded-lg text-xs font-mono font-bold border transition ${
                simRainActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700'
              }`}
            >
              {simRainActive ? 'Rain Active (Click to Clear)' : 'Simulate Rain Downpour'}
            </button>
          </div>

          {/* Knob 4: Sudden Obstacle Toggle */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div className="flex justify-between text-xs font-mono text-neutral-300">
              <span>Radar Obstacle</span>
              <span className={simObstacleActive ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {simObstacleActive ? 'TARGET AT 16m' : 'CLEAR'}
              </span>
            </div>
            <button
              onClick={() => setSimObstacleActive((prev) => !prev)}
              className={`w-full py-2 rounded-lg text-xs font-mono font-bold border transition ${
                simObstacleActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700'
              }`}
            >
              {simObstacleActive ? 'Obstacle Triggered (16m)' : 'Trigger Sudden Obstacle'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
