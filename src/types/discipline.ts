export type ViewTab = 'today' | 'week' | 'month';

export type AccentTheme = 'emerald' | 'indigo' | 'cyan';

export type BackgroundMode = 'image' | 'obsidian';

export type ImagePosition = 'top' | 'center' | 'bottom';

export interface BackgroundConfig {
  mode: BackgroundMode;
  presetId: string;
  imageUrl: string;
  overlayOpacity: number; // 0.1 to 0.85
  tileOpacity: number; // 0.35 to 0.85
  imagePosition: ImagePosition;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
  weekHistory: boolean[];
}

export interface FoodCategory {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  step: number;
  color: string;
  isDefault?: boolean;
}

export interface StudyCategory {
  id: string;
  name: string;
  logged: number;
  target: number;
  color: string;
}

export interface DayTrend {
  day: string;
  score: number;
  date: string;
}

export interface HeatmapDay {
  day: number;
  intensity: number;
  score: number;
}
