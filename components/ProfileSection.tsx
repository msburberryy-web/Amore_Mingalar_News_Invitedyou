import React from 'react';
import { WeddingData, Language } from '../types';

interface Props {
  data: WeddingData;
  language: Language;
  fixPath: (path: string) => string;
}

const ProfileSection: React.FC<Props> = ({ data, language, fixPath }) => {
  const { profile, groomName, brideName, images } = data;
  if (!profile || !profile.show) return null;

  const labels = {
    en: { profile: 'PROFILE', groom: 'Groom', bride: 'Bride' },
    ja: { profile: 'PROFILE', groom: '新郎', bride: '新婦' },
    my: { profile: 'PROFILE', groom: 'သတို့သား', bride: 'သတို့သမီး' }
  }[language];

  return (
    <section className="py-32 md:py-48 px-6 bg-transparent overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-2xl md:text-5xl font-serif text-wedding-gold tracking-[0.5em] uppercase">{labels.profile}</h2>
          <div className="w-32 h-px bg-wedding-gold mx-auto mt-10 opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40 mb-32">
          <div className="text-center group">
            <div className="aspect-[4/5] rounded-[4rem] md:rounded-full overflow-hidden border-[6px] border-wedding-gold/20 mb-12 mx-auto max-w-[380px] md:max-w-[580px] shadow-2xl transition-all duration-1000 group-hover:scale-[1.02] group-hover:border-wedding-gold/50 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.3)] bg-wedding-sand/5">
              <img src={fixPath(images.groom)} alt="Groom" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1.5s]" />
            </div>
            <p className="text-base text-wedding-gold tracking-[0.5em] uppercase font-bold mb-4 opacity-70 italic">{labels.groom}</p>
            <h3 className={`text-4xl md:text-7xl font-serif text-wedding-text tracking-[0.15em] ${language === 'my' ? 'tracking-normal' : ''}`}>{groomName[language]}</h3>
          </div>

          <div className="text-center group">
            <div className="aspect-[4/5] rounded-[4rem] md:rounded-full overflow-hidden border-[6px] border-wedding-gold/20 mb-12 mx-auto max-w-[380px] md:max-w-[580px] shadow-2xl transition-all duration-1000 group-hover:scale-[1.02] group-hover:border-wedding-gold/50 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.3)] bg-wedding-sand/5">
              <img src={fixPath(images.bride)} alt="Bride" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1.5s]" />
            </div>
            <p className="text-base text-wedding-gold tracking-[0.5em] uppercase font-bold mb-4 opacity-70 italic">{labels.bride}</p>
            <h3 className={`text-4xl md:text-7xl font-serif text-wedding-text tracking-[0.15em] ${language === 'my' ? 'tracking-normal' : ''}`}>{brideName[language]}</h3>
          </div>
        </div>

        {profile.showDetails && profile.details.length > 0 && (
          <div className="space-y-12 mb-32 max-w-4xl mx-auto animate-fade-in px-4">
            {profile.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-8 text-sm font-serif border-b border-wedding-gold/10 pb-12 transition-all hover:border-wedding-gold/40 group">
                <div className={`flex-1 text-right text-gray-500 text-3xl group-hover:text-wedding-text transition-colors ${language === 'my' ? 'tracking-normal' : ''}`}>{detail.groomValue[language]}</div>
                <div className="px-10 py-4 bg-wedding-sand/20 rounded-full text-wedding-gold text-sm tracking-[0.3em] uppercase shrink-0 min-w-[180px] text-center font-bold shadow-sm border border-wedding-gold/10">
                  {detail.label[language]}
                </div>
                <div className={`flex-1 text-left text-gray-500 text-3xl group-hover:text-wedding-text transition-colors ${language === 'my' ? 'tracking-normal' : ''}`}>{detail.brideValue[language]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;