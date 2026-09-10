import React from 'react';
import { useMining } from '../context/MiningContext';
import fleetPhoto from '../assets/images/komatsu_pc8000_mining_1789051686236.jpg';
import {
  ShieldAlert,
  Radio,
  Cpu,
  Server,
  Database,
  Monitor,
  Activity,
  Gauge,
  Eye,
  Zap,
  ArrowRight,
  Layers,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage } = useMining();

  const equipmentParameters = [
    {
      label: 'Operating Weight',
      value: '800 Metric Tons',
      sub: 'Super Hydraulic Excavator Class',
      desc: 'Ground bearing pressure distributed over heavy-duty mining crawler pads for pit bench stability.',
    },
    {
      label: 'Bucket Capacity',
      value: '42 m³ (55 yd³)',
      sub: 'Heavy Rock Shovel Dipper',
      desc: 'Single pass fills ~75 metric tons of hematite iron ore into 100-ton rear dumpers in 3 to 4 cycle passes.',
    },
    {
      label: 'Engine Output',
      value: '2x Komatsu SDA16V160 Diesel',
      sub: '4,020 HP (2 x 1,500 kW)',
      desc: 'Tier-2 certified high-altitude turbo intercooled power plant configured for 1,200m MSL Bailadila peaks.',
    },
    {
      label: 'Haul Fleet Pair',
      value: 'CAT 777E & Komatsu HD785',
      sub: '100-Ton Haul Dumpers',
      desc: 'Rigid dump trucks equipped with in-cab MININGDRIVER mmWave radar hazard HUD displays.',
    },
    {
      label: 'Monsoon Grade',
      value: '8.0% - 10.5% Incline Ramps',
      sub: 'Wet Ferruginous Clay Mud',
      desc: 'Heavy monsoon downpours generate slick red mud layers with friction coefficient μ < 0.28.',
    },
    {
      label: 'Governed Speed',
      value: '25 km/h Loaded Downhill',
      sub: 'Enforced via Edge Telematics',
      desc: 'Dynamic governor adjusts maximum permissible speed based on real-time fog visibility index.',
    },
  ];

  const pipelineLayers = [
    {
      step: '01',
      title: 'Edge Sensors',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
      tag: 'Hardware Perception',
      desc: 'Dual-band 77GHz mmWave FMCW collision radar, multi-beam solid-state LiDAR, optical scatter fog transmissometer, and industrial SHT35 temperature/humidity sensors.',
      details: ['77GHz mmWave FMCW (60m range in fog)', 'Optical Transmissometer (0-200m lux)', 'ESP32 / CAN-Bus J1939 telemetry interface'],
    },
    {
      step: '02',
      title: 'Edge Gateway',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      tag: 'In-Cab Processing',
      desc: 'Ruggedized IP67 edge computing unit installed in heavy haul dumpers. Executes real-time obstacle clustering and time-to-collision (TTC) calculations in < 25ms.',
      details: ['NVIDIA Jetson / ARM Cortex computing', 'Sub-45ms acoustic & visual HUD alert', 'CAN-Bus speed & braking telemetry tap'],
    },
    {
      step: '03',
      title: 'Backend Services',
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      tag: 'Cloud & Fog Mesh',
      desc: 'High-throughput MQTT telemetry brokers and REST streaming pipelines ingesting 100Hz telemetry from all active mining dumpers across Kirandul and Bacheli sectors.',
      details: ['Clustered MQTT Broker with QoS 1', 'AI Fog Density & Dispersion Model', 'Real-time spatial geofence supervisor'],
    },
    {
      step: '04',
      title: 'Database Layer',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      tag: 'Time-Series & Spatial',
      desc: 'Persistent time-series telemetry store tracking visibility history, radar target vectors, vehicle speeds, and statutory safety audit trails for Directorate General of Mines Safety (DGMS).',
      details: ['Microsecond time-series telemetry', 'High-speed spatial coordinates index', 'Tamper-proof statutory incident logs'],
    },
    {
      step: '05',
      title: 'Control Room Dashboard',
      icon: <Monitor className="w-5 h-5 text-amber-400" />,
      tag: 'Mission Critical SCADA',
      desc: 'MININGDRIVER high-contrast industrial control-board dashboard for Safety Controllers, Shift In-Charges, and Mine Managers with live telemetry charts and GPS tracking.',
      details: ['Sub-second live graph updates', 'Interactive 4-mode satellite haul road map', 'Emergency broadcast & speed throttling override'],
    },
  ];

  const operationalAdvantages = [
    {
      title: 'Multi-Sensor Visibility Resilience',
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      badge: 'Zero-Lux & Dense Fog Penetrability',
      desc: 'Standard optical cameras and human vision fail completely when hilltop monsoon clouds blanket Bailadila Deposit 14 below 35 meters. MININGDRIVER fuses 77GHz mmWave electromagnetic radar that penetrates dense water vapor droplets, rain spray, and red dust with optical scatter meters to maintain spatial awareness under zero visibility.',
    },
    {
      title: 'Low Latency Edge Hazard Response',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      badge: '< 45ms Reaction Time',
      desc: 'In-cab collision hazard warnings are processed locally at the edge rather than waiting for round-trip satellite or cellular transmissions. When a sudden obstacle or stopped haul truck appears within closing radar range, the driver receives instant visual flashing HUD alerts and audio chimes before human reaction limits.',
    },
    {
      title: 'Multi-Factor 0-100 Collision Risk Engine',
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      badge: 'AI Predictive Safety Model',
      desc: 'Unlike binary radar alarms that cause false alarm fatigue, MININGDRIVER synthesizes visibility distance, haul truck speed, radar closing rate, road gradient inclination, monsoon rain precipitation, and traffic density into a normalized 0-100 Risk Score categorizing conditions into SAFE, CAUTION, HIGH RISK, and CRITICAL.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        {/* Subtle industrial grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Glowing atmospheric flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-64 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            NMDC Bailadila Iron Ore Complex • Deposit 14 & 11C
          </div>

          {/* EXACT TITLE AT CENTRE */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-white leading-tight">
            Safe and Efficient Mine Haulage in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400">Dense Monsoon Fog</span>
          </h1>

          {/* EXACT SUBTITLE AT CENTRE */}
          <p className="max-w-4xl mx-auto text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed font-normal">
            An advanced AI and IoT multi-sensor telemetry ecosystem engineered for NMDC Limited’s Bailadila Iron Ore Mines. Fusing 77GHz mmWave radar, LiDAR, and edge intelligence to enable continuous collision-risk monitoring and early hazard warning during low- visibility haulage when visibility falls below 35 meters.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => setActivePage('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-mono font-bold text-sm tracking-wide shadow-xl shadow-amber-950/60 hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Proceed to Login Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-mono font-semibold text-sm border border-neutral-700 hover:border-amber-500/50 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Sign In as Operator / Driver</span>
            </button>
          </div>

          {/* Quick telemetry highlight pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto">
            <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <span className="block text-[11px] font-mono text-neutral-400 uppercase">Radar FMCW</span>
              <span className="text-base sm:text-lg font-mono font-bold text-amber-400">77 GHz</span>
            </div>
            <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <span className="block text-[11px] font-mono text-neutral-400 uppercase">Critical Fog Threshold</span>
              <span className="text-base sm:text-lg font-mono font-bold text-rose-400">&lt; 35 Meters</span>
            </div>
            <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <span className="block text-[11px] font-mono text-neutral-400 uppercase">Edge Response</span>
              <span className="text-base sm:text-lg font-mono font-bold text-cyan-400">&lt; 45 ms</span>
            </div>
            <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <span className="block text-[11px] font-mono text-neutral-400 uppercase">Collision Engine</span>
              <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">0-100 Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHENTIC FLEET PHOTOGRAPHY SECTION */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black">
          {/* Photography Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
            <img
              src={fleetPhoto}
              alt="Komatsu PC8000 loading 100-ton heavy dumpers at Kirandul Complex Bailadila"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Gradient bottom overlay for smooth text integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

            {/* Tactical watermark stamp */}
            <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/80 text-[11px] font-mono text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TELEMETRY FEED • KIRANDUL COMPLEX BENCH 6</span>
            </div>

            <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/80 text-[11px] font-mono text-amber-400">
              GPS: 18°42′00″N 81°13′10″E
            </div>
          </div>

          {/* EXACT PHOTOGRAPHY TEXT BELOW THE IMAGE */}
          <div className="p-6 sm:p-8 bg-neutral-950 space-y-2 border-t border-neutral-800">
            <h3 className="text-cyan-400 font-mono font-bold text-base sm:text-lg tracking-wider uppercase">
              KIRANDUL COMPLEX + TERRACOTTA PIT BENCH 6
            </h3>
            <p className="text-white text-sm sm:text-base leading-relaxed font-normal">
              An 800-ton Komatsu PC8000 loading 100-ton heavy dumpers. When monsoon clouds envelop the hilltop benches, the dual-band radar and LiDAR telemetry network maintains active spatial tracking.
            </p>
          </div>
        </div>
      </section>

      {/* HEAVY EQUIPMENT PARAMETERS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-850">
        <div className="space-y-4 mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Gauge className="w-4 h-4" />
            <span>Heavy Equipment Parameters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Operation Fleet Specifications
          </h2>
          <p className="text-neutral-400 text-sm max-w-3xl">
            Calibrated telemetry and kinematic profiles for the super heavy earth moving machinery (HEMM) deployed on the Bailadila high-altitude red terracotta benches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {equipmentParameters.map((param, index) => (
            <div
              key={index}
              className="bg-neutral-900/80 p-5 rounded-xl border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                <span>PARAM 0{index + 1}</span>
                <span className="text-cyan-400 font-semibold">{param.sub}</span>
              </div>
              <h3 className="text-neutral-200 font-medium text-sm mb-1">{param.label}</h3>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mb-2 group-hover:text-amber-300">
                {param.value}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                {param.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FULL-STACK ARCHITECTURE: 5-LAYER TELEMATICS & SAFETY PIPELINE */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-800">
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Full-Stack Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            5-Layer Telematics & Safety Pipeline
          </h2>
          <p className="text-neutral-400 text-sm max-w-3xl">
            From millimeter-wave physical layer sensing on 100-ton haulers to sub-second SCADA control board dispatch in the central mine headquarters.
          </p>
        </div>

        <div className="space-y-4">
          {pipelineLayers.map((layer) => (
            <div
              key={layer.step}
              className="bg-neutral-900/80 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                  {layer.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-amber-500">LAYER {layer.step}</span>
                    <h3 className="text-base font-bold text-white font-mono">{layer.title}</h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {layer.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-xs shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                {layer.details.map((det, dIdx) => (
                  <span
                    key={dIdx}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-950 text-neutral-300 border border-neutral-800/80 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    {det}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OPERATIONAL ADVANTAGES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-800 mb-12">
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" />
            <span>Mission Readiness</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Operational Advantages
          </h2>
          <p className="text-neutral-400 text-sm max-w-3xl">
            Engineered specifically to solve the high-risk zero-visibility monsoons that shut down haul roads and endanger heavy equipment operators in the Bailadila hill range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {operationalAdvantages.map((adv, index) => (
            <div
              key={index}
              className="bg-neutral-900/90 p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  {adv.icon}
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-800 text-cyan-400 border border-neutral-700">
                  {adv.badge}
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  {index + 1}. {adv.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {adv.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-xs font-mono text-neutral-500 flex items-center gap-1">
                <span>Verified by NMDC Safety Cell</span>
                <ChevronRight className="w-3 h-3 text-amber-500" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Launch Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white">Ready for Live Haulage Telemetry?</h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Inspect active dumpers, live mmWave radar range, fog prediction, and GPS vehicle coordinates in real-time through the operator portal.
            </p>
          </div>
          <button
            onClick={() => setActivePage('login')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-sm tracking-wide shadow-lg shadow-amber-950/80 transition flex items-center justify-center gap-2 shrink-0"
          >
            <span>Proceed to Operator Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
