
export enum GameStatus {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export enum GameMode {
  RACE = 'RACE',
  PRACTICE = 'PRACTICE',
  ENDURANCE = 'ENDURANCE'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface UserProfile {
  name: string;
  totalRaces: number;
  bestWpm: number;
  bestAccuracy: number;
  maxEnduranceLevel: number;
  totalCharsTyped: number;
  friends: string[]; // List of friend names/designations
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  progress: number;
}

export interface HistoryEntry {
  wpm: number;
  accuracy: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  mode: GameMode;
  difficulty: Difficulty;
  level?: number;
  timestamp: number;
  isUser?: boolean;
}
