"use client";

import { UserProfile } from '@/lib/types';

interface ProfileProps {
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  onClose: () => void;
}

export function Profile({ profile, onUpdateName, onClose }: ProfileProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-800 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2 bg-sky-500 rounded-lg shadow-lg shadow-sky-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              PILOT PROFILE
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <label className="block text-sky-400 text-[10px] font-black tracking-[0.4em] uppercase opacity-80">Pilot Designation</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={(e) => onUpdateName(e.target.value)}
              placeholder="Enter Pilot Name..."
              maxLength={20}
              className="w-full bg-slate-950/60 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white font-black text-2xl focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Career Speed</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{profile.bestWpm}</span>
                <span className="text-xs text-slate-600 font-bold">MAX WPM</span>
              </div>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Max Precision</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-400">{profile.bestAccuracy}%</span>
                <span className="text-xs text-slate-600 font-bold">ACC</span>
              </div>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Endurance Record</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-rose-500">LVL {profile.maxEnduranceLevel}</span>
              </div>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sessions Logged</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-500">{profile.totalRaces}</span>
                <span className="text-xs text-slate-600 font-bold">DRIVES</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Data Processed</span>
              <span className="text-sky-400 font-mono font-bold">{profile.totalCharsTyped.toLocaleString()} CHARS</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-sky-500/50 w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-950/50 border-t border-slate-800 mt-auto">
          <button 
            onClick={onClose}
            className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:bg-sky-500 hover:text-white transition-all transform active:scale-95"
          >
            CONFIRM CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}
