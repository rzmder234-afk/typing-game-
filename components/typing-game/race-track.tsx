"use client";

interface RaceTrackProps {
  playerProgress: number;
  opponentProgress: number;
  playerName?: string;
  opponentName?: string;
}

export function RaceTrack({ 
  playerProgress, 
  opponentProgress, 
  playerName = "You", 
  opponentName = "AI Ghost" 
}: RaceTrackProps) {
  const isMoving = (progress: number) => progress > 0 && progress < 100;
  const isPractice = opponentProgress < 0;

  return (
    <div className="w-full bg-slate-900/80 p-8 rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden relative group/track">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="absolute left-8 top-1/4 w-32 h-2 bg-black/40 blur-sm opacity-50 rounded-full"></div>
      {!isPractice && <div className="absolute left-8 bottom-1/4 w-32 h-2 bg-black/40 blur-sm opacity-50 rounded-full"></div>}

      <div className="flex flex-col gap-12 relative z-10 py-4">
        {!isPractice && (
          <div className="h-[4px] w-full absolute top-1/2 left-0 transform -translate-y-1/2 flex gap-6 overflow-hidden opacity-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="min-w-[50px] h-full bg-yellow-400"></div>
            ))}
          </div>
        )}

        <div className={`relative h-20 flex items-center ${isPractice ? 'justify-center' : ''}`}>
          <div 
            className="absolute transition-all duration-300 ease-out z-20" 
            style={{ left: `${Math.min(playerProgress, 92)}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-sky-400 mb-2 uppercase tracking-tighter bg-slate-950/80 px-2 py-0.5 rounded border border-sky-500/30 shadow-lg">{playerName}</span>
              
              <div className={`relative ${isMoving(playerProgress) ? 'animate-pulse' : ''}`}>
                {isMoving(playerProgress) && <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-4 bg-sky-500/40 blur-md rounded-full origin-right"></div>}
                <div className={`absolute -inset-4 bg-sky-500/10 blur-xl rounded-full transition-opacity duration-300 ${isMoving(playerProgress) ? 'opacity-100' : 'opacity-0'}`}></div>
                <svg className="w-20 h-12 text-sky-500 drop-shadow-[0_0_12px_rgba(14,165,233,0.6)] transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 17c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm-15 0c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm15-7l-1.4-3.6c-.4-1-1.3-1.4-2.1-1.4h-12c-.8 0-1.7.4-2.1 1.4l-1.4 3.6h-2.5v7h2.1c.2-1.7 1.7-3 3.4-3s3.2 1.3 3.4 3h6.2c.2-1.7 1.7-3 3.4-3s3.2 1.3 3.4 3h2.1v-7h-2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {!isPractice && (
          <div className="relative h-20 flex items-center">
            <div 
              className="absolute transition-all duration-300 ease-out z-20" 
              style={{ left: `${Math.min(opponentProgress, 92)}%` }}
            >
              <div className="flex flex-col items-center opacity-90">
                <span className="text-[10px] font-black text-rose-400 mb-2 uppercase tracking-tighter bg-slate-950/80 px-2 py-0.5 rounded border border-rose-500/30 shadow-lg">{opponentName}</span>
                <div className={`relative ${isMoving(opponentProgress) ? 'animate-pulse' : ''}`}>
                  {isMoving(opponentProgress) && <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-4 bg-rose-500/40 blur-md rounded-full origin-right"></div>}
                  <div className={`absolute -inset-4 bg-rose-500/10 blur-xl rounded-full transition-opacity duration-300 ${isMoving(opponentProgress) ? 'opacity-100' : 'opacity-0'}`}></div>
                  <svg className="w-20 h-12 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM5 11l1.14-3.42C6.29 7.21 6.61 7 7 7h10c.39 0 .71.21.86.58L19 11H5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col pointer-events-none border-l-4 border-white/10">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex-1 flex">
            <div className={`flex-1 ${i % 2 === 0 ? 'bg-white/80' : 'bg-slate-900'}`}></div>
            <div className={`flex-1 ${i % 2 !== 0 ? 'bg-white/80' : 'bg-slate-900'}`}></div>
          </div>
        ))}
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-500 via-white to-rose-500 opacity-60"></div>
    </div>
  );
}
