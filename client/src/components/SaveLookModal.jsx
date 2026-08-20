import React, { useState } from 'react';
import { X, BookmarkPlus, Sparkles, Check, Loader2 } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_TAGS = ['Casual', 'Work', 'Party', 'Summer', 'Winter', 'Favorites', 'Date Night'];

export const SaveLookModal = ({ isOpen, onClose, lookData }) => {
  const { saveLook, isSavingLook } = useWardrobe();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState(lookData?.title || 'My AI Fitting');
  const [selectedTags, setSelectedTags] = useState(['Favorites']);
  const [customTag, setCustomTag] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSave = async () => {
    setErrorMessage('');
    try {
      await saveLook({
        title: title.trim() || 'Untitled Look',
        personImage: lookData.personPreview,
        garmentImage: lookData.garmentPreview,
        resultUrl: lookData.resultUrl,
        category: lookData.category || 'apparel',
        tags: selectedTags.length > 0 ? selectedTags : ['Custom Fit'],
        date: new Date().toISOString(),
      });

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Save look failed:', err);
      setErrorMessage(err?.message || 'Could not save look. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl card-pearl p-6 shadow-2xl border border-blush-border bg-pearl-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-blush-100 text-blush-600 hover:bg-blush-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 rounded-xl bg-blush-100 text-blush-500 border border-blush-200">
            <BookmarkPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink-900 font-outfit">Save to Digital Wardrobe</h3>
            <p className="text-xs text-ink-600">
              {isAuthenticated && user?.isSupabaseUser
                ? 'Secured to your private Supabase Cloud wardrobe.'
                : 'Stored safely in your digital wardrobe.'}
            </p>
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-pearl-warm border border-blush-border mb-5">
          <img
            src={lookData.resultUrl}
            alt="Result Preview"
            className="w-16 h-20 rounded-xl object-cover bg-pearl-white ring-2 ring-blush-200"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blush-500">
              AI Try-On Result
            </span>
            <p className="text-xs text-ink-700 truncate mt-0.5 font-medium">
              Ready to be added to your lookbook
            </p>
          </div>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-ink-700 mb-1.5 font-outfit">
            Look Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Linen Weekend"
            className="w-full px-3.5 py-2.5 rounded-xl bg-pearl-warm border border-blush-border text-ink-900 text-xs focus:outline-none focus:border-blush-400 font-medium"
          />
        </div>

        {/* Tag Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-ink-700 mb-1.5 font-outfit">
            Collections & Tags
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {SUGGESTED_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'pill-pink-active'
                      : 'pill-pink-inactive'
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Add custom tag */}
          <form onSubmit={handleAddCustomTag} className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom tag..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-pearl-warm border border-blush-border text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:border-blush-400"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-blush-100 text-xs font-bold text-blush-600 hover:bg-blush-200 border border-blush-200 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || isSavingLook}
          className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all font-outfit ${
            isSaved
              ? 'bg-emerald-600 text-pearl-white'
              : 'btn-pink-primary'
          }`}
        >
          {isSavingLook ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving to Wardrobe...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved to Wardrobe!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Save Look</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
