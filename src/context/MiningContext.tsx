import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  PageView,
  MiningVehicle,
  SafetyAlert,
  SensorTelemetry,
  HistoricalReading,
  FogClassification,
  SafetyScoreStatus,
} from '../types';
import { MOCK_VEHICLES, INITIAL_ALERTS, INITIAL_HISTORICAL_LOGS, BAILADILA_CENTER } from '../mockData';

export interface TimeSeriesPoint {
  time: string;
  visibility: number;
  fogLevel: number;
  radarDistance: number;
  vehicleSpeed: number;
}

interface MiningContextType {
  isSystemOn: boolean;
  setIsSystemOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  vehicles: MiningVehicle[];
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  currentVehicle: MiningVehicle;
  telemetry: SensorTelemetry;
  timeSeriesData: TimeSeriesPoint[];
  alerts: SafetyAlert[];
  acknowledgeAlert: (id: string) => void;
  triggerCustomAlert: (title: string, severity: 'Information' | 'Warning' | 'Critical', desc: string) => void;
  historyLogs: HistoricalReading[];
  fogProbability: number;
  fogClassification: FogClassification;
  fogRecommendation: string;
  vehicleSafetyScore: number;
  safetyScoreStatus: SafetyScoreStatus;
  safetyActionRecommendation: string;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (val: boolean) => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  // Simulation overrides
  simFogIntensity: number; // 0 - 100
  setSimFogIntensity: (val: number) => void;
  simRainActive: boolean;
  setSimRainActive: (val: boolean) => void;
  simObstacleActive: boolean;
  setSimObstacleActive: (val: boolean) => void;
  simVehicleSpeed: number;
  setSimVehicleSpeed: (val: number) => void;
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

// Web Audio API beep synthesizer for industrial alerts
function playIndustrialChime(type: 'warning' | 'critical') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'critical') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Audio context may be restricted by browser policy before first interaction
  }
}

