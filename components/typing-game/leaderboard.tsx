"use client";

import { useState, useMemo } from 'react';
import { GameMode, Difficulty, LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  userFriends: string[];
  onClose: () => void;
}

const MOCK_NAMES = ["TurboTyper", "NeonSwift", "GhostKeys", "ShiftMaster", "VeloWiz", "PistonPress", "NitroFinger", "ApexAlpha"];

export function Leaderboard({ entries, userFriends, onClose }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [modeFilter, setModeFilter] = useState<GameMode>(GameMode.RACE);
  const [diffFilter, setDiffFilter] = useState<Difficulty>(Difficulty.MEDIUM);

  const allEntries = useMemo(() => {
    const mockEntries: LeaderboardEntry[] = [];
    
    Object.values(GameMode).forEach(mode => {
      Object.values(Difficulty).forEach(diff => {
        MOCK_NAMES.forEach((name, i) => {
          const baseWpm = diff === Difficulty.EASY ? 40 : diff === Difficulty.MEDIUM ? 70 : 100;
          mockEntries.push({
            id: `mock-${mode}-${diff}-${i}`,
            name,
            wpm: baseWpm + Math.floor(Math.random() * 30),
            accuracy: 94 + Math.floor(Math.random() * 6),
            mode,
            difficulty: diff,
            level: mode === GameMode.ENDURANCE ? Math.floor(Math.random() * 10) + 1 : undefined,
            timestamp: Date.now() - (Math.random() * 10000000),
            isUser: false
          });
        });
      });
    });

    return [...entries, ...mockEntries];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let list = allEntries.filter(e => e.mode === modeFilter);
    if (modeFilter !== GameMode.PRACTICE) {
      list = list.filter(e => e.difficulty === diffFilter);
    }

    if (activeTab === 'friends') {
      list = list.filter(e => e.isUser || userFriends.includes(e.name));
    }

    return list.sort((a, b) => {
      if (modeFilter === GameMode.PRACTICE) return b.accuracy - a.accuracy;
      if (modeFilter === GameMode.ENDURANCE) {
        if ((b.level || 0) !== (a.level || 0)) return (b.level || 0) - (a.level || 0);
      }
      return b.wpm - a.wpm;
    }).slice(0, 10);
  }, [allEntries, modeFilter, diffFilter, activeTab, userFriends]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-800 w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-[80vh]">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              HALL OF FAME
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

        <div className="p-6 bg-slate-800/20 border-b border-slate-800 flex flex-wrap gap-4 items-center">
          <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setActiveTab('global')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Global
            </button>
            <button 
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'friends' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Friends
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>

          <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-700">
            {Object.values(GameMode).map(m => (
              <button 
                key={m}
                onClick={() => setModeFilter(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${modeFilter === m ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m}
              </button>
            ))}
          </div>

          {modeFilter !== GameMode.PRACTICE && (
            <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-700">
              {Object.values(Difficulty).map(d => (
                <button 
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${diffFilter === d ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-bold tracking-widest uppercase text-sm">No records found for this track</p>
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`group flex items-center p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                  entry.isUser 
                    ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/5' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="w-12 flex justify-center">
                  <span className={`text-xl font-black ${
                    index === 0 ? 'text-amber-400' : 
                    index === 1 ? 'text-slate-300' : 
                    index === 2 ? 'text-amber-700' : 'text-slate-600'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-white group-hover:text-sky-400 transition-colors">
                      {entry.name}
                    </span>
                    {entry.isUser && (
                      <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">YOU</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-8 items-center pr-4">
                  {modeFilter === GameMode.ENDURANCE && (
                    <div className="text-right">
                      <div className="text-rose-400 font-black text-xl">{entry.level}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">LEVEL</div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-white font-black text-xl">{entry.wpm}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">WPM</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-black text-xl">{entry.accuracy}%</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">ACC</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-950/50 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] border-t border-slate-800">
          Showing top qualifiers for current track conditions
        </div>
      </div>
    </div>
  );
}
