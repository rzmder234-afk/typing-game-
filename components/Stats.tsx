
import React from 'react';

interface StatsProps {
  wpm: number;
  accuracy: number;
  time: number;
  isPractice?: boolean;
}

const Stats: React.FC<StatsProps> = ({ wpm, accuracy, time, isPractice }) => {
  if (isPractice) {
    return (
      <div className="w-full max-w-4xl flex justify-center">
        <div className="bg-slate-800/40 p-6 rounded-2xl border-2 border-emerald-500/30 flex flex-col items-center min-w-[280px] shadow-lg shadow-emerald-500/5 transition-all animate-in fade-in zoom-in duration-500">
          <span className="text-xs text-emerald-400 uppercase tracking-[0.4em] font-black mb-3">Accuracy Focus</span>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-emerald-400 mono">{Math.round(accuracy)}</span>
            <span className="text-2xl text-slate-500 font-bold">%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Speed</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-sky-400 mono">{Math.round(wpm)}</span>
          <span className="text-sm text-slate-500">WPM</span>
        </div>
      </div>
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Accuracy</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-emerald-400 mono">{Math.round(accuracy)}</span>
          <span className="text-sm text-slate-500">%</span>
        </div>
      </div>
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Time</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-amber-400 mono">{time}</span>
          <span className="text-sm text-slate-500">SEC</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
