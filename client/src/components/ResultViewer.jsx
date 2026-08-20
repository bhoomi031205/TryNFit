import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  Columns2,
  Maximize2,
  Info,
  Check,
  Share2,
  BookmarkPlus,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResultViewer = ({
  resultUrl,
  personPreview,
  garmentPreview,
  isDemo,
  onTryAnotherGarment,
  onReset,
  onSaveToWardrobe,
}) => {
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side' | 'result-only'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isCopied, setIsCopied] = useState(false);
  const sliderContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F48FB1', '#F8BBD0', '#E85D8A', '#D9A7B7', '#FCE4EC'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const getFormattedUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads') || url.startsWith('/api')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const displayResultUrl = getFormattedUrl(resultUrl);

  if (!resultUrl) {
    return (
      <div className="p-6 text-center rounded-3xl card-pearl border border-rose-200 bg-rose-50 text-rose-900 shadow-sm animate-fadeIn">
        <p className="font-bold text-sm">Virtual try-on completed, but no image URL was provided for display.</p>
      </div>
    );
  }

  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      handleSliderMove(e.clientX);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `trynfit-result-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(resultUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(resultUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl card-pearl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-blush-100 text-blush-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-ink-900 font-outfit">Virtual Fitting Complete</h3>
            {isDemo && (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full badge-blush">
                Demo Result
              </span>
            )}
          </div>
          <p className="text-xs text-ink-600 mt-0.5">
            Compare the before and after, download the look, or save it to your wardrobe.
          </p>
        </div>

        {/* View Controls: Light Pink Container & Pink Active Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-pearl-warm border border-blush-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'slider'
                ? 'pill-pink-active'
                : 'pill-pink-inactive'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Before/After Slider</span>
            <span className="sm:hidden">Slider</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'side-by-side'
                ? 'pill-pink-active'
                : 'pill-pink-inactive'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side by Side</span>
            <span className="sm:hidden">Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('result-only')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'result-only'
                ? 'pill-pink-active'
                : 'pill-pink-inactive'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Single View</span>
            <span className="sm:hidden">Full</span>
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div className="rounded-3xl card-pearl p-3 sm:p-5 shadow-card-pearl overflow-hidden bg-pearl-warm">
        {/* Mode 1: Interactive Before/After Split Slider */}
        {viewMode === 'slider' && (
          <div
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-h-[560px] mx-auto rounded-2xl overflow-hidden cursor-ew-resize select-none bg-pearl-white border border-blush-border shadow-sm"
          >
            {/* Base/Under Image: Result Try-on */}
            <img
              src={displayResultUrl}
              alt="Virtual Try-On Result"
              onError={(e) => {
                if (resultUrl && resultUrl.startsWith('http')) {
                  e.target.onerror = null;
                  e.target.src = `http://localhost:5001/api/tryon/proxy-image?url=${encodeURIComponent(resultUrl)}`;
                }
              }}
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Over Image: Original Person (Clipped to slider percentage) */}
            {personPreview && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={personPreview}
                  alt="Original Photo"
                  className="absolute inset-0 w-full h-full object-contain max-w-none"
                  style={{
                    width: sliderContainerRef.current?.offsetWidth || '100%',
                    height: '100%',
                  }}
                />
              </div>
            )}

            {/* Draggable Divider Line: Pink Glow */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-blush-300 via-blush-500 to-blush-300 shadow-[0_0_12px_rgba(232,93,138,0.5)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-pearl-white text-blush-500 shadow-md flex items-center justify-center font-bold text-xs border border-blush-border">
                ↔
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-pearl-white/95 backdrop-blur-md text-ink-900 text-[11px] font-bold border border-blush-border shadow-sm">
              Before
            </div>
            <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF6B97] to-[#FF407D] text-white text-[11px] font-extrabold shadow-md border border-[#FF6B97]/50 backdrop-blur-md flex items-center gap-1">
              After ✨
            </div>
          </div>
        )}

        {/* Mode 2: Side by Side View */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Person Photo */}
            <div className="rounded-2xl bg-pearl-white border border-blush-border p-2.5 flex flex-col items-center shadow-sm">
              <span className="text-xs font-semibold text-ink-600 mb-2">Original You</span>
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-pearl-warm">
                {personPreview ? (
                  <img src={personPreview} alt="Original" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-ink-400">No Photo</div>
                )}
              </div>
            </div>

            {/* Garment Image */}
            <div className="rounded-2xl bg-pearl-white border border-blush-border p-2.5 flex flex-col items-center shadow-sm">
              <span className="text-xs font-semibold text-ink-600 mb-2">Chosen Garment</span>
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-pearl-warm">
                {garmentPreview ? (
                  <img src={garmentPreview} alt="Garment" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-ink-400">No Garment</div>
                )}
              </div>
            </div>

            {/* Generated Result */}
            <div className="rounded-2xl bg-pearl-white border-2 border-blush-300 p-2.5 flex flex-col items-center shadow-md">
              <span className="text-xs font-bold text-blush-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Virtual Try-On Result
              </span>
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-pearl-warm">
                <img
                  src={displayResultUrl}
                  alt="Result"
                  onError={(e) => {
                    if (resultUrl && resultUrl.startsWith('http')) {
                      e.target.onerror = null;
                      e.target.src = `http://localhost:5001/api/tryon/proxy-image?url=${encodeURIComponent(resultUrl)}`;
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Single Result Only */}
        {viewMode === 'result-only' && (
          <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-h-[560px] mx-auto rounded-2xl overflow-hidden bg-pearl-white flex items-center justify-center border border-blush-border shadow-sm">
            <img
              src={displayResultUrl}
              alt="Generated Virtual Try-On"
              onError={(e) => {
                if (resultUrl && resultUrl.startsWith('http')) {
                  e.target.onerror = null;
                  e.target.src = `http://localhost:5001/api/tryon/proxy-image?url=${encodeURIComponent(resultUrl)}`;
                }
              }}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full badge-blush backdrop-blur-md text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blush-500" />
              <span>TryNFit AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Bar: Pink & Light Pink */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* View History Button */}
        <Link
          to="/history"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl btn-pink-soft font-bold text-sm font-outfit"
        >
          <Clock className="w-4 h-4 text-blush-500" />
          <span>View History</span>
        </Link>

        {/* Download Button: Pink Gradient */}
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl btn-pink-primary font-bold text-sm font-outfit"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res</span>
        </button>

        {/* Try Another Garment (keeps person): Light Pink Tone */}
        <button
          type="button"
          onClick={onTryAnotherGarment}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl btn-pink-soft font-bold text-sm"
        >
          <RotateCcw className="w-4 h-4 text-blush-500" />
          <span>Try Another Garment</span>
        </button>
      </div>
    </div>
  );
};
