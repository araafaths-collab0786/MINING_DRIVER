import React, { useState } from 'react';
import { useMining } from '../context/MiningContext';
import {
  Radio,
  Cpu,
  Eye,
  Thermometer,
  Droplets,
  CloudRain,
  Gauge,
  ShieldAlert,
  Code,
  Copy,
  Check,
  Zap,
  Terminal,
  Server,
  RefreshCw,
} from 'lucide-react';

export const SensorsPage: React.FC = () => {
  const { telemetry, isSystemOn, currentVehicle } = useMining();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'esp32' | 'mqtt'>('status');

  const esp32SampleCode = `// MININGDRIVER ESP32 Telemetry Node (Kirandul Mine Deposit 14)
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>

const char* ssid = "NMDC_MINING_MESH";
const char* password = "BAILADILA_SECURE";
const char* mqtt_server = "telemetry.miningdriver.nmdc.co.in";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Read 77GHz mmWave FMCW Radar & SHT35 sensor
  float radarDistance = read_mmwave_radar_fmcw();
  float visibility = read_optical_transmissometer();
  float temp = read_sht35_temp();
  float humidity = read_sht35_humidity();
  float speed = read_canbus_speed();

  // Construct JSON Telemetry payload
  char payload[256];
  snprintf(payload, sizeof(payload), 
    "{\\"vehicleId\\":\\"DMP-104\\",\\"radar\\":%.1f,\\"visibility\\":%.1f,\\"speed\\":%.1f,\\"temp\\":%.1f,\\"humidity\\":%.1f}",
    radarDistance, visibility, speed, temp, humidity
  );

  client.publish("nmdc/bailadila/dmp104/telemetry", payload);
  delay(100); // 10Hz transmission loop
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(esp32SampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sensorList = [
    {
      name: '77GHz mmWave FMCW Collision Radar',
      role: 'Forward Hazard & Range Tracking',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? `${telemetry.radarDistance} m` : 'STANDBY',
      spec: 'TI AWR1843 / 60m envelope / 150° FOV',
      color: 'amber',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
    },
    {
      name: 'Optical Scatter Fog Transmissometer',
      role: 'Monsoon Fog & Lux Measurement',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? `${telemetry.visibility} m` : 'STANDBY',
      spec: 'Near-IR forward scatter (880nm wavelength)',
      color: 'cyan',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: 'J1939 CAN-Bus Speed Governor Tap',
      role: 'Heavy Equipment Kinematics',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? `${telemetry.vehicleSpeed} km/h` : 'STANDBY',
      spec: '250 kbps differential twisted pair tap',
      color: 'emerald',
      icon: <Gauge className="w-5 h-5 text-emerald-400" />,
    },
    {
      name: 'SHT35 Temperature & Dew Point Probe',
      role: 'Hilltop Atmospheric Saturation',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? `${telemetry.temperature} °C / ${telemetry.humidity}% RH` : 'STANDBY',
      spec: '±0.1°C accuracy, IP67 sinter filter cap',
      color: 'blue',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
    },
    {
      name: 'Capacitive Rain Surface Sensor',
      role: 'Precipitation Detection & Measurement',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? `${telemetry.rainMmPerHour} mm/hr (${telemetry.rainProbability})` : 'STANDBY',
      spec: 'Gold plated interdigital finger grid',
      color: 'cyan',
      icon: <CloudRain className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: 'RTK Differential GNSS Receiver',
      role: 'Sub-Decimeter Vehicle Positioning',
      status: isSystemOn ? 'ONLINE' : 'OFFLINE',
      reading: isSystemOn ? '18°42′00″N 81°13′10″E' : 'STANDBY',
      spec: 'L1/L2 multi-band GPS/GLONASS/NavIC',
      color: 'purple',
      icon: <Zap className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
              TELEMETRY SENSORS & ESP32 HARDWARE SUITE
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Multi-sensor perception bus installed on {currentVehicle.name} ({currentVehicle.number})
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'status' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Sensor Array
          </button>
          <button
            onClick={() => setActiveTab('esp32')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'esp32' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ESP32 / Arduino Code
          </button>
          <button
            onClick={() => setActiveTab('mqtt')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'mqtt' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            MQTT Payload Stream
          </button>
        </div>
      </div>

      {/* TAB 1: SENSOR LIST */}
      {activeTab === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorList.map((sensor, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-3 hover:border-neutral-700 transition shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                  {sensor.icon}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    sensor.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {sensor.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-mono font-bold text-white leading-snug">
                  {sensor.name}
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">{sensor.role}</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  Real-time Value
                </span>
                <span className="text-lg font-mono font-bold text-amber-400">
                  {sensor.reading}
                </span>
              </div>

              <div className="text-[10px] font-mono text-neutral-400 truncate">
                {sensor.spec}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ESP32 ARDUINO HARDWARE CODE */}
      {activeTab === 'esp32' && (
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span>ESP32 Physical Microcontroller In-Cab Firmata</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Ready-to-flash Arduino sketch connecting 77GHz mmWave radar + transmissometer via MQTT
              </p>
            </div>

            <button
              onClick={copyCode}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-semibold transition flex items-center gap-1.5 self-start sm:self-center"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy C++ Code'}</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 overflow-x-auto">
            <pre className="font-mono text-xs text-neutral-300 leading-relaxed">
              <code>{esp32SampleCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: MQTT JSON TELEMETRY PAYLOAD */}
      {activeTab === 'mqtt' && (
        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Live MQTT Topic: nmdc/bailadila/dmp104/telemetry</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Incoming binary/JSON broker packet parsed by MININGDRIVER gateway
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              QoS 1 &bull; 100ms interval
            </span>
          </div>

          <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
            <pre className="font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto">
              {JSON.stringify(
                {
                  timestamp: telemetry.timestamp,
                  vehicleId: currentVehicle.number,
                  model: currentVehicle.name,
                  driver: currentVehicle.driverName,
                  fmcwRadar: {
                    distance_m: telemetry.radarDistance,
                    frequency_ghz: 77.0,
                    target_closing_rate_mps: telemetry.radarDistance < 20 ? -4.2 : 0.0,
                    hazard_flag: telemetry.radarDistance < 20,
                  },
                  transmissometer: {
                    visibility_meters: telemetry.visibility,
                    attenuation_db_per_km: (35.0 / (telemetry.visibility || 1)).toFixed(2),
                    fog_severity: telemetry.visibility < 35 ? 'CRITICAL' : 'MODERATE',
                  },
                  kinematics: {
                    speed_kmh: telemetry.vehicleSpeed,
                    governed_limit_kmh: 25,
                    engine_rpm: 1680,
                    retarder_pressure_psi: 420,
                  },
                  atmospheric: {
                    ambient_temp_c: telemetry.temperature,
                    relative_humidity_pct: telemetry.humidity,
                    rain_mm_per_hr: telemetry.rainMmPerHour,
                    precipitation_detected: telemetry.rainMmPerHour > 0,
                  },
                  spatial_rtk: {
                    lat: telemetry.latitude,
                    lng: telemetry.longitude,
                    elevation_m: 1142,
                    zone: 'KIRANDUL_BENCH_6',
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
