import React, { useState } from 'react';
import { WeddingData, Language } from '../types';
import WeddingCardTemplate from './WeddingCardTemplate';
import { Heart } from 'lucide-react';

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

  const coverTitleText = data.coverTitle?.[lang] || data.title?.[lang] || 'Wedding Invitation';

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-1000 ${stage === 'unrolling' ? 'bg-white' : 'bg-[#fdfbf7]'}`}
      onClick={startSequence}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] pointer-events-none"></div>
      
      <div className="relative w-full max-w-[700px] aspect-[1/1.4] xs:aspect-[1/1.2] md:aspect-[1.5/1] perspective-2000 cursor-pointer overflow-visible">
        <div className={`relative w-full h-full flex transition-all duration-700 bg-transparent ${isOpening ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <WeddingCardTemplate className="w-full h-full">
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 md:px-12 text-center max-w-[95%] overflow-visible">
              <KanoteOrnament className="w-10 md:w-32 opacity-20 mb-10 md:mb-20" />
              
              <h1 className={`text-wedding-gold text-xl xs:text-2xl md:text-6xl font-bold mb-10 md:mb-20 drop-shadow-sm whitespace-nowrap leading-tight ${lang === 'my' ? 'font-myanmar tracking-normal' : 'font-serif italic tracking-wide'}`}>
                {coverTitleText}
              </h1>

              <div className="flex items-center justify-center gap-6 text-wedding-gold/60 font-serif italic text-xs md:text-4xl w-full px-6 whitespace-nowrap overflow-visible">
                 <span className="shrink-0">{data.groomName.en}</span>
                 <Heart size={20} className="fill-current opacity-40 shrink-0 md:w-10 md:h-10" />
                 <span className="shrink-0">{data.brideName.en}</span>
              </div>

              <KanoteOrnament className="w-10 md:w-32 opacity-20 mt-10 md:mt-20 rotate-180" />
            </div>

            <p className={`text-wedding-gold/40 text-[9px] md:text-base uppercase pb-8 md:pb-20 animate-pulse font-bold tracking-[0.4em] md:tracking-[1.5em] ${lang === 'my' ? 'font-myanmar' : ''}`}>
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