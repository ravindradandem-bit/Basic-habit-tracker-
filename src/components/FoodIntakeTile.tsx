import { Pencil, Plus, Trash2, Utensils } from 'lucide-react';
import type { FoodCategory } from '../types/discipline';

interface FoodIntakeTileProps {
  ateClean: boolean;
  onToggleClean: () => void;
  categories: FoodCategory[];
  onAdjustCategory: (id: string, delta: number) => void;
  onSetCategoryValue: (id: string, value: number) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (category: FoodCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export function FoodIntakeTile({
  ateClean,
  onToggleClean,
  categories,
  onAdjustCategory,
  onSetCategoryValue,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteCategory,
}: FoodIntakeTileProps) {
  return (
    <section
      aria-labelledby="food-intake-heading"
      className="glass-tile rounded-2xl p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4 text-emerald-400" />
          </span>
          <div>
            <h2
              id="food-intake-heading"
              className="text-xs font-bold text-white uppercase tracking-wider"
            >
              Food &amp; Nutrient Intake
            </h2>
            <p className="text-[11px] text-gray-300">Did you eat clean &amp; hit macros today?</p>
          </div>
        </div>

        <button
          type="button"
          aria-pressed={ateClean}
          onClick={onToggleClean}
          className={`min-h-[38px] flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
            ateClean
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_18px_rgba(16,185,129,0.45)]'
              : 'bg-black/50 border-white/15 text-gray-200 hover:border-emerald-500/40'
          }`}
        >
          <span>{ateClean ? 'CLEAN & FUELLED' : 'LOG AS CLEAN'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[11px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Daily Targets &amp; Macros</span>
          <span className="text-[11px] text-emerald-400 font-bold tabular-nums">
            ({categories.length})
          </span>
        </span>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="min-h-[36px] flex items-center gap-1 text-[11px] font-mono bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 hover:text-white px-2.5 py-1 rounded-lg transition whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="glass-subtile rounded-xl p-5 text-center space-y-2">
          <p className="text-xs text-gray-300">No macro or nutrient categories configured.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="min-h-[36px] inline-flex items-center gap-1.5 text-xs bg-emerald-500 text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Category</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const percent = Math.min(Math.round((cat.current / (cat.target || 1)) * 100), 100);
            const isComplete = cat.current >= cat.target;

            return (
              <div
                key={cat.id}
                className="glass-subtile rounded-xl p-3 border border-white/10 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#10B981' }}
                    />
                    <span className="text-xs font-bold text-gray-100 tracking-wide truncate">
                      {cat.name}
                    </span>
                    {isComplete && (
                      <span className="text-[10px] font-mono font-semibold text-emerald-300 shrink-0">
                        · HIT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums shrink-0">
                    <div className="flex items-center bg-black/60 border border-white/15 rounded-lg px-2 py-0.5">
                      <label htmlFor={`food-val-${cat.id}`} className="sr-only">
                        {cat.name} amount in {cat.unit}
                      </label>
                      <input
                        id={`food-val-${cat.id}`}
                        type="number"
                        min={0}
                        value={cat.current}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          onSetCategoryValue(cat.id, Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
                        }}
                        className="w-14 bg-transparent text-right font-bold text-white focus:outline-none text-xs tabular-nums"
                      />
                      <span className="text-[10px] text-gray-400 ml-1">{cat.unit}</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">
                      / {cat.target}
                      {cat.unit}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: cat.color || '#10B981',
                      boxShadow: isComplete ? `0 0 10px ${cat.color || '#10B981'}` : 'none',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5 text-xs font-mono tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAdjustCategory(cat.id, -(cat.step || 10))}
                      aria-label={`Subtract ${cat.step || 10} ${cat.unit} from ${cat.name}`}
                      className="min-h-[32px] px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/80 border border-white/10 text-gray-200 hover:text-white transition"
                    >
                      -{cat.step || 10}
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustCategory(cat.id, cat.step || 10)}
                      aria-label={`Add ${cat.step || 10} ${cat.unit} to ${cat.name}`}
                      className="min-h-[32px] px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold transition"
                    >
                      +{cat.step || 10}
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(cat)}
                      aria-label={`Edit ${cat.name}`}
                      className="min-h-[34px] min-w-[34px] flex items-center justify-center hover:text-emerald-400 rounded-lg transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat.id)}
                      aria-label={`Delete ${cat.name}`}
                      className="min-h-[34px] min-w-[34px] flex items-center justify-center hover:text-rose-400 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
