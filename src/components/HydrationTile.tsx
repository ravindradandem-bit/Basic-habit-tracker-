import { Droplet, Minus, Plus } from 'lucide-react';

interface HydrationTileProps {
  waterMl: number;
  onChangeWater: (nextMl: number) => void;
}

export function HydrationTile({ waterMl, onChangeWater }: HydrationTileProps) {
  const percent = Math.min((waterMl / 3000) * 100, 100);

  return (
    <section
      aria-labelledby="hydration-heading"
      className="glass-tile rounded-2xl p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center shrink-0">
            <Droplet className="w-4 h-4 text-sky-400" />
          </span>
          <div>
            <h2
              id="hydration-heading"
              className="text-xs font-bold text-white uppercase tracking-wider"
            >
              Hydration Tracker
            </h2>
            <p className="text-[11px] text-gray-300">Target: 3.0L (12 glasses)</p>
          </div>
        </div>

        <div className="text-right font-mono tabular-nums shrink-0">
          <span className="text-xl font-extrabold text-sky-400">
            {(waterMl / 1000).toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 ml-1 uppercase">/ 3.0L</span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={waterMl}
        aria-valuemin={0}
        aria-valuemax={3000}
        aria-label="Daily water intake in milliliters"
        className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-white/10 p-0.5"
      >
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onChangeWater(Math.max(0, waterMl - 250))}
          aria-label="Subtract 250ml of water"
          className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 bg-black/50 hover:bg-black/75 border border-white/15 hover:border-sky-400/40 text-xs font-mono tabular-nums text-gray-200 rounded-xl transition"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>250ml</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeWater(Math.min(5000, waterMl + 250))}
          aria-label="Add 250ml of water"
          className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-mono tabular-nums text-sky-200 font-bold rounded-xl transition shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250ml</span>
        </button>
      </div>
    </section>
  );
}
