
export enum Difficulty {
  Easy = 'easy',
  Normal = 'normal',
  Hard = 'hard',
}

export interface Vessel {
  cap: number;
  base: number;
  image: string;
}

export interface DifficultyConfig {
  label: string;
  timeLimit: number;
  targetScore: number;
  color: string;
  bonusPerSecond: number;
}

export interface ModeConfig {
  tolerance: number;
  speed: number;
  showTicks: boolean;
  showNumbers: boolean;
  showTarget: boolean;
}

export type GameView = 'title' | 'story' | 'mode' | 'game' | 'result';

export interface ScoreEntry {
  name: string;
  score: number;
  mode: Difficulty;
  at?: number; // timestamp
}
