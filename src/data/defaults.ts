import type {
  BackgroundConfig,
  DayTrend,
  FoodCategory,
  Habit,
  HeatmapDay,
  StudyCategory,
} from '../types/discipline';

export const GOJO_WALLPAPER_PATH = '/assets/aistudio/gojo_wallpaper_90f1da84.jpg';

export interface BackgroundPreset {
  id: string;
  name: string;
  subtitle: string;
  mode: 'image' | 'obsidian';
  imageUrl: string;
  defaultOverlay: number;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'gojo',
    name: 'Shibuya Domain',
    subtitle: 'Default monochrome artwork',
    mode: 'image',
    imageUrl: GOJO_WALLPAPER_PATH,
    defaultOverlay: 0.36,
  },
  {
    id: 'obsidian',
    name: 'Pure Obsidian',
    subtitle: 'Minimal dark ambient grid',
    mode: 'obsidian',
    imageUrl: '',
    defaultOverlay: 0.5,
  },
];

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  mode: 'image',
  presetId: 'gojo',
  imageUrl: GOJO_WALLPAPER_PATH,
  overlayOpacity: 0.36,
  tileOpacity: 0.62,
  imagePosition: 'center',
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Cold shower & mindfulness',
    streak: 9,
    completed: true,
    weekHistory: [true, true, true, false, true, true, true],
  },
  {
    id: '2',
    title: 'No sugar & junk food',
    streak: 14,
    completed: true,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: '3',
    title: 'Deep work block (90m)',
    streak: 4,
    completed: false,
    weekHistory: [true, true, false, true, true, false, false],
  },
  {
    id: '4',
    title: '10,000 steps walk',
    streak: 6,
    completed: false,
    weekHistory: [false, true, true, true, true, true, false],
  },
  {
    id: '5',
    title: 'Read 20 pages physical book',
    streak: 12,
    completed: false,
    weekHistory: [true, false, true, true, true, false, false],
  },
];

export const DEFAULT_FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'calories',
    name: 'Calories',
    current: 2150,
    target: 2400,
    unit: 'kcal',
    step: 100,
    color: '#10B981',
    isDefault: true,
  },
  {
    id: 'protein',
    name: 'Protein',
    current: 145,
    target: 175,
    unit: 'g',
    step: 10,
    color: '#38BDF8',
    isDefault: true,
  },
  {
    id: 'fibre',
    name: 'Dietary Fibre',
    current: 32,
    target: 38,
    unit: 'g',
    step: 5,
    color: '#A855F7',
    isDefault: true,
  },
  {
    id: 'carbs',
    name: 'Carbs',
    current: 210,
    target: 260,
    unit: 'g',
    step: 10,
    color: '#F59E0B',
    isDefault: true,
  },
  {
    id: 'fats',
    name: 'Healthy Fats',
    current: 62,
    target: 70,
    unit: 'g',
    step: 5,
    color: '#EC4899',
    isDefault: true,
  },
];

export const DEFAULT_STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: 'study_1',
    name: 'Engineering & Code',
    logged: 2.5,
    target: 3.0,
    color: '#38BDF8',
  },
  {
    id: 'study_2',
    name: 'Deep Reading & Theory',
    logged: 1.0,
    target: 1.5,
    color: '#818CF8',
  },
  {
    id: 'study_3',
    name: 'Language / Japanese',
    logged: 1.0,
    target: 1.0,
    color: '#34D399',
  },
];

export const WEEKLY_TREND_HISTORY: DayTrend[] = [
  { day: 'Mon', score: 80, date: '11/09' },
  { day: 'Tue', score: 100, date: '11/10' },
  { day: 'Wed', score: 60, date: '11/11' },
  { day: 'Thu', score: 90, date: '11/12' },
  { day: 'Fri', score: 85, date: '11/13' },
  { day: 'Sat', score: 100, date: '11/14' },
  { day: 'Sun', score: 51, date: '11/15' },
];

export const NOVEMBER_HEATMAP_BASE: HeatmapDay[] = [
  { day: 1, intensity: 3, score: 75 },
  { day: 2, intensity: 4, score: 95 },
  { day: 3, intensity: 2, score: 60 },
  { day: 4, intensity: 4, score: 100 },
  { day: 5, intensity: 3, score: 80 },
  { day: 6, intensity: 4, score: 90 },
  { day: 7, intensity: 2, score: 55 },
  { day: 8, intensity: 4, score: 90 },
  { day: 9, intensity: 3, score: 80 },
  { day: 10, intensity: 4, score: 100 },
  { day: 11, intensity: 2, score: 60 },
  { day: 12, intensity: 4, score: 90 },
  { day: 13, intensity: 3, score: 85 },
  { day: 14, intensity: 4, score: 100 },
  { day: 15, intensity: 2, score: 51 },
  { day: 16, intensity: 0, score: 0 },
  { day: 17, intensity: 0, score: 0 },
  { day: 18, intensity: 0, score: 0 },
  { day: 19, intensity: 0, score: 0 },
  { day: 20, intensity: 0, score: 0 },
  { day: 21, intensity: 0, score: 0 },
  { day: 22, intensity: 0, score: 0 },
  { day: 23, intensity: 0, score: 0 },
  { day: 24, intensity: 0, score: 0 },
  { day: 25, intensity: 0, score: 0 },
  { day: 26, intensity: 0, score: 0 },
  { day: 27, intensity: 0, score: 0 },
  { day: 28, intensity: 0, score: 0 },
  { day: 29, intensity: 0, score: 0 },
  { day: 30, intensity: 0, score: 0 },
];
