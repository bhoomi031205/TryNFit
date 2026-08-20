import React from 'react';
import { Camera, Shirt, Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Photo',
      desc: 'Take or choose a clear, front-facing portrait or full-body picture.',
      icon: Camera,
      color: 'from-brand-500 to-indigo-500',
    },
    {
      step: '02',
      title: 'Pick Any Clothing Item',
      desc: 'Snap a screenshot from Zara, ASOS, Shein, or any website.',
      icon: Shirt,
      color: 'from-indigo-500 to-cyan-500',
    },
    {
      step: '03',
      title: 'Instant Virtual Try-On',
      desc: 'Our AI model analyzes lighting, fabric wrinkles, and your posture in seconds.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-slate-800/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 font-outfit">
            How TryNFit Works
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Designed for shoppers, fashion creators, and digital wardrobes with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-studio-900/60 border border-slate-800/80 p-6 sm:p-7 flex flex-col items-start hover:border-slate-700 transition-all group shadow-lg"
              >
                {/* Step Number Watermark */}
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-800/50 absolute top-5 right-6 font-outfit select-none group-hover:text-brand-500/20 transition-colors">
                  {item.step}
                </span>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} p-[1px] mb-5 shadow-lg`}
                >
                  <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-outfit">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
