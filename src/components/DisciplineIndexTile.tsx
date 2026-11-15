import { Sparkles } from 'lucide-react';
import type { FoodCategory, Habit } from '../types/discipline';
import { getDisciplineStatusLabel } from '../utils/discipline';

interface DisciplineIndexTileProps {
  score: number;
  habits: Habit[];
  sleepHours: number;
  waterMl: number;
  ateClean: boolean;
  foodCategories: FoodCategory[];
  studyLogged: number;
  studyTarget: number;
}

export function DisciplineIndexTile({
  score,
  habits,
  sleepHours,
  waterMl,
  ateClean,
  foodCategories,
  studyLogged,
  studyTarget,
}: DisciplineIndexTileProps) {
  const protCat =
    foodCategories.find((c) => c.id === 'protein') ||
    foodCategories.find((c) => c.name.toLowerCase().includes('prot')) ||
    null;

  const completedHabits = habits.filter((h) => h.completed).length;

  return (
    <section
      aria-labelledby="discipline-index-heading"
      className="glass-tile rounded-2xl p-4 sm:p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 shrink-0" />
            <h2 id="discipline-index-heading">Daily Discipline Index</h2>
          </div>
          <p className="text-xs text-gray-200 mt-1 font-medium">
            {getDisciplineStatusLabel(score)}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span
            data-testid="discipline-score"
            className="font-mono tabular-nums text-3xl font-extrabold tracking-tight text-white drop-shadow"
          >
            {score}%
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Daily discipline completion percentage"
        className="w-full bg-black/60 h-2.5 rounded-full mt-4 overflow-hidden border border-white/10"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(Math.max(score, 4), 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-white/10 text-center font-mono tabular-nums">
        <div className="bg-black/45 rounded-lg p-1.5 border border-white/10">
          <div className="text-[10px] text-gray-400 uppercase">Habits</div>
          <div className="text-xs font-bold text-gray-100 mt-0.5">
            {completedHabits}/{habits.length}
          </div>
        </div>
        <div className="bg-black/45 rounded-lg p-1.5 border border-white/10">
          <div className="text-[10px] text-gray-400 uppercase">Sleep</div>
          <div className="text-xs font-bold text-indigo-300 mt-0.5">{sleepHours}h</div>
        </div>
        <div className="bg-black/45 rounded-lg p-1.5 border border-white/10">
          <div className="text-[10px] text-gray-400 uppercase">Food</div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5 truncate">
            {protCat ? `${protCat.current}g P` : ateClean ? 'Clean' : 'Log'}
          </div>
        </div>
        <div className="bg-black/45 rounded-lg p-1.5 border border-white/10">
          <div className="text-[10px] text-gray-400 uppercase">Water</div>
          <div className="text-xs font-bold text-sky-300 mt-0.5">
            {(waterMl / 1000).toFixed(1)}L
          </div>
        </div>
        <div className="bg-black/45 rounded-lg p-1.5 border border-white/10">
          <div className="text-[10px] text-gray-400 uppercase">Study</div>
          <div className="text-xs font-bold text-purple-300 mt-0.5">
            {studyLogged}h{' '}
            <span className="text-[10px] text-gray-400 font-normal">/ {studyTarget}h</span>
          </div>
        </div>
      </div>
    </section>
  );
}
