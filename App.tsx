
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Difficulty, HistoryEntry, GameMode, LeaderboardEntry, UserProfile } from './types';
import { DEFAULT_TEXTS, DIFFICULTY_WPM } from './constants';
import { generateTypingText } from './services/geminiService';
import { soundService } from './services/soundService';
import TypingArea from './components/TypingArea';
import Stats from './components/Stats';
import RaceTrack from './components/RaceTrack';
import Summary from './components/Summary';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Social from './components/Social';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [mode, setMode] = useState<GameMode>(GameMode.RACE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('velocity_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.friends) parsed.friends = []; // Migration for older saves
        return parsed;
      } catch (e) { console.error(e); }
    }
    return {
      name: localStorage.getItem('velocity_player_name') || 'New Driver',
      totalRaces: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      maxEnduranceLevel: 0,
      totalCharsTyped: 0,
      friends: []
    };
  });

  const [text, setText] = useState<string>(DEFAULT_TEXTS.BASIC);
  const [typedCount, setTypedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [level, setLevel] = useState(1);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiProgressRef = useRef(0);
  const [aiDisplayProgress, setAiDisplayProgress] = useState(0);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('velocity_leaderboard');
    if (saved) {
      try {
        setLeaderboardEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse leaderboard", e);
      }
    }
  }, []);

  // Persist profile
  useEffect(() => {
    localStorage.setItem('velocity_profile', JSON.stringify(userProfile));
    localStorage.setItem('velocity_player_name', userProfile.name);
  }, [userProfile]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundService.setMute(newMuted);
  };

  const calculateWPM = useCallback((chars: number, seconds: number) => {
    if (seconds === 0) return 0;
    return Math.round((chars / 5) / (seconds / 60));
  }, []);

  const calculateAccuracy = useCallback((chars: number, errors: number) => {
    if (chars === 0) return 100;
    const acc = ((chars - errors) / chars) * 100;
    return Math.max(0, Math.round(acc));
  }, []);

  // AI Opponent Simulation Logic
  useEffect(() => {
    let aiInterval: ReturnType<typeof setInterval> | undefined;
    if (status === GameStatus.PLAYING && mode !== GameMode.PRACTICE) {
      const baseWPM = DIFFICULTY_WPM[difficulty];
      const targetWPM = mode === GameMode.ENDURANCE ? baseWPM + (level - 1) * 8 : baseWPM;
      const charsPerSecond = (targetWPM * 5) / 60;
      const step = 0.5; 
      
      aiInterval = setInterval(() => {
        aiProgressRef.current += (charsPerSecond * step);
        const progressPercentage = (aiProgressRef.current / text.length) * 100;
        setAiDisplayProgress(Math.min(100, progressPercentage));
        
        if (mode === GameMode.ENDURANCE && progressPercentage >= 100) {
          handleFinish();
        }
      }, step * 1000);
    }
    return () => {
      if (aiInterval) clearInterval(aiInterval);
    };
  }, [status, difficulty, text.length, mode, level]);

  const startCountdown = async () => {
    setIsLoading(true);
    try {
      const topic = mode === GameMode.PRACTICE 
        ? "typing accuracy, mindfulness, and slow deliberate movements" 
        : difficulty === Difficulty.HARD 
          ? "advanced technical concepts and complex vocabulary" 
          : "speed racing and precision";
          
      const newText = await generateTypingText(topic);
      setText(newText || DEFAULT_TEXTS.BASIC);
    } catch (e) {
      console.error(e);
      setText(DEFAULT_TEXTS.BASIC);
    } finally {
      setIsLoading(false);
      setStatus(GameStatus.COUNTDOWN);
      setTypedCount(0);
      setErrorCount(0);
      setTime(0);
      setLevel(1);
      setHistory([]);
      aiProgressRef.current = 0;
      setAiDisplayProgress(0);
    }
  };

  useEffect(() => {
    let cdTimer: ReturnType<typeof setTimeout> | undefined;
    if (status === GameStatus.COUNTDOWN) {
      soundService.playCountdown(countdown === 0);
      if (countdown > 0) {
        cdTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setStatus(GameStatus.PLAYING);
        setCountdown(3);
      }
    }
    return () => {
      if (cdTimer) clearTimeout(cdTimer);
    };
  }, [status, countdown]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      timerRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          const currentWpm = calculateWPM(typedCount, newTime);
          const currentAcc = calculateAccuracy(typedCount, errorCount);
          setHistory(h => [...h, { wpm: currentWpm, accuracy: currentAcc, timestamp: Date.now() }]);
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, typedCount, errorCount, calculateWPM, calculateAccuracy]);

  const handleUpdate = useCallback((stats: { typed: string; errors: number }) => {
    setTypedCount(stats.typed.length);
    setErrorCount(stats.errors);
  }, []);

  const handleFinish = useCallback(() => {
    setStatus(GameStatus.FINISHED);
    soundService.playFinish();
    
    const currentWpm = calculateWPM(typedCount, time);
    const currentAccuracy = calculateAccuracy(typedCount, errorCount);
    
    // Update Leaderboard
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: userProfile.name || "Anonymous Pilot",
      wpm: currentWpm,
      accuracy: currentAccuracy,
      mode,
      difficulty,
      level: mode === GameMode.ENDURANCE ? level : undefined,
      timestamp: Date.now(),
      isUser: true
    };

    setLeaderboardEntries(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem('velocity_leaderboard', JSON.stringify(updated));
      return updated;
    });

    // Update User Profile Stats
    setUserProfile(prev => ({
      ...prev,
      totalRaces: prev.totalRaces + 1,
      bestWpm: Math.max(prev.bestWpm, mode === GameMode.RACE ? currentWpm : 0),
      bestAccuracy: Math.max(prev.bestAccuracy, currentAccuracy),
      maxEnduranceLevel: Math.max(prev.maxEnduranceLevel, mode === GameMode.ENDURANCE ? level : 0),
      totalCharsTyped: prev.totalCharsTyped + typedCount
    }));
  }, [typedCount, time, errorCount, mode, difficulty, level, userProfile.name, calculateWPM, calculateAccuracy]);

  const handleEnduranceNext = useCallback(async () => {
    setIsLoading(true);
    try {
      setUserProfile(prev => ({ ...prev, totalCharsTyped: prev.totalCharsTyped + typedCount }));
      setLevel(prev => prev + 1);
      const newText = await generateTypingText(`intense focus level ${level + 1}`);
      setText(newText || DEFAULT_TEXTS.BASIC);
      setTypedCount(0);
      aiProgressRef.current = 0;
      setAiDisplayProgress(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [level, typedCount]);

  const resetGame = () => {
    setStatus(GameStatus.IDLE);
    setTypedCount(0);
    setErrorCount(0);
    setTime(0);
    setLevel(1);
    setHistory([]);
    aiProgressRef.current = 0;
    setAiDisplayProgress(0);
  };

  const currentWpm = calculateWPM(typedCount, time);
  const currentAccuracy = calculateAccuracy(typedCount, errorCount);
  const playerProgress = (typedCount / text.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-sky-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-rose-500 rounded-full blur-[150px]"></div>
      </div>

      <header className="w-full max-w-6xl flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20" onClick={resetGame} style={{ cursor: 'pointer' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white leading-none">VELOCITY</h1>
            <p className="text-sky-400 text-xs font-bold tracking-[0.3em]">TYPE RACER</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSocial(true)}
            className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white group"
          >
            <svg className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Social</span>
          </button>

          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white group"
          >
            <svg className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">{userProfile.name}</span>
          </button>

          <button 
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white group"
          >
            <svg className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Rankings</span>
          </button>

          <button 
            onClick={toggleMute}
            className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center gap-8 relative z-10">
        {status === GameStatus.IDLE && (
          <div className="flex flex-col items-center text-center max-w-3xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">GAME MODE</h2>
            
            <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 mb-10 w-full max-w-lg">
              {(Object.keys(GameMode) as Array<keyof typeof GameMode>).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(GameMode[m])}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    mode === GameMode[m] 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-2xl">
              {mode === GameMode.RACE && "Classic head-to-head race against an AI bot."}
              {mode === GameMode.PRACTICE && "No timer, no opponent. Focus purely on typing accuracy."}
              {mode === GameMode.ENDURANCE && "Endless typing. AI gets faster every round. How long can you last?"}
            </p>

            {mode !== GameMode.PRACTICE && (
              <div className="mb-10 w-full max-w-xl">
                <h3 className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-80">Initial Difficulty</h3>
                <div className="grid grid-cols-3 gap-6">
                  {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map((diff) => {
                    const isActive = difficulty === Difficulty[diff];
                    const wpm = DIFFICULTY_WPM[Difficulty[diff]];
                    return (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(Difficulty[diff])}
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 transform ${
                          isActive 
                            ? 'bg-sky-500/10 border-sky-500 shadow-xl shadow-sky-500/20 animate-selection scale-[1.05]' 
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:scale-105 active:scale-95'
                        }`}
                      >
                        <span className={`text-sm font-black tracking-widest uppercase mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>{diff}</span>
                        <span className={`text-xs font-bold ${isActive ? 'text-sky-400' : 'text-slate-600'}`}>{wpm} WPM</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button 
              onClick={startCountdown}
              disabled={isLoading || !userProfile.name.trim()}
              className="group relative px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-2xl hover:bg-sky-400 hover:text-white transition-all transform hover:scale-[1.05] active:scale-95 shadow-2xl disabled:opacity-50"
            >
              {isLoading ? "LOADING TRACK..." : "START ENGINE"}
            </button>
          </div>
        )}

        {status === GameStatus.COUNTDOWN && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-[180px] font-black text-white animate-ping">
              {countdown === 0 ? "GO!" : countdown}
            </div>
          </div>
        )}

        {status === GameStatus.PLAYING && (
          <>
            <RaceTrack 
              playerProgress={playerProgress} 
              opponentProgress={mode === GameMode.PRACTICE ? -1 : aiDisplayProgress}
              playerName={userProfile.name}
              opponentName={mode === GameMode.ENDURANCE ? `LVL ${level} Bot` : `${difficulty} Bot`}
            />
            <Stats 
              wpm={currentWpm} 
              accuracy={currentAccuracy} 
              time={time} 
              isPractice={mode === GameMode.PRACTICE}
            />
            <TypingArea 
              text={text} 
              onUpdate={handleUpdate} 
              isActive={status === GameStatus.PLAYING}
              onFinish={mode === GameMode.ENDURANCE ? handleEnduranceNext : handleFinish}
            />
            
            <button 
              onClick={resetGame}
              className="mt-4 text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Exit to Menu
            </button>
          </>
        )}

        {status === GameStatus.FINISHED && (
          <Summary 
            wpm={currentWpm} 
            accuracy={currentAccuracy} 
            time={time} 
            history={history}
            onRestart={resetGame}
            mode={mode}
            level={level}
          />
        )}
      </main>

      {showLeaderboard && (
        <Leaderboard 
          entries={leaderboardEntries} 
          userFriends={userProfile.friends}
          onClose={() => setShowLeaderboard(false)} 
        />
      )}

      {showProfile && (
        <Profile 
          profile={userProfile}
          onUpdateName={(name) => setUserProfile(p => ({ ...p, name }))}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showSocial && (
        <Social 
          friends={userProfile.friends}
          onAddFriend={(name) => setUserProfile(p => ({ ...p, friends: [...p.friends, name] }))}
          onRemoveFriend={(name) => setUserProfile(p => ({ ...p, friends: p.friends.filter(f => f !== name) }))}
          onClose={() => setShowSocial(false)}
        />
      )}

      {isLoading && status !== GameStatus.IDLE && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-white font-black tracking-widest animate-pulse">GENERATING NEXT LEVEL...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
