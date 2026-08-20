import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const GENERATION_STAGES = [
  { id: 1, label: 'Uploading image payloads to TryOn-API', duration: 1500 },
  { id: 2, label: 'Analyzing body posture & garment texture alignment', duration: 3500 },
  { id: 3, label: 'Applying neural fabric deformation & light blending', duration: 5500 },
  { id: 4, label: 'Synthesizing final high-resolution render', duration: 4000 },
];

export const GenerationState = ({ personPreview, garmentPreview }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 sm:p-12 rounded-3xl card-pearl text-center relative overflow-hidden shadow-card-pearl border border-blush-border">
      {/* Scanning light beam */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-40" />

      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blush-100/70 blur-[90px] rounded-full pointer-events-none" />

      {/* Dual Image Preview with Animated Synthesis Bridge */}
      <div className="flex items-center justify-center space-x-3 sm:space-x-6 mb-8 relative z-10">
        {/* Person Thumbnail */}
        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-blush-300 shadow-sm bg-pearl-warm">
          <img src={personPreview} alt="Model" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blush-500/5" />
        </div>

        {/* Neural Transfer Icon */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-blush-primary p-[1.5px] shadow-md shadow-blush-500/25 animate-pulse-slow">
            <div className="w-full h-full bg-pearl-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blush-500" />
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-blush-500 tracking-wider mt-2">
            TryOn-API Fit
          </span>
        </div>

        {/* Garment Thumbnail */}
        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-blush-300 shadow-sm bg-pearl-warm">
          <img src={garmentPreview} alt="Garment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blush-500/5" />
        </div>
      </div>

      {/* Generation Status Title */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-ink-900 mb-2 font-outfit">
        Generating your outfit with AI...
      </h3>
      <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto mb-8 font-normal">
        TryOn-API neural model is calculating clothing drape, wrinkles, shadows, and natural fit.
      </p>

      {/* Stage Progress List */}
      <div className="max-w-md mx-auto space-y-2.5 text-left mb-6 relative z-10">
        {GENERATION_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 ${
                isDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isCurrent
                  ? 'bg-blush-100 border-blush-300 text-ink-900 shadow-sm'
                  : 'bg-pearl-warm border-blush-border text-ink-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blush-500 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-ink-300 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold">{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Estimated Time Note */}
      <p className="text-[11px] text-ink-500 italic relative z-10">
        ⏱️ Average processing time: 5–20 seconds. Please keep this tab open.
      </p>
    </div>
  );
};
