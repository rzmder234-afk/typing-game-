"use client";

import { useState } from 'react';

interface SocialProps {
  friends: string[];
  onAddFriend: (name: string) => void;
  onRemoveFriend: (name: string) => void;
  onClose: () => void;
}

export function Social({ friends, onAddFriend, onRemoveFriend, onClose }: SocialProps) {
  const [search, setSearch] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() && !friends.includes(search.trim())) {
      onAddFriend(search.trim());
      setSearch('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-800 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[80vh]">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2 bg-rose-500 rounded-lg shadow-lg shadow-rose-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              SOCIAL HUB
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Manage your rivals</p>
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

        <div className="p-8 flex flex-col gap-6 overflow-hidden">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rival Designation..."
              className="flex-1 bg-slate-950/60 border-2 border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:border-rose-500 focus:outline-none transition-all placeholder:text-slate-700"
            />
            <button 
              type="submit"
              className="bg-rose-500 hover:bg-rose-400 text-white font-black px-6 rounded-xl transition-all shadow-lg shadow-rose-500/20"
            >
              ADD
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {friends.length === 0 ? (
              <div className="text-center py-10 text-slate-600">
                <p className="font-bold uppercase tracking-widest text-xs">No rivals designated yet</p>
                <p className="text-[10px] mt-2 italic">Add rival drivers to compare track times</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend} className="flex justify-between items-center bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs">
                      {friend.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-black text-white group-hover:text-rose-400 transition-colors">{friend}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveFriend(friend)}
                    className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          {"Rivals' scores appear in your Friend Leaderboards"}
        </div>
      </div>
    </div>
  );
}
