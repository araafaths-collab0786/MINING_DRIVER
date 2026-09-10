import React, { useState } from 'react';
import { useMining } from '../context/MiningContext';
import { AlertSeverity } from '../types';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Volume2,
  VolumeX,
  Bell,
  Radio,
  PlusCircle,
  Truck,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    triggerCustomAlert,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    currentVehicle,
  } = useMining();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showAcknowledged, setShowAcknowledged] = useState<boolean>(true);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (!showAcknowledged && alert.acknowledged) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === 'Warning' && !a.acknowledged).length;
  const infoCount = alerts.filter((a) => a.severity === 'Information' && !a.acknowledged).length;

  const getSeverityStyle = (sev: AlertSeverity) => {
    switch (sev) {
      case 'Critical':
        return {
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
          dot: 'bg-rose-500',
          card: 'bg-neutral-900/90 border-rose-500/40 hover:border-rose-500/70',
          icon: <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />,
        };
      case 'Warning':
        return {
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
          dot: 'bg-amber-500',
          card: 'bg-neutral-900/90 border-amber-500/30 hover:border-amber-500/60',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case 'Information':
      default:
        return {
          badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
          dot: 'bg-cyan-500',
          card: 'bg-neutral-900/90 border-neutral-800 hover:border-cyan-500/40',
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Live Alarm Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
              ACTIVE ALERTS DISPATCH HUD
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Automated collision hazard detection, radar threshold alerts & low-visibility warnings
          </p>
        </div>

        {/* Audio Siren Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition flex items-center gap-2 ${
              audioAlertsEnabled
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {audioAlertsEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioAlertsEnabled ? 'Audio Siren ON' : 'Audio Siren MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Severity Counters & Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterSeverity('all')}
          className={`p-3 rounded-xl border font-mono text-left transition ${
            filterSeverity === 'all'
              ? 'bg-neutral-800 border-neutral-600 text-white'
              : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="text-[11px] uppercase">All Active</div>
          <div className="text-2xl font-bold">{alerts.length}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Critical')}
          className={`p-3 rounded-xl border font-mono text-left transition ${
            filterSeverity === 'Critical'
              ? 'bg-rose-950/60 border-rose-500 text-rose-300'
              : 'bg-neutral-900/80 border-neutral-800 text-rose-400 hover:bg-rose-950/30'
          }`}
        >
          <div className="text-[11px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Critical
          </div>
          <div className="text-2xl font-bold">{criticalCount}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Warning')}
          className={`p-3 rounded-xl border font-mono text-left transition ${
            filterSeverity === 'Warning'
              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
              : 'bg-neutral-900/80 border-neutral-800 text-amber-400 hover:bg-amber-950/30'
          }`}
        >
          <div className="text-[11px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Warning
          </div>
          <div className="text-2xl font-bold">{warningCount}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Information')}
          className={`p-3 rounded-xl border font-mono text-left transition ${
            filterSeverity === 'Information'
              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
              : 'bg-neutral-900/80 border-neutral-800 text-cyan-400 hover:bg-cyan-950/30'
          }`}
        >
          <div className="text-[11px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Information
          </div>
          <div className="text-2xl font-bold">{infoCount}</div>
        </button>
      </div>

      {/* QUICK INJECT TEST ALERTS FOR EVALUATION */}
      <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            Inject Test Alert for Hackathon Demo:
          </span>
          <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Show Acknowledged</span>
          </label>
        </div>

        {/* The 7 specific examples requested in prompt */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() =>
              triggerCustomAlert(
                'High Fog Detected',
                'Critical',
                'Optical transmissometer reports visibility < 20m on Hilltop Bench 6.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-rose-500/40 text-rose-400 text-xs font-mono transition"
          >
            + High Fog Detected
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Low Visibility',
                'Warning',
                'Fog index climbed to 78%. Restrict speed to 20 km/h.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-amber-500/40 text-amber-400 text-xs font-mono transition"
          >
            + Low Visibility
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Obstacle detected',
                'Critical',
                '77GHz radar target detected in forward lane at 15m closing distance.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-rose-500/40 text-rose-400 text-xs font-mono transition"
          >
            + Obstacle detected
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Unsafe Vehicle Speed',
                'Critical',
                'Vehicle exceeding governed 25 km/h on wet downhill ramp (Current: 44 km/h).'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-rose-500/40 text-rose-400 text-xs font-mono transition"
          >
            + Unsafe Vehicle Speed
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Sudden obstacle detected',
                'Critical',
                'LiDAR detected unexpected rock boulder or stopped vehicle in travel path.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-rose-500/40 text-rose-400 text-xs font-mono transition"
          >
            + Sudden obstacle detected
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Rain detected',
                'Information',
                'Weather telemetry measured 6.4 mm/hr monsoon precipitation. Engage retarder.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-cyan-500/40 text-cyan-400 text-xs font-mono transition"
          >
            + Rain detected
          </button>
          <button
            onClick={() =>
              triggerCustomAlert(
                'Haul dangerous path detected',
                'Warning',
                'Mud overflow across bench curb line detected. Exercise caution.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-amber-500/40 text-amber-400 text-xs font-mono transition"
          >
            + Haul dangerous path detected
          </button>
        </div>
      </div>

      {/* ACTIVE ALERTS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span>SHOWING {filteredAlerts.length} ALERTS</span>
          <span>NMDC STATUTORY SAFETY AUDIT LOGGING ACTIVE</span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 font-mono space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">All Clear • No Active Alarms</div>
            <p className="text-xs text-neutral-400">All haul trucks operating within safe parameters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${style.card} ${
                  alert.acknowledged ? 'opacity-60' : 'shadow-lg'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {style.icon}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-mono font-bold text-white">
                          {alert.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${style.badge}`}
                        >
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400">
                            ACKNOWLEDGED
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3 text-amber-400" />
                          {alert.vehicleId}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledge Button */}
                  <div className="self-end sm:self-start shrink-0">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono font-semibold transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
