import React from 'react';
import { MiningProvider, useMining } from './context/MiningContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { DashboardOverview } from './components/DashboardOverview';
import { GpsMapPage } from './components/GpsMapPage';
import { AlertsPage } from './components/AlertsPage';
import { GraphsAndAiFogPage } from './components/GraphsAndAiFogPage';
import { SensorsPage } from './components/SensorsPage';

const AppContent: React.FC = () => {
  const { activePage, currentUser } = useMining();

  // First thing to display is the landing page
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <LandingPage />
        </main>
      </div>
    );
  }

  // Next thing to display is the login page (or if not logged in)
  if (activePage === 'login' || !currentUser) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <LoginPage />
        </main>
      </div>
    );
  }

  // Last thing to display is the App (Dashboard, Fog AI, Sensors, Location, Alerts)
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <Sidebar />

        {/* Dynamic Main Viewport with space managed for all device sizes */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-neutral-950/60 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {activePage === 'dashboard' && <DashboardOverview />}
            {activePage === 'fog-detection' && <GraphsAndAiFogPage />}
            {activePage === 'sensors' && <SensorsPage />}
            {activePage === 'vehicle-location' && <GpsMapPage />}
            {activePage === 'alerts' && <AlertsPage />}
          </div>
        </main>
      </div>

      {/* Footer Navigation Bar for Mobile / Tablet */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <MiningProvider>
      <AppContent />
    </MiningProvider>
  );
}
