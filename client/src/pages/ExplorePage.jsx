import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXPLORE_CATEGORIES, EXPLORE_LOOKS } from '../data/exploreData';
import { Sparkles, Search, ArrowRight, User, Shirt, Filter, Download, X } from 'lucide-react';

const CATEGORY_ICONS = {
  'All': '✦',
  'Streetwear': '🔥',
  'Luxury & Evening': '💎',
  'Casual Chic': '✨',
  'Summer Vibes': '☀️',
  'Tailored & Workwear': '👔',
};

export const ExplorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLooks = EXPLORE_LOOKS.filter((look) => {
    const matchesCategory =
      selectedCategory === 'All' || look.style === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      look.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      look.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      look.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-14 bg-pearl-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FDE8EF] border border-[#F8BBD0] text-xs font-extrabold text-[#C2185B] mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF407D]" />
            <span>Style Inspiration Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-900 font-outfit">
            Explore AI Trending Styles
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-2">
            Discover curated combinations generated with TryNFit. Click any look to test it in the Studio with 1 click.
          </p>
        </div>

        {/* Centered Search Bar */}
        <div className="max-w-md sm:max-w-lg mx-auto mb-5 relative">
          <Search className="w-4 h-4 text-[#FF407D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, dress, jacket, style..."
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-[#F3DCE4] text-[#1E1B1D] text-xs font-semibold placeholder-[#8E8088] focus:outline-none focus:border-[#FF407D] focus:ring-2 focus:ring-[#FF407D]/20 shadow-sm hover:border-[#F8BBD0] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#FDE8EF] text-[#8E8088] hover:text-[#FF407D] transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Centered Category Filter Pills with Icons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
          {EXPLORE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const icon = CATEGORY_ICONS[cat] || '✦';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B97] to-[#FF407D] text-white shadow-md shadow-[#FF407D]/25 border border-[#FF407D] scale-105'
                    : 'bg-white text-[#4A4147] border border-[#F3DCE4] hover:bg-[#FFF0F5] hover:border-[#F8BBD0] hover:text-[#FF407D] shadow-xs hover:scale-105'
                }`}
              >
                <span>{icon}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Looks Grid */}
        {filteredLooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredLooks.map((look) => (
              <div
                key={look.id}
                className="rounded-3xl card-pearl overflow-hidden flex flex-col justify-between group"
              >
                {/* Result Hero Image */}
                <div className="relative aspect-[4/5] bg-pearl-warm overflow-hidden border-b border-blush-border">
                  <img
                    src={look.previewResult}
                    alt={look.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Style Tag Overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pearl-white/90 backdrop-blur-md text-[10px] font-bold text-ink-900 uppercase tracking-wider border border-blush-border shadow-sm">
                    {look.style}
                  </div>

                  {/* Difficulty Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full badge-blush backdrop-blur-md text-[10px] font-bold shadow-sm">
                    {look.difficulty}
                  </div>

                  {/* Model & Garment Thumbnails Floating Inset */}
                  <div className="absolute bottom-3 left-3 right-3 p-2 rounded-2xl bg-pearl-white/95 backdrop-blur-md border border-blush-border flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-8 h-10 rounded-lg overflow-hidden border border-blush-300">
                        <img src={look.modelImage} alt="Model" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-ink-500 font-bold">+</span>
                      <div className="relative w-8 h-10 rounded-lg overflow-hidden border border-blush-300 bg-pearl-warm">
                        <img src={look.garmentImage} alt="Garment" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[10px] text-blush-500 font-bold truncate max-w-[120px]">
                      {look.brandInspiration}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-ink-900 font-outfit mb-1">
                      {look.title}
                    </h3>
                    <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                      {look.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {look.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md badge-blush text-[10px] font-semibold"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Pink Gradient Button */}
                  <div className="mt-5 pt-4 border-t border-blush-border flex items-center justify-between gap-3">
                    <Link
                      to={`/studio?preset=${look.id}`}
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl btn-pink-primary text-xs font-bold font-outfit"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Try This Look in Studio</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl card-pearl">
            <Filter className="w-8 h-8 text-blush-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-ink-900 font-outfit">No looks found</h3>
            <p className="text-xs text-ink-600 mt-1">Try searching for a different keyword or style.</p>
          </div>
        )}
      </div>
    </div>
  );
};
