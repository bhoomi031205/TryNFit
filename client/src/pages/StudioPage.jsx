import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { PresetSelector } from '../components/PresetSelector';
import { GenerationState } from '../components/GenerationState';
import { ResultViewer } from '../components/ResultViewer';
import { ErrorAlert } from '../components/ErrorAlert';
import { SaveLookModal } from '../components/SaveLookModal';
import { generateTryOn } from '../services/api';
import { useWardrobe } from '../context/WardrobeContext';
import { urlToFile } from '../utils/fileValidation';
import { PRESET_MODELS, PRESET_GARMENTS, CURATED_COMBOS } from '../data/presets';
import { EXPLORE_LOOKS } from '../data/exploreData';
import { Sparkles, User, Shirt, ArrowRight, BookmarkPlus, ShieldCheck } from 'lucide-react';

export const StudioPage = () => {
  const [searchParams] = useSearchParams();
  const { addSavedLook } = useWardrobe();

  // Upload States
  const [personFile, setPersonFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);

  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentPreview, setGarmentPreview] = useState(null);

  // Configuration States
  const [category, setCategory] = useState('auto');
  const [mode, setMode] = useState('balanced');
  const [comboIndex, setComboIndex] = useState(0);

  // Flow States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Handle Explore Page Preset Navigation (?preset=id)
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      const foundLook = EXPLORE_LOOKS.find((l) => l.id === presetId);
      if (foundLook) {
        const loadPreset = async () => {
          try {
            const mFile = await urlToFile(foundLook.modelImage, `${foundLook.id}-model.jpg`, 'image/jpeg');
            const gFile = await urlToFile(foundLook.garmentImage, `${foundLook.id}-garment.jpg`, 'image/jpeg');
            setPersonFile(mFile);
            setPersonPreview(foundLook.modelImage);
            setGarmentFile(gFile);
            setGarmentPreview(foundLook.garmentImage);
            if (foundLook.category) setCategory(foundLook.category);
          } catch (e) {
            console.error('Failed to prefill look:', e);
          }
        };
        loadPreset();
      }
    }
  }, [searchParams]);

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
    setPersonPreview(model.url);
    setError(null);
    try {
      const file = await urlToFile(model.url, `${model.id}.jpg`, 'image/jpeg');
      setPersonFile(file);
    } catch (e) {
      console.warn('Fallback file created for preset model:', e);
      const dummy = new File([new Blob(['preset'])], `${model.id}.jpg`, { type: 'image/jpeg' });
      setPersonFile(dummy);
    }
  };

  // Preset Garment Selection
  const handleSelectPresetGarment = async (garment) => {
    setGarmentPreview(garment.url);
    if (garment.category) setCategory(garment.category);
    setError(null);
    try {
      const file = await urlToFile(garment.url, `${garment.id}.jpg`, 'image/jpeg');
      setGarmentFile(file);
    } catch (e) {
      console.warn('Fallback file created for preset garment:', e);
      const dummy = new File([new Blob(['preset'])], `${garment.id}.jpg`, { type: 'image/jpeg' });
      setGarmentFile(dummy);
    }
  };

  // Preset Quick Combo
  const handleQuickCombo = async () => {
    const selectedCombo = CURATED_COMBOS[comboIndex];
    setComboIndex((prev) => (prev + 1) % CURATED_COMBOS.length);

    const model = PRESET_MODELS.find((m) => m.id === selectedCombo.modelId) || PRESET_MODELS[0];
    const garment = PRESET_GARMENTS.find((g) => g.id === selectedCombo.garmentId) || PRESET_GARMENTS[0];

    setPersonPreview(model.url);
    setGarmentPreview(garment.url);
    if (selectedCombo.category) setCategory(selectedCombo.category);
    setError(null);

    try {
      const [mFile, gFile] = await Promise.all([
        urlToFile(model.url, `${model.id}.jpg`, 'image/jpeg'),
        urlToFile(garment.url, `${garment.id}.jpg`, 'image/jpeg'),
      ]);
      setPersonFile(mFile);
      setGarmentFile(gFile);
    } catch (e) {
      console.warn('Error loading combo preset files:', e);
      setPersonFile(new File([new Blob(['preset'])], `${model.id}.jpg`, { type: 'image/jpeg' }));
      setGarmentFile(new File([new Blob(['preset'])], `${garment.id}.jpg`, { type: 'image/jpeg' }));
    }
  };

  // Submit and Generate Try-On
  const handleGenerate = async () => {
    let pFile = personFile;
    let gFile = garmentFile;

    if (!pFile && personPreview) {
      try {
        pFile = await urlToFile(personPreview, 'person.jpg', 'image/jpeg');
        setPersonFile(pFile);
      } catch (e) {
        pFile = new File([new Blob(['person'])], 'person.jpg', { type: 'image/jpeg' });
        setPersonFile(pFile);
      }
    }

    if (!gFile && garmentPreview) {
      try {
        gFile = await urlToFile(garmentPreview, 'garment.jpg', 'image/jpeg');
        setGarmentFile(gFile);
      } catch (e) {
        gFile = new File([new Blob(['garment'])], 'garment.jpg', { type: 'image/jpeg' });
        setGarmentFile(gFile);
      }
    }

    if (!pFile || !gFile) {
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
        personImage: pFile,
        garmentImage: gFile,
        category,
        mode,
      });

      if (response?.data?.resultUrl) {
        setResult(response.data);
        try {
          const newLookItem = {
            ...(response.data.historyItem || response.data),
            resultUrl: response.data.resultUrl,
            personPreview: personPreview || response.data.personPreview,
            garmentPreview: garmentPreview || response.data.garmentPreview,
            title: `Try-On #${(savedLooks?.length || 0) + 1}`,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };
          addSavedLook(newLookItem);
        } catch (historyErr) {
          console.warn('History UI sync warning:', historyErr);
        }
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

  const isFormComplete = Boolean((personFile || personPreview) && (garmentFile || garmentPreview));

  return (
    <div className="py-6 sm:py-10 bg-[#FAF8F5] min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Studio Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FDE8EF] border border-[#F8BBD0] text-xs font-bold mb-3 shadow-sm text-[#FF407D]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF407D]" />
            <span>Interactive Fitting Lab</span>
          </div>
          
          <div className="relative inline-block">
            <span className="absolute -left-7 top-1 text-[#FF407D] text-xl animate-pulse">✦</span>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#1E1B1D] font-serif">
              AI Virtual <span className="text-[#FF407D] italic font-serif">TryNFit</span> Studio
            </h1>
            <span className="absolute -right-7 top-1 text-[#FF407D] text-xl animate-pulse">✦</span>
          </div>

          <p className="text-xs sm:text-sm text-[#6F626A] mt-2.5">
            Upload your photo and a garment screenshot to render your realistic digital fit.
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

        {/* View States */}
        {isLoading ? (
          /* State 1: Generation Progress Loader */
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
              onSaveToWardrobe={() => setIsSaveModalOpen(true)}
            />
          </div>
        ) : (
          /* State 3: Upload Studio */
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Dual Upload Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Slot 1: Person Photo */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F3DCE4] shadow-card-pearl flex flex-col justify-between">
                <ImageUploader
                  title="Your Photo"
                  subtitle="Portrait or full-body picture"
                  icon={User}
                  badgeText="SLOT 1"
                  file={personFile}
                  previewUrl={personPreview}
                  onFileSelect={handlePersonFileSelect}
                  onClear={handleClearPerson}
                  tip="Best results with good lighting & clear posture."
                  disabled={isLoading}
                />
              </div>

              {/* Slot 2: Garment Image */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F3DCE4] shadow-card-pearl flex flex-col justify-between">
                <ImageUploader
                  title="Garment Image"
                  subtitle="Clothing item or online screenshot"
                  icon={Shirt}
                  badgeText="SLOT 2"
                  file={garmentFile}
                  previewUrl={garmentPreview}
                  onFileSelect={handleGarmentFileSelect}
                  onClear={handleClearGarment}
                  tip="Works with Zara, ASOS, or flat-lay clothing screenshots."
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


            {/* Main Action Bar: Pink Gradient Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!isFormComplete || isLoading}
                className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center space-x-3 transition-all duration-300 font-outfit ${
                  isFormComplete && !isLoading
                    ? 'btn-pink-primary shadow-pink-glow'
                    : 'bg-[#FDE8EF] text-[#D9A7B7] border border-[#F8BBD0] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Generate Virtual Try-On</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isFormComplete && (
                <p className="text-xs text-[#6F626A] mt-2.5">
                  Upload both your photo and garment image to activate generation.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Save to Digital Wardrobe Modal */}
        {result && (
          <SaveLookModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            lookData={{
              personPreview,
              garmentPreview,
              resultUrl: result.resultUrl,
              category,
            }}
          />
        )}
      </div>
    </div>
  );
};
