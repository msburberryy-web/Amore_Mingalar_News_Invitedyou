import React, { useState } from 'react';
import { WeddingData, Language } from '../types';
import WeddingCardTemplate from './WeddingCardTemplate';

interface Props {
  data: WeddingData;
  lang: Language;
  onOpen: () => void;
}

export const KanoteOrnament = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20C25 5 45 5 55 18C65 5 85 5 110 20" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M55 18C60 25 70 35 85 30" stroke="#C5A059" strokeWidth="1" strokeLinecap="round" />
    <path d="M55 18C50 25 40 35 25 30" stroke="#C5A059" strokeWidth="1" strokeLinecap="round" />
    <path d="M15 20Q30 15 45 20M75 20Q90 15 105 20" stroke="#C5A059" strokeWidth="1" opacity="0.6" />
    <circle cx="55" cy="18" r="2" fill="#C5A059" />
    <path d="M55 10V18M55 26V18" stroke="#C5A059" strokeWidth="0.5" />
    <path d="M30 12Q35 10 40 12M70 12Q75 10 80 12" stroke="#C5A059" strokeWidth="1" />
  </svg>
);

type AnimationStage = 'closed' | 'opening' | 'unrolling' | 'finished';

const EnvelopeOverlay: React.FC<Props> = ({ data, lang, onOpen }) => {
  const [stage, setStage] = useState<AnimationStage>('closed');

  const startSequence = () => {
    if (stage !== 'closed') return;
    // Changed from 2414 (Birds) to 2019 (Elegant Chime/Reveal)
    new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3').play().catch(() => {});
    setStage('opening');
    setTimeout(() => setStage('unrolling'), 800);
    setTimeout(() => {
      onOpen();
      setStage('finished');
    }, 2500);
  };

  if (stage === 'finished') return null;

  const isOpening = stage === 'opening' || stage === 'unrolling';
  const isUnrolling = stage === 'unrolling';

  // Defensive fallback for missing coverTitle
  const coverTitleText = data.coverTitle?.[lang] || data.title?.[lang] || 'Wedding Invitation';

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-1000 ${stage === 'unrolling' ? 'bg-white' : 'bg-[#fdfbf7]'}`}
      onClick={startSequence}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(197,160,89,0.05)_100%)]"></div>

      <div className="relative w-full max-w-[950px] aspect-[1.8/1] md:aspect-[2.5/1] perspective-2000 cursor-pointer overflow-visible">
        <div className={`relative w-full h-full flex transition-all duration-700 bg-transparent ${isOpening ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <WeddingCardTemplate className="w-full h-full">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              {/* Added top ornament for balance */}
              <KanoteOrnament className="w-16 md:w-32 opacity-20 mb-4 md:mb-8" />
              
              <h1 className={`text-wedding-gold text-2xl md:text-7xl font-bold tracking-[0.05em] text-center px-4 mb-4 drop-shadow-sm ${lang === 'my' ? 'font-myanmar' : 'font-serif italic'}`}>
                {coverTitleText}
              </h1>

              {/* Bottom mirror ornament */}
              <KanoteOrnament className="w-16 md:w-32 opacity-20 mt-4 md:mt-8 rotate-180" />
            </div>

            <p className="text-wedding-gold/40 text-[10px] md:text-xs uppercase tracking-[1em] md:tracking-[1.5em] pb-4 md:pb-8 animate-pulse font-bold">
              {lang === 'my' ? 'ဖွင့်ရန်နှိပ်ပါ' : 'Tap to Open'}
            </p>
          </WeddingCardTemplate>
        </div>

        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 pointer-events-none ${isUnrolling ? 'scale-[3] opacity-100' : 'scale-50 opacity-0'}`}
          style={{ transformOrigin: 'center' }}
        >
          <div className="text-wedding-gold text-2xl animate-spin-slow opacity-10">❦</div>
        </div>
      </div>
    </div>
  );
};

export default EnvelopeOverlay;