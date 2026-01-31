"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryEntry, GameMode } from '@/lib/types';

interface SummaryProps {
  wpm: number;
  accuracy: number;
  time: number;
  history: HistoryEntry[];
  onRestart: () => void;
  mode: GameMode;
  level?: number;
}

export function Summary({ wpm, accuracy, time, history, onRestart, mode, level }: SummaryProps) {
  const isPractice = mode === GameMode.PRACTICE;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-4xl space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white mb-2">
          {isPractice ? "Session Complete!" : "Race Complete!"}
        </h2>
        <p className="text-slate-400">
          {isPractice 
            ? "Accuracy is the foundation of speed. Great focus!" 
            : mode === GameMode.ENDURANCE 
              ? `You survived up to Level ${level}! Incredible endurance.`
              : "Great run, here is how you performed."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!isPractice && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
            <div className="text-sky-400 text-5xl font-black mb-1">{wpm}</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Final WPM</div>
          </div>
        )}
        
        <div className={`bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center ${isPractice ? 'md:col-span-3' : ''}`}>
          <div className="text-emerald-400 text-5xl font-black mb-1">{accuracy}%</div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Accuracy</div>
        </div>

        {!isPractice && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
            {mode === GameMode.ENDURANCE ? (
              <>
                <div className="text-rose-400 text-5xl font-black mb-1">{level}</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Laps Cleared</div>
              </>
            ) : (
              <>
                <div className="text-amber-400 text-5xl font-black mb-1">{time}s</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Total Time</div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700 h-[300px]">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
          {isPractice ? "Accuracy consistency" : "Performance curve"}
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="timestamp" hide />
            <YAxis stroke="#94a3b8" domain={isPractice ? [50, 100] : [0, 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              itemStyle={{ color: isPractice ? '#10b981' : '#38bdf8' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey={isPractice ? "accuracy" : "wpm"} 
              stroke={isPractice ? "#10b981" : "#38bdf8"} 
              strokeWidth={4} 
              dot={{ fill: isPractice ? "#10b981" : '#38bdf8', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button 
        onClick={onRestart}
        className="w-full bg-white text-slate-900 font-black text-xl py-4 rounded-2xl hover:bg-sky-400 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
