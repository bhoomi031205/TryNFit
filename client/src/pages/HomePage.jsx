import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Target,
  Flame,
  Star,
  Check,
  ChevronDown,
  Compass,
  ShoppingBag,
  Sliders,
  Plus
} from 'lucide-react';
import { EXPLORE_LOOKS } from '../data/exploreData';

export const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeVibe, setActiveVibe] = useState(1);

  const vibes = [
    {
      id: 1,
      label: 'Vibe 1',
      subtitle: 'Luxury Evening',
      icon: Sparkles,
      tagIcon: '💎',
      styleTag: 'LUXURY EVENING',
      matchScore: '99.4%',
      modelImg: '/images/hero-model.jpg',
      garmentImg: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80',
      garmentName: 'Emerald Satin Slip Dress',
      brand: 'Zara Silk Edition',
      price: '$89.00',
      presetId: 'explore-1',
    },
    {
      id: 2,
      label: 'Vibe 2',
      subtitle: 'Streetwear',
      icon: Zap,
      tagIcon: '🔥',
      styleTag: 'STREETWEAR',
      matchScore: '98.9%',
      modelImg: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
      garmentImg: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=150&q=80',
      garmentName: 'Vintage Biker Leather Jacket',
      brand: 'AllSaints Icon',
      price: '$149.00',
      presetId: 'explore-2',
    },
    {
      id: 3,
      label: 'Vibe 3',
      subtitle: 'Casual Chic',
      icon: Star,
      tagIcon: '✨',
      styleTag: 'CASUAL CHIC',
      matchScore: '99.1%',
      modelImg: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      garmentImg: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=150&q=80',
      garmentName: 'Oversized Nordic Cable Knit',
      brand: 'Arket Studio',
      price: '$65.00',
      presetId: 'explore-3',
    },
  ];

  const currentVibe = vibes.find((v) => v.id === activeVibe) || vibes[0];

  const whyLooksPerfect = [
    { label: 'Fabric Match' },
    { label: 'Body Contours' },
    { label: 'Lighting Sync' },
    { label: 'Realistic Shadows' },
  ];

  const faqs = [
    {
      q: 'Do you store or save my uploaded photos on your servers?',
      a: 'Never. TryNFit operates with a strict Zero Server-Side Storage policy. Uploaded images exist solely in temporary RAM memory during the AI inference lifecycle and are instantly purged the moment the response is returned.',
    },
    {
      q: 'What kind of clothing screenshots work best?',
      a: 'You can upload screenshots from Zara, ASOS, Shein, Amazon, Pinterest, or any fashion retailer. Clean, unobstructed front-facing catalog photos or flat-lay photos yield the most photorealistic results.',
    },
    {
      q: 'What type of photo of myself should I upload?',
      a: 'Upload a well-lit, front-facing photo showing your upper body or full silhouette with a relatively simple posture and unobstructed shoulders/waist.',
    },
    {
      q: 'How does the Digital Wardrobe work?',
      a: 'Your saved fits and lookbooks are stored locally in your browser’s localStorage. That means your data remains 100% private to your device without ever being uploaded to a remote database.',
    },
    {
      q: 'Is TryNFit free to use?',
      a: 'Yes! TryNFit is open for demo virtual try-ons without any subscription or credit card requirement.',
    },
  ];

  const brandLogos = [
    { name: 'ZARA', style: 'font-serif tracking-[0.25em] font-extrabold text-lg' },
    { name: 'MANGO', style: 'font-sans tracking-[0.3em] font-bold text-sm' },
    { name: 'asos', style: 'font-sans lowercase tracking-tight font-black text-lg' },
    { name: 'H&M', style: 'font-serif italic font-black text-lg tracking-wider' },
    { name: 'SHEIN', style: 'font-sans tracking-[0.25em] font-extrabold text-sm' },
    { name: 'PINTEREST', style: 'font-sans uppercase tracking-[0.15em] font-bold text-xs' },
    { name: 'NYKAA', style: 'font-sans tracking-[0.2em] font-black text-sm italic' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAF8F5]">
      
      {/* 1. Hero Section + Brand Strip (Full Viewport Height with Brand Strip at the End of Screen) */}
      <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between pt-2 sm:pt-3 pb-3 sm:pb-4 overflow-hidden">
        
        {/* Main Hero 2-Column Grid (Centered in available height) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Subtitle, Actions, Metrics, Social Proof */}
            <div className="lg:col-span-6 text-left space-y-4 sm:space-y-5">
              
              {/* Tag Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FDE8EF] border border-[#F8BBD0] text-xs font-bold text-[#FF407D] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FF407D]" />
                <span>Next-Gen AI Virtual Try-On Studio</span>
              </div>

              {/* Editorial Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-[#1E1B1D] font-serif leading-[1.1]">
                  See it on you,
                </h1>
                <div className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-[#1E1B1D] font-serif leading-[1.1] flex items-center flex-wrap gap-x-3">
                  <span className="italic font-serif text-[#FF407D] brush-underline">
                    before
                  </span>
                  <span>you buy.</span>
                  {/* Tiny 4-pointed sparkle */}
                  <span className="inline-block text-[#FF407D] text-2xl sm:text-3xl font-sans animate-pulse">✦</span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#6F626A] max-w-lg leading-relaxed font-normal">
                Upload your selfie and any outfit screenshot.<br />
                Our AI fits the look to your body, fabric and lighting<br />
                for a realistic try-on experience.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <Link
                  to="/studio"
                  className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full btn-pink-primary text-sm font-bold font-outfit shadow-pink-glow"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Launch Try-On Studio</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full btn-pink-soft text-sm font-bold font-outfit"
                >
                  <Flame className="w-4 h-4 text-[#FF407D]" />
                  <span>Explore Trending Looks</span>
                </Link>
              </div>

              {/* 4-Metric Grid Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-[#EFE9E2]">
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-[#4A4147] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#1E1B1D] block font-outfit">50K+</span>
                    <span className="text-[11px] text-[#6F626A] block">Outfits Tried</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#4A4147] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#1E1B1D] block font-outfit">100%</span>
                    <span className="text-[11px] text-[#6F626A] block">Privacy First</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-[#4A4147] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#1E1B1D] block font-outfit">99.4%</span>
                    <span className="text-[11px] text-[#6F626A] block">AI Fit Accuracy</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="text-[#FF407D] text-base leading-none shrink-0">✦</span>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#1E1B1D] block font-outfit">Realistic</span>
                    <span className="text-[11px] text-[#6F626A] block">Results</span>
                  </div>
                </div>
              </div>

              {/* Social Proof / Testimonials Row */}
              <div className="pt-1.5 flex items-center space-x-3.5">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="User 1" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="User 2" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="User 3" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" alt="User 4" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" alt="User 5" />
                </div>
                <div>
                  <div className="flex items-center text-[#FF407D] space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#1E1B1D]">50,000+ happy users</p>
                  <p className="text-[11px] text-[#6F626A]">Trusted by fashion lovers worldwide</p>
                </div>
              </div>

            </div>

            {/* Right Column: Model Showcase Card with Floating Glass Overlays */}
            <div className="lg:col-span-6 relative">
              <div className="max-w-[490px] lg:max-w-[510px] mx-auto relative rounded-[28px] sm:rounded-[32px] bg-white p-3.5 sm:p-4 shadow-card-pearl border border-[#F3DCE4]">
                
                {/* Model Image Frame */}
                <div key={currentVibe.id} className="relative aspect-[4/4.8] max-h-[460px] sm:max-h-[480px] w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#FAF8F5] transition-all duration-500 animate-fadeIn">
                  <img
                    src={currentVibe.modelImg}
                    alt={`TryNFit Virtual Try-On - ${currentVibe.garmentName}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />

                  {/* Floating Card 1: Top Left AI Fit Match */}
                  <div className="absolute top-3.5 left-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#6F626A] block">AI Fit Match</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1E1B1D] font-outfit block">{currentVibe.matchScore}</span>
                    
                    {/* Pink Waveform Line */}
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[#FF407D]">
                      <svg className="w-13 h-3.5 text-[#FF407D]" viewBox="0 0 60 16" fill="none">
                        <path
                          d="M2 12 Q 12 2, 22 10 T 42 4 T 58 8"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs">✦</span>
                    </div>
                  </div>

                  {/* Floating Tag: Top Right Style Tag */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-sm flex items-center space-x-1 text-[9px] sm:text-[10px] font-bold text-[#FF407D] tracking-wider uppercase">
                    <span>{currentVibe.tagIcon}</span>
                    <span>{currentVibe.styleTag}</span>
                  </div>

                  {/* Floating Card 2: Right Side "Why it looks perfect" */}
                  <div className="absolute top-24 right-3.5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md w-38 sm:w-42 hidden sm:block">
                    <h4 className="text-[11px] sm:text-xs font-bold text-[#1E1B1D] mb-2 font-outfit">Why it looks perfect</h4>
                    <div className="space-y-1.5">
                      {whyLooksPerfect.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-[#4A4147]">
                          <span>{item.label}</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#FF407D] text-white flex items-center justify-center text-[9px]">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Glassmorphic Bar: Bottom Garment Info */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={currentVibe.garmentImg}
                        alt={currentVibe.garmentName}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#F3DCE4]"
                      />
                      <div>
                        <h4 className="text-[11px] sm:text-xs font-bold text-[#1E1B1D] truncate max-w-[150px] sm:max-w-[180px]">{currentVibe.garmentName}</h4>
                        <span className="text-[9px] sm:text-[10px] text-[#6F626A]">{currentVibe.brand}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#1E1B1D] font-outfit">{currentVibe.price}</span>
                      <Link
                        to={`/studio?preset=${currentVibe.presetId}`}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF407D] hover:bg-[#E8316B] text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
                        title="Try this garment in studio"
                      >
                        +
                      </Link>
                    </div>
                  </div>

                </div>

                {/* Bottom PICK A VIBE Selector (3 Columns) */}
                <div className="mt-3.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6F626A] block mb-1.5 font-outfit">
                    PICK A VIBE
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {vibes.map((vibe) => {
                      const Icon = vibe.icon;
                      const isActive = activeVibe === vibe.id;
                      return (
                        <button
                          key={vibe.id}
                          type="button"
                          onClick={() => setActiveVibe(vibe.id)}
                          className={`py-2 px-3 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            isActive
                              ? 'vibe-pill-active'
                              : 'vibe-pill-inactive'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6F626A]'}`} />
                          <span>{vibe.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 2. Brand Logos Ticker Strip (Lifted a little bit up) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto pt-1 pb-4 sm:pb-6">
          <div className="py-2.5 sm:py-3 px-5 sm:px-8 rounded-2xl bg-[#F5F0EB]/70 border border-[#EFE9E2] flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#8E8088] shrink-0">
              Loved by users. Shopped from brands.
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 sm:gap-8 opacity-70 hover:opacity-100 transition-opacity">
              {brandLogos.map((brand, i) => (
                <span key={i} className={`text-[#2E272C] ${brand.style}`}>
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 3. Interactive Before/After Split Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#F3DCE4] shadow-card-pearl text-center">
          <div className="max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#FF407D]">
              Interactive Fitting Lab
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E1B1D] mt-1 font-outfit">
              Drag to Compare Before vs AI Fit
            </h2>
            <p className="text-xs sm:text-sm text-[#6F626A] mt-2">
              Slide the divider horizontally to see how fabrics deform naturally around anatomical body contours.
            </p>
          </div>

          <div className="relative w-full max-w-2xl mx-auto aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#F3DCE4] shadow-sm select-none">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
              alt="Virtual Try-On Result"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E1B1D] text-xs font-bold shadow-sm">
              Original Photo
            </div>
            <div className="absolute bottom-4 right-4 px-3.5 py-1 rounded-full bg-[#FDE8EF] text-[#FF407D] border border-[#F8BBD0] text-xs font-bold shadow-sm">
              AI Try-On Result ✨
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/studio"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#FF407D] hover:text-[#E8316B] transition-colors"
            >
              <span>Try with your own photo in the Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Ready-to-Try Looks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#FF407D]">
              Trending Style Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1D] mt-1 font-outfit">
              Ready-to-Try Looks
            </h2>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF407D] hover:text-[#E8316B] transition-colors"
          >
            <span>View All Looks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPLORE_LOOKS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-[#F3DCE4] shadow-card-pearl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-[#FAF8F5] overflow-hidden">
                <img
                  src={item.previewResult}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#1E1B1D] uppercase tracking-wider border border-[#F3DCE4]">
                  {item.style}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E1B1D] font-outfit mb-1">{item.title}</h3>
                  <p className="text-xs text-[#6F626A] line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F3DCE4] flex items-center justify-between">
                  <span className="text-xs text-[#FF407D] font-bold">{item.brandInspiration}</span>
                  <Link
                    to={`/studio?preset=${item.id}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full btn-pink-primary text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Look</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF407D]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1D] mt-1 font-outfit">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#F3DCE4] shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#FFF0F5]/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#1E1B1D] font-outfit">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF407D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#6F626A] font-normal leading-relaxed border-t border-[#F3DCE4] pt-3 bg-[#FAF8F5]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
