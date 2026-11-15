import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { BookOpen, Image as ImageIcon, RotateCcw, Upload, Utensils, X } from 'lucide-react';
import { BACKGROUND_PRESETS, DEFAULT_BACKGROUND_CONFIG } from '../data/defaults';
import type {
  AccentTheme,
  BackgroundConfig,
  FoodCategory,
  ImagePosition,
} from '../types/discipline';
import { validateBackgroundUrl } from '../utils/discipline';

interface ThemeBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentTheme: AccentTheme;
  onChangeAccent: (accent: AccentTheme) => void;
  ambientGlow: boolean;
  onToggleAmbientGlow: () => void;
  backgroundConfig: BackgroundConfig;
  onUpdateBackground: (next: BackgroundConfig) => void;
  imageLoadError: string | null;
  onClearImageError: () => void;
}

async function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Empty image data.'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const maxDim = 1600;
        let { width, height } = img;
        if (width <= maxDim && height <= maxDim && file.size < 900_000) {
          resolve(dataUrl);
          return;
        }
        const scale = Math.min(maxDim / width, maxDim / height, 1);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function ThemeBackgroundModal({
  isOpen,
  onClose,
  accentTheme,
  onChangeAccent,
  ambientGlow,
  onToggleAmbientGlow,
  backgroundConfig,
  onUpdateBackground,
  imageLoadError,
  onClearImageError,
}: ThemeBackgroundModalProps) {
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUrlError(null);
    setUploadStatus(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUrlError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }
    try {
      setUrlError(null);
      onClearImageError();
      const dataUrl = await compressImageFileToDataUrl(file);
      onUpdateBackground({
        ...backgroundConfig,
        mode: 'image',
        presetId: 'custom-upload',
        imageUrl: dataUrl,
      });
      setUploadStatus(`Applied "${file.name}"`);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : 'Failed to load image.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e: FormEvent) => {
    e.preventDefault();
    const result = validateBackgroundUrl(urlInput);
    if (!result.valid) {
      setUrlError(result.error || 'Invalid image URL.');
      return;
    }
    setUrlError(null);
    setUploadStatus(null);
    onClearImageError();
    onUpdateBackground({
      ...backgroundConfig,
      mode: 'image',
      presetId: 'custom-url',
      imageUrl: result.url,
    });
    setUrlInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-tile rounded-2xl p-4 sm:p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scroll border border-white/20 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h2 id="theme-modal-title" className="text-sm font-bold text-white">
                Wallpaper &amp; Theme Settings
              </h2>
              <p className="text-[11px] text-gray-300">
                Customize app background while keeping frosted translucent tiles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wallpaper and theme settings"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-gray-300 block uppercase tracking-wider">
            Background Presets
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {BACKGROUND_PRESETS.map((preset) => {
              const isSelected = backgroundConfig.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onClearImageError();
                    setUrlError(null);
                    setUploadStatus(null);
                    onUpdateBackground({
                      ...backgroundConfig,
                      mode: preset.mode,
                      presetId: preset.id,
                      imageUrl: preset.imageUrl,
                      overlayOpacity: preset.defaultOverlay,
                    });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-emerald-400 bg-white/10 ring-1 ring-emerald-400/50'
                      : 'border-white/10 bg-black/45 hover:bg-white/5'
                  }`}
                >
                  {preset.mode === 'image' ? (
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0e1322] via-[#090d16] to-[#05070c] border border-white/20 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate">
                      {preset.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload or Paste Custom Image */}
        <div className="space-y-2.5 p-3 rounded-xl bg-black/45 border border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-gray-200 uppercase tracking-wider">
              Custom Background Image
            </span>
            {backgroundConfig.presetId !== 'gojo' && (
              <button
                type="button"
                onClick={() => {
                  onClearImageError();
                  setUrlError(null);
                  setUploadStatus(null);
                  onUpdateBackground(DEFAULT_BACKGROUND_CONFIG);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 hover:text-emerald-200 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            id="custom-bg-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold text-emerald-200 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image From Device</span>
          </button>

          <form onSubmit={handleApplyUrl} className="flex items-center gap-2 pt-1">
            <label htmlFor="custom-bg-url" className="sr-only">
              Custom background image URL
            </label>
            <input
              id="custom-bg-url"
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (urlError) setUrlError(null);
              }}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 min-w-0 bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-[38px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition whitespace-nowrap shrink-0"
            >
              Apply URL
            </button>
          </form>

          {uploadStatus && (
            <p className="text-[11px] font-mono text-emerald-300">{uploadStatus}</p>
          )}
          {(urlError || imageLoadError) && (
            <p role="alert" className="text-[11px] font-mono text-rose-300">
              {urlError || imageLoadError}
            </p>
          )}
        </div>

        {/* Backdrop Dim, Glass Translucency & Framing */}
        <div className="space-y-3 p-3 rounded-xl bg-black/45 border border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <label htmlFor="bg-scrim-slider" className="text-gray-300 uppercase">
                Background Dim Scrim
              </label>
              <span className="text-gray-200 tabular-nums">
                {Math.round(backgroundConfig.overlayOpacity * 100)}%
              </span>
            </div>
            <input
              id="bg-scrim-slider"
              type="range"
              min="0.1"
              max="0.85"
              step="0.02"
              value={backgroundConfig.overlayOpacity}
              onChange={(e) =>
                onUpdateBackground({
                  ...backgroundConfig,
                  overlayOpacity: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <label htmlFor="tile-opacity-slider" className="text-gray-300 uppercase">
                Translucent Tile Frosted Density
              </label>
              <span className="text-gray-200 tabular-nums">
                {Math.round(backgroundConfig.tileOpacity * 100)}%
              </span>
            </div>
            <input
              id="tile-opacity-slider"
              type="range"
              min="0.35"
              max="0.85"
              step="0.02"
              value={backgroundConfig.tileOpacity}
              onChange={(e) =>
                onUpdateBackground({
                  ...backgroundConfig,
                  tileOpacity: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {backgroundConfig.mode === 'image' && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-gray-300 uppercase">
                Wallpaper Framing
              </span>
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
                {(['top', 'center', 'bottom'] as ImagePosition[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() =>
                      onUpdateBackground({ ...backgroundConfig, imagePosition: pos })
                    }
                    className={`px-2.5 py-1 text-[11px] font-mono capitalize rounded-md transition ${
                      backgroundConfig.imagePosition === pos
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accent & Atmospheric Glow */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-gray-300 block uppercase tracking-wider">
            Atmospheric Aura Tint
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'emerald', name: 'Emerald Peak', col: '#10B981', border: 'border-emerald-500' },
                { id: 'indigo', name: 'Void Indigo', col: '#6366F1', border: 'border-indigo-500' },
                { id: 'cyan', name: 'Cyber Cyan', col: '#06B6D4', border: 'border-cyan-500' },
              ] as const
            ).map((accent) => (
              <button
                key={accent.id}
                type="button"
                onClick={() => onChangeAccent(accent.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  accentTheme === accent.id
                    ? `${accent.border} bg-white/10 ring-1 ring-white/30`
                    : 'border-white/10 bg-black/45 hover:bg-white/5'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-3.5 h-3.5 rounded-full mx-auto block mb-1"
                  style={{ backgroundColor: accent.col }}
                />
                <span className="text-xs font-semibold text-white block">{accent.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/45 border border-white/10">
          <div>
            <span className="text-xs font-bold text-white block">Subtle Atmospheric Glow</span>
            <span className="text-[10px] text-gray-400 font-mono">
              Soft accent aura behind translucent tiles
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ambientGlow}
            aria-label="Toggle subtle atmospheric glow"
            onClick={onToggleAmbientGlow}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
              ambientGlow ? 'bg-emerald-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                ambientGlow ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[42px] py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            Done &amp; Save
          </button>
        </div>
      </div>
    </div>
  );
}

interface FoodCategoryModalProps {
  isOpen: boolean;
  editingCategory: FoodCategory | null;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    target: number;
    unit: string;
    step: number;
    color: string;
  }) => void;
}

const COLOR_SWATCHES = ['#10B981', '#38BDF8', '#A855F7', '#F59E0B', '#EC4899', '#6366F1'];

export function FoodCategoryModal({
  isOpen,
  editingCategory,
  onClose,
  onSave,
}: FoodCategoryModalProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('100');
  const [unit, setUnit] = useState('g');
  const [step, setStep] = useState('5');
  const [color, setColor] = useState('#10B981');

  useEffect(() => {
    if (!isOpen) return;
    if (editingCategory) {
      setName(editingCategory.name);
      setTarget(editingCategory.target.toString());
      setUnit(editingCategory.unit);
      setStep((editingCategory.step || 5).toString());
      setColor(editingCategory.color || '#10B981');
    } else {
      setName('');
      setTarget('100');
      setUnit('g');
      setStep('5');
      setColor('#10B981');
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, editingCategory, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      target: Math.max(1, parseFloat(target) || 100),
      unit: unit.trim() || 'g',
      step: Math.max(0.5, parseFloat(step) || 5),
      color,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-tile rounded-2xl p-4 sm:p-5 w-full max-w-md space-y-4 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Utensils className="w-4 h-4" />
            </span>
            <div>
              <h2 id="food-modal-title" className="text-sm font-bold text-white">
                {editingCategory ? 'Edit Nutrient Category' : 'Add Food Category'}
              </h2>
              <p className="text-[11px] text-gray-300">
                Set daily target goal, unit &amp; quick increments
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close food category dialog"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono">
          <div>
            <label htmlFor="cat-name" className="text-[11px] text-gray-300 block mb-1">
              Category / Nutrient Name
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creatine, Sodium, Greens"
              className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="cat-target" className="text-[11px] text-gray-300 block mb-1">
                Daily Target Goal
              </label>
              <input
                id="cat-target"
                type="number"
                min="1"
                step="any"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="cat-unit" className="text-[11px] text-gray-300 block mb-1">
                Unit
              </label>
              <input
                id="cat-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="g, kcal, mg"
                className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="cat-step" className="text-[11px] text-gray-300 block mb-1">
                Quick Step (+ / -)
              </label>
              <input
                id="cat-step"
                type="number"
                min="0.5"
                step="any"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-300 block mb-1">Accent Color</span>
              <div className="flex items-center gap-2 pt-1.5">
                {COLOR_SWATCHES.map((col) => (
                  <button
                    key={col}
                    type="button"
                    aria-label={`Select color ${col}`}
                    onClick={() => setColor(col)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      color === col ? 'border-white scale-110' : 'border-transparent opacity-65'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[42px] py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              {editingCategory ? 'Update Category' : 'Add Nutrient Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface StudyCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; target: number; color: string }) => void;
}

export function StudyCategoryModal({ isOpen, onClose, onSave }: StudyCategoryModalProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('2.0');
  const [color, setColor] = useState('#38BDF8');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setTarget('2.0');
    setColor('#38BDF8');
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      target: Math.max(0.5, parseFloat(target) || 1.0),
      color,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-tile rounded-2xl p-4 sm:p-5 w-full max-w-md space-y-4 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 id="study-modal-title" className="text-sm font-bold text-white">
                Add Study Category
              </h2>
              <p className="text-[11px] text-gray-300">
                Configure discipline topic &amp; target daily focus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close study category dialog"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono">
          <div>
            <label htmlFor="study-cat-name" className="text-[11px] text-gray-300 block mb-1">
              Category Name
            </label>
            <input
              id="study-cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Machine Learning, System Design"
              className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="study-cat-target" className="text-[11px] text-gray-300 block mb-1">
              Target Hours (Daily)
            </label>
            <input
              id="study-cat-target"
              type="number"
              step="0.5"
              min="0.5"
              max="16"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-gray-300 block mb-1">Accent Color</span>
            <div className="flex items-center gap-2 pt-1">
              {['#38BDF8', '#818CF8', '#A855F7', '#34D399', '#F59E0B', '#EC4899'].map((col) => (
                <button
                  key={col}
                  type="button"
                  aria-label={`Select study color ${col}`}
                  onClick={() => setColor(col)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    color === col ? 'border-white scale-110' : 'border-transparent opacity-65'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[42px] py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Save Study Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
