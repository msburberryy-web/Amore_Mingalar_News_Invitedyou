import React from 'react';
import { WeddingData, Language } from '../types';

interface Props {
  data: WeddingData;
  language: Language;
}

const ProfileSection: React.FC<Props> = ({ data, language }) => {
  const { profile, groomName, brideName, images } = data;
  if (!profile || !profile.show) return null;

  const labels = {
    en: { profile: 'PROFILE', groom: 'Groom', bride: 'Bride' },
    ja: { profile: 'PROFILE', groom: '新郎', bride: '新婦' },
    my: { profile: 'PROFILE', groom: 'သတို့သား', bride: 'သတို့သမီး' }
  }[language];

  const fixAssetPath = (path: string): string => {
    if (!path || typeof path !== 'string') return path;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    let clean = path.replace(/\\/g, '/').trim();
    clean = clean.replace(/^(\.\.\/|\.\/|\/)*public\//i, '');
    if (clean.startsWith('/')) clean = clean.substring(1);
    return clean;
  };

  return (
    <section className="py-32 md:py-48 px-6 bg-white border-b border-gray-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-2xl md:text-5xl font-serif text-wedding-gold tracking-[0.5em] uppercase">{labels.profile}</h2>
          <div className="w-32 h-px bg-wedding-gold mx-auto mt-10 opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40 mb-32">
          <div className="text-center group">
            <div className="aspect-[4/5] rounded-[4rem] md:rounded-full overflow-hidden border-[10px] border-wedding-sand mb-12 mx-auto max-w-[380px] md:max-w-[580px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-1000 group-hover:scale-[1.05] group-hover:shadow-[0_50px_100px_-25px_rgba(197,160,89,0.35)]">
              <img src={fixAssetPath(images.groom)} alt="Groom" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1.5s]" />
            </div>
            <p className="text-base text-wedding-gold tracking-[0.5em] uppercase font-bold mb-4 opacity-70 italic">{labels.groom}</p>
            <h3 className="text-4xl md:text-6xl font-serif text-wedding-text tracking-[0.15em]">{groomName[language]}</h3>
          </div>

          <div className="text-center group">
            <div className="aspect-[4/5] rounded-[4rem] md:rounded-full overflow-hidden border-[10px] border-wedding-sand mb-12 mx-auto max-w-[380px] md:max-w-[580px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-1000 group-hover:scale-[1.05] group-hover:shadow-[0_50px_100px_-25px_rgba(197,160,89,0.35)]">
              <img src={fixAssetPath(images.bride)} alt="Bride" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1.5s]" />
            </div>
            <p className="text-base text-wedding-gold tracking-[0.5em] uppercase font-bold mb-4 opacity-70 italic">{labels.bride}</p>
            <h3 className="text-4xl md:text-6xl font-serif text-wedding-text tracking-[0.15em]">{brideName[language]}</h3>
          </div>
        </div>

        {profile.showDetails && profile.details.length > 0 && (
          <div className="space-y-12 mb-32 max-w-3xl mx-auto animate-fade-in px-4">
            {profile.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-8 text-sm font-serif border-b border-gray-100 pb-10 transition-all hover:border-wedding-gold/40 group">
                <div className="flex-1 text-right text-gray-500 text-2xl group-hover:text-wedding-text transition-colors">{detail.groomValue[language]}</div>
                <div className="px-8 py-3 bg-wedding-sand/50 rounded-full text-wedding-gold text-xs tracking-[0.3em] uppercase shrink-0 min-w-[160px] text-center font-bold shadow-sm">
                  {detail.label[language]}
                </div>
                <div className="flex-1 text-left text-gray-500 text-2xl group-hover:text-wedding-text transition-colors">{detail.brideValue[language]}</div>
              </div>
            ))}
          </div>
        )}

        {profile.showQa && profile.qa.length > 0 && (
          <div className="space-y-16 bg-wedding-sand/10 p-16 md:p-32 rounded-[6rem] border border-wedding-gold/15 animate-fade-in relative shadow-inner">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-12 py-4 rounded-full border border-wedding-gold/25 text-wedding-gold font-serif italic text-2xl shadow-md">The Wedding Q&A</div>
            {profile.qa.map((qa, idx) => (
              <div key={idx} className="text-center max-w-4xl mx-auto border-b border-wedding-gold/10 pb-16 last:border-0 last:pb-0">
                <h4 className="text-2xl md:text-4xl font-serif text-wedding-text mb-12 italic leading-relaxed">
                   <span className="text-wedding-gold font-bold mr-6 not-italic font-sans text-3xl md:text-5xl">Q.</span>
                   {qa.question[language]}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 bg-white/90 rounded-[3rem] shadow-xl border border-wedding-gold/5 flex flex-col items-center group transition-all hover:-translate-y-2">
                    <span className="text-xs uppercase tracking-[0.5em] text-wedding-gold font-bold mb-6 opacity-60 italic">{groomName.en}</span>
                    <p className="text-gray-700 text-xl md:text-2xl font-serif italic leading-relaxed">{qa.groomAnswer[language]}</p>
                  </div>
                  <div className="p-10 bg-white/90 rounded-[3rem] shadow-xl border border-wedding-gold/5 flex flex-col items-center group transition-all hover:-translate-y-2">
                    <span className="text-xs uppercase tracking-[0.5em] text-wedding-gold font-bold mb-6 opacity-60 italic">{brideName.en}</span>
                    <p className="text-gray-700 text-xl md:text-2xl font-serif italic leading-relaxed">{qa.brideAnswer[language]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;