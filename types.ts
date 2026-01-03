
export enum ScreenState {
  MENU = 'MENU',
  PROFILES = 'PROFILES',
  LEVEL_SELECT = 'LEVEL_SELECT',
  BRIEFING = 'BRIEFING',
  GAMEPLAY = 'GAMEPLAY',
  RETENTION_MODE = 'RETENTION_MODE',
  COMPARISON = 'COMPARISON',
  RESULT = 'RESULT',
  OPTIONS = 'OPTIONS',
}

export enum Language {
  HTML = 'HTML',
  CSS = 'CSS',
  JAVASCRIPT = 'JAVASCRIPT',
  CPP = 'C++',
  JAVA = 'JAVA',
}

export enum Theme {
  TERMINAL = 'TERMINAL',
  FRUTIGER = 'FRUTIGER',
  IDE = 'IDE',
}

export interface Profile {
  id: string;
  name: string;
  levelsCompleted: number;
  errorsMade: number;
  accuracyRate: number; // 0-100
  fastestClear: string; // "MM:SS"
  retentionBest: number; // Max nodes cleared in one retention session
  created: number;
}

export interface Level {
  id: string;
  chapter: number;
  subChapter?: number;
  title: string;
  language: Language;
  description: string;
  objective: string;
  targetOutput: string; // Description or HTML string
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameSession {
  levelId: string;
  startTime: number;
  attempts: number;
  code: string;
  accuracy: number;
  timeElapsed: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  isRetention?: boolean;
  score?: number;
}
