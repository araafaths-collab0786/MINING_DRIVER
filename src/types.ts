export type UserRole = 
  | 'Safety Controller'
  | 'Dumper Driver'
  | 'Telematics Engineer'
  | 'Ministry Auditor';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicleName?: string;
  vehicleNumber?: string;
}

export type PageView = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'fog-detection'
  | 'sensors'
  | 'vehicle-location'
  | 'alerts';

export type AlertSeverity = 'Information' | 'Warning' | 'Critical';

export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  vehicleId: string;
  location: string;
  acknowledged: boolean;
}

export type FogClassification = 'CLEAR' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type SafetyScoreStatus = 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'CRITICAL';

export interface SensorTelemetry {
  timestamp: string;
  radarDistance: number; // in meters (e.g. 5 to 60m)
  visibility: number; // in meters (e.g. 15 to 150m)
  temperature: number; // in Celsius (e.g. 21 - 29 C)
  humidity: number; // in percentage (e.g. 70 - 99%)
  rainMmPerHour: number; // e.g. 0.0 to 25.0 mm/hr
  rainProbability: 'LOW' | 'MODERATE' | 'HIGH';
  vehicleSpeed: number; // in km/h (e.g. 0 to 45 km/h)
  obstacleDetected: boolean;
  obstacleType?: string;
  obstacleDistance?: number;
  latitude: number;
  longitude: number;
  elevation: number;
  roadGradePercent: number;
  trafficDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  hazardZone: string;
}

export interface MiningVehicle {
  id: string;
  name: string;
  number: string;
  type: string;
  driverName: string;
  driverId: string;
  zone: string;
  status: 'HAULING' | 'LOADING' | 'UNLOADING' | 'STOPPED' | 'MAINTENANCE';
  currentSpeed: number;
  targetSpeed: number;
  latitude: number;
  longitude: number;
  heading: number;
  payloadTons: number;
  safetyScore: number;
  safetyStatus: SafetyScoreStatus;
}

export interface HistoricalReading {
  id: string;
  time: string;
  visibility: number;
  fog: number;
  speed: number;
  radar: number;
  temperature: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  vehicleId: string;
}

export type MapLayerType = 'satellite' | 'hybrid' | 'terrain' | 'roadmap';
