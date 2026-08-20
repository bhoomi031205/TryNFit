import React from 'react';
import { ShieldCheck, Lock, Trash2, Cpu } from 'lucide-react';

export const PrivacyGuarantee = () => {
  return (
    <section className="py-10 border-t border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/30 via-studio-900/60 to-brand-950/30 border border-emerald-500/20 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1 md:mt-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                  <span>Zero Server Storage Guarantee</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Privacy First
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light leading-relaxed">
                  Your personal photos and garments are processed strictly in ephemeral RAM buffers.
                  TryNFit never writes your images to a server hard disk, database, or cloud bucket.
                  Everything is discarded the moment your try-on completes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-emerald-300/90 font-mono self-stretch md:self-auto justify-start">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Auto-Purged RAM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
