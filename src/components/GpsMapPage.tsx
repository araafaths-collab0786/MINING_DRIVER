import React, { useEffect, useRef, useState } from 'react';
import { useMining } from '../context/MiningContext';
import { MapLayerType } from '../types';
import { BAILADILA_CENTER } from '../mockData';
import L from 'leaflet';
import {
  Truck,
  User,
  MapPin,
  Gauge,
  Navigation,
  Layers,
  Compass,
  Radio,
  Eye,
  Crosshair,
  AlertTriangle,
} from 'lucide-react';

export const GpsMapPage: React.FC = () => {
  const { currentVehicle, telemetry, isSystemOn, vehicles, setSelectedVehicleId } = useMining();
  const [mapLayer, setMapLayer] = useState<MapLayerType>('satellite');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Exact coordinates of Bailadila Iron Ore Mine: 18°42′00″N 81°13′10″E
  // Decimal: 18.7000° N, 81.2194° E
  const mineLat = 18.7000;
  const mineLng = 81.2194;

  // Tile layer URLs for the 4 requested map types
  const getTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'satellite':
        return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      case 'hybrid':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'terrain':
        return 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'roadmap':
      default:
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [mineLat, mineLng],
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialTiles = L.tileLayer(getTileUrl('satellite'), {
      attribution: '&copy; Google Maps &bull; NMDC Kirandul Mine Telemetry',
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = initialTiles;

    // Custom Mining Site Center Marker (Bailadila Mine 18°42′00″N 81°13′10″E)
    const nmdcIcon = L.divIcon({
      className: 'custom-mine-icon',
      html: `
        <div style="background-color: #0f172a; border: 2px solid #f59e0b; color: #f59e0b; padding: 4px 8px; border-radius: 8px; font-family: monospace; font-size: 11px; font-weight: bold; white-space: nowrap; box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #f59e0b; display: inline-block;"></span>
          BAILADILA MINE (18°42′00″N 81°13′10″E)
        </div>
      `,
      iconSize: [220, 30],
      iconAnchor: [110, 15],
    });

    L.marker([mineLat, mineLng], { icon: nmdcIcon }).addTo(map);

    // Kirandul Bench 6 Haul Road Polyline
    const haulRoadCoords: [number, number][] = [
      [18.7040, 81.2150], // Loading shovel face
      [18.7025, 81.2168], // Bench 6 turn
      [18.7012, 81.2185], // Vehicle current position area
      [18.6990, 81.2205], // Ramp B switchback
      [18.6965, 81.2220], // Mid incline
      [18.6940, 81.2245], // Primary crusher hopper
    ];

    L.polyline(haulRoadCoords, {
      color: '#06b6d4',
      weight: 4,
      dashArray: '8, 6',
      opacity: 0.85,
    }).addTo(map);

    // Primary Crusher marker
    const crusherIcon = L.divIcon({
      className: 'custom-crusher-icon',
      html: `
        <div style="background-color: #0f172a; border: 1.5px solid #10b981; color: #10b981; padding: 2px 6px; border-radius: 6px; font-family: monospace; font-size: 10px; font-weight: bold; white-space: nowrap;">
          CRUSHER HOPPER
        </div>
      `,
      iconSize: [110, 20],
      iconAnchor: [55, 10],
    });
    L.marker([18.6940, 81.2245], { icon: crusherIcon }).addTo(map);

    // Active Vehicle Marker
    const vehicleIcon = L.divIcon({
      className: 'custom-vehicle-icon',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background-color: #f43f5e; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background-color: #0f172a; border: 2px solid #fbbf24; color: #fbbf24; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #fbbf24;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 17h4V5H2v12h3m9 0h2l3-3v-4h-5v7m-7 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0m9 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/></svg>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const vMarker = L.marker([telemetry.latitude, telemetry.longitude], { icon: vehicleIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: monospace; font-size: 12px; color: #000;">
          <strong>${currentVehicle.number} (${currentVehicle.name})</strong><br/>
          Driver: ${currentVehicle.driverName} (${currentVehicle.driverId})<br/>
          Speed: ${telemetry.vehicleSpeed} km/h<br/>
          Radar Distance: ${telemetry.radarDistance} m<br/>
          Zone: ${currentVehicle.zone}
        </div>`
      );

    markerRef.current = vMarker;

    // Visibility / Radar Envelope Circle
    const circle = L.circle([telemetry.latitude, telemetry.longitude], {
      radius: telemetry.radarDistance,
      color: telemetry.radarDistance < 20 ? '#f43f5e' : '#10b981',
      fillColor: telemetry.radarDistance < 20 ? '#f43f5e' : '#10b981',
      fillOpacity: 0.15,
      weight: 1.5,
    }).addTo(map);

    circleRef.current = circle;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map tiles when user toggles between Satellite, Hybrid, Terrain, Roadmap
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(getTileUrl(mapLayer));
  }, [mapLayer]);

  // Update Vehicle position live when telemetry changes
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current || !circleRef.current) return;
    const newLatLng = new L.LatLng(telemetry.latitude, telemetry.longitude);
    markerRef.current.setLatLng(newLatLng);
    circleRef.current.setLatLng(newLatLng);
    circleRef.current.setRadius(telemetry.radarDistance);
    circleRef.current.setStyle({
      color: telemetry.radarDistance < 20 ? '#f43f5e' : '#10b981',
      fillColor: telemetry.radarDistance < 20 ? '#f43f5e' : '#10b981',
    });
  }, [telemetry.latitude, telemetry.longitude, telemetry.radarDistance]);

  const recenterMap = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([telemetry.latitude, telemetry.longitude], 17);
  };

  const centerBailadilaMine = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([mineLat, mineLng], 15);
  };

  return (
    <div className="space-y-6">
      {/* 1. MINING VEHICLE INFORMATION CARD */}
      {/* Requirements:
          i. Vehicle Name and Number
          ii. Driver Name with ID
          iii. Mining Zone
          iv. Current speed and Vehicle Status
          v. Current location of Vehicle
      */}
      <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
                  {currentVehicle.number}
                </span>
                <span className="text-sm font-mono text-neutral-300 font-semibold">
                  {currentVehicle.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-cyan-400 border border-neutral-700">
                  {currentVehicle.type}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Heavy Earth Moving Machinery (HEMM) Telematics Unit
              </p>
            </div>
          </div>

          {/* Vehicle Selector Pill */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-neutral-400">Select Hauler:</label>
            <select
              value={currentVehicle.id}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.number} - {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed 5 Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* i. Vehicle Name & Number */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
              <Truck className="w-3 h-3 text-amber-400" />
              Vehicle Spec
            </span>
            <div className="text-xs font-mono font-bold text-white">
              {currentVehicle.name}
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold">
              ID: {currentVehicle.number}
            </div>
          </div>

          {/* ii. Driver Name with ID */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
              <User className="w-3 h-3 text-cyan-400" />
              Driver & Operator ID
            </span>
            <div className="text-xs font-mono font-bold text-neutral-200 truncate">
              {currentVehicle.driverName}
            </div>
            <div className="text-xs font-mono text-cyan-400 font-semibold">
              {currentVehicle.driverId}
            </div>
          </div>

          {/* iii. Mining Zone */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              Mining Zone
            </span>
            <div className="text-xs font-mono font-bold text-neutral-200 truncate">
              {currentVehicle.zone}
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              Elevation: 1,142 m MSL
            </div>
          </div>

          {/* iv. Current speed & Vehicle Status */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
              <Gauge className="w-3 h-3 text-orange-400" />
              Speed & Status
            </span>
            <div className="text-xs font-mono font-bold text-neutral-100 flex items-center gap-1.5">
              <span>{isSystemOn ? `${telemetry.vehicleSpeed} km/h` : 'INACTIVE'}</span>
              <span className="text-[10px] text-neutral-400 font-normal">(Gov: 25)</span>
            </div>
            <div className="text-[11px] font-mono font-bold text-amber-400">
              {currentVehicle.status} • {currentVehicle.payloadTons}T
            </div>
          </div>

          {/* v. Current location of Vehicle */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
              <Navigation className="w-3 h-3 text-purple-400" />
              Live GNSS Fix
            </span>
            <div className="text-xs font-mono font-bold text-purple-300">
              {telemetry.latitude.toFixed(5)}°N
            </div>
            <div className="text-xs font-mono text-purple-300">
              {telemetry.longitude.toFixed(5)}°E
            </div>
          </div>
        </div>
      </div>

      {/* 2. GPS MAP */}
      {/* Requirements:
          i. Add an interactive map showing the current mining vehicle location and traveling so that the user can see how the dumper is moving and also make it easier for the drivers to see the map and move to their location
          ii. The map should be of four: Satellite, Hybrid, Terrain, Roadmap
          iii. Use Google Maps only and mark the exact location of bailadilla Iron Ore Mine 18°42′00″N 81°13′10″E
      */}
      <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl space-y-0">
        {/* Map Controls Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase">
              Interactive Mining Haulage Map
            </h3>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-amber-400 border border-amber-500/30">
              Bailadila Iron Ore Mine: 18°42′00″N 81°13′10″E
            </span>
          </div>

          {/* 4 MAP MODES SWITCHER: Satellite, Hybrid, Terrain, Roadmap */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            {(['satellite', 'hybrid', 'terrain', 'roadmap'] as MapLayerType[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapLayer(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition ${
                  mapLayer === mode
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Map Stage Container */}
        <div className="relative w-full h-[540px] bg-neutral-950">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Overlay Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="bg-neutral-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-700/80 text-xs font-mono text-neutral-200 shadow-xl space-y-0.5">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                BAILADILA IRON ORE MINES (18°42′00″N 81°13′10″E)
              </div>
              <div className="text-[11px] text-neutral-400">
                Kirandul Complex Bench 6 • Haul Road Incline Ramp B
              </div>
            </div>

            <div className="bg-neutral-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-700/80 text-xs font-mono shadow-xl flex items-center gap-3">
              <div>
                <span className="text-[10px] text-neutral-400 block">FMCW RADAR CONE</span>
                <span className={`font-bold ${telemetry.radarDistance < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {telemetry.radarDistance}m Coverage
                </span>
              </div>
              <div className="h-6 w-px bg-neutral-800" />
              <div>
                <span className="text-[10px] text-neutral-400 block">VISIBILITY</span>
                <span className={`font-bold ${telemetry.visibility < 35 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {telemetry.visibility}m
                </span>
              </div>
            </div>
          </div>

          {/* Quick Center Buttons */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={recenterMap}
              className="bg-neutral-950/90 hover:bg-neutral-900 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-xs font-mono font-semibold text-amber-400 shadow-xl transition flex items-center gap-1.5"
              title="Center on Monitored Hauler"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Track {currentVehicle.number}</span>
            </button>
            <button
              onClick={centerBailadilaMine}
              className="bg-neutral-950/90 hover:bg-neutral-900 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-xs font-mono font-semibold text-cyan-400 shadow-xl transition flex items-center gap-1.5"
              title="Center on Bailadila Mine Coordinates"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Mine 18°42′N 81°13′E</span>
            </button>
          </div>

          {/* Driver In-Cab HUD Compass Overlay on bottom left */}
          <div className="absolute bottom-6 left-4 z-20 bg-neutral-950/90 backdrop-blur-md p-3 rounded-xl border border-neutral-800 shadow-2xl hidden sm:flex items-center gap-3">
            <Compass className="w-8 h-8 text-cyan-400 animate-spin-slow" />
            <div className="font-mono text-xs">
              <span className="text-neutral-400 block text-[10px]">HAUL ROAD BEARING</span>
              <span className="text-white font-bold">145° SE • TOWARDS CRUSHER</span>
              <span className="text-amber-400 block text-[10px]">ROAD GRADE: -8.2% (DOWNHILL WET)</span>
            </div>
          </div>
        </div>

        {/* Haul Waypoints & Route Guidance Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Cyan Line: Designated Haulage Path (Excavator Shovel 201 &rarr; Gyratory Crusher Hopper)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400">Total Distance: 2.8 km</span>
            <span className="text-emerald-400">Remaining to Dump: 1.1 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
