import { useState, type FormEvent } from 'react';
import { Check, ChevronDown, ChevronUp, Flame, Plus, Trash2 } from 'lucide-react';
import type { Habit } from '../types/discipline';

interface HabitMatrixTileProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onMoveHabit: (index: number, direction: -1 | 1) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: (title: string) => void;
}

export function HabitMatrixTile({
  habits,
  onToggleHabit,
  onMoveHabit,
  onDeleteHabit,
  onAddHabit,
}: HabitMatrixTileProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    onAddHabit(newHabitText.trim());
    setNewHabitText('');
    setShowAddForm(false);
  };

  return (
    <section
      aria-labelledby="habit-matrix-heading"
      className="glass-tile rounded-2xl p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <div>
            <h2 id="habit-matrix-heading" className="text-sm font-bold text-white tracking-wide">
              THE HABIT MATRIX
            </h2>
            <p className="text-[11px] text-gray-300">Reorder sequence &amp; track streaks</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          aria-expanded={showAddForm}
          className="min-h-[38px] flex items-center gap-1 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/35 px-3 py-1.5 rounded-xl transition whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Habit</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-white/15"
        >
          <label htmlFor="new-habit-input" className="sr-only">
            New habit title
          </label>
          <input
            id="new-habit-input"
            type="text"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="New discipline habit..."
            className="bg-transparent text-xs text-white placeholder-gray-400 px-2.5 py-1.5 flex-1 focus:outline-none"
            autoFocus
            required
          />
          <button
            type="submit"
            className="min-h-[36px] text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3.5 py-1.5 rounded-lg transition whitespace-nowrap shrink-0"
          >
            Add
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="glass-subtile rounded-xl p-6 text-center space-y-2.5">
          <p className="text-xs text-gray-300">No active habits in your discipline matrix.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="min-h-[38px] inline-flex items-center gap-1.5 text-xs bg-emerald-500 text-black font-semibold px-3.5 py-1.5 rounded-lg hover:bg-emerald-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Habit</span>
          </button>
        </div>
      ) : (
        <ul className="space-y-2 mt-2" aria-label="Daily habits">
          {habits.map((habit, idx) => (
            <li
              key={habit.id}
              className={`glass-subtile rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 transition-all duration-200 ${
                habit.completed
                  ? 'border-emerald-500/35 bg-emerald-950/30 shadow-[0_0_15px_-4px_rgba(16,185,129,0.22)]'
                  : ''
              }`}
            >
              <div className="flex flex-col items-center text-gray-400 shrink-0">
                <button
                  type="button"
                  onClick={() => onMoveHabit(idx, -1)}
                  disabled={idx === 0}
                  aria-label={`Move ${habit.title} up`}
                  className="p-1 hover:text-white disabled:opacity-25 transition rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveHabit(idx, 1)}
                  disabled={idx === habits.length - 1}
                  aria-label={`Move ${habit.title} down`}
                  className="p-1 hover:text-white disabled:opacity-25 transition rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                role="checkbox"
                aria-checked={habit.completed}
                aria-label={`${habit.title}, ${habit.streak} day streak, priority ${idx + 1}`}
                onClick={() => onToggleHabit(habit.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span
                  aria-hidden="true"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200 shrink-0 ${
                    habit.completed
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'border-white/25 bg-black/45 text-transparent hover:border-emerald-400/60'
                  }`}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </span>

                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-semibold tracking-wide truncate transition-all ${
                      habit.completed ? 'text-gray-300 line-through' : 'text-gray-100'
                    }`}
                  >
                    {habit.title}
                  </span>
                  <span className="flex items-center gap-2 mt-0.5 text-[11px] font-mono tabular-nums">
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <Flame className="w-3 h-3" />
                      <span>{habit.streak}d streak</span>
                    </span>
                    <span className="text-gray-400">· #{idx + 1} priority</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteHabit(habit.id)}
                aria-label={`Delete ${habit.title}`}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-gray-400 hover:text-rose-400 rounded-lg transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
