import type { ViewTab } from '../types/discipline';

interface ViewTabsProps {
  activeTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
}

const TABS: { id: ViewTab; label: string; activeClass: string }[] = [
  {
    id: 'today',
    label: 'TODAY',
    activeClass: 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.35)]',
  },
  {
    id: 'week',
    label: 'WEEK (7D)',
    activeClass: 'bg-indigo-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.4)]',
  },
  {
    id: 'month',
    label: 'MONTH (30D)',
    activeClass: 'bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]',
  },
];

export function ViewTabs({ activeTab, onChangeTab }: ViewTabsProps) {
  return (
    <nav aria-label="Timeframe view selector" className="glass-tile rounded-2xl p-1.5">
      <div role="tablist" className="grid grid-cols-3 gap-1.5 font-mono text-xs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeTab(tab.id)}
              className={`min-h-[40px] py-2 px-3 rounded-xl font-bold tracking-wider transition-all duration-200 flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                isActive ? tab.activeClass : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
