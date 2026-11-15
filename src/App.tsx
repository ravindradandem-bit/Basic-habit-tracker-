import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { DisciplineIndexTile } from './components/DisciplineIndexTile';
import { FoodIntakeTile } from './components/FoodIntakeTile';
import { HabitMatrixTile } from './components/HabitMatrixTile';
import { HeaderTile } from './components/HeaderTile';
import { HydrationTile } from './components/HydrationTile';
import { FoodCategoryModal, StudyCategoryModal, ThemeBackgroundModal } from './components/Modals';
import { MonthView } from './components/MonthView';
import { SleepTile } from './components/SleepTile';
import { StudyFocusTile } from './components/StudyFocusTile';
import { ViewTabs } from './components/ViewTabs';
import { WeekView } from './components/WeekView';
import {
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_FOOD_CATEGORIES,
  DEFAULT_HABITS,
  DEFAULT_STUDY_CATEGORIES,
} from './data/defaults';
import type {
  AccentTheme,
  BackgroundConfig,
  FoodCategory,
  Habit,
  StudyCategory,
  ViewTab,
} from './types/discipline';
import {
  adjustFoodCategory,
  adjustStudyCategory,
  calculateDisciplineScore,
  getTotalStudyHours,
  reorderHabits,
  toggleHabitItem,
} from './utils/discipline';

function loadJsonFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export default function App() {
  const [userName, setUserName] = useState<string>(
    () => localStorage.getItem('ritch_user_name') || 'Satoru Gojo'
  );
  const [activeTab, setActiveTab] = useState<ViewTab>('today');

  const [accentTheme, setAccentTheme] = useState<AccentTheme>(() => {
    const saved = localStorage.getItem('ritch_glow_accent');
    return saved === 'indigo' || saved === 'cyan' ? saved : 'emerald';
  });

  const [ambientGlow, setAmbientGlow] = useState<boolean>(() => {
    const saved = localStorage.getItem('ritch_ambient_glow');
    return saved !== null ? saved === 'true' : true;
  });

  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>(() =>
    loadJsonFromStorage('ritch_background_config', DEFAULT_BACKGROUND_CONFIG)
  );
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
  const [backgroundImgFailed, setBackgroundImgFailed] = useState<boolean>(false);

  const [habits, setHabits] = useState<Habit[]>(() =>
    loadJsonFromStorage('ritch_habits_data', DEFAULT_HABITS)
  );
  const [sleepHours, setSleepHours] = useState<number>(() => {
    const saved = localStorage.getItem('ritch_sleep_hours');
    const parsed = saved ? parseFloat(saved) : 7.5;
    return Number.isNaN(parsed) ? 7.5 : parsed;
  });
  const [ateClean, setAteClean] = useState<boolean>(
    () => localStorage.getItem('ritch_clean_eating') === 'true'
  );
  const [waterMl, setWaterMl] = useState<number>(() => {
    const saved = localStorage.getItem('ritch_water_ml');
    const parsed = saved ? parseInt(saved, 10) : 2250;
    return Number.isNaN(parsed) ? 2250 : parsed;
  });
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>(() =>
    loadJsonFromStorage('ritch_food_categories', DEFAULT_FOOD_CATEGORIES)
  );
  const [studyCategories, setStudyCategories] = useState<StudyCategory[]>(() =>
    loadJsonFromStorage('ritch_study_categories', DEFAULT_STUDY_CATEGORIES)
  );

  // Modals
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFoodCategory, setEditingFoodCategory] = useState<FoodCategory | null>(null);
  const [showStudyModal, setShowStudyModal] = useState(false);

  // Persistence
  useEffect(() => saveToStorage('ritch_user_name', userName), [userName]);
  useEffect(() => saveToStorage('ritch_glow_accent', accentTheme), [accentTheme]);
  useEffect(() => saveToStorage('ritch_ambient_glow', String(ambientGlow)), [ambientGlow]);
  useEffect(
    () => saveToStorage('ritch_background_config', JSON.stringify(backgroundConfig)),
    [backgroundConfig]
  );
  useEffect(() => saveToStorage('ritch_habits_data', JSON.stringify(habits)), [habits]);
  useEffect(() => saveToStorage('ritch_sleep_hours', String(sleepHours)), [sleepHours]);
  useEffect(() => saveToStorage('ritch_clean_eating', String(ateClean)), [ateClean]);
  useEffect(() => saveToStorage('ritch_water_ml', String(waterMl)), [waterMl]);
  useEffect(
    () => saveToStorage('ritch_food_categories', JSON.stringify(foodCategories)),
    [foodCategories]
  );
  useEffect(
    () => saveToStorage('ritch_study_categories', JSON.stringify(studyCategories)),
    [studyCategories]
  );

  const studyTotals = useMemo(() => getTotalStudyHours(studyCategories), [studyCategories]);

  const disciplineScore = useMemo(
    () =>
      calculateDisciplineScore({
        habits,
        sleepHours,
        ateClean,
        waterMl,
        studyLogged: studyTotals.logged,
        studyTarget: studyTotals.target,
      }),
    [habits, sleepHours, ateClean, waterMl, studyTotals]
  );

  const proteinCat = useMemo(
    () =>
      foodCategories.find((c) => c.id === 'protein') ||
      foodCategories.find((c) => c.name.toLowerCase().includes('prot')) ||
      null,
    [foodCategories]
  );

  const handleUpdateBackground = (next: BackgroundConfig) => {
    setBackgroundImgFailed(false);
    setBackgroundConfig(next);
  };

  const handleSaveFoodCategory = (payload: {
    name: string;
    target: number;
    unit: string;
    step: number;
    color: string;
  }) => {
    if (editingFoodCategory) {
      setFoodCategories((prev) =>
        prev.map((c) => (c.id === editingFoodCategory.id ? { ...c, ...payload } : c))
      );
    } else {
      setFoodCategories((prev) => [
        ...prev,
        {
          id: `cat_${Date.now()}`,
          current: 0,
          isDefault: false,
          ...payload,
        },
      ]);
    }
    setShowFoodModal(false);
  };

  const handleSaveStudyCategory = (payload: { name: string; target: number; color: string }) => {
    setStudyCategories((prev) => [
      ...prev,
      {
        id: `study_${Date.now()}`,
        logged: 0,
        ...payload,
      },
    ]);
    setShowStudyModal(false);
  };

  const objectPositionStyle =
    backgroundConfig.imagePosition === 'top'
      ? 'center top'
      : backgroundConfig.imagePosition === 'bottom'
        ? 'center bottom'
        : 'center center';

  const tileOpacityVars = {
    '--tile-alpha': String(backgroundConfig.tileOpacity),
    '--subtile-alpha': String(Math.max(0.28, +(backgroundConfig.tileOpacity - 0.1).toFixed(2))),
  } as CSSProperties;

  const glowColorClass =
    accentTheme === 'emerald'
      ? 'bg-emerald-500'
      : accentTheme === 'indigo'
        ? 'bg-indigo-600'
        : 'bg-cyan-500';

  return (
    <div
      style={tileOpacityVars}
      className="relative min-h-screen w-full text-gray-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden"
    >
      {/* Full-viewport customizable background layer */}
      <div
        data-testid="app-background-layer"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#070a12]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1322] via-[#090d16] to-[#05070c]" />

        {backgroundConfig.mode === 'image' &&
          backgroundConfig.imageUrl &&
          !backgroundImgFailed && (
            <img
              data-testid="app-background-image"
              src={backgroundConfig.imageUrl}
              alt="Custom application wallpaper"
              referrerPolicy="no-referrer"
              onError={() => {
                setBackgroundImgFailed(true);
                setImageLoadError(
                  'Could not load that image URL. Switched to fallback obsidian backdrop.'
                );
              }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ objectPosition: objectPositionStyle }}
            />
          )}

        {/* Measured dark scrim so frosted translucent tiles remain legible over bright wallpaper regions */}
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            backgroundColor: `rgba(5, 7, 12, ${backgroundConfig.overlayOpacity})`,
          }}
        />

        {ambientGlow && (
          <>
            <div
              className={`absolute top-[-12%] right-[-8%] w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 ${glowColorClass}`}
            />
            <div className="absolute bottom-[-12%] left-[-8%] w-[380px] h-[380px] bg-indigo-900/25 rounded-full blur-[110px] opacity-25" />
          </>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:22px_22px] opacity-35" />
      </div>

      {/* Scrollable Translucent Workspace */}
      <main className="relative z-10 w-full max-w-[540px] lg:max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4">
        <HeaderTile
          userName={userName}
          onUpdateUserName={setUserName}
          onOpenThemeModal={() => setShowThemeModal(true)}
          accentTheme={accentTheme}
        />

        <ViewTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6 space-y-4">
              <DisciplineIndexTile
                score={disciplineScore}
                habits={habits}
                sleepHours={sleepHours}
                waterMl={waterMl}
                ateClean={ateClean}
                foodCategories={foodCategories}
                studyLogged={studyTotals.logged}
                studyTarget={studyTotals.target}
              />

              <HabitMatrixTile
                habits={habits}
                onToggleHabit={(id) => setHabits((prev) => toggleHabitItem(prev, id))}
                onMoveHabit={(index, dir) => setHabits((prev) => reorderHabits(prev, index, dir))}
                onDeleteHabit={(id) => setHabits((prev) => prev.filter((h) => h.id !== id))}
                onAddHabit={(title) =>
                  setHabits((prev) => [
                    {
                      id: String(Date.now()),
                      title,
                      streak: 1,
                      completed: false,
                      weekHistory: [false, false, false, false, false, false, false],
                    },
                    ...prev,
                  ])
                }
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <SleepTile sleepHours={sleepHours} onChangeSleep={setSleepHours} />

              <HydrationTile waterMl={waterMl} onChangeWater={setWaterMl} />

              <FoodIntakeTile
                ateClean={ateClean}
                onToggleClean={() => setAteClean((v) => !v)}
                categories={foodCategories}
                onAdjustCategory={(id, delta) =>
                  setFoodCategories((prev) => adjustFoodCategory(prev, id, delta))
                }
                onSetCategoryValue={(id, value) =>
                  setFoodCategories((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, current: value } : c))
                  )
                }
                onOpenAddModal={() => {
                  setEditingFoodCategory(null);
                  setShowFoodModal(true);
                }}
                onOpenEditModal={(cat) => {
                  setEditingFoodCategory(cat);
                  setShowFoodModal(true);
                }}
                onDeleteCategory={(id) =>
                  setFoodCategories((prev) => prev.filter((c) => c.id !== id))
                }
              />

              <StudyFocusTile
                categories={studyCategories}
                totalLogged={studyTotals.logged}
                totalTarget={studyTotals.target}
                onAdjustHours={(id, delta) =>
                  setStudyCategories((prev) => adjustStudyCategory(prev, id, delta))
                }
                onDeleteCategory={(id) =>
                  setStudyCategories((prev) => prev.filter((c) => c.id !== id))
                }
                onOpenAddModal={() => setShowStudyModal(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'week' && (
          <WeekView
            habits={habits}
            todayScore={disciplineScore}
            sleepHours={sleepHours}
            waterMl={waterMl}
            proteinGrams={proteinCat ? proteinCat.current : 0}
          />
        )}

        {activeTab === 'month' && (
          <MonthView
            habits={habits}
            todayScore={disciplineScore}
            studyLogged={studyTotals.logged}
          />
        )}

        <footer className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-gray-200 font-mono">
            <span>100% Offline &amp; Local</span>
            <span aria-hidden="true">·</span>
            <span>Obsidian Glass UI</span>
          </div>
        </footer>
      </main>

      <ThemeBackgroundModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        accentTheme={accentTheme}
        onChangeAccent={setAccentTheme}
        ambientGlow={ambientGlow}
        onToggleAmbientGlow={() => setAmbientGlow((v) => !v)}
        backgroundConfig={backgroundConfig}
        onUpdateBackground={handleUpdateBackground}
        imageLoadError={imageLoadError}
        onClearImageError={() => setImageLoadError(null)}
      />

      <FoodCategoryModal
        isOpen={showFoodModal}
        editingCategory={editingFoodCategory}
        onClose={() => setShowFoodModal(false)}
        onSave={handleSaveFoodCategory}
      />

      <StudyCategoryModal
        isOpen={showStudyModal}
        onClose={() => setShowStudyModal(false)}
        onSave={handleSaveStudyCategory}
      />
    </div>
  );
}
