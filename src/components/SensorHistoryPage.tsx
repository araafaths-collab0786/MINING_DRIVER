import React, { useState } from 'react';
import { useMining } from '../context/MiningContext';
import {
  FileText,
  Calendar,
  Filter,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';

export const SensorHistoryPage: React.FC = () => {
  const { historyLogs } = useMining();
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-10');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sensorTypeHighlight, setSensorTypeHighlight] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = historyLogs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (searchTerm && !log.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) && !log.time.includes(searchTerm)) {
      return false;
    }
    return true;
  });

  const exportCsv = () => {
    const header = 'Time,Visibility(m),Fog(%),Speed(km/h),Radar(m),Temperature(C),Status,VehicleID\n';
    const rows = filteredLogs
      .map(
        (r) =>
          `${r.time},${r.visibility},${r.fog},${r.speed},${r.radar},${r.temperature},${r.status},${r.vehicleId}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NMDC_Bailadila_Sensor_History_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/50">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/50">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
            <CheckCircle2 className="w-3 h-3" />
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
              SENSOR HISTORY TELEMETRY LOG
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            DGMS Statutory Archive &bull; Bailadila Iron Ore Mine Haulage Telematics
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold transition flex items-center gap-2 shadow-md shadow-amber-950/60 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR: Date and Sensor Type */}
      <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <label className="text-xs font-mono text-neutral-400">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* Sensor Type Highlight Filter */}
          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <label className="text-xs font-mono text-neutral-400">Sensor Column:</label>
            <select
              value={sensorTypeHighlight}
              onChange={(e) => setSensorTypeHighlight(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-neutral-900">All Sensors</option>
              <option value="VISIBILITY" className="bg-neutral-900">Visibility (Transmissometer)</option>
              <option value="FOG" className="bg-neutral-900">Fog Level (%)</option>
              <option value="SPEED" className="bg-neutral-900">Speed (km/h)</option>
              <option value="RADAR" className="bg-neutral-900">Radar Distance (m)</option>
              <option value="TEMP" className="bg-neutral-900">Temperature (°C)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            {['ALL', 'CRITICAL', 'WARNING', 'NORMAL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  statusFilter === st
                    ? 'bg-neutral-800 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle or time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* SENSOR HISTORY TABLE */}
      {/* Table format strictly follows user prompt:
          | Time | Visibility | Fog | Speed | Radar | Temperature | Status |
      */}
      <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-wider border-b border-neutral-800">
                <th className="py-3 px-4 font-bold">Time</th>
                <th className={`py-3 px-4 font-bold ${sensorTypeHighlight === 'VISIBILITY' ? 'text-cyan-400 bg-neutral-900' : ''}`}>
                  Visibility
                </th>
                <th className={`py-3 px-4 font-bold ${sensorTypeHighlight === 'FOG' ? 'text-purple-400 bg-neutral-900' : ''}`}>
                  Fog
                </th>
                <th className={`py-3 px-4 font-bold ${sensorTypeHighlight === 'SPEED' ? 'text-emerald-400 bg-neutral-900' : ''}`}>
                  Speed
                </th>
                <th className={`py-3 px-4 font-bold ${sensorTypeHighlight === 'RADAR' ? 'text-amber-400 bg-neutral-900' : ''}`}>
                  Radar
                </th>
                <th className={`py-3 px-4 font-bold ${sensorTypeHighlight === 'TEMP' ? 'text-orange-400 bg-neutral-900' : ''}`}>
                  Temperature
                </th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Vehicle</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-neutral-800/80">
              {filteredLogs.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-850/60 transition">
                  <td className="py-3 px-4 font-bold text-neutral-200">{row.time}</td>
                  <td className={`py-3 px-4 ${row.visibility < 35 ? 'text-rose-400 font-bold' : 'text-cyan-400'}`}>
                    {row.visibility} m
                  </td>
                  <td className={`py-3 px-4 ${row.fog > 80 ? 'text-rose-400 font-bold' : 'text-purple-400'}`}>
                    {row.fog}%
                  </td>
                  <td className={`py-3 px-4 ${row.speed > 35 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {row.speed} km/h
                  </td>
                  <td className={`py-3 px-4 ${row.radar < 20 ? 'text-rose-400 font-bold' : 'text-amber-400'}`}>
                    {row.radar} m
                  </td>
                  <td className="py-3 px-4 text-orange-300">{row.temperature} °C</td>
                  <td className="py-3 px-4">{getStatusBadge(row.status)}</td>
                  <td className="py-3 px-4 text-neutral-400 font-semibold">{row.vehicleId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>Total records: {filteredLogs.length}</span>
          <span>NMDC Kirandul Mine Cloud Node 04</span>
        </div>
      </div>
    </div>
  );
};
