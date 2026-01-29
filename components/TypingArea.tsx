
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';

interface TypingAreaProps {
  text: string;
  onUpdate: (stats: { typed: string; errors: number }) => void;
  isActive: boolean;
  onFinish: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ text, onUpdate, isActive, onFinish }) => {
  const [userInput, setUserInput] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive) return;

    const newValue = e.target.value;
    const currentIdx = newValue.length - 1;

    // Only check if we typed something new
    if (newValue.length > userInput.length) {
      if (newValue[currentIdx] === text[currentIdx]) {
        soundService.playCorrect();
      } else {
        setErrorCount(prev => prev + 1);
        soundService.playIncorrect();
      }
    } else {
        // Backspace or deletion
        soundService.playTyping();
    }

    setUserInput(newValue);
    onUpdate({ typed: newValue, errors: errorCount });

    if (newValue.length === text.length) {
      onFinish();
    }
  };

  const getCharClass = (idx: number) => {
    if (idx >= userInput.length) return 'text-slate-500';
    return userInput[idx] === text[idx] 
      ? 'text-sky-400 font-bold' 
      : 'text-rose-500 bg-rose-500/20 rounded px-0.5';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative z-10 mono text-xl md:text-2xl leading-relaxed tracking-wide bg-slate-900/40 p-8 rounded-2xl border border-slate-700 min-h-[200px] select-none">
        {text.split('').map((char, i) => (
          <span key={i} className={`${getCharClass(i)} transition-all duration-100`}>
            {i === userInput.length && isActive && (
              <span className="absolute border-l-2 border-sky-400 h-8 ml-[-2px] animate-pulse"></span>
            )}
            {char}
          </span>
        ))}
      </div>
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleInput}
        disabled={!isActive}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-default resize-none"
        spellCheck={false}
      />
      {!isActive && userInput.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-slate-800/90 px-6 py-3 rounded-full border border-slate-600 shadow-2xl animate-bounce">
            <span className="text-sky-400 font-bold">Waiting to start...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
