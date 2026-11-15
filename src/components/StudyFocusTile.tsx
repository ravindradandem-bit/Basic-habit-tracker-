import { BookOpen, Plus, Trash2 } from 'lucide-react';
import type { StudyCategory } from '../types/discipline';

interface StudyFocusTileProps {
  categories: StudyCategory[];
  totalLogged: number;
  totalTarget: number;
  onAdjustHours: (id: string, delta: number) => void;
  onDeleteCategory: (id: string) => void;
  onOpenAddModal: () => void;
}

export function StudyFocusTile({
  categories,
  totalLogged,
  totalTarget,
  onAdjustHours,
  onDeleteCategory,
  onOpenAddModal,
}: StudyFocusTileProps) {
  return (
    <section
      aria-labelledby="study-focus-heading"
      className="glass-tile rounded-2xl p-4 sm:p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/35 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-purple-300" />
          </span>
          <div>
            <h2
              id="study-focus-heading"
              className="text-xs font-bold text-white uppercase tracking-wider"
            >
              Study &amp; Focus Categories
            </h2>
            <p className="text-[11px] text-gray-300">Track intellectual depth &amp; target hours</p>
          </div>
        </div>

        <div className="text-right font-mono tabular-nums shrink-0">
          <span className="text-sm font-extrabold text-purple-300">{totalLogged}h</span>
          <span className="text-[11px] text-gray-400"> / {totalTarget}h</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[11px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Focus Disciplines</span>
          <span className="text-[11px] text-purple-300 font-bold tabular-nums">
            ({categories.length})
          </span>
        </span>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="min-h-[36px] flex items-center gap-1 text-[11px] font-mono bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/35 text-purple-200 px-2.5 py-1 rounded-lg transition whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Study Category</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="glass-subtile rounded-xl p-5 text-center space-y-2">
          <p className="text-xs text-gray-300">No study disciplines added yet.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="min-h-[36px] inline-flex items-center gap-1.5 text-xs bg-purple-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-500 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Discipline</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const percent = Math.min(Math.round(((cat.logged || 0) / (cat.target || 1)) * 100), 100);
            const isComplete = (cat.logged || 0) >= (cat.target || 0);

            return (
              <div
                key={cat.id}
                className={`glass-subtile rounded-xl p-3 border space-y-2.5 transition-all ${
                  isComplete
                    ? 'border-emerald-500/40 bg-emerald-950/25 shadow-[0_0_15px_-4px_rgba(16,185,129,0.25)]'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#38BDF8' }}
                    />
                    <span className="text-xs font-bold text-gray-100 tracking-wide truncate">
                      {cat.name}
                    </span>
                    {isComplete && (
                      <span className="text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                        · 100%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono tabular-nums text-xs shrink-0">
                    <span className="font-extrabold text-white text-sm">
                      {cat.logged.toFixed(1)}h
                    </span>
                    <span className="text-gray-400 text-[11px]">/ {cat.target.toFixed(1)}h</span>
                  </div>
                </div>

                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      background: isComplete
                        ? 'linear-gradient(90deg, #10B981, #34D399)'
                        : 'linear-gradient(90deg, #6366F1, #38BDF8)',
                      boxShadow: isComplete
                        ? '0 0 10px rgba(16, 185, 129, 0.7)'
                        : '0 0 8px rgba(56, 189, 248, 0.5)',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5 text-xs font-mono tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAdjustHours(cat.id, -0.5)}
                      aria-label={`Subtract 30 minutes from ${cat.name}`}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/80 border border-white/10 text-gray-200 hover:text-white transition text-[11px]"
                    >
                      -30m
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustHours(cat.id, 0.5)}
                      aria-label={`Add 30 minutes to ${cat.name}`}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 font-semibold transition text-[11px]"
                    >
                      +30m
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustHours(cat.id, 1.0)}
                      aria-label={`Add 1 hour to ${cat.name}`}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-semibold transition text-[11px]"
                    >
                      +1h
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    aria-label={`Delete ${cat.name}`}
                    className="min-h-[34px] min-w-[34px] flex items-center justify-center text-gray-400 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
