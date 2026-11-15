import { Minus, Moon, Plus } from 'lucide-react';

interface SleepTileProps {
  sleepHours: number;
  onChangeSleep: (hours: number) => void;
}

const SLEEP_PRESETS = [6, 7.5, 8.5];

export function SleepTile({ sleepHours, onChangeSleep }: SleepTileProps) {
  return (
    <section aria-labelledby="sleep-heading" className="glass-tile rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 text-indigo-300" />
          </span>
          <div>
            <h2 id="sleep-heading" className="text-xs font-bold text-white uppercase tracking-wider">
              Sleep Tracking
            </h2>
            <p className="text-[11px] text-gray-300">Nightly rest &amp; recovery</p>
          </div>
        </div>

        <div className="text-right font-mono tabular-nums shrink-0">
          <span className="text-xl font-extrabold text-indigo-300">{sleepHours}</span>
          <span className="text-[10px] text-gray-400 ml-1 uppercase">Hours</span>
        </div>
      </div>

      <div className="pt-1">
        <label htmlFor="sleep-range-slider" className="sr-only">
          Sleep duration in hours
        </label>
        <input
          id="sleep-range-slider"
          type="range"
          min="4"
          max="12"
          step="0.5"
          value={sleepHours}
          onChange={(e) => onChangeSleep(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChangeSleep(Math.max(4, +(sleepHours - 0.5).toFixed(1)))}
            aria-label="Decrease sleep by 0.5 hours"
            className="min-h-[38px] min-w-[38px] rounded-lg bg-black/50 border border-white/15 hover:border-indigo-400 flex items-center justify-center text-gray-200 hover:text-white transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeSleep(Math.min(12, +(sleepHours + 0.5).toFixed(1)))}
            aria-label="Increase sleep by 0.5 hours"
            className="min-h-[38px] min-w-[38px] rounded-lg bg-black/50 border border-white/15 hover:border-indigo-400 flex items-center justify-center text-gray-200 hover:text-white transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {SLEEP_PRESETS.map((hrs) => (
            <button
              key={hrs}
              type="button"
              onClick={() => onChangeSleep(hrs)}
              className={`min-h-[36px] text-xs font-mono tabular-nums px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                sleepHours === hrs
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                  : 'bg-black/45 border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
