import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Cpu,
  Layers,
  ShieldCheck,
  Lock,
  Trash2,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Zap,
  Sliders
} from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'In-Memory Input Processing & Buffer Isolation',
      desc: 'When you upload your photo and clothing screenshot, our Express server buffers input files strictly in RAM memory via Multer memoryStorage. Your uploaded input photos are processed transiently and never saved to disk.',
      badge: 'In-Memory Inputs',
      icon: Lock,
    },
    {
      num: '02',
      title: 'Dense Pose & Human Silhouette Segmentation',
      desc: 'The neural model extracts anatomical keypoints (shoulders, torso, hips, limbs) and isolates body geometry while segmenting background and hair details to preserve identity.',
      badge: 'Pose Estimation',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Geometric Fabric Warping & Texture Synthesis',
      desc: 'The garment is separated from its background and deformed according to your 3D body contours, simulating natural fabric wrinkles, folds, and gravitational drape.',
      badge: 'Neural Deformation',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Latent Diffusion Inpainting & History Persistence',
      desc: 'A conditioned latent diffusion model synthesizes realistic shadows and fabric textures. The generated fitting result is saved locally so you can revisit your Wardrobe and Try-On History anytime with 0 extra API credit cost.',
      badge: 'Diffusion Model',
      icon: Sparkles,
    },
  ];

  const tips = [
    {
      title: 'Clean Frontal Stance',
      desc: 'Photos taken straight-on at chest or full-body level yield the sharpest fit and alignment.',
    },
    {
      title: 'Good Ambient Lighting',
      desc: 'Even lighting without harsh shadows helps the AI detect contours and match lighting accurately.',
    },
    {
      title: 'Unobstructed Garment Shots',
      desc: 'Store screenshots with a clean white or neutral background result in the cleanest fabric edges.',
    },
    {
      title: 'Accurate Category Selection',
      desc: 'Setting the garment category (Tops, Bottoms, One-Pieces) assists the AI in tailoring waistlines.',
    },
  ];

  return (
    <div className="py-8 sm:py-14 bg-pearl-white space-y-16 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FDE8EF] border border-[#F8BBD0] text-xs font-extrabold text-[#C2185B] mb-3 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#FF407D]" />
            <span>AI Architecture & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-900 font-outfit">
            How TryNFit AI Works
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-2 font-normal leading-relaxed">
            A look behind our neural virtual try-on pipeline, input privacy safeguards, and user-controlled history.
          </p>
        </div>

        {/* 4-Step Technical Architecture */}
        <div className="space-y-6 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 sm:p-8 rounded-3xl card-pearl flex flex-col md:flex-row items-start gap-6 shadow-card-pearl"
              >
                {/* Number & Icon */}
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-blush-100 border border-blush-200 flex items-center justify-center text-blush-500 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-ink-400 font-outfit md:hidden">
                    {step.num}
                  </span>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-ink-900 font-outfit">
                      {step.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FDE8EF] text-[#C2185B] border border-[#F8BBD0] hidden sm:inline-block shrink-0">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-600 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Tips Section */}
        <div className="p-6 sm:p-10 rounded-3xl bg-pearl-warm border border-blush-border mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-blush-500">
              Pro Tips
            </span>
            <h2 className="text-2xl font-extrabold text-ink-900 mt-1 font-outfit">
              How to Get Flawless AI Fittings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-pearl-white border border-blush-border flex items-start space-x-3 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-blush-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-ink-900 font-outfit">{tip.title}</h4>
                  <p className="text-[11px] text-ink-600 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Pillar Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-pearl-warm border border-blush-border flex flex-col md:flex-row items-center justify-between gap-6 mb-16 shadow-card-pearl">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-blush-100 border border-blush-200 text-blush-500 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900 font-outfit">
                Input Privacy & User-Controlled History
              </h3>
              <p className="text-xs text-ink-600 mt-1 max-w-xl font-normal leading-relaxed">
                Uploaded personal photos are processed strictly in RAM memory and are never saved or retained.
                Generated fitting results are cached locally so you can view your Wardrobe and Try-On History across sessions.
                You retain full privacy control and can delete any saved result or clear your complete history anytime.
              </p>
            </div>
          </div>

          <Link
            to="/history"
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B97] to-[#FF407D] text-white text-xs font-bold font-outfit shadow-sm hover:opacity-95 transition-opacity"
          >
            <span>Manage History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
