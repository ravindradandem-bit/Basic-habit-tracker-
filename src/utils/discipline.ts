import type { FoodCategory, Habit, StudyCategory } from '../types/discipline';

export interface DisciplineScoreInput {
  habits: Habit[];
  sleepHours: number;
  ateClean: boolean;
  waterMl: number;
  studyLogged: number;
  studyTarget: number;
}

export function getTotalStudyHours(categories: StudyCategory[]): {
  logged: number;
  target: number;
} {
  const logged = Math.round(categories.reduce((acc, c) => acc + (c.logged || 0), 0) * 10) / 10;
  const target = Math.round(categories.reduce((acc, c) => acc + (c.target || 0), 0) * 10) / 10;
  return { logged, target };
}

export function calculateDisciplineScore(input: DisciplineScoreInput): number {
  const habitComp = input.habits.length
    ? (input.habits.filter((h) => h.completed).length / input.habits.length) * 45
    : 0;
  const sleepComp = Math.min(Math.max(input.sleepHours, 0) / 8, 1) * 15;
  const foodComp = input.ateClean ? 15 : 0;
  const waterComp = Math.min(Math.max(input.waterMl, 0) / 3000, 1) * 15;
  const studyComp =
    input.studyTarget > 0
      ? Math.min(Math.max(input.studyLogged, 0) / input.studyTarget, 1) * 10
      : 10;
  return Math.round(habitComp + sleepComp + foodComp + waterComp + studyComp);
}

export function getDisciplineStatusLabel(score: number): string {
  if (score >= 80) return 'Flawless Execution — Unstoppable';
  if (score >= 50) return 'Strong momentum building';
  return 'Focus on high-priority locks';
}

export function toggleHabitItem(habits: Habit[], id: string): Habit[] {
  return habits.map((habit) => {
    if (habit.id !== id) return habit;
    const nextCompleted = !habit.completed;
    const updatedHistory = habit.weekHistory
      ? [...habit.weekHistory]
      : [true, true, false, true, true, false, false];
    updatedHistory[6] = nextCompleted;
    return {
      ...habit,
      completed: nextCompleted,
      streak: nextCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
      weekHistory: updatedHistory,
    };
  });
}

export function reorderHabits(habits: Habit[], index: number, direction: -1 | 1): Habit[] {
  const targetIndex = index + direction;
  if (index < 0 || index >= habits.length || targetIndex < 0 || targetIndex >= habits.length) {
    return habits;
  }
  const updated = [...habits];
  const [moved] = updated.splice(index, 1);
  updated.splice(targetIndex, 0, moved);
  return updated;
}

export function adjustFoodCategory(
  categories: FoodCategory[],
  id: string,
  delta: number
): FoodCategory[] {
  return categories.map((cat) => {
    if (cat.id !== id) return cat;
    const nextVal = Math.max(0, Math.round((cat.current + delta) * 10) / 10);
    return { ...cat, current: nextVal };
  });
}

export function adjustStudyCategory(
  categories: StudyCategory[],
  id: string,
  delta: number
): StudyCategory[] {
  return categories.map((cat) => {
    if (cat.id !== id) return cat;
    const nextLogged = Math.max(0, Math.round((cat.logged + delta) * 10) / 10);
    return { ...cat, logged: nextLogged };
  });
}

export function getHeatmapIntensity(score: number): number {
  if (score >= 90) return 4;
  if (score >= 70) return 3;
  if (score >= 45) return 2;
  if (score > 0) return 1;
  return 0;
}

export function validateBackgroundUrl(rawUrl: string): { valid: boolean; url: string; error?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, url: '', error: 'Enter an image URL to apply.' };
  }
  if (trimmed.startsWith('/assets/') || trimmed.startsWith('data:image/')) {
    return { valid: true, url: trimmed };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return { valid: true, url: parsed.toString() };
    }
    return { valid: false, url: '', error: 'URL must begin with https:// or http://' };
  } catch {
    return { valid: false, url: '', error: 'Please enter a valid image URL.' };
  }
}
