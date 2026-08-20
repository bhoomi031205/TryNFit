import React from 'react';
import { ArrowDown, Sparkles, Shield, Zap, ShoppingBag } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[200px] bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-brand-500/30 text-brand-300 text-xs font-medium mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Generation AI Virtual Try-On</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          See how any garment looks on you{' '}
          <span className="gradient-text">before you buy.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Upload a photo of yourself and drop a screenshot of any clothing item from any online store.
          Our generative AI wraps fabric contours, lighting, and textures directly onto your silhouette.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Any Store Screenshot</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Works with Zara, ASOS, Amazon, Pinterest & more.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">100% Privacy Focused</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">In-memory RAM processing. Zero server storage.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">High Fidelity Neural Fit</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Realistic folds, posture alignment, and drape.</p>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#studio"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Virtual Fitting</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