export const MiningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSystemOn, setIsSystemOn] = useState<boolean>(true);
  
  // Session starts on landing page; users authenticate via login page before entering the app
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('miningdriver_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return null;
  });

  const [activePage, setActivePage] = useState<PageView>('landing');
  const [vehicles, setVehicles] = useState<MiningVehicle[]>(MOCK_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('DMP-104');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);

  // Interactive simulation knobs
  const [simFogIntensity, setSimFogIntensity] = useState<number>(85); // %
  const [simRainActive, setSimRainActive] = useState<boolean>(true);
  const [simObstacleActive, setSimObstacleActive] = useState<boolean>(true);
  const [simVehicleSpeed, setSimVehicleSpeed] = useState<number>(43); // km/h

  const [alerts, setAlerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);
  const [historyLogs, setHistoryLogs] = useState<HistoricalReading[]>(INITIAL_HISTORICAL_LOGS);

  // Time series initial history
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesPoint[]>([
    { time: '10:40:00', visibility: 75, fogLevel: 35, radarDistance: 45, vehicleSpeed: 25 },
    { time: '10:41:00', visibility: 60, fogLevel: 55, radarDistance: 38, vehicleSpeed: 30 },
    { time: '10:42:00', visibility: 42, fogLevel: 72, radarDistance: 28, vehicleSpeed: 35 },
    { time: '10:43:00', visibility: 30, fogLevel: 84, radarDistance: 22, vehicleSpeed: 40 },
    { time: '10:44:00', visibility: 26, fogLevel: 90, radarDistance: 17, vehicleSpeed: 42 },
    { time: '10:45:00', visibility: 25, fogLevel: 92, radarDistance: 16, vehicleSpeed: 43 },
  ]);

  // Active vehicle reference
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Base telemetry state
  const [telemetry, setTelemetry] = useState<SensorTelemetry>({
    timestamp: new Date().toLocaleTimeString(),
    radarDistance: 16,
    visibility: 25,
    temperature: 22.4,
    humidity: 97,
    rainMmPerHour: 6.4,
    rainProbability: 'HIGH',
    vehicleSpeed: 43,
    obstacleDetected: true,
    obstacleType: 'Caterpillar 777E [Haul Lane]',
    obstacleDistance: 16,
    latitude: BAILADILA_CENTER.lat + 0.0012,
    longitude: BAILADILA_CENTER.lng - 0.0009,
    elevation: 1142,
    roadGradePercent: 8.2,
    trafficDensity: 'HIGH',
    hazardZone: 'Pit 14 Bench 6 Incline Ramp',
  });

  // Calculate AI Fog Detection
  const fogProbability = Math.round(Math.min(100, Math.max(5, simFogIntensity + (Math.random() * 4 - 2))));
  
  let fogClassification: FogClassification = 'CLEAR';
  let fogRecommendation = 'SAFE OPERATIONAL PARAMETERS';
  if (fogProbability >= 85) {
    fogClassification = 'CRITICAL';
    fogRecommendation = 'CRITICAL VISIBILITY < 25M: CEASE OVERTAKING, REDUCE SPEED TO < 15 KM/H, ACTIVATE HIGH-BEAM FOG STROBES';
  } else if (fogProbability >= 70) {
    fogClassification = 'HIGH';
    fogRecommendation = 'REDUCE VEHICLE SPEED: DENSE MONSOON CLOUD ON BENCH 6, ENGAGE 77GHZ MMWAVE RADAR HAZARD HUD';
  } else if (fogProbability >= 45) {
    fogClassification = 'MODERATE';
    fogRecommendation = 'MODERATE FOG: MAINTAIN 45M DISTANCE, ENGAGE ANTI-SKID TRACTION ON MUD GRADES';
  } else if (fogProbability >= 20) {
    fogClassification = 'LOW';
    fogRecommendation = 'PATCHY MIST: NORMAL CAUTION ADVISED';
  } else {
    fogClassification = 'CLEAR';
    fogRecommendation = 'OPTIMAL VISIBILITY ACROSS BAILADILA VALLEY';
  }

  // Calculate Vehicle Safety Score (0 - 100)
  // Multi-factor formula:
  // Visibility (up to 25 pts penalty) + Speed (up to 25 pts) + Radar distance (up to 25 pts) + Obstacle (15 pts) + Rain & Road Grade (10 pts)
  let calculatedScore = 0;
  // Visibility penalty: under 35m is dangerous
  if (telemetry.visibility < 30) calculatedScore += 25;
  else if (telemetry.visibility < 50) calculatedScore += 18;
  else if (telemetry.visibility < 80) calculatedScore += 10;
  else calculatedScore += 2;

  // Speed penalty: over 30 km/h in fog is high risk
  if (telemetry.vehicleSpeed > 40) calculatedScore += 25;
  else if (telemetry.vehicleSpeed > 30) calculatedScore += 18;
  else if (telemetry.vehicleSpeed > 20) calculatedScore += 10;
  else calculatedScore += 4;

  // Radar Distance penalty: under 20m closing distance
  if (telemetry.radarDistance < 20) calculatedScore += 25;
  else if (telemetry.radarDistance < 35) calculatedScore += 16;
  else if (telemetry.radarDistance < 50) calculatedScore += 8;
  else calculatedScore += 2;

  // Obstacle detection penalty
  if (telemetry.obstacleDetected) calculatedScore += 15;

  // Rain & Road grade penalty
  if (telemetry.rainMmPerHour > 5.0) calculatedScore += 7;
  if (telemetry.roadGradePercent > 7.0) calculatedScore += 3;

  const vehicleSafetyScore = Math.min(100, Math.max(8, Math.round(calculatedScore)));

  let safetyScoreStatus: SafetyScoreStatus = 'SAFE';
  let safetyActionRecommendation = 'MAINTAIN REGULAR HAUL CADENCE';

  if (vehicleSafetyScore >= 81) {
    safetyScoreStatus = 'CRITICAL';
    safetyActionRecommendation = 'REDUCE SPEED\nMAINTAIN SAFE DISTANCE';
  } else if (vehicleSafetyScore >= 61) {
    safetyScoreStatus = 'HIGH RISK';
    safetyActionRecommendation = 'SLOW DOWN IMMEDIATELY\nPREPARE SERVICE RETARDER';
  } else if (vehicleSafetyScore >= 31) {
    safetyScoreStatus = 'CAUTION';
    safetyActionRecommendation = 'INCREASE FOLLOWING DISTANCE\nWATCH FOR ROCKFALL';
  } else {
    safetyScoreStatus = 'SAFE';
    safetyActionRecommendation = 'HAUL CORRIDOR CLEAR\nCONTINUE TO CRUSHER';
  }

  // Live simulation ticker: ONLY runs when isSystemOn is true!
  useEffect(() => {
    if (!isSystemOn) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Subtle natural fluctuation
        const jitter = (Math.random() - 0.5) * 1.5;
        const newSpeed = Math.max(0, Math.min(50, Math.round(simVehicleSpeed + jitter)));
        const newRadar = Math.max(5, Math.min(65, Math.round((simObstacleActive ? 16 : 48) + (Math.random() - 0.5) * 3)));
        const newVisibility = Math.max(12, Math.min(140, Math.round(100 - simFogIntensity * 0.85 + (Math.random() - 0.5) * 2)));
        const newRainMm = simRainActive ? Number((6.2 + (Math.random() - 0.5) * 0.8).toFixed(1)) : 0.0;
        const rainProb = newRainMm > 4.0 ? 'HIGH' : newRainMm > 0.5 ? 'MODERATE' : 'LOW';

        // Vehicle travel path slight movement along the haul road
        const latOffset = (Math.random() - 0.48) * 0.00015;
        const lngOffset = (Math.random() - 0.48) * 0.00015;

        return {
          ...prev,
          timestamp: new Date().toLocaleTimeString(),
          vehicleSpeed: newSpeed,
          radarDistance: newRadar,
          visibility: newVisibility,
          temperature: Number((22.4 + (Math.random() - 0.5) * 0.3).toFixed(1)),
          humidity: Math.min(99, Math.max(88, Math.round(96 + (Math.random() - 0.5) * 2))),
          rainMmPerHour: newRainMm,
          rainProbability: rainProb,
          obstacleDetected: simObstacleActive,
          latitude: prev.latitude + latOffset,
          longitude: prev.longitude + lngOffset,
        };
      });

      // Update time-series charts
      const nowStr = new Date().toLocaleTimeString();
      setTimeSeriesData((prev) => {
        const currentPt = prev[prev.length - 1];
        const newVis = Math.max(15, Math.min(140, Math.round(100 - simFogIntensity * 0.85 + (Math.random() - 0.5) * 3)));
        const newFog = Math.min(100, Math.max(5, Math.round(simFogIntensity + (Math.random() - 0.5) * 3)));
        const newRadar = Math.max(6, Math.min(60, Math.round((simObstacleActive ? 16 : 45) + (Math.random() - 0.5) * 2)));
        const newSpd = Math.max(0, Math.min(50, Math.round(simVehicleSpeed + (Math.random() - 0.5) * 2)));

        const next = [
          ...prev.slice(-14), // keep last 15 points
          {
            time: nowStr,
            visibility: newVis,
            fogLevel: newFog,
            radarDistance: newRadar,
            vehicleSpeed: newSpd,
          },
        ];
        return next;
      });

      // Update vehicle list speed and score
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === selectedVehicleId) {
            return {
              ...v,
              currentSpeed: simVehicleSpeed,
              safetyScore: vehicleSafetyScore,
              safetyStatus: safetyScoreStatus,
            };
          }
          return v;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSystemOn, simFogIntensity, simRainActive, simObstacleActive, simVehicleSpeed, selectedVehicleId, vehicleSafetyScore, safetyScoreStatus]);

  // Acknowledge alert
  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  // Trigger custom alert for demonstration
  const triggerCustomAlert = (title: string, severity: 'Information' | 'Warning' | 'Critical', desc: string) => {
    const newAlert: SafetyAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title,
      description: desc,
      severity,
      timestamp: 'Just now',
      vehicleId: selectedVehicleId,
      location: 'Kirandul Pit Bench 6',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (audioAlertsEnabled) {
      playIndustrialChime(severity === 'Critical' ? 'critical' : 'warning');
    }
  };

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('miningdriver_user', JSON.stringify(user));
    if (user.role === 'Dumper Driver' && user.vehicleNumber) {
      setSelectedVehicleId(user.vehicleNumber);
    }
    setActivePage('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('miningdriver_user');
    setActivePage('login');
  };

  return (
    <MiningContext.Provider
      value={{
        isSystemOn,
        setIsSystemOn,
        currentUser,
        setCurrentUser,
        activePage,
        setActivePage,
        vehicles,
        selectedVehicleId,
        setSelectedVehicleId,
        currentVehicle,
        telemetry,
        timeSeriesData,
        alerts,
        acknowledgeAlert,
        triggerCustomAlert,
        historyLogs,
        fogProbability,
        fogClassification,
        fogRecommendation,
        vehicleSafetyScore,
        safetyScoreStatus,
        safetyActionRecommendation,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        login,
        logout,
        simFogIntensity,
        setSimFogIntensity,
        simRainActive,
        setSimRainActive,
        simObstacleActive,
        setSimObstacleActive,
        simVehicleSpeed,
        setSimVehicleSpeed,
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
};
