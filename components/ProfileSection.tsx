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
    <section className="py-20 px-6 bg-white border-b border-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-2xl font-serif text-wedding-gold tracking-widest uppercase">{labels.profile}</h2>
          <div className="w-10 h-px bg-wedding-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-16 mb-16">
          <div className="text-center">
            <div className="aspect-[4/5] rounded-full overflow-hidden border-2 border-wedding-sand mb-6 mx-auto max-w-[160px] shadow-lg">
              <img src={fixAssetPath(images.groom)} alt="Groom" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] text-wedding-gold tracking-[0.2em] uppercase font-bold mb-1">{labels.groom}</p>
            <h3 className="text-xl font-serif text-wedding-text tracking-widest">{groomName[language]}</h3>
          </div>

          <div className="text-center">
            <div className="aspect-[4/5] rounded-full overflow-hidden border-2 border-wedding-sand mb-6 mx-auto max-w-[160px] shadow-lg">
              <img src={fixAssetPath(images.bride)} alt="Bride" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] text-wedding-gold tracking-[0.2em] uppercase font-bold mb-1">{labels.bride}</p>
            <h3 className="text-xl font-serif text-wedding-text tracking-widest">{brideName[language]}</h3>
          </div>
        </div>

        {profile.showDetails && profile.details.length > 0 && (
          <div className="space-y-6 mb-16 max-w-lg mx-auto animate-fade-in">
            {profile.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-4 text-sm font-serif border-b border-gray-50 pb-2">
                <div className="flex-1 text-right text-gray-500">{detail.groomValue[language]}</div>
                <div className="px-3 py-1 bg-wedding-sand/30 rounded text-wedding-gold text-[10px] tracking-widest uppercase shrink-0 min-w-[90px] text-center font-bold">
                  {detail.label[language]}
                </div>
                <div className="flex-1 text-left text-gray-500">{detail.brideValue[language]}</div>
              </div>
            ))}
          </div>
        )}

        {profile.showQa && profile.qa.length > 0 && (
          <div className="space-y-10 bg-wedding-sand/10 p-8 rounded-2xl border border-wedding-gold/10 animate-fade-in">
            {profile.qa.map((qa, idx) => (
              <div key={idx} className="text-center">
                <h4 className="text-md font-serif text-wedding-text mb-4 italic">
                   <span className="text-wedding-gold font-bold mr-2">Q.</span>
                   {qa.question[language]}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="text-wedding-gold/60 font-bold mr-2">{groomName.en}:</span> {qa.groomAnswer[language]}</p>
                  <p className="text-sm text-gray-600"><span className="text-wedding-gold/60 font-bold mr-2">{brideName.en}:</span> {qa.brideAnswer[language]}</p>
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