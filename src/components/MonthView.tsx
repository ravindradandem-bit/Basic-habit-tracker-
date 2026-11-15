import { Flame, Sparkles } from 'lucide-react';
import { NOVEMBER_HEATMAP_BASE } from '../data/defaults';
import type { Habit } from '../types/discipline';
import { getHeatmapIntensity } from '../utils/discipline';

interface MonthViewProps {
  habits: Habit[];
  todayScore: number;
  studyLogged: number;
}

export function MonthView({ habits, todayScore, studyLogged }: MonthViewProps) {
  const heatmapDays = NOVEMBER_HEATMAP_BASE.map((item) =>
    item.day === 15
      ? { ...item, score: todayScore, intensity: getHeatmapIntensity(todayScore) }
      : item
  );

  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const bestHabit = habits.reduce<Habit | null>(
    (best, h) => (!best || h.streak > best.streak ? h : best),
    null
  );
  const monthlyStudyTotal = (79.5 + studyLogged).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <section
        aria-labelledby="month-heatmap-heading"
        className="lg:col-span-7 glass-tile rounded-2xl p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h2 id="month-heatmap-heading">November Heatmap</h2>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">30-day discipline streak intensity</p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-200 bg-purple-950/60 border border-purple-500/35 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">
            Nov 2026
          </span>
        </div>

        <div className="bg-black/50 rounded-xl p-3 border border-white/10">
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono tabular-nums">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-[10px] text-gray-400 py-0.5">
                {d}
              </span>
            ))}

            {heatmapDays.map((item) => {
              const isPast = item.day <= 15;
              const isToday = item.day === 15;

              let cellBg = 'bg-white/5 border-white/5 text-gray-500';
              if (isPast) {
                if (item.intensity === 4) {
                  cellBg =
                    'bg-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                } else if (item.intensity === 3) {
                  cellBg = 'bg-emerald-600 text-white font-medium';
                } else if (item.intensity === 2) {
                  cellBg = 'bg-indigo-600/85 text-white';
                } else {
                  cellBg = 'bg-indigo-950 text-gray-300';
                }
              }

              return (
                <div
                  key={item.day}
                  title={`Nov ${item.day}: ${isPast ? `${item.score}% execution` : 'Upcoming'}`}
                  aria-label={`November ${item.day}: ${
                    isPast ? `${item.score} percent execution` : 'Upcoming'
                  }`}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[11px] border transition-transform hover:scale-105 ${cellBg} ${
                    isToday ? 'ring-2 ring-emerald-300 ring-offset-1 ring-offset-black' : ''
                  }`}
                >
                  <span>{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mt-3 pt-2.5 border-t border-white/10">
            <span>Less active</span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/10" />
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-950" />
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            </div>
            <span>Peak focus</span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="month-hall-heading"
        className="lg:col-span-5 glass-tile rounded-2xl p-4 sm:p-5 space-y-3"
      >
        <h2
          id="month-hall-heading"
          className="text-xs font-bold text-white uppercase tracking-wider"
        >
          Monthly Hall of Discipline
        </h2>

        <div className="grid grid-cols-2 gap-2.5 font-mono tabular-nums">
          <div className="glass-subtile rounded-xl p-3 border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Current Streak</div>
            <div className="text-lg font-extrabold text-amber-300 flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 shrink-0" />
              <span>{longestStreak} Days</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Personal Record: 28d</p>
          </div>

          <div className="glass-subtile rounded-xl p-3 border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Nutrition Adherence</div>
            <div className="text-lg font-extrabold text-emerald-300 mt-0.5">93.2%</div>
            <p className="text-[10px] text-gray-400 mt-1">162g avg daily protein</p>
          </div>

          <div className="glass-subtile rounded-xl p-3 border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Best Habit</div>
            <div className="text-xs font-bold text-white mt-1.5 truncate">
              {bestHabit ? bestHabit.title : 'None yet'}
            </div>
            <p className="text-[10px] text-emerald-400 mt-1">
              {bestHabit ? `${bestHabit.streak}d active streak` : 'Start logging'}
            </p>
          </div>

          <div className="glass-subtile rounded-xl p-3 border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Total Study</div>
            <div className="text-lg font-extrabold text-purple-300 mt-0.5">
              {monthlyStudyTotal}h
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Deep Focus mastery</p>
          </div>
        </div>
      </section>
    </div>
  );
}
