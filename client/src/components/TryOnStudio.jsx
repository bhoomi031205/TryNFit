import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { PresetSelector } from './PresetSelector';
import { GenerationState } from './GenerationState';
import { ResultViewer } from './ResultViewer';
import { ErrorAlert } from './ErrorAlert';
import { generateTryOn } from '../services/api';
import { urlToFile } from '../utils/fileValidation';
import { PRESET_MODELS, PRESET_GARMENTS } from '../data/presets';
import { Sparkles, User, Shirt, ArrowRight, ShieldCheck } from 'lucide-react';

export const TryOnStudio = () => {
  // Upload States
  const [personFile, setPersonFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);

  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentPreview, setGarmentPreview] = useState(null);

  // Configuration States
  const [category, setCategory] = useState('auto');
  const [mode, setMode] = useState('balanced');

  // Generation & Flow States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Handle Person File Selection
  const handlePersonFileSelect = (file) => {
    if (personPreview && personPreview.startsWith('blob:')) {
      URL.revokeObjectURL(personPreview);
    }
    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleClearPerson = () => {
    if (personPreview && personPreview.startsWith('blob:')) {
      URL.revokeObjectURL(personPreview);
    }
    setPersonFile(null);
    setPersonPreview(null);
  };

  // Handle Garment File Selection
  const handleGarmentFileSelect = (file) => {
    if (garmentPreview && garmentPreview.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreview);
    }
    setGarmentFile(file);
    setGarmentPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleClearGarment = () => {
    if (garmentPreview && garmentPreview.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreview);
    }
    setGarmentFile(null);
    setGarmentPreview(null);
  };

  // Preset Model Selection
  const handleSelectPresetModel = async (model) => {
    try {
      const file = await urlToFile(model.url, `${model.id}.jpg`, 'image/jpeg');
      setPersonFile(file);
      setPersonPreview(model.url);
      setError(null);
    } catch (e) {
      console.error('Failed to load preset model image:', e);
      setPersonPreview(model.url);
    }
  };

  // Preset Garment Selection
  const handleSelectPresetGarment = async (garment) => {
    try {
      const file = await urlToFile(garment.url, `${garment.id}.jpg`, 'image/jpeg');
      setGarmentFile(file);
      setGarmentPreview(garment.url);
      if (garment.category) setCategory(garment.category);
      setError(null);
    } catch (e) {
      console.error('Failed to load preset garment image:', e);
      setGarmentPreview(garment.url);
    }
  };

  // Preset Quick Combo
  const handleQuickCombo = async () => {
    const randomModel = PRESET_MODELS[Math.floor(Math.random() * PRESET_MODELS.length)];
    const randomGarment = PRESET_GARMENTS[Math.floor(Math.random() * PRESET_GARMENTS.length)];
    await handleSelectPresetModel(randomModel);
    await handleSelectPresetGarment(randomGarment);
  };

  // Submit and Generate Try-On
  const handleGenerate = async () => {
    if (!personFile || !garmentFile) {
      setError({
        message: 'Please upload both your photo and a garment image before generating.',
        code: 'MISSING_FILES',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateTryOn({
        personImage: personFile,
        garmentImage: garmentFile,
        category,
        mode,
      });

      if (response?.data?.resultUrl) {
        setResult(response.data);
      } else {
        throw new Error('Virtual try-on completed but no image URL was returned.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Try Another Garment Handler
  const handleTryAnotherGarment = () => {
    handleClearGarment();
    setResult(null);
    setError(null);
  };

  // Full Reset Handler
  const handleReset = () => {
    handleClearPerson();
    handleClearGarment();
    setResult(null);
    setError(null);
  };

  const isFormComplete = Boolean(personFile && garmentFile);

  return (
    <section id="studio" className="py-8 sm:py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Studio Section Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold border border-brand-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fitting Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Create Your Look
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fill both slots with photos, or select from studio presets below.
          </p>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="mb-6 max-w-4xl mx-auto">
            <ErrorAlert
              error={error}
              onDismiss={() => setError(null)}
              onRetry={handleGenerate}
            />
          </div>
        )}

        {/* Conditional Views */}
        {isLoading ? (
          /* State 1: Generation Loading View */
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <GenerationState
              personPreview={personPreview}
              garmentPreview={garmentPreview}
            />
          </div>
        ) : result ? (
          /* State 2: Completed Result View */
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <ResultViewer
              resultUrl={result.resultUrl}
              personPreview={personPreview}
              garmentPreview={garmentPreview}
              isDemo={result.isDemo}
              onTryAnotherGarment={handleTryAnotherGarment}
              onReset={handleReset}
            />
          </div>
        ) : (
          /* State 3: Main Upload Studio */
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Dual Upload Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Slot 1: Person Photo */}
              <div className="p-4 sm:p-5 rounded-3xl bg-studio-900/60 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-slate-700/80 transition-all flex flex-col justify-between">
                <ImageUploader
                  title="Your Photo"
                  subtitle="Portrait or full-body picture"
                  icon={User}
                  badgeText="Slot 1"
                  file={personFile}
                  previewUrl={personPreview}
                  onFileSelect={handlePersonFileSelect}
                  onClear={handleClearPerson}
                  tip="Best results with good lighting & uncluttered background."
                  disabled={isLoading}
                />
              </div>

              {/* Slot 2: Garment Image */}
              <div className="p-4 sm:p-5 rounded-3xl bg-studio-900/60 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-slate-700/80 transition-all flex flex-col justify-between">
                <ImageUploader
                  title="Garment Image"
                  subtitle="Clothing item or online screenshot"
                  icon={Shirt}
                  badgeText="Slot 2"
                  file={garmentFile}
                  previewUrl={garmentPreview}
                  onFileSelect={handleGarmentFileSelect}
                  onClear={handleClearGarment}
                  tip="Works with store screenshots, catalog photos, or lay-flat clothing."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Quick Test Presets Carousel */}
            <PresetSelector
              onSelectModel={handleSelectPresetModel}
              onSelectGarment={handleSelectPresetGarment}
              onQuickCombo={handleQuickCombo}
              disabled={isLoading}
            />


            {/* Main Action Bar */}
            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!isFormComplete || isLoading}
                className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-3 transition-all duration-300 font-outfit ${
                  isFormComplete && !isLoading
                    ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-brand-200" />
                <span>Generate Virtual Try-On</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isFormComplete && (
                <p className="text-xs text-slate-400 mt-2.5">
                  Upload both your photo and garment image to activate generation.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
