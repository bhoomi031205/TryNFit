import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWardrobe } from '../context/WardrobeContext';
import {
  BookmarkPlus,
  Trash2,
  Download,
  Sliders,
  Sparkles,
  Calendar,
  Layers,
  X,
  Plus,
  Clock,
  Cpu,
  Eye
} from 'lucide-react';

export const WardrobePage = () => {
  const { savedLooks, deleteLook, clearWardrobe, savedCount, isLoadingHistory } = useWardrobe();
  const [comparingLook, setComparingLook] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewingImage, setViewingImage] = useState(null);

  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-pearl-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FDE8EF] border border-[#F8BBD0] text-xs font-extrabold text-[#C2185B] mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF407D]" />
              <span>Persistent AI History ({savedCount})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 font-outfit">
              My Try-Ons History
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              Every successful AI try-on is automatically saved here.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/studio"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl btn-pink-primary text-xs font-bold font-outfit"
            >
              <Plus className="w-4 h-4" />
              <span>New Try-On</span>
            </Link>

            {savedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all your saved try-on history?')) {
                    clearWardrobe();
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-blush-100 hover:bg-rose-100 text-blush-600 hover:text-rose-600 border border-blush-200 text-xs font-bold transition-colors"
                title="Clear all saved history"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {/* History Grid */}
        {isLoadingHistory ? (
          <div className="py-20 text-center text-ink-500 font-medium text-sm">
            Loading your try-on history...
          </div>
        ) : savedLooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedLooks.map((look, index) => {
              const displayTitle = look.title || `Try-On #${savedLooks.length - index}`;
              const displayDate = look.createdAt || look.date
                ? new Date(look.createdAt || look.date).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Just now';

              return (
                <div
                  key={look.id || `look-${index}`}
                  className="rounded-3xl card-pearl overflow-hidden flex flex-col justify-between shadow-card-pearl border border-blush-border"
                >
                  {/* Generated Result Image Container */}
                  <div className="relative aspect-[3/4] bg-pearl-warm overflow-hidden border-b border-blush-border group">
                    <img
                      src={
                        look.resultUrl && (look.resultUrl.startsWith('/uploads') || look.resultUrl.startsWith('/api'))
                          ? `${import.meta.env.VITE_API_BASE_URL || ''}${look.resultUrl}`
                          : look.resultUrl
                      }
                      alt={displayTitle}
                      onError={(e) => {
                        if (look.resultUrl && look.resultUrl.startsWith('http')) {
                          e.target.onerror = null;
                          e.target.src = `${import.meta.env.VITE_API_BASE_URL || ''}/api/tryon/proxy-image?url=${encodeURIComponent(look.resultUrl)}`;
                        }
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Quick View Floating Overlay */}
                    <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setViewingImage(look.resultUrl)}
                        className="px-3.5 py-2 rounded-xl bg-pearl-white text-ink-900 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-blush-50"
                      >
                        <Eye className="w-4 h-4 text-blush-500" />
                        <span>View Full</span>
                      </button>
                      {look.personPreview && (
                        <button
                          type="button"
                          onClick={() => setComparingLook(look)}
                          className="px-3.5 py-2 rounded-xl btn-pink-primary text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
                        >
                          <Sliders className="w-4 h-4" />
                          <span>Slider</span>
                        </button>
                      )}
                    </div>

                    {/* Model Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-pearl-white/90 backdrop-blur-md text-ink-800 text-[10px] font-bold border border-blush-border shadow-sm flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-blush-500" />
                      <span>{look.model || 'fal/fashn-tryon-v1-5'}</span>
                    </div>

                    {/* Index Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full badge-blush backdrop-blur-md text-[10px] font-extrabold shadow-sm">
                      {displayTitle}
                    </div>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-base font-extrabold text-ink-900 font-outfit truncate">
                          {displayTitle}
                        </h3>
                        <div className="flex items-center space-x-1 text-[11px] text-ink-500 font-semibold shrink-0">
                          <Clock className="w-3 h-3 text-blush-400" />
                          <span>{displayDate}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-ink-500 font-mono truncate">
                        ID: {look.id}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="mt-4 pt-3.5 border-t border-blush-border flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingImage(look.resultUrl)}
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl btn-pink-soft text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blush-500" />
                        <span>Open Result</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(look.resultUrl, displayTitle)}
                        className="p-2 rounded-xl btn-pink-soft transition-colors"
                        title="Download image"
                      >
                        <Download className="w-4 h-4 text-blush-500" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteLook(look.id)}
                        className="p-2 rounded-xl bg-blush-100 hover:bg-rose-100 text-blush-600 hover:text-rose-600 border border-blush-200 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 rounded-3xl card-pearl max-w-xl mx-auto p-8 shadow-card-pearl border border-blush-border">
            <div className="w-16 h-16 rounded-2xl bg-blush-100 border border-blush-200 flex items-center justify-center text-blush-500 mx-auto mb-4 shadow-sm">
              <BookmarkPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-ink-900 font-outfit mb-2">
              No Try-Ons Yet
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 mb-6 font-normal leading-relaxed">
              Upload your portrait and a garment photo in the AI Studio. Every successful try-on will automatically be saved to your history here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/studio"
                className="w-full sm:w-auto px-6 py-3 rounded-xl btn-pink-primary text-xs font-bold font-outfit"
              >
                Go to Try-On Studio
              </Link>
            </div>
          </div>
        )}

        {/* Fullsize Image Viewing Modal */}
        {viewingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-3xl rounded-3xl card-pearl p-4 sm:p-6 shadow-2xl border border-blush-border bg-pearl-white max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blush-500" />
                  <h3 className="text-base font-bold text-ink-900 font-outfit">Saved Try-On Output</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingImage(null)}
                  className="p-1.5 rounded-full bg-blush-100 text-blush-600 hover:bg-blush-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden rounded-2xl bg-pearl-warm border border-blush-border flex items-center justify-center p-2">
                <img
                  src={viewingImage}
                  alt="Saved Try-On Result"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Compare Before/After Modal */}
        {comparingLook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-3xl card-pearl p-5 sm:p-6 shadow-2xl border border-blush-border bg-pearl-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-ink-900 font-outfit">
                    {comparingLook.title || 'Saved Try-On'}
                  </h3>
                  <p className="text-xs text-ink-600">Drag the slider to compare before vs after</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComparingLook(null)}
                  className="p-1.5 rounded-full bg-blush-100 text-blush-600 hover:bg-blush-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-pearl-warm border border-blush-border select-none shadow-sm">
                <img
                  src={comparingLook.resultUrl}
                  alt="Result"
                  className="absolute inset-0 w-full h-full object-contain"
                />

                {comparingLook.personPreview && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={comparingLook.personPreview}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain max-w-none"
                      style={{ width: '100%', minWidth: '100%' }}
                    />
                  </div>
                )}

                <div
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-blush-300 via-blush-500 to-blush-300 shadow-[0_0_12px_rgba(232,93,138,0.5)] pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-pearl-white text-blush-500 shadow-md flex items-center justify-center font-bold text-xs border border-blush-border">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  aria-label="Look comparison slider"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-pearl-white/95 backdrop-blur-md text-ink-900 text-[11px] font-bold border border-blush-border shadow-sm">
                  Before
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B97] to-[#FF407D] text-white text-[11px] font-extrabold shadow-md border border-[#FF6B97]/50 backdrop-blur-md flex items-center gap-1">
                  After ✨
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
