import React, { useState } from 'react';
import { useMining } from '../context/MiningContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Volume2,
  Radio,
  Server,
  Save,
  Check,
  ShieldAlert,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { audioAlertsEnabled, setAudioAlertsEnabled } = useMining();
  const [criticalFogThreshold, setCriticalFogThreshold] = useState(35);
  const [radarThreshold, setRadarThreshold] = useState(20);
  const [governedSpeed, setGovernedSpeed] = useState(25);
  const [mqttBroker, setMqttBroker] = useState('telemetry.miningdriver.nmdc.co.in');
  const [baudRate, setBaudRate] = useState('115200');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
              TELEMETRY & THRESHOLD CONFIGURATION
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Safety parameters, DGMS speed governors, and hardware ESP32 bus settings
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold transition flex items-center gap-2 shadow-md shadow-amber-950/60 self-start sm:self-center"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved' : 'Save Parameters'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAFETY THRESHOLDS */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2 border-b border-neutral-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Hazard Thresholds</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            {/* Fog Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-300">
                <span>Critical Visibility Limit</span>
                <span className="text-rose-400 font-bold">&lt; {criticalFogThreshold} meters</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                value={criticalFogThreshold}
                onChange={(e) => setCriticalFogThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <p className="text-[10px] text-neutral-500">
                Trigger in-cab audio buzzer when optical transmissometer drops below this value.
              </p>
            </div>

            {/* Radar Hazard Distance */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-neutral-300">
                <span>Forward Radar Hazard Distance</span>
                <span className="text-amber-400 font-bold">&lt; {radarThreshold} meters</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                value={radarThreshold}
                onChange={(e) => setRadarThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[10px] text-neutral-500">
                Minimum safe stopping envelope at 77GHz mmWave radar beam.
              </p>
            </div>

            {/* Governed Speed Limit */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-neutral-300">
                <span>Wet Monsoon Governed Speed</span>
                <span className="text-emerald-400 font-bold">{governedSpeed} km/h</span>
              </div>
              <input
                type="range"
                min={15}
                max={45}
                value={governedSpeed}
                onChange={(e) => setGovernedSpeed(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-neutral-500">
                Bailadila 8-10% slope gradient maximum safe operating speed limit.
              </p>
            </div>
          </div>
        </div>

        {/* HARDWARE & NETWORK */}
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>IoT & In-Cab Hardware</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            {/* Audio Siren Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="space-y-0.5">
                <span className="text-neutral-200 font-bold">In-Cab Audio Siren</span>
                <p className="text-[10px] text-neutral-400">Synthesize audio alarm chime on critical hazard</p>
              </div>
              <button
                type="button"
                onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  audioAlertsEnabled ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {audioAlertsEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* MQTT Broker URL */}
            <div className="space-y-1">
              <label className="text-neutral-400">MQTT Broker Host:</label>
              <input
                type="text"
                value={mqttBroker}
                onChange={(e) => setMqttBroker(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Serial Baud Rate */}
            <div className="space-y-1">
              <label className="text-neutral-400">ESP32 UART Baud Rate:</label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="9600">9600 bps</option>
                <option value="57600">57600 bps</option>
                <option value="115200">115200 bps (Standard ESP32)</option>
                <option value="921600">921600 bps (High-Speed Radar Raw)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
