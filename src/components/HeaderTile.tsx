import { useState } from 'react';
import { Flame, Image as ImageIcon, Pencil, Check } from 'lucide-react';
import type { AccentTheme } from '../types/discipline';

interface HeaderTileProps {
  userName: string;
  onUpdateUserName: (nextName: string) => void;
  onOpenThemeModal: () => void;
  accentTheme: AccentTheme;
}

export function HeaderTile({
  userName,
  onUpdateUserName,
  onOpenThemeModal,
  accentTheme,
}: HeaderTileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const accentDotClass =
    accentTheme === 'emerald'
      ? 'text-emerald-400'
      : accentTheme === 'indigo'
        ? 'text-indigo-400'
        : 'text-cyan-400';

  const handleSave = () => {
    const cleaned = tempName.trim();
    if (cleaned) {
      onUpdateUserName(cleaned);
    }
    setIsEditingName(false);
  };

  return (
    <header className="glass-tile rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="font-extrabold text-xl tracking-tight text-white font-mono whitespace-nowrap shrink-0">
            BASIC<span className={accentDotClass}>.</span>
          </h1>
          <span aria-hidden="true" className="text-white/25 text-xs shrink-0">
            /
          </span>
          <span className="text-[11px] sm:text-xs font-medium tracking-wider text-gray-300 uppercase whitespace-nowrap">
            Discipline OS
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenThemeModal}
            title="Wallpaper & Theme"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center gap-1.5 text-xs font-mono text-gray-200 bg-black/55 hover:bg-black/75 border border-white/15 hover:border-emerald-400/50 px-2.5 sm:px-3 py-1.5 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap shrink-0"
            aria-label="Customize wallpaper background and theme"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          <div className="hidden sm:flex items-center text-xs font-mono tabular-nums text-gray-200 bg-black/45 border border-white/10 px-3 py-2 rounded-xl whitespace-nowrap shrink-0">
            SUN, NOV 15
          </div>
        </div>
      </div>

      <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 shrink-0">
            User:
          </span>

          {isEditingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="flex items-center gap-1.5 w-full max-w-[220px]"
            >
              <label htmlFor="alias-input" className="sr-only">
                User alias
              </label>
              <input
                id="alias-input"
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                maxLength={32}
                className="bg-black/65 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400 w-full min-w-0"
                placeholder="Enter alias..."
              />
              <button
                type="submit"
                className="min-h-[34px] inline-flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-2.5 py-1 rounded-lg transition whitespace-nowrap shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempName(userName);
                setIsEditingName(true);
              }}
              className="group min-h-[36px] max-w-[165px] sm:max-w-[240px] flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-500/40 px-2.5 py-1 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={`Edit user name ${userName}`}
            >
              <span className="text-xs font-semibold text-gray-100 group-hover:text-emerald-300 transition tracking-wide truncate">
                {userName}
              </span>
              <Pencil className="w-3 h-3 text-gray-400 group-hover:text-emerald-400 transition shrink-0" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-emerald-300 whitespace-nowrap shrink-0">
          <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Special Grade</span>
          <span className="sm:hidden text-gray-300">· NOV 15</span>
        </div>
      </div>
    </header>
  );
}
