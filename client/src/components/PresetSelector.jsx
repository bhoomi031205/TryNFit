import React from 'react';
import { PRESET_MODELS, PRESET_GARMENTS } from '../data/presets';
import { Sparkles, User, Shirt, Wand2 } from 'lucide-react';

export const PresetSelector = ({ onSelectModel, onSelectGarment, onQuickCombo, disabled }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F3DCE4] shadow-card-pearl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FF407D]" />
            <h4 className="text-sm font-bold text-[#FF407D] font-outfit">Quick-Test Studio Presets</h4>
          </div>
          <p className="text-xs text-[#6F626A] mt-0.5">
            Don't have images handy? Click any sample below or try a pre-configured combo.
          </p>
        </div>

        {/* Autofill Combo Button */}
        <button
          type="button"
          onClick={onQuickCombo}
          disabled={disabled}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FDE8EF] text-[#FF407D] text-xs font-bold border border-[#F8BBD0] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0 font-outfit"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Autofill Combo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sample Models */}
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#1E1B1D] flex items-center gap-1.5 mb-2.5 font-outfit">
            <User className="w-3.5 h-3.5 text-[#FF407D]" />
            <span>SAMPLE MODEL PHOTOS</span>
          </span>
          <div className="grid grid-cols-4 gap-2.5">
            {PRESET_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => onSelectModel(model)}
                disabled={disabled}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-[#F3DCE4] hover:border-[#FF407D] focus:outline-none focus:ring-2 focus:ring-[#FF407D]/30 transition-all hover:scale-105 shadow-xs bg-[#FAF8F5]"
                title={`${model.name} (${model.gender})`}
              >
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sample Garments */}
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#1E1B1D] flex items-center gap-1.5 mb-2.5 font-outfit">
            <Shirt className="w-3.5 h-3.5 text-[#FF407D]" />
            <span>SAMPLE GARMENT ITEMS</span>
          </span>
          <div className="grid grid-cols-4 gap-2.5">
            {PRESET_GARMENTS.map((garment) => (
              <button
                key={garment.id}
                type="button"
                onClick={() => onSelectGarment(garment)}
                disabled={disabled}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-[#F3DCE4] hover:border-[#FF407D] focus:outline-none focus:ring-2 focus:ring-[#FF407D]/30 transition-all hover:scale-105 shadow-xs bg-[#FAF8F5]"
                title={`${garment.name} (${garment.tag})`}
              >
                <img
                  src={garment.thumbnail}
                  alt={garment.name}
                  className="w-full h-full object-cover bg-white"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
