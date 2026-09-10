import React, { useState } from 'react';
import { useMining } from '../context/MiningContext';
import { UserRole } from '../types';
import { NmdcLogo } from './NmdcLogo';
import { Lock, Mail, User, Phone, Truck, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActivePage } = useMining();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Form fields
  const [email, setEmail] = useState('cp.sharma@nmdc.co.in');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Dr. C. P. Sharma');
  const [phone, setPhone] = useState('+91 94252 88410');
  const [role, setRole] = useState<UserRole>('Safety Controller');
  const [vehicleName, setVehicleName] = useState('Komatsu HD785-7');
  const [vehicleNumber, setVehicleNumber] = useState('DMP-104');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email and security password.');
      return;
    }

    if (isSignUp) {
      if (!name || !phone) {
        setErrorMessage('All signup fields are required for NMDC security clearance.');
        return;
      }
      if (role === 'Dumper Driver' && (!vehicleName || !vehicleNumber)) {
        setErrorMessage('Vehicle Name and Vehicle Number are required for Dumper Driver role.');
        return;
      }
    }

    login({
      name: isSignUp ? name : 'Dr. C. P. Sharma',
      email,
      phone: isSignUp ? phone : '+91 94252 88410',
      role: isSignUp ? role : 'Safety Controller',
      vehicleName: role === 'Dumper Driver' ? vehicleName : undefined,
      vehicleNumber: role === 'Dumper Driver' ? vehicleNumber : undefined,
    });
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 bg-neutral-950 relative overflow-hidden">
      {/* Background industrial grid accent */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 sm:p-8 shadow-2xl shadow-black backdrop-blur-xl">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <NmdcLogo size="lg" />
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wider">
            MININGDRIVER ACCESS
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Bailadila Iron Ore Mines Telematics Portal
          </p>
        </div>

        {/* Quick Demo Sign-in preset chips */}
        <div className="mb-5 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Quick 1-Click Role Login</span>
            <span className="text-amber-500 font-bold">PRE-CLEARED</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                login({
                  name: 'Dr. C. P. Sharma',
                  email: 'cp.sharma@nmdc.co.in',
                  phone: '+91 94252 88410',
                  role: 'Safety Controller',
                });
              }}
              className="px-2.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-left border border-neutral-700/80 hover:border-amber-500/50 transition flex items-center justify-between group"
            >
              <span className="text-amber-400 font-semibold group-hover:text-amber-300">Safety Controller</span>
              <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-amber-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                login({
                  name: 'Ramesh Verma',
                  email: 'ramesh.verma@nmdc.co.in',
                  phone: '+91 98765 43210',
                  role: 'Dumper Driver',
                  vehicleName: 'Komatsu HD785-7',
                  vehicleNumber: 'DMP-104',
                });
              }}
              className="px-2.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-left border border-neutral-700/80 hover:border-amber-500/50 transition flex items-center justify-between group"
            >
              <span className="text-cyan-400 font-semibold group-hover:text-cyan-300">Dumper Driver</span>
              <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400" />
            </button>
          </div>
        </div>

        {/* LARGE SWITCH: LOGIN / SIGNUP */}
        <div className="bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 mb-6 flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
              !isSignUp
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Portal Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
              isSignUp
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            New Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Full Operator Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Verma"
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Operational Role Selector */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Operational Role
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    <option value="Safety Controller">Safety Controller (Dispatch)</option>
                    <option value="Dumper Driver">Dumper Driver (In-Cab HUD)</option>
                    <option value="Telematics Engineer">Telematics Engineer (IoT & Radar)</option>
                    <option value="Ministry Auditor">Ministry Auditor (DGMS Inspect)</option>
                  </select>
                </div>
              </div>

              {/* Dumper Driver Conditional Fields */}
              {role === 'Dumper Driver' && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 font-bold uppercase">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Assigned Mining Equipment</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      Vehicle Name / Heavy Shovel Model
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleName}
                      onChange={(e) => setVehicleName(e.target.value)}
                      placeholder="e.g. Komatsu HD785-7 or CAT 777E"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      Vehicle Number / Fleet ID
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="e.g. DMP-104"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email Id */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Official Email Id
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@nmdc.co.in"
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Security Password */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-mono font-bold text-sm tracking-wide shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{isSignUp ? 'Register & Enter Dashboard' : 'Authenticate & Enter Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back to landing link */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <button
            onClick={() => setActivePage('landing')}
            className="hover:text-amber-400 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Overview Page</span>
          </button>
          <span>NMDC Kirandul Complex</span>
        </div>
      </div>
    </div>
  );
};
