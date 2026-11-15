import { Check, Flame, Sparkles } from 'lucide-react';
import type { Habit } from '../types/discipline';
import { WEEKLY_TREND_HISTORY } from '../data/defaults';

interface WeekViewProps {
  habits: Habit[];
  todayScore: number;
  sleepHours: number;
  waterMl: number;
  proteinGrams: number;
}

export function WeekView({
  habits,
  todayScore,
  sleepHours,
  waterMl,
  proteinGrams,
}: WeekViewProps) {
  const trendData = WEEKLY_TREND_HISTORY.map((item, idx) =>
    idx === WEEKLY_TREND_HISTORY.length - 1 ? { ...item, score: todayScore } : item
  );

  const weeklyAvg = Math.round(
    trendData.reduce((acc, item) => acc + item.score, 0) / trendData.length
  );

  const avgSleep = (((7.6 * 6 + sleepHours) / 7)).toFixed(1);
  const avgProtein = Math.round((158 * 6 + proteinGrams) / 7);
  const totalWaterL = ((16.25 + waterMl / 1000)).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <section
        aria-labelledby="week-arc-heading"
        className="lg:col-span-5 glass-tile rounded-2xl p-4 sm:p-5 space-y-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h2 id="week-arc-heading">7-Day Discipline Arc</h2>
            </div>
            <p className="text-xs text-gray-200 mt-1 font-medium">
              Weekly consistency score:{' '}
              <span className="text-emerald-400 font-bold font-mono tabular-nums">
                {weeklyAvg}%
              </span>
            </p>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-emerald-300 whitespace-nowrap shrink-0">
            +12% vs last wk
          </span>
        </div>

        <div className="bg-black/45 rounded-xl p-3 border border-white/10">
          <div className="flex items-end justify-between h-32 pt-2 px-1 gap-2">
            {trendData.map((item, idx) => {
              const isToday = idx === trendData.length - 1;
              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  <span className="text-[10px] font-mono tabular-nums text-gray-300 mb-1">
                    {item.score}%
                  </span>
                  <div className="w-full max-w-[30px] bg-white/10 rounded-t-md overflow-hidden flex items-end h-20">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isToday
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : item.score >= 80
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                            : 'bg-indigo-900/70'
                      }`}
                      style={{ height: `${Math.max(item.score, 6)}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1.5 ${
                      isToday ? 'text-emerald-300 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 font-mono tabular-nums text-center pt-1">
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Sleep Avg</div>
            <div className="text-sm font-bold text-indigo-300 mt-0.5">{avgSleep}h</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Optimal</div>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Protein Avg</div>
            <div className="text-sm font-bold text-sky-300 mt-0.5">{avgProtein}g/d</div>
            <div className="text-[10px] text-sky-400 mt-0.5">91% target</div>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Calories</div>
            <div className="text-sm font-bold text-amber-300 mt-0.5">2,280</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Clean 6/7d</div>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
            <div className="text-[10px] text-gray-400 uppercase">Water Tot</div>
            <div className="text-sm font-bold text-emerald-300 mt-0.5">{totalWaterL}L</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              {(parseFloat(totalWaterL) / 7).toFixed(1)}L/day
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="week-matrix-heading"
        className="lg:col-span-7 glass-tile rounded-2xl p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <h2 id="week-matrix-heading" className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Completion Matrix
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-400">Mon - Sun</span>
        </div>

        <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px] text-gray-400 border-b border-white/10 pb-1.5 px-1">
          <div className="col-span-5 text-left">Habit</div>
          <div className="col-span-1">M</div>
          <div className="col-span-1">T</div>
          <div className="col-span-1">W</div>
          <div className="col-span-1">T</div>
          <div className="col-span-1">F</div>
          <div className="col-span-1">S</div>
          <div className="col-span-1 text-emerald-400 font-bold">S</div>
        </div>

        {habits.length === 0 ? (
          <div className="glass-subtile rounded-xl p-6 text-center text-xs text-gray-300">
            Add habits on the Today tab to populate your 7-day completion matrix.
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {habits.map((habit) => {
              const history = habit.weekHistory || [
                true,
                true,
                true,
                false,
                true,
                true,
                habit.completed,
              ];
              return (
                <div
                  key={habit.id}
                  className="glass-subtile rounded-xl p-2.5 grid grid-cols-12 gap-1 items-center"
                >
                  <div className="col-span-5 pr-1 min-w-0">
                    <p className="text-xs font-medium text-gray-100 truncate">{habit.title}</p>
                    <span className="text-[10px] font-mono tabular-nums text-amber-300 inline-flex items-center gap-0.5 mt-0.5">
                      <Flame className="w-3 h-3" />
                      <span>{habit.streak}d</span>
                    </span>
                  </div>

                  {history.map((isDone, dayIdx) => (
                    <div key={dayIdx} className="col-span-1 flex justify-center">
                      <span
                        aria-label={`${habit.title} day ${dayIdx + 1}: ${
                          isDone ? 'completed' : 'missed'
                        }`}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-500/85 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-white/5 border border-white/10 text-gray-500'
                        }`}
                      >
                        {isDone ? '✓' : '·'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
